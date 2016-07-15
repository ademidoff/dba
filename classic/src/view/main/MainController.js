/**
 * The controller for rendering components in the main area (tab panel)
 * upon clicking on the nav menu
 */
Ext.define('SM.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    mixins: ['SM.core.Localizable'],
    localizable: {
        switchToModern: 'Switch to Modern',
        confirmSwitchToModern: 'Are you sure you want to switch toolkits?'
    },
    lastView: null,

    init: function () {
        var refs = this.getReferences(),
            navTree = refs.navigationTree;

        var navStore = SM.core.createTreeStore({
            entity: 'Menu',
            action: 'tree',
            query: {
                where: {
                    'IsActive': true
                },
                order: [
                    [ 'ParentId', 'DESC' ],
                    [ 'Order', 'ASC' ],
                    [ 'Title', 'ASC' ]
                ]
            }
        });

        navTree.setStore(navStore);
        navStore.load();
    },

    setCurrentView: function (node) {
        // var me = this;
        // var refs = me.getReferences();
        // var contentPanel = refs.contentPanel;
        var entityName = Ext.String.capitalize(node.data.component);
        if (!entityName) {
            return SM.core.Toast('No action defined');
        }

        SM.core.getView(entityName)
        .then(SM.core.renderView)
        .catch(SM.core.alertError);
    },

    onNavigationTreeSelectionChange: function (tree, node) {
        // no action on the parent nodes
        if (node.hasChildNodes()) return;
        // console.log(node.data);
        if (/logout/i.test(node.data.component)) {
            Ext.state.Manager.clear('SMLoggedIn');
            window.location.reload();
            // return this.redirectTo("login");
        }
        this.setCurrentView(node);
    },

    onToggleNavigationSize: function () {
        var me = this,
            refs = me.getReferences(),
            navTreeContainer = refs.navigationTreeCont,
            navigationList = refs.navigationTree,
            wrapContainer = refs.mainContainerWrap,
            shouldCollapse = !navigationList.getMicro(),
            new_width = shouldCollapse ? 64 : 250;

        if (Ext.isIE9m || !Ext.os.is.Desktop) {
            Ext.suspendLayouts();

            refs.appLogo.setWidth(new_width);
            navTreeContainer.setWidth(new_width);
            navigationList.setWidth(new_width);
            navigationList.setMicro(shouldCollapse);

            Ext.resumeLayouts(); // do not flush the layout here...

            // No animation for IE9 or lower...
            wrapContainer.layout.animatePolicy = wrapContainer.layout.animate = null;
            wrapContainer.updateLayout();  // ... since this will flush them
        }
        else {
            if (!shouldCollapse) {
                // If we are leaving micro mode (expanding), we do that first so that the
                // text of the items in the navlist will be revealed by the animation.
                navigationList.setMicro(false);
            }

            // Start this layout first since it does not require a layout
            refs.appLogo.animate({dynamic: true, to: {width: new_width}});

            // Directly adjust the width config and then run the main wrap container layout
            // as the root layout (it and its chidren). This will cause the adjusted size to
            // be flushed to the element and animate to that new size.
            navTreeContainer.setWidth(new_width);
            navigationList.setWidth(new_width);
            navigationList.setMicro(shouldCollapse);

            navigationList.width = new_width;
            wrapContainer.updateLayout({isRoot: true});
            // navigationList.el.addCls('nav-tree-animating');

            // We need to switch to micro mode on the navlist *after* the animation (this
            // allows the "sweep" to leave the item text in place until it is no longer
            // visible.
            if (shouldCollapse) {
                navigationList.on({
                    afterlayoutanimation: function () {
                        navigationList.setMicro(true);
                        navigationList.el.removeCls('nav-tree-animating');
                    },
                    single: true
                });
            }
        }
    },
    // @disabled
    onMainViewRender: function () {
        if (!window.location.hash) {
            this.redirectTo('login');
        }
    },

    onRouteChange: function (id) {
        console.log(id);
        this.setCurrentView(id);
    },

    onSearchRouteChange: function () {
        this.setCurrentView('searchresults');
    },

    onSwitchToModern: function () {
        Ext.Msg.confirm(
            this.localize('switchToModern'),
            this.localize('confirmSwitchToModern'),
            this.onSwitchToModernConfirmed,
            this);
    },

    onSwitchToModernConfirmed: function (choice) {
        if (choice === 'yes') {
            var s = location.search;

            // Strip "?classic" or "&classic" with optionally more "&foo" tokens
            // following and ensure we don't start with "?".
            s = s.replace(/(^\?|&)classic($|&)/, '').replace(/^\?/, '');

            // Add "?modern&" before the remaining tokens and strip & if there are
            // none.
            location.search = ('?modern&' + s).replace(/&$/, '');
        }
    },

    onEmailRouteChange: function () {
        this.setCurrentView('email');
    },

    onTabChange: function(tabPanel, newCard) {
        var store = newCard.getStore && newCard.getStore();
        var id = tabPanel.shouldRefreshId;
        var cmp = id && Ext.getCmp(id);
        if (cmp && store) {
            store.reload({ params: store.lastOptions.params });
            tabPanel.shouldRefreshId = null;
        }
    }
});

/**
 * Main Application Menu && Viewport
 */
Ext.define('SM.view.main.Menu', {
    extend: 'Ext.container.Viewport',
    xtype: 'main-menu',

    requires: [
        'Ext.button.Segmented',
        'Ext.window.MessageBox',
        'Ext.form.field.Checkbox',
        'Ext.grid.Panel',

        'SM.view.main.MainContainerWrap',
        'SM.view.main.MainController',
        'SM.view.form.BaseComboBox',
        'SM.view.form.FlatComboBox',
        'SM.view.form.DoubleComboBox',
        'SM.view.base.BaseGrid',
        'SM.view.base.BaseForm',
        'SM.core.Messaging',
        'SM.core.AceEditorPanel',
        'SM.core.AceEditorWindow',
        'SM.core.AceEditor'
    ],

    controller: 'main',

    cls: 'sm-viewport',
    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        //render: 'onMainViewRender'
    },

    items: [
        {
            xtype: 'toolbar',
            cls: 'app-headerbar shadow',
            height: 64,
            itemId: 'headerBar',
            items: [
                {
                    xtype: 'component',
                    reference: 'appLogo',
                    cls: 'app-logo',
                    html: [
                        '<div class="main-logo">',
                        '<img src="resources/images/company-logo.png">',
                        'Service Desk',
                        '</div>'
                    ].join(''),
                    width: 250
                },
                {
                    margin: '0 0 0 8',
                    ui: 'header',
                    iconCls:'x-fa fa-navicon',
                    id: 'main-navigation-btn',
                    handler: 'onToggleNavigationSize'
                },
                '->',
                /*
                {
                    xtype: 'segmentedbutton',
                    margin: '0 16 0 0',

                    platformConfig: {
                        ie9m: {
                            hidden: true
                        }
                    },

                    items: [{
                        iconCls: 'x-fa fa-desktop',
                        pressed: true
                    }, {
                        iconCls: 'x-fa fa-tablet'
                        //handler: 'onSwitchToModern'
                    }]
                },*/
                {
                    iconCls:'x-fa fa-search',
                    ui: 'header',
                    href: '#searchresults',
                    hrefTarget: '_self',
                    tooltip: 'Search for content'
                },
                {
                    iconCls:'x-fa fa-comment-o',
                    ui: 'header',
                    href: '#chat',
                    hrefTarget: '_self',
                    tooltip: 'Check your messages'
                },
                {
                    iconCls:'x-fa fa-question',
                    ui: 'header',
                    href: '#faq',
                    hrefTarget: '_self',
                    tooltip: 'Help / FAQ\'s'
                },
                {
                    iconCls:'x-fa fa-th-large',
                    ui: 'header',
                    href: '#profile',
                    hrefTarget: '_self',
                    tooltip: 'See your profile'
                },
                {
                    xtype: 'tbtext',
                    text: 'Admin user',
                    cls: 'top-user-name',
                    itemId: 'sys-user-name'
                },
                {
                    xtype: 'image',
                    cls: 'header-right-profile-image',
                    height: 35,
                    width: 35,
                    alt:'current user image',
                    src: 'resources/images/user-profile/2.png'
                }
            ]
        },
        {
            xtype: 'maincontainerwrap',
            id: 'main-view-detail-wrap',
            reference: 'mainContainerWrap',
            flex: 1,
            items: [
                {
                    region: 'west',
                    xtype: 'container',
                    reference: 'navigationTreeCont',
                    itemId: 'navigationTreeContainer',
                    width: 250,
                    scrollable: 'y',
                    items: [
                        {
                            xtype: 'treelist',
                            reference: 'navigationTree',
                            itemId: 'navigationTreeList',
                            ui: 'navigation',
                            flex: 1,
                            expanderFirst: false,
                            expanderOnly: false,
                            listeners: {
                                selectionchange: 'onNavigationTreeSelectionChange'
                            }
                        }
                    ]
                },
                {
                    region: 'center',
                    xtype: 'tabpanel',
                    flex: 1,
                    reference: 'contentPanel',
                    cls: 'sm-content-panel',
                    id: 'sm-content-panel',
                    minTabWidth: 100
                }
            ]
        }
    ]
});

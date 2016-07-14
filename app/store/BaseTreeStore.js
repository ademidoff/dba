/**
 * Base tree store for child stores
 */
Ext.define('SM.store.BaseTreeStore', {
    extend: 'Ext.data.TreeStore',

    root: {
        id: 'root',
        expanded: true
    },

    autoLoad: false,

    listeners: {
        nodeappend: function (thisNode, newChild) {
            if (!newChild.isRoot()) {
                var iconCls = newChild.get('iconCls');
                if (/^fa-(.*)/.test(iconCls)) {
                    newChild.set('iconCls', 'x-fa ' + iconCls);
                }
            }
        }
    }
});
Ext.define('SM.view.base.BaseGrid', {
    extend: 'Ext.grid.Panel',

    multiColumnSort: true,
    listeners: {
        headerclick: function(ct, col, _e) {
            // console.log('col object: ', col);
            if (col.isSortable) {
                console.log('sort state: ', col.sortState);

            }
        }
    }
});

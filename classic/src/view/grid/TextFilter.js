Ext.define('SM.view.grid.TextFilter', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.gridfilterfield',

    emptyText: 'Filter',
    width: '92%',
    padding: '0 5px',
    cls: 'x-grid-col-filter',
    enableKeyEvents: true,
    listeners: {
        keyup: {
            fn: function(field, _event) {
                this.up('grid').getStore().filter(new Ext.util.Filter({
                    anyMatch: true,
                    disableOnEmpty: true,
                    property: field.up('gridcolumn').dataIndex,
                    value   : field.getValue()
                }));
            },
            buffer: 500
        }
    }
});

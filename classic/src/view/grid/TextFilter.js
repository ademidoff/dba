Ext.define('SM.view.grid.TextFilter', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.gridfilterfield',

    emptyText: 'Filter',
    width: '100%',
    cls: 'grid-col-filter',
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
            buffer: 250
        }
    }
});

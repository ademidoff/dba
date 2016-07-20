/**
 * Flat Combobox
 * Has a remote store with one field only: `Value`
 * Queries any entity
 */
Ext.define('SM.view.form.FlatComboBox', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'combobox.flat',

    /**
     * @cfg {integer} formElementId holds the `FormElement`.`Id`
     * This value should be assigned upon instatiation.
     */

    queryMode: 'remote',
    typeAhead: true,
    typeAheadDelay: 300,
    displayField: 'Value',
    valueField: 'Value',
    // unless false, this will break the proxy's `query` param
    queryParam: false,
    forceSelection: true,

    initComponent: function() {
        var me = this;
        var model = Ext.create('SM.model.Base', {
            fields: [
                { name: 'Id',        type: 'string' },
                { name: 'Value',     type: 'string' }
            ]
        });
        var proxy = Ext.create('SM.store.BaseProxy', {
            reader: {
                type: 'json',
                rootProperty: 'data'
            },
            extraParams: {
                action: 'enum',
                query: {
                    Id: me.formElementId
                }
            }
        });
        var store = SM.core.createStore({
            model: model,
            proxy: proxy
        });

        Ext.apply(this, {
            store: store
        });
        this.callParent();
    }
});

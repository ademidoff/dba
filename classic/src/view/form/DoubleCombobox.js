/**
 * Double Combobox
 * Has a remote store with two fields: `Id`, `Value`
 * Queries any entity
 */
Ext.define('SM.view.form.DoubleComboBox', {
    extend: 'Ext.form.field.ComboBox',
    xtype: 'combobox.double',

    /**
     * cfg {integer} formElementId holds the `FormElement`.`Id`
     * This value should be assigned upon instatiation.
     */

    queryMode: 'remote',
    typeAhead: true,
    typeAheadDelay: 300,
    displayField: 'Value',
    valueField: 'Id',
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
                action: 'link',
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
    },

    listeners: {
        scope: this,
        beforequery: function(_queryPlan) {
            // var store = queryPlan.combo.getStore();
            // queryPlan.cancel = !!store.getCount();
        }
    }
});

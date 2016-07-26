Ext.define('SM.view.grid.Checkcolumn', {
    extend: 'Ext.grid.column.Check',
    xtype: 'checkcolumn.ro',

    initComponent: function() {
		// disable the mouse and keyboard clicks on checkcolumns
        this.on('beforecheckchange', function() { return false; });
        this.callParent(arguments);
    }
});

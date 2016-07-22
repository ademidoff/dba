Ext.define('SM.overrides.data.Store', {
    override: 'Ext.data.Store',

    createSortersCollection: function() {
        var sorters = this.callParent();

        if (!Ext.isEmpty(this.multiSortLimit)) {
            sorters.getOptions().setMultiSortLimit(this.multiSortLimit);
        }
        return sorters;
    }
});

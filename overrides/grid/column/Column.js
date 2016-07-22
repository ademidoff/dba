Ext.define('SM.overrides.grid.column.Column', {
    override: 'Ext.grid.column.Column',

    toggleSortState: function() {
        if (this.isSortable()) {
            var me = this,
                grid = me.up('tablepanel'),
                store = grid.store,
                sortParam = me.getSortParam(),
                direction = undefined,
                sorter = store.getSorters().get(sortParam);

            if(!sorter) {
                direction = 'ASC';
                this.sort(direction);
            }
            else {
                if (sorter.config.direction !== sorter._direction) {
                    store.getSorters().remove(sortParam);
                } else
                    this.sort(direction);
            }
        }
    }
});

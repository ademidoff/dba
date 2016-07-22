/**
 * Base store for child data stores
 */
Ext.define('SM.store.BaseStore', {
    extend: 'Ext.data.Store',

    pageSize: 100,
    autoLoad: false,
    remoteSort: true
});

/**
 * Application
 * The main application class. An instance of this class is created by app.js
 */

Ext.define('SM.Application', {
    extend: 'Ext.app.Application',

    stores: [
        'SM.store.BaseStore',
        'SM.store.BaseTreeStore'
    ],

    views: [
        'SM.view.login.Login',
        'SM.view.main.Menu'
    ],

    init: function() {
        var stateProvider;
        if (Ext.util.LocalStorage.supported) {
            stateProvider = new Ext.state.LocalStorageProvider();
        } else {
            stateProvider = new Ext.state.CookieProvider();
        }
        Ext.state.Manager.setProvider(stateProvider); 
    },

    launch: function (profile) {

        // Could use any type of storage, i.e., Cookies, LocalStorage, etc.
        var loggedIn = Ext.state.Manager.get('SMLoggedIn');

        Ext.create({
            xtype: loggedIn ? 'main-menu' : 'login'
        });

    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

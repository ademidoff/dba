/**
 * LoginController.js
 */
 
Ext.define('SM.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    init: function(view) {
        var username = Ext.state.Manager.get('username');
        if (username) {
            view.down('form').getForm().findField('username').setValue(username);
        }
    },

    onLoginClick: function() {
        var refs = this.getView().getReferences();
        var login = refs.usernameField.getValue();
        // var form = this.getView().down('form').getForm();
        // var rememberMe = form.findField('remember');

        Ext.state.Manager.set('SMLoggedIn', true);
        if (login) {
            Ext.state.Manager.set('username', login);
        }

        // Remove Login Window
        this.getView().destroy();

        // Add the main view to the viewport
        Ext.create({
            xtype: 'main-menu'
        });
    }
});
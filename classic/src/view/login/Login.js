/**
 * Login Window
 */
 
 Ext.define('SM.view.login.Login', {
 	extend: 'Ext.window.Window',
    xtype: 'login',

    requires: [
        'SM.view.login.LoginController',
        'Ext.form.Panel'
    ],

    controller: 'login',
    bodyPadding: 10,
    title: 'Service Manager Login',
    closable: false,
    autoShow: true,
	
	items: {
		xtype : 'form',
		reference : 'form',
		items : [
			{
				xtype : 'textfield',
				name : 'username',
				reference: 'usernameField',
				fieldLabel : 'Username',
				allowBlank : false
			}, {
				xtype : 'textfield',
				name : 'password',
				reference: 'passwordField',
				inputType : 'password',
				fieldLabel : 'Password',
				allowBlank : false
			}
			/*, {
				xtype : 'displayfield',
				hideEmptyLabel : false,
				value : 'Enter any non-blank password'
			}*/
		],
		buttons : [
			{
				text : 'Login',
				formBind : true,
				listeners : {
					click : 'onLoginClick'
				}
			}
		]
    }
	
});
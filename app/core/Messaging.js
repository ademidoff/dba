Ext.define('SM.core.Messaging', {
    extend: 'Ext.Mixin',
    mixinConfig: {
        id: 'messaging'
    },
    /**
     * @cfg {Object} classMessages
     * Provide this config object wherever you want to have i10n messages
     * along with `mixins: ['SM.core.Messaging']`
     * NOTE: the messages should be localized/overriden in the language files
     * By default the english message will be used
     */
    constructor: function(config) {
        var me = this;
        if (config) {
            Ext.apply(me, config);
        }
    },

    getMessage: function(messageId) {
        var messages = this.classMessages;
        if (!messages) {
            SM.core.Toast([
                'Messages not configured for the class \'',
                this.getClassName(),
                '\''
            ].join(''));
            return null;
        }
        return messages[messageId] || 'No such message for id: ' + messageId;
    }
});

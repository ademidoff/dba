Ext.define('SM.core.Localizable', {
    extend: 'Ext.Mixin',
    mixinConfig: {
        id: 'localizable'
    },
    /**
     * @cfg {Object} localizable
     * Provide this config object wherever you want to have localized messages
     * along with `mixins: ['SM.core.Localizable']`
     * NOTE: the messages should be localized (i.e. overriden) in the language files
     * By default the english message will be used
     */
    constructor: function(config) {
        var me = this;
        if (config) {
            Ext.apply(me, config);
        }
    },

    localize: function(messageId) {
        var messages = this.localizable;
        if (!messages) {
            SM.core.Toast([
                'Localization not configured for the class \'',
                this.getClassName(),
                '\''
            ].join(''));
            return null;
        }
        return messages[messageId] || 'No such message for id: ' + messageId;
    }
});

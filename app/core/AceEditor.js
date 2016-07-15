Ext.define('SM.core.AceEditor', {
    extend: 'Ext.form.field.TextArea',

    alias: 'widget.codeeditor',

    mixins: ['SM.core.Localizable'],
    localizable: {
        codeEditorNotLoaded: 'Code editor could not be loaded'
    },

    constructor: function(config) {
        var me = this;
        var triggers = {
            editable: false,
            scrollable: false,
            preventScrollbars: true,
            grow: true,
            growMin: 80,
            growMax: 80,
            triggers: {
                codeEditor: {
                    cls: 'x-form-code-trigger',
                    hidden: !window.ace,
                    handler: Ext.bind(me.triggerEditor, me)
                }
            }
        };
        if (!window.ace) {
            Ext.Loader.loadScript({
                url: 'app/core/ace/ace.js',
                onLoad: function() {
                    me.getTrigger('codeEditor').show();
                },
                onError: function() {
                    SM.core.Toast(me.localize('codeEditorNotLoaded'));
                }
            });
        }
        var cfg = Ext.Object.merge(config, triggers);
        me.superclass.constructor.call(this, cfg);
    },

    triggerEditor: function() {
        var me = this;
        if (!me.win || me.win.isDestroyed) {
            me.win = Ext.create('SM.core.AceEditorWindow');
            me.win.copyContentToField = function(content) {
                me.setValue(content);
                // ::scrollTo(x, y, animate = true)
                me.scrollBy(0, -80, false);
            };
            me.win.getRecordId = function() {
                return me.up('form').getRecordId();
            };
        }
        me.win[me.win.isVisible() ? 'hide' : 'show']();
    },

    destroy: function() {
        delete this.win;
        this.callParent();
    }
});

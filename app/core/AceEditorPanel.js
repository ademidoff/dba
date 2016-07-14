/**
 * @class Ext.ux.aceeditor.Panel
 * @extends Ext.panel.Panel
 * A configurable code editor panel
 * Source: https://github.com/ajaxorg/ace
 * Source: http://harrydeluxe.github.io/extjs-ux/example/aceeditor/aceeditor.html
 */
Ext.define('SM.core.AceEditorPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.aceeditorpanel',

    mixins: ['SM.core.Messaging'],

    classMessages: {
        contentFetchingError: 'Error fetching code editor content'
    },

    layout: 'fit',
    autofocus: true,
    border: false,

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            items: {
                xtype: 'component',
                id: 'ace-editor-component'
            },
            dockedItems: {
                xtype: 'toolbar',
                dock: 'top',
                ui: 'footer',
                items: [
                    {
                        xtype: 'button',
                        text: 'Close',
                        iconCls: 'fa fa-arrow-circle-left',
                        handler: Ext.bind(me.doClose, me)
                    },
                    {
                        xtype: 'button',
                        text: 'Save',
                        itemId: 'saveBtn',
                        iconCls: 'fa fa-floppy-o',
                        disabled: true,
                        handler: Ext.bind(me.onSave, me)
                    },
                    {
                        xtype: 'button',
                        text: 'Undo',
                        itemId: 'undoBtn',
                        iconCls: 'fa fa-undo',
                        disabled: true,
                        handler: Ext.bind(me.onUndo, me)
                    },
                    {
                        xtype: 'button',
                        text: 'Redo',
                        itemId: 'redoBtn',
                        iconCls: 'fa fa-repeat',
                        disabled: true,
                        handler: Ext.bind(me.onRedo, me)
                    },
                    '->',
                    {
                        xtype: 'splitbutton',
                        text: 'Settings',
                        iconCls: 'fa fa-cog',
                        menu: [{
                            xtype: 'menucheckitem',
                            group: 'codetheme',
                            text: 'chrome',
                            // checked: true,
                            checkHandler: Ext.Function.bind(me.onChangeTheme, me)
                        },
                        {
                            xtype: 'menucheckitem',
                            group: 'codetheme',
                            text: 'twilight',
                            // checked: false,
                            checkHandler: Ext.Function.bind(me.onChangeTheme, me)
                        }]
                    }
                ]
            }
        });

        me.callParent(arguments);
    },

    listeners: {
        resize: function() {
            if (this.editor) {
                this.editor.resize();
            }
        },
        change: function() {
            var undoManager = this.editor.session.getUndoManager();
            var hasUndo = undoManager.hasUndo();
            var hasRedo = undoManager.hasRedo();
            var toolbar = this.down('toolbar');
            toolbar.getComponent('saveBtn').setDisabled(!hasUndo);
            toolbar.getComponent('undoBtn').setDisabled(!hasUndo);
            toolbar.getComponent('redoBtn').setDisabled(!hasRedo);
        }
    },

    onRender: function() {
        var me = this;
        // save the auto-generated id
        me.editorId = me.items.getAt(0).getId();

        me.callParent(arguments);

        // init editor on afterlayout
        me.on('afterlayout', function() {
            me.initEditor();
        }, me, { single: true });
    },

    fetchContent: function() {
        var recordId = this.up('window').getRecordId();
        if (!recordId) {
            return Promise.resolve({});
        }
        return SM.Request.create({
            params: {
                action: 'find',
                entity: 'EntityEventHook',
                query: recordId
            }
        });
    },

    initEditor: function() {
        var me = this,
            POS_BEGINNING = -1,
            // POS_END = 0,
            editor;

        Ext.applyIf(me, {
            path: '',
            autofocus: true,
            fontSize: '14px',
            theme: 'chrome',
            parser: 'javascript',
            printMargin: true,
            printMarginColumn: 80,
            highlightActiveLine: true,
            highlightGutterLine: true,
            highlightSelectedWord: true,
            scrollPastEnd: true,
            showGutter: true,
            fullLineSelection: true,
            tabSize: 4,
            useSoftTabs: false,
            showInvisible: false,
            useWrapMode: false,
            codeFolding: true
        });

        editor = me.editor = ace.edit(me.editorId);
        editor.$blockScrolling = Infinity;
        editor.ownerCt = me;
        editor.setOptions({
            highlightSelectedWord: me.highlightSelectedWord,
            highlightActiveLine: me.highlightActiveLine
        });
        editor.renderer.setOptions({
            showGutter: me.showGutter,
            scrollPastEnd: me.scrollPastEnd,
            fontSize: me.fontSize,
            printMarginColumn: me.printMarginColumn,
            showPrintMargin: me.printMargin,
            highlightGutterLine: me.highlightGutterLine,
            showInvisibles: me.showInvisible,
            showFoldWidgets: me.codeFolding,
            theme: 'ace/theme/' + me.theme
        });
        editor.session.setOptions({
            wrap: me.useWrapMode,
            tabSize: me.tabSize,
            useSoftTabs: me.useSoftTabs,
            mode: 'ace/mode/' + me.parser
        });

        me.onChangeThrottled = Ext.Function.createThrottled(function() {
            me.fireEvent('change', me.editor);
        }, 500);

        if (me.autofocus) {
            me.editor.focus();
        }
        else {
            editor.renderer.hideCursor();
            editor.blur();
        }

        me.fireEvent('editorcreated', me);

        function resetUndo(me, editor) {
            editor.session.setUndoManager(new ace.UndoManager());
            editor.on('input', me.onChangeThrottled);
        }

        me.fetchContent()
        .then(function(data) {
            var script = data.data && data.data.Script;
            if (script) {
                editor.session.setValue(script, POS_BEGINNING);
            }
            resetUndo(me, editor);
        })
        .catch(function(error) {
            resetUndo(me, editor);
            SM.core.Toast(error || me.getMessage('contentFetchingError'));
        });
    },

    onUndo: function() {
        this.editor.session.getUndoManager().undo(true);
    },

    onRedo: function() {
        this.editor.session.getUndoManager().redo(true);
    },

    onSave: function() {
        var content = this.editor.session.getValue();
        var win = this.up('window');
        win.copyContentToField(content);
        this.editor.session.setUndoManager(new ace.UndoManager());
        this.onChangeThrottled();
    },

    doClose: function() {
        this.up('window').close();
    },

    onChangeTheme: function(btn) {
        this.editor.setTheme('ace/theme/' + btn.text);
    },

    destroy: function() {
        if (this.editor) {
            this.editor.destroy();
        }
        this.callParent();
    }
});

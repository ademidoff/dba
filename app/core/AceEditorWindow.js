Ext.define('SM.core.AceEditorWindow', {
    extend: 'Ext.window.Window',

    xtype: 'aceeditorwindow',
    title: 'Code Editor',
    layout: 'fit',
    maximizable: true,
    border: true,
    width: 700,
    height: 400,
    closeAction: 'destroy',
    
    items: [{
        xtype: 'aceeditorpanel'
        // listeners: {
        //     editorcreated: function() {
        //         console.log('editorcreated fired');
        //     }
        // }
    }],

    listeners: {
        beforeclose: function(win) {
            var panel = win.down('aceeditorpanel');
            var editor = panel.editor;
            // var undoManager = editor.getSession().getUndoManager();
            var undoManager = editor.session.getUndoManager();
            // check if there is unsaved content
            if (!undoManager.hasUndo()) {
                return true;
            } 
            else {
                Ext.Msg.confirm(
                    'Close', 
                    'There are unsaved changes in the editor.\nAre you sure you still want to exit?',
                    win.onExitConfirmed, 
                    win
                );
                return false;
            }
        }
    },

    onExitConfirmed: function(choice) {
        if (choice === 'yes') {
            this.destroy();
        }
    }
});

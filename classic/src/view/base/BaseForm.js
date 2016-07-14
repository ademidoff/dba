/**
 * Base Form for inheritance
 */
Ext.define('SM.view.base.BaseForm', {
    extend: 'Ext.form.Panel',
    xtype: 'base.form',

    config: {
        entityName: null,
        recordId: null
    },

    title: 'Base Form',
    bodyPadding: 15,
    width: '100%',
    scrollable: true,
    // closable: true,

    jsonSubmit: true,
    url: 'api/v1',

    defaults: {
        anchor: '100%',
        labelSeparator: ''
    },

    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            ui: 'footer',
            items: [
                {
                    text: 'Back',
                    iconCls: 'fa fa-arrow-circle-left',
                    handler: function() {
                        var _form = this.up('form');
                        if (!_form.isDirty()) {
                            _form.close();    
                        } else {
                            Ext.Msg.show({
                                title:'Close',
                                message: [
                                    'There are unsaved changes in this form.', 
                                    ' Are you sure you want to close it?'
                                ].join(''),
                                buttons: Ext.Msg.YESNO,
                                icon: Ext.Msg.QUESTION,
                                fn: function(btn) {
                                    if (btn === 'yes') {
                                        _form.close();
                                    }
                                }
                            });                            
                        }
                    }
                },
                {
                    text: 'Save & close',
                    iconCls: 'fa fa-floppy-o',
                    handler: function() {
                        var _form = this.up('form');
                        _form.onSave(_form, onAfterSave);
                        function onAfterSave(response) {
                            SM.core.Toast(response.msg || 'Record saved');
                            _form.close();
                        }
                    }
                },
                {
                    text: 'Save',
                    iconCls: 'fa fa-floppy-o',
                    formBind: true,
                    disabled: true,
                    handler: function() {
                        var _form = this.up('form');
                        _form.onSave(_form, onAfterSave);
                        function onAfterSave(response) {
                            if (response.data) {
                                // possibly load the updated record
                                // console.log(response.data);
                            }
                            if (response.msg)
                                Ext.Msg.alert('Success', response.msg);
                        }
                    }
                },
                {
                    text: 'Copy',
                    iconCls: 'fa fa-plus-circle'
                },
                {
                    text: 'Remove',
                    iconCls: 'fa fa-minus-circle',
                    handler: function() {
                        var _form = this.up('form');
                        _form.onDelete(_form, onAfterDelete);
                        function onAfterDelete(response) {
                            SM.core.Toast(response.msg || 'Record deleted');
                            _form.close();
                        }
                    }
                }
            ]
        }
    ],

        // use this to avoid false positive on loaded values
    resetDirty: function() {
        this.getForm().getFields().each(function(fld) {
            fld.originalValue = fld.getValue();
        });
    },

    onSave: function(_form, onAfterSave) {
        var form = _form.getForm();
        var values;
        if (form.isValid()) {
            values = form.getFieldValues(true);
            if (!Object.keys(values).length) {
                return Ext.Msg.alert('Information', 'No changes to save');
            }
            var recordId = _form.getRecordId();
            var action = recordId ? 'update' : 'create';
            var params = {
                entity: _form.getEntityName(),
                action: action,
                values: values,
                query: {
                    where: {
                        Id: recordId
                    }
                }
            };
            if (!recordId) {
                delete params.query;
            }
            // console.log('values:', values);
            SM.Request.create({
                params: params
            })
            .then(function(response) {
                if (typeof onAfterSave === 'function') {
                    onAfterSave(response);
                }
            })
            .catch(function(err) {
                Ext.Msg.alert('Error', err || 'Unknown server error');
            });
        }
    },

    onDelete: function(_form, onAfterDelete) {
        var form = _form.getForm();
        Ext.Msg.show({
            title:'Delete record',
            message: 'Are you sure you want to delete this record?',
            buttons: Ext.Msg.YESNOCANCEL,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === 'yes') {
                    return console.log('Yes pressed');
                    // TODO: test on dummy records
                    SM.Request.create({
                        params: {
                            entity: _form.getEntityName(),
                            action: 'remove',
                            query: {
                                where: {
                                    Id: _form.getRecordId()
                                }
                            }
                        }
                    })
                    .then(function(response) {
                        if (typeof onAfterDelete === 'function') {
                            onAfterDelete(response);
                        }
                    })
                    .catch(function(err) {
                        Ext.Msg.alert('Error', err || 'Unknown server error');
                    });
                }
            }
        });
    },
    /**
     * @method loadFieldStores Loads comboboxes' stores
     */
    loadFieldStores: function() {
        this.items.each(function(item) {
            if (/^combobox/.test(item.xtype) && item.store) {
                item.store.load();
            }
        });
    }
});

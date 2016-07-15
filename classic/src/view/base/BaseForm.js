/**
 * Base Form for inheritance
 */
Ext.define('SM.view.base.BaseForm', {
    extend: 'Ext.form.Panel',
    xtype: 'base.form',

    mixins: ['SM.core.Localizable'],
    localizable: {
        unsavedCloseConfirm: [
            'There are unsaved changes in this form.',
            ' Are you sure you want to close it?'
        ].join(''),
        cantDeleteRecord: 'This record cannot be deleted',
        beforeDeleteConfirm: 'Are you sure you want to delete this record?'
    },
    // auto getters & setters
    config: {
        entityName: null,
        recordId: null
    },

    title: 'Base Form',
    bodyPadding: 15,
    width: '100%',
    scrollable: true,
    closeAction: 'destroy',
    // closable: false,

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
                        this.up('form').close();
                    }
                },
                {
                    text: 'Save & close',
                    formBind: true,
                    disabled: true,
                    iconCls: 'fa fa-floppy-o',
                    handler: function() {
                        var form = this.up('form');
                        if (form.fireEvent('beforesave', form) === false) {
                            SM.core.Toast('Form cannot be saved');
                            return;
                        }
                        form.onSave(form)
                        .then(function(response) {
                            SM.core.Toast(response.msg || 'Record saved');
                            form.resetDirty();
                            form.close();
                        })
                        .catch(function(err) {
                            Ext.Msg.alert('Information', err || 'Unknown server error');
                        });
                    }
                },
                {
                    text: 'Save',
                    iconCls: 'fa fa-floppy-o',
                    formBind: true,
                    disabled: true,
                    handler: function() {
                        var form = this.up('form');
                        if (form.fireEvent('beforesave', form) === false) {
                            SM.core.Toast('Record cannot be saved');
                            return;
                        }
                        form.onSave(form)
                        .then(function(response) {
                            SM.core.Toast(response.msg || 'Record saved');
                            form.resetDirty();
                            form.fireEvent('aftersave', form, response);
                        })
                        .catch(function(err) {
                            Ext.Msg.alert('Information', err || 'Unknown server error');
                        });
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
                        var form = this.up('form');
                        if (form.fireEvent('beforedelete', form) === false) {
                            return SM.core.Toast(form.localize('cantDeleteRecord'));
                        }
                        form.onDelete(form)
                        .then(function(response) {
                            form.fireEvent('afterdelete', form, response);
                            SM.core.Toast(response.msg || 'Record successfully deleted');
                            form.forceClose();

                        })
                        .catch(function(message) {
                            if (message)
                                SM.core.Toast(message);
                        });
                    }
                }
            ]
        }
    ],

    listeners: {
        beforeclose: function(form) {
            if (form.isDirty()) {
                Ext.Msg.show({
                    title:'Close',
                    message: form.localize('unsavedCloseConfirm'),
                    buttons: Ext.Msg.YESNO,
                    icon: Ext.Msg.QUESTION,
                    fn: function(btn) {
                        if (btn === 'yes') {
                            form.forceClose();
                        }
                    }
                });
                return false;
            }
        },
        beforesave: function() {
        },
        aftersave: function() {
        },
        beforedelete: function() {
        },
        afterdelete: function() {
        }
    },
    /**
     * @method resetDirty Resets the form's dirty state
     * Use to avoid false positive on loaded values
     * @returns {void}
     */
    resetDirty: function() {
        this.getForm().getFields().each(function(fld) {
            fld.originalValue = fld.getValue();
        });
    },
    /**
     * @method forceClose Allows to close the form by ignoring its dirty status
     * @returns {void}
     */
    forceClose: function() {
        this.resetDirty();
        this.close();
    },
    /**
     * @method onSavr Persists the form's field values to the database
     * @param {Object} form The form instance
     * @returns {Promise} The promise will return the server's response
     */
    onSave: function(form) {
        var $form = form.getForm();
        var values = $form.getFieldValues(true);
        return new Promise(function(resolve, reject) {
            if (!$form.isValid()) {
                reject('The form is not valid');
            }
            else if (!Object.keys(values).length) {
                reject('No changes to save');
            }
            else {
                var recordId = form.getRecordId();
                var action = recordId ? 'update' : 'create';
                var params = {
                    entity: form.getEntityName(),
                    action: action,
                    values: values,
                    query: {
                        where: {
                            Id: recordId
                        }
                    }
                };
                if (!recordId) {
                    // new record has no recordId and must have no query
                    delete params.query;
                }
                // console.log('values:', values);
                resolve(SM.Request.create({
                    params: params
                }));
            }
        });
    },
    /**
     * @method onDelete Deletes a form's record from the database
     * @param {Object} form The form instance
     * @returns {Promise} The promise will return the server's response
     */
    onDelete: function(form) {
        return new Promise(function(resolve, reject) {
            Ext.Msg.show({
                title:'Delete record',
                message: form.localize('beforeDeleteConfirm'),
                buttons: Ext.Msg.YESNOCANCEL,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if (btn === 'yes') {
                        resolve(SM.Request.create({
                            params: {
                                entity: form.getEntityName(),
                                action: 'remove',
                                query: {
                                    where: {
                                        Id: form.getRecordId()
                                    }
                                }
                            }
                        }));
                    }
                    else {
                        reject('' /* show no message */);
                    }
                }
            });
        });
    },
    /**
     * @method loadFieldStores Loads comboboxes' stores
     * @returns {void}
     */
    loadFieldStores: function() {
        this.items.each(function(item) {
            if (/^combobox/.test(item.xtype) && item.store) {
                item.store.load();
            }
        });
    }
});

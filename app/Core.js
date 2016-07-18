Ext.ns('SM.core');
Ext.define('SM.core', {});

Ext.define('SM.Request', {

    mixins: ['SM.core.Localizable'],
    localizable: {
        paramsNotDefined: 'Request params not defined',
        unknownServerError: 'Unknown server error'
    },
    /**
	 * @cfg {Ext.Element} maskEl
	 * The mask will be applied on this element during ajax requests
	 */
    maskEl: Ext.getBody(),

    /**
     * @cfg {Object[]} params
     * Parameters to be sent to the back-end via ajax
     */

    constructor: function(config) {

        var me = this;

        if (config) {
            Ext.apply(me, config);
        }

        return new Promise(function(resolve, reject) {

            if (me.params === undefined) {
                return Promise.reject(me.localize('paramsNotDefined'));
            }

            me.maskEl.mask('Loading...');

            Ext.Ajax.request({
                url: 'api/v1',
                method: 'POST',
                jsonData: me.params,

                success: function(response) {
                    var result;
                    me.maskEl.unmask();
                    try {
                        result = Ext.decode(response.responseText);
                        // normalize the result
                        if (!result.data) {
                            Object.assign(result, { data: [] });
                        }
                        resolve(result);
                    } catch(e) {
                        reject(e);
                    }
                },

                failure: function(response) {
                    var err = me.localize('unknownServerError');
                    // action.failureType == 'server'
                    me.maskEl.unmask();
                    try {
                        response = Ext.decode(response.responseText);
                        reject(response.msg || err);
                    } catch (e) {
                        reject(err);
                    }
                }
            });
        });
    }
});

SM.core.createStore = function (params) {
    var type, model, config, proxy;
    var storeClass = 'SM.store.';
    if (params) {
        if (type = params.type) {
            delete params.type;
        }
        if (model = params.model) {
            config = { model: model };
            delete params.model;
        }
        if (proxy = params.proxy) {
            delete params.proxy;
        }
    }

    storeClass += type === 'tree' ? 'BaseTreeStore' : 'BaseStore';
    proxy = proxy || Ext.create('SM.store.BaseProxy', { extraParams: params });
    config = Object.assign({}, config, { proxy: proxy });

    return Ext.create(storeClass, config);
};

SM.core.createTreeStore = function (params) {
    return SM.core.createStore(Object.assign({}, params, {type: 'tree'}));
};

/**
 * fetchForm makes an ajax request to fetch a form config
 * @param {String} formName
 * @return {Array} items Returns an array of fields
 */
SM.core.fetchForm = function(formName) {
    function makeFields(fields) {
        return fields.map(function(fld) {
            var item = {
                formElementId: fld.Id,
                name: fld.Name,
                fieldLabel: fld.Label,
                hidden: fld.IsHidden,
                xtype: fld.Type || 'textfield'
            };
            if (item.xtype === 'numberfield' && /order/i.test(item.name)) {
                item.minValue = 0;
            }
            item.allowNull = Ext.isBoolean(fld.IsMandatory) ? !fld.IsMandatory : true;
            item.disabled = Ext.isBoolean(fld.IsReadOnly) ? fld.IsReadOnly : false;
            return item;
        });
    }

    // returns a Promise
    return SM.Request.create({
        params: {
            lookup: {
                entity: 'FormElement',
                order: ['Order'],
                refkey: 'FormId',
                refqry: { Name: formName }
            }
        }
    })
    .then(function(result) {
        return makeFields(result.data);
    });
};

SM.core.createForm = function(container, entityName, recId) {
    var form;
    return SM.core
        .fetchForm(entityName)
        .then(function(items) {
            if (!items.length) {
                throw new Error('Form ' + entityName + ' not defined');
            }
            form = Ext.create({
                xtype: 'base.form',
                title: entityName,
                items: items
            });
            form.setEntityName(entityName);

            container.add(form);
            if (container.getXType() === 'tabpanel') {
                form.parentTab = container.getActiveTab();
                container.setActiveTab(form);
                form.parentTab.tab.hide();
            }
            // new record
            if (!recId) {
                form.loadFieldStores();
                return form;
            }
            // load the field values from the server, not from the grid
            return SM.Request
            .create({
                params: {
                    action: 'find',
                    entity: entityName,
                    query: recId
                }
            })
            .then(function(data) {
                if (data && data.data) {
                    form.getForm().setValues(data.data);
                }
                form.setRecordId(recId);
                form.loadFieldStores();
                return form;
            })
            .catch(function(error) {
                throw new Error(error.msg || error.message || 'Error loading form data');
            });
        })
        .catch(function(error) {
            var msg = error instanceof Error ? error.message :
                    error ? error : 'Form ' + entityName + ' not found';
            SM.core.Toast(msg);
            if (form) {
                form.close();
            }
        });
};

SM.core.getView = function (entityName) {
    var attributeModel = Ext.create('SM.model.Base', {
        fields: [
            { name: 'Id',           type: 'int' },
            { name: 'EntityId',     type: 'int' },
            { name: 'Name',         type: 'string' },
            { name: 'Label',        type: 'string' },
            { name: 'Order',        type: 'int' },
            { name: 'DataType',     type: 'string' },
            { name: 'Length', 	    type: 'int' },
            { name: 'DefaultValue', type: 'string' },
            { name: 'NotNull',      type: 'boolean' },
            { name: 'AutoInc',      type: 'boolean' },
            { name: 'IsUnique',     type: 'boolean' },
            { name: 'IsPrimary',    type: 'boolean' },
            { name: 'IsDefault',    type: 'boolean' },
            { name: 'IsSortable',   type: 'boolean' },
            { name: 'IsGroupable',  type: 'boolean' },
            { name: 'IsActive',     type: 'boolean' }
        ]
    });

    var attributeStore = SM.core.createStore({
        lookup: {
            entity: 'EntityAttribute',
            order: ['Order'],
            refkey: 'EntityId',
            refqry: { Name: entityName }
        },
        model: attributeModel
    });

    function makeGridColumns() {
        var defaults = { menuDisabled: true };
        var TYPES = {
            INTEGER: { xtype: 'numbercolumn', format: '0,000', width: 100, align: 'right' },
            DECIMAL: { xtype: 'numbercolumn', format: '0,000.00', width: 110, align: 'right' },
            BOOLEAN: { xtype: 'checkcolumn.ro', width: 50, editor: null },
            STRING: { flex: 1, minWidth: 120 },
            DATE: { xtype: 'datecolumn', width: 120 }
        };

        return this.data.reduce(function(res, val) {
            var col = { text: val.Label, dataIndex: val.Name };
            col = Object.assign(col, defaults, TYPES[val.DataType] || TYPES.STRING);
            if (val.Name === 'Id') {
                col.width = 40;
            }
            return res.concat(col);
        }, []);
    }

    function makeModelFields() {
        var TYPES = {
            INTEGER: 'int',
            DECIMAL: 'int',
            BOOLEAN: 'boolean',
            STRING: 'string',
            DATE: 'date'
        };

        return this.data.reduce(function(res, val) {
            var col = { name: val.Name, type: TYPES[val.DataType] || TYPES.STRING };
            return res.concat(col);
        }, []);
    }

    return new Promise(function(resolve, reject) {
        attributeStore.load(function(recs, operation, success) {
            if (success) {
                var data = recs.length ? recs[0].data.data : [];

                resolve({
                    entityName: entityName,
                    data: data,
                    makeGridColumns: makeGridColumns,
                    makeModelFields: makeModelFields
                });
            } else {
                reject('Error fetching the model');
            }
        });
    });
};

SM.core.renderView = function(entity) {
    return SM.core.renderGrid(entity);
};

SM.core.renderGrid = function(entity) {
    var entityName = entity.entityName;
    var contentPanel = Ext.getCmp('sm-content-panel');
    var model = Ext.create('SM.model.Base', {
        fields: entity.makeModelFields()
    });
    var proxy = Ext.create('SM.store.BaseProxy', {
        reader: {
            type: 'json',
            rootProperty: 'data'
        },
        extraParams: {
            entity: entityName,
            action: 'list'
        }
    });
    var dataStore = Ext.create('SM.store.BaseStore', {
        model: model,
        proxy: proxy,
        sorters: {property: 'Id', direction: 'ASC'}
    });

    var toolbar = Ext.create('Ext.toolbar.Toolbar', {
        ui: 'footer',
        items: [
            {
                text: 'Close',
                iconCls: 'fa fa-arrow-circle-left',
                handler: function() {
                    this.up('grid').close();
                }
            },
            {
                text: 'Search',
                iconCls: 'fa fa-search',
                handler: function() {
                    SM.core.Toast('search button pressed');
                }
            },
            {
                text: 'New',
                iconCls: 'fa fa-plus-circle',
                handler: function() {
                    SM.core
                    .createForm(contentPanel, entityName, null)
                    .then(attachFormListeners(contentPanel));
                }
            },
            '->',
            {
                text: '',
                iconCls: 'fa fa-cog',
                handler: function() {
                    SM.core.Toast('Call grid config widget');
                }
            }
        ]
    });

    var paging = Ext.create('Ext.PagingToolbar', {
        store: dataStore,
        displayInfo: true,
        displayMsg: 'Records {0} - {1} of {2}',
        emptyMsg: 'No records'
    });

    var grid = Ext.create('SM.view.base.BaseGrid', {
        title: entityName,
        store: dataStore,
        columns: entity.makeGridColumns(),
        tbar: toolbar,
        bbar: paging,
        listeners: {
            itemdblclick: function(view, rec) {
                // open a form to edit the record
                SM.core
                .createForm(contentPanel, entityName, rec.get('Id'))
                .then(attachFormListeners(contentPanel))
                .then(function(form) {
                    form.fireEvent('dirtychange');
                });
            }
        }
    });

    dataStore.load(function(recs, operation, success) {
        if (success) {
            //var data = recs.length ? recs[0].data.data : [];
            contentPanel.add(grid);
            contentPanel.setActiveTab(grid);
        } else {
            grid.destroy();
            Ext.Msg.alert('Information', 'Entity ' + entityName + ' not found');
        }
    });

    function attachFormListeners(contentPanel) {
        return function(form) {
            function shouldRefreshStore(cb) {
                // console.log('should refresh called from', this.parentTab.id);
                var grid = this.parentTab;
                var store = grid && grid.getStore && grid.getStore();
                store && store.reload({
                    scope: this,
                    callback: function(recs, operation, success) {
                        if (success) {
                            if (typeof form[cb] === 'function') {
                                form[cb]();
                            }
                        }
                    }
                });
            }
            form.on({
                close: function() {
                    this.parentTab.tab.show();
                    contentPanel.setActiveTab(this.parentTab);
                    this.parentTab = null;
                },
                beforeclose: function(_form) {
                    if (form.isDirty()) {
                        Ext.Msg.show({
                            title:'Close',
                            message: form.localize('unsavedCloseConfirm'),
                            buttons: Ext.Msg.YESNO,
                            icon: Ext.Msg.QUESTION,
                            fn: function(btn) {
                                if (btn === 'yes') {
                                    form.doClose();
                                }
                            }
                        });
                        return false;
                    }
                },
                // beforesave: function() {},
                aftersave: shouldRefreshStore,
                // beforedelete: function() {},
                afterdelete: shouldRefreshStore,
                dirtychange: function(form, dirty) {
                    // console.log('dirty change', dirty);
                    var tbar = this.down('toolbar');
                    var hasRecordId = !!this.getRecordId();
                    var isValid = this.getForm().isValid();
                    var deleteBtn = tbar.getComponent('deleteBtn');
                    var saveBtn = tbar.getComponent('saveBtn');
                    var saveCloseBtn = tbar.getComponent('saveCloseBtn');
                    var copyBtn = tbar.getComponent('copyBtn');
                    deleteBtn.setDisabled(!hasRecordId);
                    saveBtn.setDisabled(!dirty || !isValid);
                    saveCloseBtn.setDisabled(!dirty || !isValid);
                    copyBtn.setDisabled(!hasRecordId);
                },
                scope: form
            });
            return form;
        };
    }
};

SM.core.Toast = function(msg) {
    Ext.toast({
        html: Ext.String.format('<p style="text-align:center">{0}</p>', msg),
        bodyPadding: '0 10',
        slideInDuration: 200,
        autoClodeDelay: 5000,
        width: 400,
        align: 't'
    });
};

SM.core.Alert = function(msg) {
    console.warn('This should warn to console: ', msg);
};

SM.core.alertError = function(error) {
    Ext.Msg.alert('Error', error || 'Unknown error');
};

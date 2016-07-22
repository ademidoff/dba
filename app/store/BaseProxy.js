/**
 * Base Ajax Proxy for Stores
 */
Ext.define('SM.store.BaseProxy', {
    extend: 'Ext.data.proxy.Ajax',

    url: 'api/v1',
    actionMethods: {
        read: 'POST'
    },
    reader: {
        type: 'json'
    },
    paramsAsJson: true,
    sortParam: 'orderBy',
    filterParam: 'filterBy'

    /*
    doRequest: function(operation) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation),
            method  = me.getMethod(request),
            jsonData, params;

        if (writer && operation.allowWrite()) {
            request = writer.write(request);
        }

        request.setConfig({
            binary              : me.getBinary(),
            headers             : me.getHeaders(),
            timeout             : me.getTimeout(),
            scope               : me,
            callback            : me.createRequestCallback(request, operation),
            method              : method,
            useDefaultXhrHeader : me.getUseDefaultXhrHeader(),
            disableCaching      : false // explicitly set it to false, ServerProxy handles caching
        });

        if (method.toUpperCase() !== 'GET' && me.getParamsAsJson()) {
            params = request.getParams();
            // console.log('init params: ', operation.getParams());
            // console.log('extra params: ', me.getExtraParams());
            console.log('params: ', params);

            if (params) {
                jsonData = request.getJsonData();
                if (jsonData) {
                    jsonData = Ext.Object.merge({}, jsonData, params);
                } else {
                    jsonData = params;
                }
                request.setJsonData(jsonData);
                request.setParams(undefined);
            }
        }

        if (me.getWithCredentials()) {
            request.setWithCredentials(true);
            request.setUsername(me.getUsername());
            request.setPassword(me.getPassword());
        }
        return me.sendRequest(request);
    }
    */
});



define('/Home/Report/AddReport/Content/API', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    //var API = require('API');
    var API = KISP.require('SSH.API');


    var emitter = new Emitter();
    var loading = null;

    //获取数据
    function post(opt, fn) {

        var api = new API('GetWebRptList', {
            prefix: 'kis.APP004824.SaleManage.BillListInfoController.',
        });


        api.on({
            'request': function () {
                emitter.fire('request');
                loading = loading || KISP.create('Loading', {
                    'z-index': 1030,
                });
                loading.show();
            },

            'response': function () {
                loading.hide();
            },
            'success': function (data, json, xhr) {
                var list = data.rptList;
                emitter.fire('success', [list]);
            },

            'fail': function (code, msg, json, xhr) {
                if (msg != '获取数据为空') {
                    KISP.alert('获取数据失败: {0} ({1})', msg, code);
                }

            },

            'error': function (code, msg, json, xhr) {
                if (!json) { // http 协议连接错误
                    msg = '网络繁忙，请稍候再试';
                }
                KISP.alert(msg);

            },
        });

        api.post(opt);
    }

    return {
        post: post,
        on: emitter.on.bind(emitter),
    };
});



define('/Home/Inform/API', function (require, module, exports) {

    var KISP = require('KISP');
    var loading = null;
    var API = KISP.require('SSH.API');
    var Emitter = KISP.require('Emitter');
    var emitter = new Emitter();
    var list = {};

    //获取数据
    function get(opt, count) {

        var para = {
            pageNo: opt.pageNo,
            pageSize: opt.pageSize,
            type: opt.type,
            showAll: false,
        };

        var api = new API('GetToDoTask', {
            prefix: 'kis.APP004824.SaleManage.BillListInfoController.',
        });

        api.on({
            'request': function () {
                emitter.fire('request');
                loading = loading || KISP.create('Loading');
                loading.show();
            },

            'response': function () {
                loading.hide();
            },
            'success': function (data, json, xhr) {

                if(count){
                    emitter.fire('getCount',[opt.type,data.allCount]);
                    return false;
                }

                var pageList = {
                    pageNo: opt.pageNo,
                    totalPage: data.allCount,
                    pageSize: opt.pageSize,
                };

                list.list = data.list && data.list.length > 0 ? data.list : '';
                list.pageList = pageList ;

                emitter.fire('success',[list]);
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

        api.post(para);
    }


    return {
        get: get,
        on:emitter.on.bind(emitter),
    };
});

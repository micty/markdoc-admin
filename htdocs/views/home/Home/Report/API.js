

define('/Home/Report/API', function (require, module, exports) {

    var KISP = require('KISP');
    var loading = null;
    var API = KISP.require('SSH.API');

    var Emitter = KISP.require('Emitter');
    var emitter = new Emitter();

    function post() {
        var api = new API('GetWebRptList', {
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
                var list = data.rptList;

                if(list){
                    list = list.filter(function (item) {

                        if (item.havePower != '0' && item.showOrder != '0') {
                            return item;
                        } else {
                            return;
                        }
                    });
                }
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

        api.post();
    }

    function update(opt) {

        var para = {
            rptID: opt.rptID,
            status: opt.cmd,
        };

        var api = new API('UpdateWebRptList', {
            prefix: 'kis.APP004824.SaleManage.BillListInfoController.',
          
        });

        api.on({
            'success': function (data, json, xhr) {
              emitter.fire(opt.cmd);
              
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
        post: post,
        update: update,
        on: emitter.on.bind(emitter),
    };

});

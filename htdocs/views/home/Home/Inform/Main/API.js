

define('/Home/Inform/Main/API', function (require, module, exports) {

    var KISP = require('KISP');
    var API = KISP.require('SSH.API');
    var Emitter = KISP.require('Emitter');
    var emitter = new Emitter();

    var loading = null;
    var ToSure = module.require('ToSure');
    var ShowMsg = module.require('ShowMsg');
    var Component = require('Component');

    var ParamDic = {};
    var para = {};
    var type$name = {
        1: '单据审核',
        2: '单据反审核',
        3: '单据作废',
        4: '单据反作废',
    };

    ToSure.on({
        'sure': function (backArray) {

            ParamDic = backArray;
            exports.verify();

        },

    });


    function hint(content) {
        Component.hint({
            type: true,
            content: content,
            time: 1000,
        });
    }

    return exports = {
        verify: function (opt) {    //单据审核

           if(opt){
               para = opt;
           }

            var api = new API('UpdateBillStatus', {
                prefix: 'kis.APP004824.SaleManage.BillInfoController.',
            });


            api.on({
                'request': function () {
                    loading = loading || KISP.create('Loading');
                    loading.show();
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {

                    var list = data[para.id];
                    var result = list.result;
                    switch (result) {
                        case -1:
                            if (Array.isArray(list.details)) {
                                ToSure.render(list);  //创建dialog展示
                            } else {
                                ShowMsg.render(list);
                            }
                            break;
                        case 0:
                            ToSure.render(list);  //创建dialog展示
                            break;
                        case 1:
                            KISP.alert(list.details,function(){
                                emitter.fire('success');
                            });
                            break;
                    };

                    //fn && fn(opt);
                },

                'fail': function (code, msg, json, xhr) {
                    if (msg != '获取数据为空') {
                        KISP.alert(type$name[para.type] + '失败: {0}', msg);
                    }
                },

                'error': function (code, msg, json, xhr) {
                    if (!json) { // http 协议连接错误
                        msg = '网络繁忙，请稍候再试';
                    }

                    msg = '保存销售出库单详情错误: ' + msg;

                    KISP.alert(msg);
                },
            });

            // alert by 马跃 后端接口有调整，调整了post数据格式  -beg
            api.post({
                TransType:para.type,
                Status: para.status,
                Items: [{
                    InterID: para.id,
                    ParamDic: ParamDic,
                }]
            });
            // alert by 马跃 后端接口有调整，调整了post数据格式  -end
        },
        get: function (opt) {      //获取列表全部数据

            var para = {
                type: opt.type,
                showAll: true,
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

                    var list = data.list;

                    var data = list.map(function (item, index) {
                        return {
                            type: opt.type,
                            transType: item.classType,
                            interID: item.billID,
                        }
                    });
                   
                    exports.check({ data: data });

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
        },
        'check': function (opt) {    //设置已阅

                var para = opt;

                var api = new API('UpdateBillsReadStatus', {
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

                        hint('操作成功');
                        emitter.fire('success');
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

        },
        on: emitter.on.bind(emitter),
    };
});

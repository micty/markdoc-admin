define('/Home/Report/ReportDetail/List/API', function (require, module, exports) {

    var KISP = require('KISP');
    var loading = null;
    var API = KISP.require('SSH.API');
    var Emitter = KISP.require('Emitter');
    var emitter = new Emitter();

    function post(opt) {

        var para = {
            rptId: opt.rptID,
            rptType: 1,
        };

        switch (opt.rptID) {
            case 'rpt10001': //销售订单统计表
                para.filter = {
                    datetype: opt.datetype,
                    //groupitem: 3,//默认业务员
                };
                break;
            case 'rpt10006': //商品库存余额表
                para.filter = {
                    showCount: 10,
                };
                break;
            case 'rpt10002': //销售（出库单）毛利润明细表
                para.filter = {
                    datetype: opt.datetype,
                };
                break;
            case 'rpt10008':
                para.filter = {
                    datetype: opt.datetype,
                };
        }

        var api = new API('GetRptDataInfo', {
            prefix: 'kis.APP004824.SaleManage.RptInfoController.',
        });

        api.on({

            'success': function (data, json, xhr) {
                var list = data.rows;
                emitter.fire('success', [list, opt]);
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
        on: emitter.on.bind(emitter),
    };

});

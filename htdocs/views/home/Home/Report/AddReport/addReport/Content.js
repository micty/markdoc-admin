

KISP.panel('/Home/Report/AddReport/Content', function (require, module, panel) {

    var API = module.require('API');
    var List = module.require('List');
    var Authority = require('Authority');

    var list = {};
    var rptID$name = {
        'rpt10001': '销售订单统计表',
        'rpt10006': '商品库存余额表',
        'rpt10002': '销售（出库单）毛利润明细表',
    };

    panel.on('init', function () {

        panel.$.on('click', 'button', function () {
            var index = $(this).parent().attr('index');
            var rptID = list[index].rptID;
            list[index].cmd = 'add';

            if (list[index].havePower == 0) {
                KISP.alert('您没有' + rptID$name[rptID] + '的查看权限');
                return false;
            }
            panel.fire('add', [list[index]]);
        });

        API.on({
            'success': function (detail) {
                list = detail;
                List.render(list);
            }
        });

    });



    panel.on('render', function () {
        API.post();
    });


});






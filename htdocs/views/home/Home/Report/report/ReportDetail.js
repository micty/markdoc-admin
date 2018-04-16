

KISP.panel('/Home/Report/ReportDetail', function (require, module, panel) {

    var KISP = require('KISP');
    var List = module.require('List');

    panel.on('init', function () {

        List.on({
            'data-success': function (data) {
                panel.fire('echarts', [data]);

            },
            'delete-chart': function (opt) {
                panel.fire('delete', [opt]);

            },
            'scale': function (opt) {
                panel.fire('scale', [opt]);
            }
        });


    });


    panel.on('render', function (list) {
        List.render(list);

        panel.$.find('[data-rpt-btn="rpt10001"]').hide();//临时屏蔽销售订单统计表的放大功能
    });


});

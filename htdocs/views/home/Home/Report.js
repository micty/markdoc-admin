

KISP.panel('/Home/Report', function (require, module, panel) {

    var KISP = require('KISP');
    var AddReport = module.require('AddReport');
    var ECharts = module.require('ECharts');
    var API = module.require('API');
    var ReportDetail = module.require('ReportDetail');

    var chartList = [];

    panel.on('init', function () {
       
        //鼠标移上去才展现滚动条  by anlix_gong

        panel.$.hover(function () {
            panel.$.find('[data-cmd="report-item"]').addClass('auto');
        }, function () {
            panel.$.find('[data-cmd="report-item"]').removeClass('auto');
        });

        panel.$.on('click', '[data-type="AddReport"]', function () {

            if (chartList.length == 3) {
                KISP.alert('最多只能添加三个报表');
            } else {
                AddReport.render();
            }
        });
        AddReport.on({
            'add': function (opt) {
                API.update(opt);
            }
        });
        ReportDetail.on({
            'echarts': function (data) {
                ECharts.show();
                ECharts.render(data);
            },
            'delete': function (opt) {
                API.update(opt);
            },
            'scale': function (opt) {
                panel.fire('scale', [opt]);
            },
        });

        API.on({
            'success': function (list) {
                chartList = list;
                ReportDetail.render(list);
            },
            'del': function () {
                API.post();
            },
            'add': function ( ) {
                API.post();
            }
                    
         
        });
    });

    panel.on('render', function () {
        API.post();
    });

});

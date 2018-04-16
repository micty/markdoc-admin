/**
 * 
 */
KISP.panel('/Home/Report/ReportDetail/List', function (require, module, panel) {

    var KISP = require('KISP');
    var $ = require('$');
    var Emitter = KISP.require('Emitter');
    var API = module.require('API');
    var Time = module.require('Time');
    var chartlist = []; //报表数据
    var No;
    var chooseDiv; //选中的div

    var id$info = {
        'rpt10001': {
            'chartType': 2,
            'datetype': 3,
            'groupitem': 3,
            'sorttype': 4,
        }, //销售订单统计表,默认柱状图
        'rpt10006': {
            'chartType': 1,
            'datetype': 3,
            'groupitem': 3,
            'sorttype': 4,
        }, //商品库存余额表,默认饼状图
        'rpt10008': {
            'chartType': 2,
            'datetype': 3,
            'groupitem': 1,
            'sorttype': 4,
        }, //采购订单执行情况表，默认柱状图
    };


    panel.on('init', function () {

        panel.template({
            '': function (data) {
                var list = data.list;
                var html = this.fill('card', list);

                return {
                    'detail': html,
                };
            },
            'card': {
                '': function (item, index) {
                    No = index;
                    var type = item.rptID == 'rpt10006' ? 'special' : 'normal';
                    var html = this.fill(type, item);
                    return html;
                },
                'normal': function (item) {
                    var caption = (item.rptID == 'rpt10001') ? (item.caption + '（单位：千元）') : item.caption;

                    return {
                        'index': No,
                        'caption': caption,
                        'charts-rptnum': item.rptID,
                        'style': item.rptID == 'rpt10002' ? 'display:none;' : 'display:block;',
                    };
                },
                'special': function (item) {
                    return {
                        'index': No,
                        'caption': item.caption,
                        'charts-rptnum': item.rptID,
                    };
                },
            }


        });

        API.on({
            'success': function (data, map) {

                chooseDiv = panel.$.find('[data-cmd="' + map.rptID + '"]');
                var NoData = chooseDiv.parent().next();

                if (data.length == 0) {
                    NoData.show();
                } else {
                    NoData.hide();
                    map.echartdata = data;
                    panel.fire('data-success', [map]);
                }

            }
        })


    });
    panel.on('init', function () {

        panel.$.on('click', '[data-btn="delete"]', function () {

            var index = $(this).parent().attr('data-type');
            var opt = chartlist[index];
            opt.cmd = 'del';

            KISP.confirm('是否取消报表在首页的显示', function () {
                panel.fire('delete-chart', [opt]);

            });
        });

        panel.$.on('click', '[data-btn="scale"]', function () {
            var index = $(this).parent().attr('data-type');
            var opt = chartlist[index];
            opt.cmd = 'scale';
            opt.info = id$info[opt.rptID];
            panel.fire('scale', [opt]);
        });

        panel.$.on('click', '[data-cmd="time"]', function () {
            var index = $(this).parent().attr('data-ulindex');
            $(this).parent().find('li').removeClass('on');
            $(this).addClass('on');

            var rptID = chartlist[index].rptID;

            var elementDiv = panel.$.find('[data-cmd="' + rptID + '"]');
            var map = {
                'rptID': rptID,
                'elementDiv': elementDiv[0],
                'datetype': $(this).attr('index'), //时间
            };
            chooseDiv = elementDiv;
            API.post(map);
        });

    });


    panel.on('render', function (list) {

        chartlist = list.filter(function (item, index) {
            var havePower = item.havePower;
            return !!havePower;
        });
        panel.fill({
            list: chartlist,
        });

        chartlist.forEach(function (item) {

            var elementDiv = panel.$.find('[data-cmd="' + item.rptID + '"]');
            var para = {
                'rptID': item.rptID,
                'elementDiv': elementDiv[0],
                'datetype': 3,
            };

            API.post(para);
        });
    });

});

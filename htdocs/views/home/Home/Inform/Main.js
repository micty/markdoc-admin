

KISP.panel('/Home/Inform/Main', function (require, module, panel) {

    var KISP = require('KISP');
    var API = module.require('API');
    var List = module.require('List');

    var data = {};

    panel.on('init', function () {

        //审核
        panel.$.on('click', '[data-btn="verify"]', function () {

            if (KISP.edition != 'debug') {
                KISP.alert('该功能正在开发中');
                return false;
            }

            var index = $(this).attr('data-index');
            var list = data.list[index];
            var opt = {
                status: 1,//表示审核状态
                type: list.classType,
                id: list.billID,
            };
            API.verify(opt);

        });

        //已阅
        panel.$.on('click', '[data-btn="check"]', function () {

            var index = $(this).attr('data-index');
            var list = data.list[index];
            var opt = {
                data: [{
                    type: data.type,
                    transType: list.classType,
                    interID: list.billID,
                }]
            };

            API.check(opt);

        });


        //设置一键已阅
        panel.$.on('click', '[data-btn="checkAll"]', function () {

            KISP.confirm('是否将所有信息设置为已阅', function () {

                API.get({ type: data.type });
            });

        });

        //单据跳转
        panel.$.on('click', '[data-type="billNo"]', function () {

            if (KISP.edition != 'debug') {
                KISP.alert('该功能正在开发中');
                return false;
            }

            var index = $(this).attr('data-index');
            var list = data.list[index];
            panel.fire('billNo', [list]);
        });

        //显示滚动条
        panel.$.on('mouseover','[data-type="panel"]', function () {
           $(this).addClass("auto");
        });

        panel.$.on('mouseout','[data-type="panel"]', function () {
            $(this).removeClass("auto");
        });


    });

    API.on({
        'success': function () {
            panel.fire('update');
        }
    });

    panel.on('render', function (list,type) {

        data.list = list;
        data.type = type;

        List.render(panel.$, data);
    });

});

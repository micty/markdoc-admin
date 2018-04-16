

KISP.panel('/Home/Inform', function (require, module, panel) {

    var KISP = require('KISP');

    var Tabs = module.require('Tabs');
    var Main = module.require('Main');
    var API = module.require('API');
    var Pager = module.require('Pager');

    var LocalStorage = KISP.require('LocalStorage');
    var homeInfo = new LocalStorage('home');

    var para = {
        'pageSize':  homeInfo.get('pageSize') || 10,
        'pageNo': 1,
        'type': 1,
        'jumpBefore': false,    //用来判断是否为最后一页的最后一条
    };

    var count = {};

    var NoData = require('NoData');
    var nodata = new NoData({
        'container': { $: panel.$.find('[id="home-inform-list"]') },
        'text': '',
        'style': {
            'z-index': 2,
        },
    });

    panel.on('init', function () {

        Tabs.on('change', function (item) {
            para.type = item.type;
            API.get(para);
        });

        API.on({
            'success': function (list) {
                nodata.hide();

                var pageList = list.pageList;

                count.type = para.type;
                count.totalPage = pageList.totalPage;
                Tabs.change(count);

                if ( list.list) {
                    //!pageList && Pager.hide();
                    para.jumpBefore = list.list.length == 1;
                    Pager.render(pageList);

                    Main.render( list.list, para.type);
                }
                else {
                    nodata.show();
                }
            },
            'getCount': function (type, allCount) {
                if (type == 1) {
                    count.item = allCount;
                    API.get({ type: 3, }, true);

                }
                if (type == 3) {
                    count.warn = allCount;
                    Tabs.render(0, count);
                }

            },

        });


        Pager.on({
            'change': function (no, size) {
                para.pageNo = no;
                para.pageSize = size;
                homeInfo.set('pageSize',size)
                API.get(para);
            }
        });

        Main.on({
            'update': function () {

                if (para.jumpBefore && para.pageNo > 1) {

                    para.pageNo --;
                }
                API.get(para);
            },
            'billNo': function (opt) {
                panel.fire('billNo', [opt]);
            },
        });

    });


    panel.on('render', function () {

        API.get(para, true);
    });

});

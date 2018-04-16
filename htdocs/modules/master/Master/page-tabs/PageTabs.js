

KISP.panel('/Master/PageTabs', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    var List = module.require('List');
    var Tabs = module.require('Tabs');


    panel.on('init', function () {


        List.on({
            'change': function (list) {
                Tabs.render(list);
            },

            'remove': function (item, index) {
                Tabs.active(index - 1, true);
            },

            'clear': function () {
                Tabs.active(0, true);
            },

        });


        Tabs.on({
            'render': function (list) {
                panel.fire('render', [list]);
            },

            'active': function (item, index) {
                panel.fire('active', [item, index]);
            },

            'close': function (item, index) {
             
                var values = panel.fire('close', [item, index]);

                if (values.includes(false)) {
                    return false;
                }
            },

            //关闭后。
            'after-close': function (index) {
                List.remove(index);
            },
        });

    });

    


    panel.on('render', function () {
        var list = List.get();

        Tabs.render(list);
        Tabs.active(0, true);

        panel.fire('ready');


    });





    return {

        open: function (item) {
        
            var index = List.index(item);

            if (index >= 0) { //已存在
                Tabs.active(index);
                return index;
            }


            //在当前激活的项后面插入。
            index = Tabs.index();
            index = List.insert(index, item);

            Tabs.active(index);

            return index;
        },

        //给外面手动关闭页签。
        close: function (index) {
            Tabs.close(index);
        },

        active: function (index) {
            Tabs.active(index);
        },

        clear: function () {
            Tabs.clear();
        },

        //设置指定项的标题名称。
        set: function (id, title) {
            var index = List.index({ 'id': id });
            if (index < 0) {
                return;
            }

            var list = List.get();
            var item = List.get(index);

            item.name = title;
            index = Tabs.index();

            Tabs.render(list);
            Tabs.active(index);
        },
       
    };


});


KISP.panel('/TopMenus/Tree', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var MenuTree = require('MenuTree.v2');
    var Data = module.require('Data');

    var tree = null;
    var current = null; //当前激活的项。
    var list = [];



    panel.on('init', function () {
      

        tree = new MenuTree({
            'container': panel.$,
        });

        tree.on({
            'fill': function (list) {
                console.log(list);
            },

            //点击某一项时触发。
            'item': function (item) {
                current = item;
                panel.fire('item', [item]);
            },

            //展开复合节点时触发。
            'open': function (item) {
                current = item;
                panel.fire('item', [item]);
            },

            //关闭复合节点时触发。
            'close': function (item) {
                current = item;
                panel.fire('item', [item]);
            },

            'icon': function (icon, item) {
                
            },

            //这里只能添加一级或者二级菜单项。
            //因此 parent 不为空。
            'add': function (item) {
                this.open(item.parent);

                //如果添加的是二级菜单，则继续保留在添加二级菜单的界面。
                //通过模仿表单里的【添加二级菜单项】按钮点击逻辑来实现。
                if (item.level == 2) {
                    panel.fire('item', [{
                        level: 2,
                        parent: current,
                        data: {},
                    }]);
                }
            },

            'delete': function (item) {
                this.open(item.parent);
            },
        });

        tree.render();
    });


    /**
    * 渲染。
    *   options = {
    *       list: [],
    *       open: true,     //是否打开根节点。
    *   };
    */
    panel.on('render', function (options) {
      
        list = Data.toTree(options);


        tree.fill(list);

        if (options.open) {
            tree.open('root');
        }

        
    });

    return {
        'add': function (item) {
            tree.add(item);
        },
        'update': function (item) {
            tree.update(item);
        },

        'delete': function (item) {
            tree.delete(item);
        },

        'move': function (item, step) {
            tree.move(item, step);
        },

        'get': function () {
            var list = tree.get();
            var items = Data.toJSON(list);

            return items;
        },

        'open': function (id) {
            tree.open(id);
        },
    };


});
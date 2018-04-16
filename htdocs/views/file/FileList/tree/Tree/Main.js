

KISP.panel('/FileList/Tree/Main', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var MenuTree = require('MenuTree.v2');
    var Data = module.require('Data');
 
    var tree = null;

    var meta = {
        item: null,     //当前激活的项。
        index: -1,      //路径中下次要 push 的指针。
        list: [],       //路径历史。
    };


    panel.on('init', function () {

        function active(item) {
        
            if (item === meta.item) {
                return;
            }

            meta.index++;
            meta.list[meta.index] = item;
            meta.item = item;
         
            panel.fire('item', [item, {
                'back': meta.index > 0,
                'forward': meta.index < meta.list.length - 1,
                'up': !!(item && item.parent),
                'root': !!item.parent,
                'dirOnly': item.data.type == 'dir',
            }]);

            panel.fire(item.data.type, [item]);
        }



        tree = new MenuTree({
            'container': panel.$,
        });

        tree.on({
            'fill': function (list) {
                
            },

            //点击某一项时触发。
            'item': function (item) {
                if (item.id.endsWith('/')) { //空目录的指示文件。
                    tree.open(item.parent.id);
                    return;
                }
                
                active(item);
               
            },

            //展开复合节点时触发。
            'open': function (item) {
                active(item);
            },

            //关闭复合节点时触发。
            'close': function (item) {
                active(item);
            },

            'icon': function (icon, item) {

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
    *       dir$dirs: {},   //某个目录对应的子目录列表（仅当前层级，不包括子目录的）。
    *       dir$files: {},  //某个目录对应的文件列表（仅当前层级，不包括子目录的）。
    *   };
    */
    panel.on('render', function (options) {
        var list = Data.toTree(options);

        meta.item = null;
        meta.list = [];
        meta.index = -1;
        meta.push = true;

        tree.fill(list);

        
    });

    return {
        open: function (id) {
            var item = tree.get(id);

            if (!item) {
                KISP.alert('不存在节点: ' + id, function () {
                    tree.open('root');
                });
                return;
            }
            
            tree.open(id);
        },

        back: function () {
            var index = meta.index - 1;
            var item = meta.list[index];

            if (!item) {
                return;
            }

            meta.index = index - 1; //后退多一步，为 push 做准备。
            this.open(item);
        },

        forward: function () {
            var index = meta.index + 1;
            var item = meta.list[index];

            if (!item) {
                return;
            }

            this.open(item);
        },

        up: function () {
            var item = meta.item;
            var parent = item ? item.parent : null;

            if (!parent) {
                return;
            }

            this.open(parent);
        },

        root: function () {
            this.open('root');
        },

        dirOnly: function (checked) {
            panel.$.toggleClass('dir-only', !!checked);
        },
    };


});
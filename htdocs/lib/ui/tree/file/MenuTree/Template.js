

define('FileTree/Template', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var Template = KISP.require('Template');
    var $String = KISP.require('String');
    var Escape = KISP.require('Escape');


    function processItem(item, index) {
        var list = item.list;
        var isDir = Array.isArray(list) && list.length > 0;
        var name = isDir ? 'dir' : 'file';

        var html = this.fill(name, item); //`this` is tpl。

        return html;
    }


    function processIcon(item, index) {
        var icon = item.icon;

        return {
            'index': index,
            'name': item.name || icon,
            'class': item.class || icon,
        };
    }



    return {
        create: function (meta) {
           
            var tpl = new Template('#tpl-FileTree');


            tpl.process({
                '': function (data) {
                    var items = data.list.map(processItem, tpl);

                    return {
                        'items': items,
                    };
                },

                'dir': {
                    '': function (item) {
                        //当明确指定不可折叠时，必须强制为打开状态。
                        //否则就再也没机会打开了，因为它会屏蔽掉目录菜单项的点击事件。
                        //因此需要再初始时就强制打开。
                        if (item.foldable === false) {
                            item.open = true;
                        }

                        var list = item.list;

                        //是否有子目录。
                        //说明：一个目录里，可能全是文件，也可能含有至少一个目录。
                        var hasDir = list.find(function (item) {
                            return item.list && item.list.length > 0;
                        });

                        var items = list.map(processItem, tpl);
                        var icons = this.fill('icon', item.icons || []);
                        var name = Escape.html(item.name);
                        var current = meta.current;


                        return {
                            'eid': item.eid,
                            'name': name || '',
                            'items': items,
                            'open': item.open ? 'down' : '',
                            'on': current && item.id == current.id ? 'on' : '',
                            'icons': icons,
                            'display': item.open ? 'display: block;' : 'display: none;',
                            'hasDir': hasDir ? 'has-dir' : 'all-files',
                        };
                    },

                    'icon': processIcon,

                },

                'file': {
                    '': function (item, index) {
                        var icons = this.fill('icon', item.icons || []);
                        var name = Escape.html(item.name);
                        var current = meta.current;

                        return {
                            'eid': item.eid,
                            'name': name,
                            'on': current && item.id == current.id ? 'on' : '',
                            'icons': icons,
                        };
                    },

                    'icon': processIcon,
                },
            });


            ////分配随机 id 和相应的 parent。
            //tpl.on('process', function (item) {
    
            //    var id = item.id = item.id || $String.random();
            //    var eid = item.eid = 'eid-' + $String.random();          //用于 DOM 元素的 id。

            //    meta.id$item[id] = item;
            //    meta.eid$item[eid] = item;

            //    item.list && item.list.map(function (node) {
            //        node.parent = item;    //分配 `parent` 字段。
            //    });

            //    item.trace = function (fn) {
            //        var parent = item.parent;

            //        if (!parent) {
            //            return;
            //        }

            //        fn && fn(parent);
            //        parent.trace(fn);
            //    };


            //});


            return tpl;

        },

    };
});
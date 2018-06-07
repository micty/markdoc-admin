

define('FileTree/Events', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');


    return {
        bind: function (meta) {

            //点击菜单项。
            meta.$.on('click', '[data-type="item"]', function (event) {
                var eid = this.id;
                var item = meta.eid$item[eid];

                if (!item) {
                    return;
                }


                var cmd = 'item';
                var list = item.list;
                var current = meta.current;


                if (current) {
                    $('#' + current.eid).removeClass('on'); //灭掉旧的
                }

                //点击的是一个目录，且没有明确禁用折叠。
                if (list && list.length && item.foldable !== false) {

                    //如果点击的是另外一个已经打开了的目录项，则当成普通的项来处理。
                    //不进行常规的目录项的展开/折叠处理。
                    if (item != current && item.open) {
                        cmd = 'item';
                    }
                    else {
                        var open = item.open = !item.open;  //取反
                        var $li = $(this.parentNode);

                        cmd = open ? 'open' : 'close';
                        $li.toggleClass('down', open);

                        var $ul = $li.children('ul');

                        if (open) {
                            $ul.slideDown(200);
                        }
                        else {
                            $ul.slideUp(200);
                        }
                    }
                }
                else { //是一个文件。
                    //$(this).addClass('on');
                }

                $(this).addClass('on');
                this.scrollIntoViewIfNeeded();

                meta.current = item;
                meta.emitter.fire(cmd, [item]);

            });



            //点击图标。
            meta.$.on('click', '[data-type="icon"]', function (event) {
                event.stopPropagation();

                var target = event.target;
                var index = target.getAttribute('data-index');
                var item = meta.eid$item[target.parentNode.id];
                var icons = item.icons || [];
                var icon = icons[index];

                if (!icon || !item) {
                    return;
                }


                meta.emitter.fire('icon', [icon, item]);
            });
        },

    };
});


KISP.panel('/SideMenus/Main/Guide', function (require, module, panel) {
    var KISP = require('KISP');
    var Header = module.require('Header');
    var Form = module.require('Form');
    var Footer = module.require('Footer');



    panel.on('init', function () {
        Header.on({
            'check': function (checked) {
                Form.check(checked);
            },
        });

        Form.on({
            'add': function (item) {
                Header.render(item);
                Form.render(item);
                Footer.render(item);
            },
            'file': function (file) {
                panel.fire('file', [file]);
            },
            'change': function () {
                var item = Form.get();
                //实时更新到树中。
                if (item && item.id) {
                    panel.fire('update', [item]);
                }
            },
        });

        Footer.on({
            'add': function () {
                var item = Form.get();
                if (!item) {
                    return;
                }

                Form.clear();
                panel.fire('add', [item]);
            },
            'update': function () {
                var item = Form.get();

                panel.fire('update', [item]);
            },
            'delete': function () {
                var item = Form.get('current');
                var msg = '你确认要删除该菜单项吗？';

                //有子菜单。
                if (item.list.length) {
                    msg += '<p style="color: red;">这将会连同的它的所有子菜单一起删除。</p>';
                }

                KISP.confirm(msg, function () {
                    panel.fire('delete', [item]);
                });
            },

            'move': function (step) {
                var item = Form.get('current');
                panel.fire('move', [item, step]);
            },

        });
    });

    /**
    * 渲染。
    */
    panel.on('render', function (item) {
        Header.render(item);
        Form.render(item);
        Footer.render(item);
    });






});
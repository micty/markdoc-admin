
KISP.view('/SideMenus', function (require, module, view) {
    var KISP = require('KISP');
    var API = module.require('API');
    var Tree = module.require('Tree');
    var Main = module.require('Main');

    var meta = {
        file: '',
        mode: 'new',
        json: null,
    };

    view.on('init', function () {
        Tree.on({
            'item': function (item) {
                Main.render({
                    'item': item,
                    'file': meta.file,
                    'mode': meta.mode,
                    'index': 0,
                });
            },
        });

        Main.on({
            'add': function (item) {
                var file = Main.getFile();
                meta.file = file;
                Tree.add(item);
            },
            'update': function (item) {
                Tree.update(item);
            },
            'delete': function (item) {
                Tree.delete(item);
            },
            'move': function (item, step) {
                Tree.move(item, step);
            },


            'mode': {
                'guide': function () {
                    Tree.open('root');
                },
                'code': function () {
                    var groups = Tree.get();
                    var json = meta.json;

                    json.groups = groups;
                    return json;
                },
            },

            'code-change': function (json) {
                meta.json = json || { groups: [], };

                Tree.render({
                    'list': meta.json.groups,
                    'file': meta.file,
                    'open': false,
                });
            },
            'save': function () {
                var file = Main.getFile();
                var groups = Tree.get();

                if (!file) {
                    return;
                }

                meta.json.groups = groups;
                meta.file = file;

                API.save(meta);
            },

            'file': function (file) {
                console.log(file);
                console.log(meta);

                view.fire('file', [file]);
            },
        });

        API.on('success', {
            'get': function (data) {
                meta = data;

                Tree.render({
                    'list': data.json.groups,
                    'file': meta.file,       //以此作为菜单项中的基目录。
                    'open': true,
                });
            },
            'save': function () {
                meta.mode = 'edit'; //保存成功后改后编辑模式。

                Main.render({
                    'file': meta.file,
                    'mode': meta.mode,
                });
            },
            
        });
    });


    /**
    * 渲染内容。
    */
    view.on('render', function (file) {

        //file = 'a/b/c/test/sidebar.json';
        //file = '';

        API.get(file);
       
    });



});

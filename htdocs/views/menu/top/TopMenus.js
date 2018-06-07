
KISP.view('/TopMenus', function (require, module, view) {
    var KISP = require('KISP');
    var API = module.require('API');
    var Tree = module.require('Tree');
    var Main = module.require('Main');


    view.on('init', function () {
        Tree.on({
            'item': function (item) {
                Main.render(item);
            },
        });

        Main.on({
            'add': function (item) {
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
                    var list = Tree.get();
                    return list;
                },
            },

            'code-change': function (list) {
                Tree.render({
                    'list': list,
                    'open': false,
                });
            },
            'save': function () {
                var list = Tree.get();
                API.save(list);
            },

            'file': function (file) {
                view.fire('file', [file]);
            },
        });

        API.on('success', {
            'get': function (list) {
             
                Tree.render({
                    'list': list,
                    'open': true,
                });
            },
            'save': function () {

            },
            
        });
    });


    /**
    * 渲染内容。
    */
    view.on('render', function () {

        API.get();
       
    });



});

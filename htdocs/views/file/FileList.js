
KISP.view('/FileList', function (require, module, view) {
    var KISP = require('KISP');
    var SessionStorage = KISP.require('SessionStorage');

    var API = module.require('API');
    var Tree = module.require('Tree');
    var Preview = module.require('Preview');
    var Sidebar = module.require('Sidebar');
    var Dialog = module.require('Dialog');
    var Main = module.require('Main');


    var storage = new SessionStorage(module.id);

    var meta = {
        item: { id: 'root', },  //当前激活的菜单项。在菜单树填充后首先激活根节点。
    };


    view.on('init', function () {
       

        API.on('success', {
            'get': function (data) {
                Tree.render(data);
                Tree.open(meta.item.id);
            },
            'read': {
                'dir': function (data) {
                    Preview.hide();

                    Main.render({
                        'list': data.detail.list,
                        'item': data.item,
                    });

                    Sidebar.render(data);
                },

                'file': function (data) {
                    Preview.render(data.detail);
                    Main.hide();
                    Sidebar.render(data);
                },
            },
            'delete': function (data) {
                meta.item.id = data.parent;
                API.get();
            },
        });

        Tree.on({
            'item': function (item) {
                storage.set('id', item.id); //保存到 storage。
                meta.item = item;
                API.read(item);
            },
            'resize': {
                'change': function (dx) {
                    Main.resize(dx);
                    Preview.resize(dx);
                },

                'stop': function () {
                    Main.resize(true);
                    Preview.resize(true);
                },
            },
        });


        Main.on({
            'item': function (item) {
                Tree.open(item.name);
            },
        });


        Preview.on({
            'render': function (titles) {
                Sidebar.outline(titles);
            },
        });

        Sidebar.on('outline', function (item, index) {
            Preview.outline(index);
        });

        Sidebar.on('operation', {
            'refresh': function () {
                API.get();
            },
            'edit': function () {
                view.fire('edit', [meta.item.id]);
            },
            'rename': function () {
                Dialog.render({ cmd: 'rename', 'item': meta.item, });
            },
            'add': function () {
                Dialog.render({ cmd: 'add', 'item': meta.item, });
            },
            'delete': function () {
                API.delete(meta.item);
            },
            'open': function () {
                API.open(meta.item.id);
            },
            'download': function () {
                API.download(meta.item.id);
            },
            'use': function () {
                var data = Preview.get();
                view.fire('use', [data]);
            },
            'demo': function () {
                var $String = KISP.require('String');
                var demo = KISP.data('demo');

                var url = $String.format(demo.file, {
                    'url': demo.url,
                    'file': meta.item.id,
                });

                window.open(url);
            },
            'sidebar': function () {
                view.fire('sidebar', [meta.item.id]);
            },
        });

        Dialog.on({
            'success': function (data) {
                meta.item = { 'id': data.dest, };
                API.get(); //刷新。
            },
        });
       
    });


    /**
    * 渲染内容。
    *   file: '',   //渲染完成后要打开的文件。
    */
    view.on('render', function (file) {
        var id = file || storage.get('id') || 'root';
        meta.item = { 'id': id, }; //使用完全重新的方式。

        API.get();

       
    });



});

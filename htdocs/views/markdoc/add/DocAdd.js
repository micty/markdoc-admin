
KISP.view('/DocAdd', function (require, module, view) {
    var KISP = require('KISP');

    var API = module.require('API');
    var Editor = module.require('Editor');
    var Preview = module.require('Preview');
    var Storage = module.require('Storage');
    var Themes = module.require('Themes');
    var Header = module.require('Header');
    var Change = module.require('Change');
    var Outline = module.require('Outline');


    var meta = {
        content: '',        //内容。
        ext: '.md',         //当前请求后台的文件信息，如果有。
        changed: false,     //自读取或保存以来，是否已发生修改。
        mode: 'new',        //模式。 编辑或新增，即 `edit` 或 `new`。
    }; 



    view.on('init', function () {

        function save() {
            Change.save(meta.changed, function () {
                var name = Header.get();
                var content = Editor.getContent();

                name && API.save({
                    'id': name,         //
                    'mode': meta.mode,  // `new` | `edit`。
                    'content': content, //
                });
            });
        }


        Header.on({
            'save': save,
            'fullscreen': function () {
                view.fire('fullscreen');
            },
            'column': function () {
                view.$.toggleClass('full-editor');
            },
            'themes': function () {
                Themes.toggle();
            },
            'new': function () {
                view.render({ content: '', });
            },
            'table': function (data) {
                Editor.addTable(data);
            },
            'editor': function (cmd) {
                Editor.call(cmd);
            },
            'outline': function () {
                Outline.show();
            },
        });

        Editor.on({
            'save': save,
            'scroll': function (info) {
                Preview.scroll(info);
            },
            'content': function (content) { //填充内容、修改内容时，都会触发。
                if (content != meta.content) {
                    meta.content = content;
                    meta.changed = true;
                    Storage.set(content);
                }

                Preview.render({
                    'content': content,
                    'ext': meta.ext,
                });
            },
        });

        Preview.on({
            'render': function (titles) {
                Outline.render(titles);
            },
            'scroll': function (info) {
                Editor.scroll(info);
            },
        });

        Themes.on({
            'item': function (name) {
                Editor.setTheme(name);
            },
        });

        Outline.on({
            'item': function (item, index) {
                Preview.to(index);
            },
        });

        API.on('success', {
            'read': function (data) {
                Header.render({
                    'mode': 'edit',
                    'id': data.name, //其实就是文件 id。
                });

                meta.ext = data.ext;

                Editor.render(data); //会触发 Editor.content 事件。 该行代码要在上下这两行代码之间。

                meta.changed = false;
                meta.mode = 'edit';
            },

            'save': function (data) {
                meta.changed = false; //这个先执行。

                //如果是新增文件，则重新加载一下，以便根据后缀名进行语法高亮。
                if (meta.mode == 'new') {
                    view.render({ 'id': data.name });
                    return;
                }


                meta.mode = 'edit';

                Header.render({
                    'mode': 'edit',
                    'id': data.name,
                });
            },
        });
    });


    /**
    * 渲染内容。
    * 处理的优先级如下：
    *
    *   1, 来源于某个文件时。
    *   options = {
    *       id: '',         //必选。 文件 id。
    *   };
    *
    *   2, 来源于具体内容时。
    *   options = {
    *       content: '',    //必选。 内容。
    *       ext: '',        //可选。 内容类型。
    *   };
    *
    *   3, 来源于 storage 时。
    *   options = {
    *       storage: true,
    *   };
    *
    *   4, 来源于自身垢 readme 文件时。
    *   options = {
    *       readme: true,
    *   };
    */
    view.on('render', function (options) {
        var opt = options || { storage: true, };
        var id = opt.id;

        Header.render();
        Editor.render(meta);;
        Themes.render(1);


        if (id) {
            return Change.load(meta.changed, function () {
                API.read(id);
            });
        }


        var content =
                'content' in opt ? opt.content :
                opt.storage ? Storage.get() :
                opt.readme ? Editor.getReadme() : '';

        Change.load(meta.changed, function () {
            meta.ext = opt.ext || '.md';
            meta.content = content;
            meta.changed = true;
            meta.mode = 'new';

            Header.render();
            Editor.render(meta);
        });

       
    });

  

});

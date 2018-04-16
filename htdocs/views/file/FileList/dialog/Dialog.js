KISP.panel('/FileList/Dialog', function (require, module, panel) {
    var KISP = require('KISP');
    var Dialog = require('Dialog');

    var Content = module.require('Content');
    var API = module.require('API');

    var dialog = null;
    var current = null; //外面传进来的数据。


    panel.on('init', function () {

        //提交。
        function submit() {
            var data = Content.get();

            if (!current || !data) {
                return;
            }

            switch (current.cmd) {
                case 'rename':
                    if (data.name == current.item.name) {
                        dialog.close();
                        return;
                    }

                    API.rename({
                        'item': current.item,
                        'name': data.name,
                    });
                    break;

                case 'add':
                    API.add({
                        'item': current.item,
                        'name': data.name,
                        'type': data.type,
                        'file': current.file,
                    });
                    break;
            }


        }



        dialog = Dialog.panel({
            'container': panel,
            'content': Content,
            'title': '',
            'resizable': true,
            'autoClose': false, //点击按钮不要自动关闭。
            'width': 400,
            'height': 200,
            'z-index': 1023,
            'footer': [
                { text: '确定', name: 'ok', },
            ],

        });

        dialog.on({
            'render': function (data) {
                Content.render(current);
            },
            'enter': function (event) {
                submit();
            },
        });

        

        dialog.on('button', {
            'ok': function () {
                submit();
            },
        });

        Content.on({
            'select': function (file) {
                current.file = file;
                console.log(current);
            },
            'type': function (type) {
                console.log(type);
            },

        });

        API.on('success', function (data) {
            dialog.close();
            panel.fire('success', [data]);
        });


    });

    panel.on('render', function (data) {
        var item = data.item;
        var isFile = item.data.type == 'file';
        var isAdd = data.cmd == 'add';

        //如果操作的是一个文件节点，且动作是添加，
        //则当作是在操作它的父节点，即它的目录节点。
        if (isFile && isAdd) {
            data.item = item.parent;
        }


        render(data);

        function render(data) {
            current = Object.assign({}, data);

            var item = data.item;
            var isAdd = data.cmd == 'add';
            var isFile = item.data.type == 'file';

            var desc = isFile ? '文件' : '目录';
            var title = isAdd ? '添加' : ('重命名' + desc);
            var height = isAdd ? 232 : 150;

            dialog.render({ 'title': title, });
            dialog.set({ 'height': height, });
        }

    });



});

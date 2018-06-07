

define('/FileList/Dialog/API', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var API = require('API');

    var emitter = new Emitter();

    var loading = KISP.create('Loading', {
        mask: 0,
    });
    
    var toast = KISP.create('Toast', {
        duration: 1500,
        mask: 0,
    });



    /**
    * 添加文件或目录。
    *   options = {
    *       item: {},   //菜单项。
    *       name: '',   //文件名。
    *       type: '',   //类型，只能是 `file` 或 `dir`。
    *   };
    */
    function add(options) {
        var api = new API('FileList.add');
        var item = options.item;
        var id = item.id;

        if (item.parent) { //没有父节点，说明是根节点。
            id += '/';
        }

        var dest = id + options.name;


        api.on({
            'request': function () {
                loading.show('提交中...');
            },

            'response': function () {
                loading.hide();
            },

            'success': function (data, json, xhr) {
                toast.show('添加成功');

                setTimeout(function () {
                    emitter.fire('success', [{
                        'dest': dest,
                    }]);

                }, 1500);
            },

            'fail': function (code, msg, json, xhr) {
                KISP.alert('添加失败: {0}', msg);
            },

            'error': function (code, msg, json, xhr) {
                KISP.alert('添加错误: 网络繁忙，请稍候再试');
            },
        });

        api.post({
            'id': dest,
            'type': options.type,
        });
    }



    /**
    * 上传文件。
    *   options = {
    *       file: FileObject,   //必选，DOM 节点中的 file 元素。
    *       item: {},           //可选，菜单项。
    *       name: '',           //可选，文件名。 如果不指定，则使用原始文件名。
    *   };
    */
    function upload(options) {
        var File = require('File');

        var item = options.item;
        var isRoot = !item.parent;    //没有父节点，则是根目录。
        var dir = isRoot ? '' : item.id + '/';

        /**
        * 上传文件。
        *   options = {
        *       file: File,         //必选，DOM 节点中的 input[type="file"] 元素中获取到的对象。
        *       dir: '',            //可选，要存储的目录名。 如 `a/b/c/`，必须以 `/` 结束。
        *       name: '',           //可选，文件名。 如果不指定，则使用原始文件名。
        *       done: function,     //可选，上传完成后的回调。
        *   };
        */
        File.upload({
            'file': options.file,
            'dir': dir,
            'name': options.name,

            'done': function (data) {
                if (!data) {
                    KISP.alert('上传失败');
                    return;
                }

                toast.show('上传成功');

                setTimeout(function () {
                    emitter.fire('success', [{
                        'dest': data.dest,
                    }]);

                }, 1500);
            },
        });

    }




    return {
        on: emitter.on.bind(emitter),

        /**
        * 重命名文件或目录。
        *   options = {
        *       item: {},   //菜单项。
        *       name: '',   //文件或目录名。
        *   };
        */
        rename: function (options) {
            var api = new API('FileList.rename');
            var item = options.item;
            var parent = item.parent;
            var isRoot = !parent.parent;    //没有父节点，则是根目录。
            var dest = isRoot ? options.name : parent.id + '/' + options.name;

            api.on({
                'request': function () {
                    loading.show('提交中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {
                    toast.show('重命名成功');

                    setTimeout(function () {
                        emitter.fire('success', [{
                            'dest': dest,
                        }]);

                    }, 1500);
                },

                'fail': function (code, msg, json, xhr) {
                    KISP.alert('重命名失败: {0}', msg);
                },

                'error': function (code, msg, json, xhr) {
                    KISP.alert('重命名错误: 网络繁忙，请稍候再试');
                },
            });

            api.post({
                'id': item.id,
                'dest': dest,
            });

        },

        /**
        * 添加文件或目录。
        *   options = {
        *       item: {},           //菜单项。
        *       name: '',           //文件或目录名。
        *       type: '',           //类型，只能是 `file` 或 `dir`。
        *       file: File,         //必选，DOM 节点中的 input[type="file"] 元素中获取到的对象。
        *   };
        */
        add: function (options) {
            var type = options.type;
            var item = options.item;
            var file = options.file;
          
            if (type == 'file' && file) {
                upload({
                    'file': file,
                    'item': item,
                    'name': options.name,
                });
            }
            else {
                add({
                    'item': item,
                    'name': options.name,
                    'type': type,
                });
            }

        },

       
    };


});
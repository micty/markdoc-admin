

define('/FileList/API', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var $String = KISP.require('String');
    var API = require('API');
    var Query = KISP.require('Query');

    var rootUrl = KISP.config('API').url;

    var emitter = new Emitter();

    var loading = KISP.create('Loading', {
        mask: 0,
    });

    var toast = null;
    

    return {
        on: emitter.on.bind(emitter),

        /**
        * 获取。
        */
        get: function () {
            var api = new API('FileList.get');

            api.on({
                'request': function () {
                    loading.show('加载中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {
                    
                    emitter.fire('success', 'get', [data]);
                },

                'fail': function (code, msg, json, xhr) {
                    KISP.alert('获取文件列表失败: {0}', msg);
                },

                'error': function (code, msg, json, xhr) {
                    KISP.alert('获取文件列表错误: 网络繁忙，请稍候再试');
                },
            });

            api.get();

        },

        /**
        * 读取指定文件或目录的信息。
        */
        read: function (item) {
            var api = new API('FileList.read');

            api.on({
                'request': function () {
                    loading.show('加载中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {
                    var content = data.content;

                    if (data.isImage) {
                        var sample = '![ ]({id})';                   //markdown 语法。 中括号之间要留个空格，才能在 markdoc 的源码中语法高亮。

                        data.content = $String.format(sample, {
                            'id': data.name,
                        });

                        //data.ext = '.md';
                    }


                    var type = item.data.type;

                    var options = {
                        'detail': data,     //服务器读取到的信息。
                        'item': item,       //菜单项的信息。
                    };

                    emitter.fire('success', 'read', type, [options]);
                },

                'fail': function (code, msg, json, xhr) {
                    KISP.alert('获取文件内容失败: {0}', msg);
                },

                'error': function (code, msg, json, xhr) {
                    KISP.alert('获取文件内容错误: 网络繁忙，请稍候再试');
                },
            });

            api.get({'id': item.id, });

        },

        /**
        * 删除指定的文件或目录。
        */
        delete: function (item) {
            var type = item.data.type;

            var type$desc = {
                file: '文件',
                dir: '目录',
            };

            var msg = '你确认要删除该' + type$desc[type] + '吗？'

            //是一个目录。
            if (type == 'dir') {
                msg += '<p style="color: red;">这将会连同它的所有子目录和文件一起删除。</p>';
            }
            
            msg += '<p style="color: #FF5722; font-weight: bold;">该操作会直接从服务器上删除目标项，且不可恢复！</p>';



            KISP.confirm(msg, function () {

                var api = new API('FileList.delete');

                api.on({
                    'request': function () {
                        loading.show('删除中...');
                    },

                    'response': function () {
                        loading.hide();
                    },

                    'success': function (data, json, xhr) {
                        
                        toast = toast || KISP.create('Toast', {
                            text: '删除成功',
                            duration: 1500,
                            mask: 0,
                        });

                        toast.show();

                        setTimeout(function () {
                            emitter.fire('success', 'delete', [{
                                'id': item.id,
                                'parent': item.parent.id,
                            }]);

                        }, 1500);
                    },

                    'fail': function (code, msg, json, xhr) {
                        KISP.alert('删除失败: {0}', msg);
                    },

                    'error': function (code, msg, json, xhr) {
                        KISP.alert('删除错误: 网络繁忙，请稍候再试');
                    },
                });

                api.post({
                    'id': item.id,
                    'type': type,
                });

            });


        },

        download: function (id) {
            var api = rootUrl + 'download';
            var url = Query.add(api, 'id', id);

            location.href = url;

        },

        open: function (id) {
            var url = rootUrl + id;

            window.open(url);

        },

    };


});
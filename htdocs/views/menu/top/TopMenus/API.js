

define('/TopMenus/API', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var JSON = KISP.require('JSON');
    var API = require('API');

    var emitter = new Emitter();

    var loading = KISP.create('Loading', {
        mask: 0,
    });

    var toast = KISP.create('Toast', {
        duration: 1500,
        mask: 0,
    });



    var meta = {
        file: 'config.json',
        json: null,
    };




    return {
        on: emitter.on.bind(emitter),

        /**
        * 获取。
        */
        get: function () {
            var api = new API('FileList.read');

            api.on({
                'request': function () {
                    loading.show('加载中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, root, xhr) {
                    var json = JSON.parse(data.content) || {};
                    var header = json.header = json.header || {};
                    var list = header.menus = header.menus || [];

                    meta.json = json;

                    emitter.fire('success', 'get', [list]);
                },

                'fail': function (code, msg, root, xhr) {
                    KISP.alert('获取菜单列表失败: {0}', msg);
                },

                'error': function (code, msg, json, xhr) {
                    KISP.alert('获取菜单列表错误: 网络繁忙，请稍候再试');
                },
            });


            api.get({
                'id': meta.file,
            });

        },

        /**
        * 保存。
        */
        save: function (list) {
            var api = new API('FileList.write');

            api.on({
                'request': function () {
                    loading.show('保存中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {
                    toast.show('保存成功');
                    emitter.fire('success', 'save', []);
                },

                'fail': function (code, msg, json, xhr) {
                    KISP.alert('保存菜单列表失败: {0}', msg);
                },
                'error': function (code, msg, json, xhr) {
                    KISP.alert('保存菜单列表错误: 网络繁忙，请稍候再试');
                },
            });

            var json = meta.json;

            json.header.menus = list;

            var content = JSON.stringify(json, null, 4);



            api.post({
                'id': meta.file,
                'mode': 'edit',
                'content': content,
            });
        },
    };



});
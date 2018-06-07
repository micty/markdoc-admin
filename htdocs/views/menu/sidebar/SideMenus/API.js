

define('/SideMenus/API', function (require, module, exports) {
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

    //新文件。
    function newFile() {
  
        emitter.fire('success', 'get', [{
            file: '',
            mode: 'new',
            json: {
                file: '',
                logo: '',
                mutex: false,
                groups: [],
            },
        }]);
    }




    return {
        on: emitter.on.bind(emitter),

        /**
        * 获取。
        */
        get: function (file) {

            //未指定文件名，则当作是新建的。
            if (!file) {
                return newFile();
            }


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
                    json.groups = json.groups || [];

                    emitter.fire('success', 'get', [{
                        'mode': 'edit',
                        'file': file,
                        'json': json,
                    }]);
                },

                'fail': function (code, msg, root, xhr) {

                    //不存在该文件，则当作新建。
                    if (code == 404) {
                        return newFile();
                    }


                    KISP.alert('获取菜单列表失败: {0}', msg);
                },

                'error': function (code, msg, json, xhr) {
                    KISP.alert('获取菜单列表错误: 网络繁忙，请稍候再试');
                },
            });


            api.get({
                'id': file,
            });

        },

        /**
        * 保存。
        */
        save: function (options) {
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



            var json = options.json;
            var content = JSON.stringify(json, null, 4);


            api.post({
                'id': options.file,
                'mode': options.mode,
                'content': content,
            });
        },
    };



});
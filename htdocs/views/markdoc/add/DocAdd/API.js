
define('/DocAdd/API', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var API = require('API');
    var Emitter = KISP.require('Emitter');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;


    


    
    


    return {
        'on': emitter.on.bind(emitter),

        //获取详情
        'read': function (id) {

            var api = new API('FileList.read');

            api.on({
                'request': function () {
                    loading = loading || KISP.create('Loading', {
                        mask: 0,
                    });
                    loading.show('读取中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {
                    emitter.fire('success', 'read', [data]);
                },

                'fail': function (code, msg, json) {
                    KISP.alert('读取失败: {0}', msg);
                },

                'error': function () {
                    KISP.alert('读取错误: 网络繁忙，请稍候再试');
                },
            });

            api.get({ 'id': id, });

        },

        //提交详情
        'save': function (data) {
            var api = new API('FileList.write');

            api.on({
                'request': function () {
                    loading = loading || KISP.create('Loading', {
                        mask: 0,
                    });

                    loading.show('提交中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {
                    toast = toast || KISP.create('Toast', {
                        text: '保存成功',
                        duration: 1500,
                        mask: 0,
                    });

                    toast.show();

                    setTimeout(function () {
                        emitter.fire('success', 'save', [data]);
                    }, 1500);

                },

                'fail': function (code, msg, json) {
                    KISP.alert('保存失败: {0}', msg);
                },

                'error': function () {
                    KISP.alert('保存错误: 网络繁忙，请稍候再试');
                },
            });

            api.post(data);

        },
    };


});
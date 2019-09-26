
define('/Login/API', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var API = require('API');
    var Emitter = KISP.require('Emitter');
    var MD5 = module.require('MD5');

    var emitter = new Emitter();
    var loading = null;
    var toast = null;




    return {
        'on': emitter.on.bind(emitter),

        login: function (data) {
            var api = KISP.create('API', 'User.login'); //这里要用纯原生的。

            api.on({
                'request': function () {
                    loading = loading || KISP.create('Loading', {
                        mask: 0,
                    });

                    loading.show('登录中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {
                    toast = toast || KISP.create('Toast', {
                        text: '登录成功',
                        duration: 1500,
                        mask: 0,
                    });

                    toast.show();

                    setTimeout(function () {
                        emitter.fire('success', 'login', [data]);
                    }, 1500);

                },

                'fail': function (code, msg, json) {
                    KISP.alert('登录失败: {0}({1})', msg, code);
                },

                'error': function () {
                    KISP.alert('登录错误: 网络繁忙，请稍候再试');
                },
            });



            var number = data.number;
            var password = MD5.encrypt(data.password); //md5 加密。

            api.post({
                'number': number,
                'password': password,
            });

        },

        logout: function () {

        },


    };


});
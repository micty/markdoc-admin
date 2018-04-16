
/**
* API。 
* 主要实现自动加上 token 字段。
*/
define('API', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var User = require('User');



    function API(name, config) {
        var token = User.get('token');
        var api = KISP.create('API', name, config);
        var get = api.get.bind(api);
        var post = api.post.bind(api);

        api.get = function (data) {
            data = data || {};
            data.token = token;

            return get(data);
        };

        api.post = function (data, query) {
            query = query || {};
            query.token = token;

            console.log(name, data);

            return post({ 'data': data, }, query);
        };



        api.on('fail', function (code) {
            
            if (code == -1 || code == -2) {
                var msg = code == -2 ?
                    '会话已超时，请重新登录。' :
                    '请先登录再操作。';


                KISP.alert(msg, function () {
                    User.clear();
                    location.reload();
                });

                //重置为空函数，防止下一个 fail 事件的处理器再弹出 alert。
                KISP.alert = function () { };
            }


        });



        return api;
    }

    Object.assign(API, {
        upload: function (file) {
            var token = User.get('token');


        },
    });

    return API;

});
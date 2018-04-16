

define('User', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var LocalStorage = KISP.require('LocalStorage');
    var SessionStorage = KISP.require('SessionStorage');

    var session = new SessionStorage(module.id);
    var local = new LocalStorage(module.id);


    return exports = {
        /**
        * 从 sessionStorage 或 localStorage 里获取已缓存到的用户信息。
        * 已重载 get();        //从 sessionStorage 里获取用户的全部信息。
        * 已重载 get(key);     //从 sessionStorage 里获取用户的指定键的信息。
        * 已重载 get(true);    //从 localStorage 里获取用户信息。 针对 `/Login` 模块。
        */
        get: function (key) {
            //针对 Login 面板。
            if (key === true) {
                return local.get('user');
            }

            var user = session.get('user');

            if (!user) {
                return;
            }

            return key ? user[key] : user;

        },

        /**
        * 把用户信息写到缓存中(sessionStorage 和 localStorage)。
        */
        set: function (data) {
            session.set('user', data);
            local.set('user', data);
        },

        /**
        * 
        */
        clear: function () {
            session.remove('user');
        },

        /**
        * 
        */
        isSuper: function () {
            var user = exports.get();

            return user.role == 'administrator';
        },

        /**
        * 
        */
        is: function (role) {
            if (exports.isSuper()) {
                return true;
            }

            var user = exports.get();

            return user.role == role;
        },

        /**
        * 
        */
        display: function (role) {
            return exports.is(role) ? '' : 'display: none;';
        },
    };


});
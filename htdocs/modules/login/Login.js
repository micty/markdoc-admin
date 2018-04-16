

KISP.panel('/Login', function (require, module, panel) {
    var KISP = require('KISP');
    var User = require('User');
    var API = module.require('API');

    var txtNumber = panel.$.find('input[name="number"]').get(0);
    var txtPassword = panel.$.find('input[name="password"]').get(0);

    panel.set('show', false);

    panel.on('init', function () {
        function login() {
            var number = txtNumber.value;
            var password = txtPassword.value;

            if (!number) {
                KISP.alert('请输入用户名');
                return;
            }

            //if (!password) {
            //    KISP.alert('请输入密码');
            //    return;
            //}


            API.login({
                'number': number,
                'password': password,
            });
        }

        $('[name="submit"]').on('click', function () {
            login();
        });


        $(document).on('keyup', function (event) {

            if (event.keyCode == 13) { //回车键
                if (!panel.visible()) {
                    return;
                }

                login();
            }
        });
    });


    panel.on('init', function () {
        
        API.on('success', {
            'login': function (user) {
                panel.hide();

                User.set(user);
                panel.fire('success', [{
                    'user': user,
                    'fromSession': false,
                }]);
            },
        });
    });




    panel.on('render', function () {

        //从 sessionStorage 中读取，用于确定是否已登录。
        var user = User.get();     

        if (user) {
            panel.hide();
            panel.fire('success', [{
                'user': user,
                'fromSession': true,
            }]);
            return;
        }



        //从 localStorage 中读取，用于自动填写用户名和聚集。
        user = User.get(true);  

        if (user) {
            txtNumber.value = user.number;
            txtPassword.focus();
        }
        else {
            txtNumber.focus();
        }

        panel.show();

    });

    return {
        logout: function () {
            User.clear();
            txtPassword.value = '';
            panel.render();
        },
    };




});
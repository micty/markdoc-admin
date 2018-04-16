
/*
* 主控制器。
*/
KISP.launch(function (require, module) {
    var Master = module.require('Master');
    var Loading = module.require('Loading');
    var Login = module.require('Login');

    Loading.hide();


    Login.on({
        'success': function (data) {
            //直接跳到模块，可能会有问题，这里如果手动登录的，则强制刷新一下。
            if (!data.fromSession) { 
                location.reload();
            }

            Master.render({ 'user': data.user, });
      
        },
    });


    Master.on({
        'require': function (name) {
            return module.require(name);
        },

        //就绪后需要快速打开的视图，仅供开发使用。
        //每个人提交代码必须注释掉自己的那个视图。
        'ready': function () {
            //Master.open('DocAdd', [{ from: 'readme', }]);
            //Master.open('DocAdd', [{ id: 'check.md', }]);
            //Master.open('DocAdd', [{ id: 'manual.md', }]);
            //Master.open('DocHelp', []);
            //Master.open('Demo.GridView', []);
            //Master.open('TopMenus', []);
            //Master.open('SideMenus', ['house/permit/sidebar.json']);


            Master.open('FileList', []);

        },

        'render': function () {
            
        },

        'logout': function () {
            Login.logout();
        },
    });


    module.render('Login');



    //////
    //document.addEventListener('paste', function (event) {

    //    var clipboardData = event.clipboardData;

    //    debugger
    //});




});




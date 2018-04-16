

KISP.panel('/Home/Inform/Main/API/ToSure/Footer', function (require, module, panel) {
    var MD5 = KISP.require('MD5')
    var passWord = null;
    var Component = require('Component');

    panel.on('init', function () {

        panel.$.on('click', 'button[data-cmd]', function () {
            var cmd = this.getAttribute('data-cmd');
            var val = panel.$.find('[data-cmd="password"] input').val();
            val= MD5.encrypt(val);

            if(!passWord || val == passWord || cmd == 'cancel'){
                panel.fire(cmd);
                return;
            }

            var cfg = {
                type: false,
                content: "请输入正确密码",
                style: '',
                time: 2000,
            };
            Component.hint(cfg);

        });

    });



    panel.on('render', function (result) {

        clear();
        panel.$.find('[data-cmd="confirm-button"]').toggleClass('nosure',result);
    });

    //判断显示几个按钮
    function showTip(result){
        panel.$.find('[data-cmd="tip"]').addClass("on");
        var text;
        result ? text = '由于系统不允许负库存出库，当前操作无法继续！' : text = '是否继续执行该操作？';
        panel.$.find('[data-cmd="tip"]').text(text);
    }

    //清空密码,提示 弹窗初始化
    function clear(){

        panel.$.find('[data-cmd="password"] input')[0].value = '';
        panel.$.find('[data-cmd="password"]').removeClass('key');
        passWord = null;
        panel.$.find('[data-cmd="tip"]').removeClass("on");
    }

    return {
        showWord: function (password) {
            passWord = password[0];
            panel.$.find('[data-cmd="password"]').addClass('key');
        },
        showTip: showTip,
        clear: clear,
    }

});








KISP.panel('/Home/Inform/Main/API/ToSure', function (require, module, panel) {

    var $ = require('$');
    var KISP = require('KISP');
    var Footer = module.require('Footer');
    var Content = module.require('Content');
    var Dialog = require('Dialog');

    var keyName;
    var result = '';
    var dialog = null;

    panel.on('init', function () {

        dialog = Dialog.panel({
            title: '提示',
            container: panel,
            content: Content,
            footer: Footer,
            resizable: false,
        });

        dialog.on({
            'render': function (list) {
                Footer.render(result);
                Content.render(list);
            },
        });
        Content.on({
            'hasWholeWord': function (password) {
                Footer.showWord(password);
            }
        });

        Footer.on({

            'cancel': function () {
                dialog.close();
                panel.fire('cancel')
            },

            'ok': function () {
                dialog.close();
                if (result) {        //如果只是提示信息则直接返回，反正用户确认继续执行
                    return;
                }
                var returnData = {};
                returnData[keyName] = 1;
                panel.fire('sure', [returnData]);
            },
        });

    });

    function dealDetails(data) {
        data.forEach(function (item, index) {

            if (item.Children.length > 0) {
                item.Children.forEach(function (msg, index) {
                    msg.ErrorMessages = msg.ErrorMessages.split('$|');
                    if (msg.ErrorMessages.length > 1) {

                        msg.ErrorMessages.pop();
                    }
                })
            }
        })

        return data;
    }
    panel.on('render', function (data) {   //传进来的是需要渲染的单个单据对象


        var details = data.details;
        keyName = details[0].MessageKeyName;
        result = details[0].ErrorType == 3 && keyName == 'CheckBillGetStockDataMsgFlag';        //负库存不允许出库参数

        var list = dealDetails(details);
        dialog.render(list);

        //弹出框提示
        //var title = null;
        //if(keyName == 'CheckSELowPrice'){
        //    title = '价格检查对话框';
        //}
        //
        //dialog.set('title', title || '提示');

        //显示文字提示
        if(keyName == 'CheckBillGetStockDataMsgFlag' || keyName == 'CheckHignLowInventoryMsgFlag'){
            Footer.showTip(result);
        }

    });

});


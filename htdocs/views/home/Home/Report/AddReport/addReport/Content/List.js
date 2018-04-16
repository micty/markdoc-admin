

KISP.panel('/Home/Report/AddReport/Content/List', function (require, module, panel) {

    var KISP = require('KISP');
   

    panel.on('init', function () {


    });


    panel.on('render', function (list) {
       
        panel.fill(list, function (item, index) {

            return {
                'index': index,
                'name': item.caption,
                'id': item.rptID,
                'src': item.src,
                'class': item.showOrder > 0 && item.havePower == 1 ? '' : 'on',
                'edit': item.showOrder > 0 && item.havePower == 1 ? '已添加' : '添加',
                'disabled': item.showOrder > 0 ? 'disabled' : '',
            };
        });

    });


});

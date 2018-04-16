KISP.route('DocList', function (require, module) {
    var KISP = require('KISP');
    var Master = module.require('Master');

    return {
        'edit': function (item) {//跳转到销售出库单详情页
           
            Master.open('DocAdd', '写文档', [{
                from: 'id',
                value: item.id,
            }]);
        },
    };

});

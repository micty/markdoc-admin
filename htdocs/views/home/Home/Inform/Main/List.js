

KISP.panel('/Home/Inform/Main/List', function (require, module, panel) {

    var KISP = require('KISP');
    var Template = KISP.require('Template');
    var tpl = null;

    var type$name = {
        1:'default',
        2:'new',
        3:'warn',
    };

    panel.on('init', function () {

        tpl = new Template(panel.$);
        tpl.process({
            '': function (data) {
                var name = type$name[data.type];
                var html = this.fill(name,data);

                return html;
            },
            'default': {
                '': function (data) {
                    var items = this.fill('item',data.list);
                    return {
                        'items':items,
                    };
                },
                'item': function (item, index) {

                    return {
                        'index': index,
                        'amount': item.amount ? item.amount : '--',
                        'billDate': item.billDate ? item.billDate : '--',
                        'billID': item.billID,
                        'billNo': item.billNo ? item.billNo : '--',
                        'biller': item.biller ? item.biller : '--',
                        'emper': item.emper ? item.emper : '--',
                        'typeName': item.typeName ? item.typeName : '--',
                        'qty': item.qty ? item.qty : '--',
                        'classType': item.classType,
                        //'styleCus': item.itemList ? '' : 'display:none;',
                        'customer': !item.itemList ? '--' : item.itemList[0].key,
                        'company': !item.itemList ? '--' : item.itemList[0].value,
                    };
                }
            },
            'new': {
                '': function (data) {
                    var items = this.fill('item',data.list);
                    return {
                        'items':items,
                    };
                },
                'item':{
                    '': function (item) {
                        var type = !item.billLinkNo ? 'verify' : 'send';
                        var html = this.fill(type, item);
                        return html;
                    },
                    'send': function (item,index) {
                        return {
                            'index': index,
                            'billDate': item.billDate,
                            'billID': item.billID,
                            'billNo': item.billNo,
                            'biller': item.biller,
                            'emper': item.emper,
                            'checker': item.checker,
                            'billLinkNo': item.billLinkNo,
                            'typeName': item.typeName,
                            'qty': item.qty,
                            'classType': item.classType,

                        };
                    },
                    'verify': function (item,index) {
                        return {
                            'index': index,
                            'amount': item.amount ? item.amount : '0.00',
                            'billDate': item.billDate,
                            'billID': item.billID,
                            'billNo': item.billNo,
                            'biller': item.biller,
                            'emper': item.emper,
                            'checker': item.checker,
                            'typeName': item.typeName,
                            'qty': item.qty,
                            'classType': item.classType,
                            'styleCus': item.itemList ? '' : 'display:none;',
                            'customer': !item.itemList ? '' : item.itemList[0].key,
                            'company': !item.itemList ? '' : item.itemList[0].value,

                        };
                    }
                }

            },
             'warn': {
                '': function (data) {
                    var items = this.fill('item',data.list);
                    return {
                        'items':items,
                    };
                },
                'item': function (item,index) {
                    return {
                        'index': index,
                        'billDate': item.billDate,
                        'billID': item.billID,
                        'billNo': item.billNo,
                        'typeName': item.typeName,
                        'qty': item.qty,
                        'qty2': item.qty2,
                        'diffqty': item.diffqty,
                        'classType': item.classType,
                    };
                }
            },


        });

    });


    panel.on('render', function (ctn,data) {

        var html = tpl.fill(data);
        $(ctn).html(html);

    });

});

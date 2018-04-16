

define('ButtonDropList/Template', function (require, module) {

    var $ = require('$');
    var Template = KISP.require('Template');
    var $Array = KISP.require('Array');

    var tpl = new Template('#tpl-ButtonDropList');


    tpl.process({
        '': function (data) {

            var items = data.items;
            items = this.fill('item', items);

            return {
                'index': 0,
                'text': data.text,
                'class': data.class || '',
                'items': items,
            };
           
        },

        'item': function (item, index) {

            return {
                'index': index + 1,
                'class': item.class || '',
                'text': item.text,
            };
        },

    });



    return tpl;



});


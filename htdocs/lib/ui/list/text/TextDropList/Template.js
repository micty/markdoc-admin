

define('TextDropList/Template', function (require, module) {

    var $ = require('$');
    var Template = KISP.require('Template');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');

    var tpl = new Template('#tpl-TextDropList');


    tpl.process({
        '': function (data) {

            var items = this.fill('item', data.list);

            //因为原 html 中的 sample 给处理后 没有等号的属性值会给替换成有空值的属性值。
            //如 {readonly} 会给替换成 {readonly}=""，这不是我们想要的。
            //这里我们手动替换回来。
            this.fix(['readonly', 'disabled']);
            

            return {
                'txtId': data.txtId,
                'ulId': data.ulId,
                'text': data.text,
                'readonly': data.readonly ? 'readonly' : '',
                'disabled': data.disabled ? 'disabled' : '',
                'items': items,
            };
           
        },

        'item': {
            '': function (item, index) {

                //分配额外的字段。
                item.id = item.id || $String.random();
                item.index = index;


                var columns = item.columns;
                var text = item.text;

                if (Array.isArray(columns)) {
                    text = this.fill('column', columns);
                }

                return {
                    'index': index,
                    'class': item.class || '',
                    'disabled': item.disabled ? 'disabled' : '',
                    'text': text,
                    'title': item.title || '',

                };
            },

            'column': function (item, index) {

                var width = item.width || '';
                if (width) {
                    width = 'width: ' + width + 'px;';
                }

                return {
                    'index': index,
                    'width': width,
                    'text': item.text || '',
                    'class': item.class || '',
                };
            },
        },

    });



    return tpl;



});



/**
* 
*/
define('GridView/Template', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var Template = KISP.require('Template');



    return {

        create: function (meta) {
            var tpl = new Template('#tpl-GridView');
            var fields = meta.fields;

            //如果指定了启用复选框列，则表头的首列生成一个全选的复选框。
            if (meta.check) {
                fields[0].caption = tpl.fill('check-all', {});
            }

            tpl.process({
                '': function () {
                    var header = this.fill('header', {
                        'fields': fields,
                    });

                    return {
                        'header': header,
                        'id': meta.id,
                        'class': meta.class,
                        'no-footer': meta.footer ? '' : 'no-footer',
                        'headerId': meta.headerId,
                        'tableId': meta.tableId,
                        'pagerId': meta.pagerId,
                        'counterId': meta.counterId,
                        'countId': meta.countId,
                        'checkAllId': meta.checkAllId,
                    };
                },

                //表头。
                'header': {
                    '': function (data) {
                        var fields = data.fields;
                        var cells = this.fill('cell', fields);

                        return {
                            'cells': cells,
                        };
                    },

                    'cell': function (item, index) {
                        return {
                            'caption': item.caption,
                        };
                    },
                },

            });
           

            return tpl;
        },
    };
    
});




/**
* 
*/
define('GridView/Resizer', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');
    var TableResizer = require('TableResizer.v2');


    return {

        create: function (meta) {

            //表体的调整器。
            var rsz = null;

            //表头的调整器。
            var resizer = new TableResizer({
                'table': '#' + meta.headerId,
                'fields': meta.fields,
            });



            //表头的全选。
            resizer.on('render', function () {
                var chk = '#' + meta.checkAllId;

                this.$.on('click', chk, function () {
                    var $chk = $(this);
                    var checked = !$chk.hasClass('on');

                    $chk.toggleClass('on', checked);

                    meta.table.column('check', function (cell) {
                        cell.ctrl.toggleClass('on', checked);
                        meta.checkItem(cell.row.data, checked);
                    });

                });
            });

            resizer.on({
                'render': function (width, fields) {
                    rsz = new TableResizer({
                        'table': meta.table.get('element'),
                        'dragable': false,
                        'fields': fields,
                    });

                    rsz.render();
                },

                'change': function (data) {
                    rsz.set(data);
                },
            });



            return resizer;
           
        },
    };
    
});



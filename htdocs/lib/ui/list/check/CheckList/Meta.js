
/**
* 
*/
define('CheckList/Meta', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');


    return {

        create: function (config, others) {
            var columns = config.columns;

            var meta = {
                'id': $String.random(),
                'txtId': $String.random(),
                'tableId': $String.random(),

                '$': null,
                '$table': null, //$(tableId)
                '$txt': null,   //$(txt)
                'txt': null,
                'this': null,

                'emitter': null,
                'table': null,
                'masker': null,
                'tpl': null,


                'container': config.container,
                'cssClass': config.cssClass,
                'tableClass': config.tableClass,
                'text': config.text,
                'readonly': config.readonly,
                'disabled': config.disabled,
                'order': config.order,          //是否自动增加一列作为序号列。
                'mask': config.mask,
                'dialog': config.dialog,
                'field': config.field,
                'tabindex': config.tabindex,

                'columns': columns,
                'direction': '',                //要展示的方向。 在页面右边位置不够时，要加 `right` 类，但只需要检测一次。
                'visible': false,               //下拉列表是否可见。
                'hovering': false,              //记录鼠标是否正在列表项中悬停。


                //调整列表展示的方向。
                //要在显示之后再计算位置。
                //在页面右边位置不够时，要加 `right` 类，但只需要检测一次。
                'adjust': function () {
                    if (!meta.visible) {
                        return;
                    }

                    meta.$.removeClass('right');    //先移除，以避免影响。

                    var width = meta.$table.outerWidth();
                    var max = $(meta.dialog).width();

                    var left1 = meta.$table.offset().left;
                    var left2 = $(meta.dialog).offset().left;
                    var left = left1 - left2;

                    var direction = meta.direction = left + width > max ? 'right' : 'left';

                    meta.$.toggleClass('right', direction == 'right');
                },
            };


            Object.assign(meta, others);


           

            return meta;
           
        },


    };
    
});



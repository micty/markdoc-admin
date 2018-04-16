
/**
* 
*/
define('DropList/Meta', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');


    return {

        create: function (config, others) {
            var filters = config.filters;
            var columns = config.columns;

            //如果指定为 true，则跟 columns 中的字段一样的。
            if (filters === true) { 
                filters = columns || null;
            }


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
                'custom': config.custom,
                'order': config.order,          //是否自动增加一列作为序号列。
                'empty': config.empty,          //是否允许为空。
                'mask': config.mask,
                'dialog': config.dialog,
                'field': config.field,

                'tabIndex': config.tabIndex,
                'maxLength': config.maxLength,

                'columns': columns,
                'filters': filters,             //要进行过滤的字段名。 如果指定则在组件内部进行关键词过滤。
                'direction': '',                //要展示的方向。 在页面右边位置不够时，要加 `right` 类，但只需要检测一次。
                'visible': false,               //下拉列表是否可见。
                'hovering': false,              //记录鼠标是否正在列表项中悬停。
                'list': [],                     //用来存放本地过滤的列表数据。
                'length': 0,                    //总记录数。

                'current': {},
                'old': {},         //最后一次有选中项的状态，结构跟 current 一样，主要用于清空后的恢复。

                'getValue': function (item, key) {
                    return typeof key == 'function' ? key(item) : item[key];
                },

                'change': function (value) {
                    var hasArgs = arguments.length > 0;
                    var txt = meta.txt;
                    var $txt = $(txt);

                    value = hasArgs ? String(value) : txt.value;

                    if (value === meta.text) {
                        return;
                    }


                    var isEmpty = value === '';
                    $txt.removeClass('error');
                    meta.text = txt.title = value;

                    //内部输入的不需要重新写值，否则会导致光标一直在最后。
                    if (hasArgs) {
                        txt.value = value;
                    }

                    //外面传进来值，说明是手动调用 this.set('text', value) 的引起的，不需要再触发事件。
                    //即是说，只有在输入框中手动输入内容时才会触发事件。
                    if (!hasArgs) {
                        meta.emitter.fire('change', [value]);
                    }

                    if (isEmpty) {
                        meta.emitter.fire('empty', []);
                    }

                    //这个放在事件触发的后面。
                    txt.placeholder = meta.current.item && isEmpty ? '(无内容)' : '';
                },

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



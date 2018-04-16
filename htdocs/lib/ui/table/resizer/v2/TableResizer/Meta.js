
/**
* 
*/
define('TableResizer.v2/Meta', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');




    return {

        create: function (config, others) {

            var meta = {
                'id': $String.random(),         //
                'emitter': null,                //
                'table': null,                  //在 render() 后会变成 DOM 节点
                '$': null,                      //在 render() 后会变成 $() 对象。
                'this': null,                   //
                'selector': config.table,       //原始的 table 选择器。
                'dragable': config.dragable,    //是否允许拖曳。
                'rowspan': config.rowspan,      //最大跨行数。 如果表头有跨行合并单元格，则要指定为最大跨行数。
                'minWidth': config.minWidth,    //列所允许的最小宽度。
                'indexKey': config.indexKey,    //
                'cssClass': config.cssClass,    //
                'fields': null,                 //列字段集合数组。
                'width': 0,                     //表格总宽度。
                'cols': [],                     //col 节点集合。
                'id$index': {},                 //记录每个 resizer 对应的 index。
                'cell$ids': new Map(),          //记录单元格的对应的 resizer 集合。
            };

            Object.assign(meta, others);

            return meta;
           
        },


    };
    
});



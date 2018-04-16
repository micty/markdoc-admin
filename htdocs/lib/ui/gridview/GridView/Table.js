
/**
* 
*/
define('GridView/Table', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');
    var Table = require('Table');



    return {

        create: function (meta) {
            var table = new Table({
                'container': '#' + meta.tableId,    //生成的表格 html 要塞进去的容器。
                'fields': meta.fields,              //字段列表。 item = { name, caption, width, class, };
                'order': false,                     //这里不通过 table 组件来自动生成序号，而是通过下面的的方式生成。
                'columnName': 'name',               //
            });

            table.on('process', {
                'row': function (row) {
                    row.value = row.data[meta.primaryKey];  //把主键的值(如 id)作为整行的值。
                    meta.emitter.fire('process', 'row', [row]);
                },

                'cell': {
                    '': function (cell) {
                        //先触发具体名称的单元格事件。
                        var values = meta.emitter.fire('process', 'cell', cell.name, [cell]);
                        var value = values.slice(-1)[0]; //以最后一个为准。

                        //再触发统一的单元格事件。
                        if (value === undefined) {
                            values = meta.emitter.fire('process', 'cell', [cell]);
                            value = values.slice(-1)[0]; //以最后一个为准。
                        }

                        //业务层没有绑定事件并返回一个有效值。
                        if (value === undefined) {
                            value = cell.row.data[cell.name];
                        }

                        cell.value = value;
                        return value;

                    },

                    //复选列。
                    'check': function (cell) {
                        var row = cell.row;
                        var checked = meta.current.id$item[row.value];

                        return meta.tpl.fill('check-item', {
                            'index': row.index,
                            'checked': checked ? 'on' : '',
                        });
                    },

                    //序号列。
                    'order': function (cell) {
                        var row = cell.row;
                        var order = row.index + 1;

                        //指定了不使用全局序号，或者当前处于已选模式下，则使用局部序号，即从 1 开始。
                        if (!meta.order.global || meta.selectedMode) {
                            return order;
                        }

                        //使用全局序号，即跟分页无关。
                        var base = (meta.no - 1) * meta.size;

                        return base + order;
                    },
                },

            });

       

            table.on('render', function () {

                table.$.on('click', '[data-cmd="check-item"]', function () {
                    var cid = this.parentNode.id;   //单元格 id。
                    var cell = table.get(cid);      //
                    var checked = meta.checkItem(cell.row.data);

                    $(this).toggleClass('on', checked);
                    meta.checkAll();
                });


            });



            table.on('fill', function (list) {
                meta.list = list;

                //启用了复选框列才执行。
                if (meta.check) {
                    meta.checkAll();

                    table.column('check', function (cell) {
                        cell.ctrl = $(cell.element).find('[data-cmd="check-item"]');
                    });
                }
            });

            table.on('click', {
                '': function (event) {
                    meta.emitter.fire('click', 'table', [table, event]);
                },

                'row': function (row, event) {
                    meta.emitter.fire('click', 'row', [row, event]);
                },

                'cell': function (cell, event) {
                    meta.emitter.fire('click', 'cell', cell.name, [cell, event]);
                    meta.emitter.fire('click', 'cell', [cell, event]);
                },
            });


            meta.fields.forEach(function (field) {
                var delegate = field.delegate;
                if (!delegate) {
                    return;
                }

                table.on('click', 'cell', field.name, delegate, function (cell, event, target) {
                    meta.emitter.fire('click', 'cell', cell.name, delegate, [cell, event, target]);

                });
            });
          


            return table;


           
        },
    };
    
});




/**
* 
*/
define('DropList/Table', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var Table = require('Table');
    var Escape = KISP.require('Escape');


    return {

        create: function (meta) {

            var fields = meta.columns.map(function (name) {
                return { 'name': name, };
            });

            var table = new Table({
                'container': '#' + meta.tableId,
                'fields': fields,
                'order': meta.order,
                'class': meta.tableClass,
                'columnName': 'name',
            });


            table.on('process', {
                'row': function (row) {
                    var title = meta.field.title;


                    if (title) {
                        row.title = meta.getValue(row.data.item, title);
                    }
                },
                'cell': function (cell) {
                    var values = meta.emitter.fire('process', [cell]);
                    var text = values.slice(-1)[0];

                    //未返回值，则取字段中的。
                    if (text === undefined) {
                        text = cell.row.data.item[cell.name];
                        text = text == null ? '' : text;    //null、undefined 转为 ''。
                        text = Escape.html(text); //避免 xss 注入。
                    }

                    var current = meta.current;
                    var keyword = current.keyword;

                    //让候选项指向含有关键词的第一项，并且只需要设置一次。
                    if (text.includes(keyword) && current.index < 0) {
                        current.index = cell.row.index;
                    }


                    //如果指定了关键词，则进行关键词高亮。
                    if (keyword) {
                        text = String(text).split(keyword).join(current.html); //replaceAll
                    }

                    return text;
                },
            });


            table.on('fill', function (list) {
                var length = meta.length = list.length;
                var index = Math.max(meta.current.index, 0);

                meta.$table.removeClass('loading').toggleClass('nodata', !length);
                meta.$txt.removeClass('error'); //移除输入框中的错误提示。
                meta.this.hover(index);

                meta.adjust();
            });

            table.on('render', function () {
                this.$.on('mouseover', function () {
                    meta.hovering = true;
                });

                this.$.on('mouseout', function () {
                    meta.hovering = false;
                });

            });


            table.on('click', {
                //表格行的点击事件。
                'row': function (row, event) {
                    //用于传递到业务层，以识别是手动选中触发的。
                    meta.current.event = event;
                    meta.this.select(row.index);
                },
            });


            return table;
           
        },

        /**
        * 根据指定的 item，从 table 中获取对应的 row。
        */
        getRow: function (table, item) {
            var rows = table.get('rows');
            var type = typeof item;

            //重载 getRow(table, index); 
            if (type == 'number') {
                return rows[item];
            }


            //重载 getRow(table, fn); 
            if (type == 'function') {
                return rows.find(function (row, index) {
                    return item(row.data, index);
                });
            }

            if (!item) {
                return null;
            }


            //重载 getRow(table, id);
            var id = item;


            //重载 getRow(table, item);
            if (type == 'object') {
                id = String(item.id); //后台的数据类型并不是十分严格，有可能为数字类型的 0。
            }

            return rows.find(function (row, index) {
                return row.data.id == id;
            });


        },
    };
    
});




/**
* 
*/
define('CheckList/Table', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var Table = require('Table');
    var Escape = KISP.require('Escape');
    var $Array = KISP.require('Array');


    return {

        create: function (meta) {

            var fields = meta.columns.map(function (name) {
                return { 'name': name, };
            });

            fields = [{'name': 'check', }, ...fields];


            var table = new Table({
                'container': '#' + meta.tableId,
                'fields': fields,
                'order': meta.order,
                'class': meta.tableClass,
                'columnName': 'name',
            });


            table.on('process', {
                'row': function (row) {
                    row.class = row.data.checked ? 'on' : '';
                },
                'cell': function (cell) {
                    if (cell.name == 'check') {
                        var html = meta.tpl.fill('check', {});
                        return html;
                    }


                    var values = meta.emitter.fire('process', [cell]);
                    var text = values.slice(-1)[0];

                    //未返回值，则取字段中的。
                    if (text === undefined) {
                        text = cell.row.data[cell.name];
                        text = Escape.html(text); //避免 xss 注入。
                    }

                    return text;
                },
            });


            table.on('fill', function (list) {
                var length =list.length;
                meta.$table.removeClass('loading').toggleClass('nodata', !length);
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




            var allChecked = false;


            table.on('click', {
                //表格行的点击事件。
                'row': function (row, event) {

                    //没有按住 ctrl 键，则是单个选中。
                    if (!event.ctrlKey) {
                        var item = row.data;
                        var checked = item.checked = !item.checked;
                        var checks = meta.this.get();

                        $(row.element).toggleClass('on', checked);
                        meta.emitter.fire('check', [checks, item, row.index]);
                        return;
                    }


                    //按住了 ctrl 键，则全部选中。
                    allChecked = !allChecked;

                    var rows = table.get('rows');

                    rows.map(function (row) {
                        row.data.checked = allChecked;
                        $(row.element).toggleClass('on', allChecked);
                    });

                    var checks = meta.this.get();
                    meta.emitter.fire('check', [checks]);
                   
                },
            });




            return table;
           
        },

    };
    
});



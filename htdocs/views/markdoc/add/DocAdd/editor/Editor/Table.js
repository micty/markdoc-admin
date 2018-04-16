

define('/DocAdd/Editor/Table', function (require, module, exports) {
    var KISP = require('KISP');
    var File = require('File');
    var $Date = KISP.require('Date');
    var $String = KISP.require('String');


  

    function map(count, fn) {
        var list = [];
        var item = null;

        for (var i = 0; i < count; i++) {
            item = fn(i, i == count - 1);

            if (item !== null) {
                list.push(item);
            }
        }

        return list;
    }



    return {
        /**
        * 创建表格。
        *   options = {
        *       row: 0,
        *       cell: 0,
        *   };
        * 最终效果如: 
        *   |  列1  |  列2  |  列3  |
        *   |-------|-------|-------|
        *   |       |       |   1   |
        *   |       |       |   2   |
        *   |       |       |   3   |
        * 每列的最后一个单元格要加点内容，才能把整行的高度撑开。
        * 特别是最后一行的最后一个单元格，必须要有点内容，否则会丢失它。
        * 为了直观，就干脆加行号当内容算了。
        */
        create: function (options) {
            var row = options.row;
            var cell = options.cell;


            //表头。 如:
            //|  列1  |  列2  |  列3  |
            var headers = map(cell, function (index, isLast) {
                var item = '|  列' + (index + 1) + '  ';

                if (isLast) {
                    item += '|';
                }

                return item;
            });


            //分隔线。 如: 
            //|-------|-------|-------|
            var spliters = map(cell, function (index, isLast) {
                var item = '|-------';

                if (isLast) {
                    item += '|';
                }

                return item;
            });


            //表体行。 如:
            //|       |       |   1   |
            //|       |       |   2   |
            //|       |       |   3   |
            var rows = map(row, function (no) {
                var order = no + 1;

                var cells = map(cell, function (index, isLast) {

                    return isLast ? '|   ' + order + '   |' : '|       ';
                });

                return cells;
            });


            var table = [
                headers,
                spliters,
                ...rows,
            ];

            table = table.join('\n');
            table = table.replace(/,/g, ''); //去掉里面的逗号。

            table = '\n\n' + table + '\n\n'; //前后插入多两个空行，可以解决在文本行内插入表格的问题。


            return table;

        },
    };





});

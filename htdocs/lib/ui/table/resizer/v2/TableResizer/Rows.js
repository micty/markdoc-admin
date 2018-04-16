

define('TableResizer.v2/Rows', function (require, module) {

    var $ = require('$');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');

  
    return {

        get: function (table, rowspan) {
            var rows = Array.from(table.rows).slice(0, rowspan);

            var list = $Array.pad(0, rowspan).map(function () {
                return [];
            });
            

            rows.map(function (row, no) {
                var baseX = 0;
                var cells = list[no];
                var len = cells.length;

                if (len > 0) {
                    //查找空位。
                    baseX = cells.findIndex(function (cell) {
                        return !cell;
                    });

                    //没有空位，则在最后加上。
                    if (baseX < 0) {
                        baseX = len;
                    }
                }

                Array.from(row.cells).map(function (cell, index) {
                    var rowspan = cell.getAttribute('rowspan');
                    var colspan = cell.getAttribute('colspan');

                    rowspan = Number(rowspan) || 1;
                    colspan = Number(colspan) || 1;
                   

                    $Array.pad(0, rowspan).map(function (R) {
                        var y = R + no;
                        var cells = list[y];

                        $Array.pad(0, colspan).map(function (C) {
                            var x = baseX + C;
                            cells[x] = cell;
                        });
                    });


                    baseX += colspan;


                    if (cells[baseX]) {
                        baseX = cells.findIndex(function (cell) {
                            return !cell;
                        });

                        if (baseX < 0) {
                            baseX = cells.length;
                        }
                    }
                });
            });

            return list;


        },
    };

});


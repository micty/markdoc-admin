

KISP.panel('/DocAdd/Header/Table', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    var mask = null;


    panel.on('init', function () {
      
        //
        function makeArray(count) {
            var list = [];
            var item = {};

            for (var i = 0; i < count; i++) {
                list.push(item);
            }

            return list;
        }



        panel.template({
            '': function (data) {
                var html = this.fill('all', data);
                return html;
            },

            'all': {
                '': function (data) {
                    var list = makeArray(data.rows);
                    var rows = this.fill('row', list, data.cells);

                    return {
                        'rows': rows,
                    };
                },


                'row': {
                    '': function (row, no, count) {
                        var list = makeArray(count);
                        var cells = this.fill('cell', list, no);

                        return {
                            'cells': cells,
                        };
                    },

                    'cell': function (cell, index, no) {
                        return {
                            'no': no,
                            'index': index,
                        };
                    },
                },
            },

        });


        panel.$.on('mouseover', 'td', function () {
            var cell = this;
            var no = +cell.getAttribute('data-no');
            var index = +cell.getAttribute('data-index');

            var row = no + 1;
            var cell = index + 1;

            var html = row + cell < 2 ? '插入表格' : $String.format('{row}行 x {cell}列 表格', {
                'row': row,
                'cell': cell,
            });

            panel.$.find('div').html(html);

            panel.$.find('td').each(function () {
                var cell = this;
                var no2 = +cell.getAttribute('data-no');
                var index2 = +cell.getAttribute('data-index');
                var isRange = (no2 <= no) && (index2 <= index);
               
                $(cell).toggleClass('on', isRange);
            });
            
        });

        panel.$.on('click', 'td', function () {
            var cell = this;
            var no = +cell.getAttribute('data-no');
            var index = +cell.getAttribute('data-index');

            panel.fire('add', [{
                'row': no + 1,
                'cell': index + 1,
            }]);

            mask.hide();
        });


        mask = KISP.create('Mask', {
            volatile: true, //易消失。
            opacity: 0,
        });

        mask.on({
            'hide': function () {
                panel.hide();
            },
        });
    });



    panel.on('show', function () {
        mask.show();
    });



    /**
    * 渲染。
    *   options = {
    *   };
    */
    panel.on('render', function (options) {

        panel.fill({
            rows: 9,
            cells: 10,
        });

    });



});

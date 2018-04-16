

define('TableResizer.v2/Cols', function (require, module) {

    var $ = require('$');
    var Template = KISP.require('Template');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');

    var tpl = new Template('#tpl-TableResizer-v2');

    tpl.process({
        'colgroup': {
            '': function (data) {
                var cols = this.fill('col', data.fields);

                return {
                    'cols': cols,
                };
            },

            'col': function (field, index) {
                return {
                    'index': index,
                    'width': field.width,
                    'display': field.visible ? '' : 'display: none;',
                };
            },
        },
    });


    return {
        fill: function ($table, fields) {
            var html = tpl.fill('colgroup', { 'fields': fields, });

            $table.prepend(html);

            var cols = $table.find('colgroup>col').toArray();
            return cols;
           
        },


    };

});


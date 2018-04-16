
/**
*/
define('MarkDoc/Lines', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');


    return exports = {

        /**
        *  产生行号的 html。
        */
        getNumbers: function (meta, content) {
            var sample = meta.samples['numbers'];
            var sitem = meta.samples['numbers.item'];
            var lines = content.split(/\r\n|\n|\r/);
            var height = exports.getHeight(lines);

            //最后一个空行要去掉。
            //因为它在 `<pre></pre>` 中无法展示出来。
            var lastLine = lines[lines.length - 1];

            if (!lastLine) {
                lines = lines.slice(0, -1);
            }

            var list = lines.map(function (item, index) {

                return $String.format(sitem, { 'no': index + 1, });
            });


            var html = $String.format(sample, {
                'height': height,
                'items': list.join(''),
                'total': list.length,
            });
        
            return html;


            //var tpl = meta.tpl.template('numbers');

            //tpl.process({
            //    '': function (data) {
            //        var items = this.fill('item', data.items);

            //        return {
            //            'height': height,
            //            'items': lines.join(''),
            //        };
            //    },

            //    'item': function (item, index) {
            //        return {
            //            'no': index + 1,
            //        };
            //    },
            //});

            //var html = tpl.fill({
            //    'height': height,
            //    'items': lines,
            //});
        },


        /**
        * 根据文本内容计算需要的高度。
        */
        getHeight: function (lines) {
            if (!Array.isArray(lines)) {
                lines = lines.split(/\r\n|\n|\r/);
            }

            return lines.length * 20;
        },
    };








});

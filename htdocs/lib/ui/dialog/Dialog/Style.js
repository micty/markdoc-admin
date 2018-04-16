
/**
* 
*/
define('Dialog/Style', function (require, module, exports) {

    var KISP = require('KISP');
    var $Object = KISP.require('Object');
    

    function getMargin(value) {
        value = parseInt(value);
        value = 0 - value / 2;
        return value + 'px';
    }

    

    return {
        get: function (data) {

            var style = $Object.filter(data, [
                'height',
                'width',
                'z-index',
            ]);

            //根据宽度计算 margin-left 和 margin-top，使其居中。
            var width = style.width;
            if (width) {
                style.width = parseInt(width) + 'px';
                style['margin-left'] = getMargin(width);
            }
            else {
                delete style.width;
            }

            var height = style.height;
            if (height) {
                style.height = parseInt(height) + 'px';
                style['margin-top'] = getMargin(height);
            }
            else {
                delete style.height;
            }





            var list = [];
            for (var key in style) {
                var value = style[key];
                var item = key + ': ' + value;
                list.push(item);
            }

            style = list.join('; ') + ';';

            return style;
        },
    };


});


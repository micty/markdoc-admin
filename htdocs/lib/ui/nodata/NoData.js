
define('NoData', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');

    //var config={
    //    'container':panel,      容器
    //    'text':'暂无数据',      文本内容  此图标不需要传文本内容
    //    'style':{               
    //        'top':0,            样式设置，注意  列表的top，不需要设置 
    //        'bottom':0,
    //        'z-index':3,
    //    },
    //}

    function NoData(config) {
        this.container = config.container.$ || config.container || "";
        this.style = config.style;
        this.text = config.text ? config.text : '';
        this.container.append('<p class="NoData" data-cmd="NoData" style="display:none"><span class="nodata-tip">' + this.text + '</span></p>');
    }

    NoData.prototype = {
        constructor: NoData,
        show: function () {
            var nodata = this.container.find('[data-cmd="NoData"]');
            nodata.css(this.style);
            if (this.container.width() < 600) {
                nodata.addClass('small');
            };
            nodata[0].style.display = "block";
        },
        hide: function () {
            this.container.find('.NoData')[0].style.display = "none";
        },
        destroy: function () {
            this.container.find('p[class="NoData"]').remove();
        }

    };
    return NoData;
});
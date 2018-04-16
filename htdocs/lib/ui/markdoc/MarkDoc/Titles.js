
/**
* 标题相关的。
*/
define('MarkDoc/Titles', function (require, module, exports) {

    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');
    var JSON = KISP.require('JSON');


    return {

        render: function (meta) {
            var sample = meta.samples['title'];
            var selector = meta.titles.selector;
            var title = ''; //取第一个 title 作为浏览器标题。

            meta.$.find(selector).each(function () {
                var $this = $(this);
                var list = $this.nextUntil(selector);

                title = title || $this.text();
                $this.wrapInner(sample);
                $this.toggleClass('title', list.length > 0);

            });

            return title;

        },
    };
    
});



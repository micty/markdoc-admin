
/**
* 
*/
define('MarkDoc/Events', function (require, module, exports) {

    var $ = require('$');
    var $String = KISP.require('String');
    var Template = KISP.require('Template');



    return {
        
        bind: function (meta, options) {

            meta.bind = true;

            //点击语言标签时。
            meta.code.foldable && meta.$.on('click', '[data-cmd="language"]', function (event) {
                $(this.parentNode).toggleClass('on');
                event.stopPropagation();
            });


            //折叠起来时，整个源代码区别可点击。
            meta.code.foldable && meta.$.on('click', '[data-cmd="source-code"]', function () {
                var $div = $(this);
                if ($div.hasClass('on')) {
                    $div.removeClass('on');
                }
            });


            //点击超链接时。
            meta.$.on('click', 'a[href^="#"]', function (event) {
                var a = this;
                var href = a.getAttribute('href');

                event.preventDefault();
                meta.emitter.fire('hash', [href]);
            });
            

            //点击标题时。
            meta.titles.foldable && meta.$.on('click', meta.titles.selector, function (event) {
                if (event.target.tagName.toLowerCase() != 'span') {
                    return;
                }

                $(this).nextUntil(meta.titles.selector).animate({
                    height: 'toggle',
                    opacity: 'toggle',
                });
            });

        },

    };
    
});



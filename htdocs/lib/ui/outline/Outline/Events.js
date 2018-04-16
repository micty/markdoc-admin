

define('Outline/Events', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var $String = KISP.require('String');


    return {
        bind: function (meta) {

            meta.$.on('click', '[data-index]', function () {
                var index = +this.getAttribute('data-index');
                var item = meta.list[index];

                meta.emitter.fire('item', [item, index]);
            });


        },

    };
});
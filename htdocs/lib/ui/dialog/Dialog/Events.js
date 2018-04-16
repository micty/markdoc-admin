
define('Dialog/Events', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');







    return {
        bind: function (meta) {

            //响应回车键。
            var name$fn = {
                'keyup': function (event) {
                    if (event.keyCode != 13 || !meta.visible) {
                        return;
                    }

                    event.stopPropagation();
                    meta.emitter.fire('enter', [event]);
                },
            };


            $(document.body).on(name$fn);
            $('#' + meta.id).on(name$fn);



            $('#' + meta.headerId).on('click', 'i', function () {
                meta.this.close();
            });


            $('#' + meta.footerId).on('click', 'button[data-index]', function () {
                var index = +this.getAttribute('data-index');
                var item = meta.footer.buttons[index];
                var name = item.name || String(index);

                meta.emitter.fire('button', name, [item, index]);
                meta.emitter.fire('button', [item, index]);

                // item.autoClosed 优先级高于 meta.autoClosed
                var autoClose = 'autoClose' in item ?
                        item.autoClose :
                        meta.autoClose;

                if (autoClose) {
                    meta.this.close(true);
                }
            });



        },

    };
});
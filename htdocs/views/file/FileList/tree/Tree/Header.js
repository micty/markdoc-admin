

KISP.panel('/FileList/Tree/Header', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    panel.on('init', function () {
        var dirOnly = false;


        panel.$.on('click', '[data-cmd]', function () {
            var cmd = this.getAttribute('data-cmd');

            if (cmd == 'dir-only') {
                dirOnly = !dirOnly;
                panel.$.find('i').toggleClass('checked', dirOnly);
                panel.fire('dir-only', [dirOnly]);
            }
            else {
                panel.fire(cmd);
            }

        });
        
    });


    /**
    * 渲染。
    *   options = {
    *       
    *   };
    */
    panel.on('render', function (options) {
        options = options || {};

        panel.$.toggleClass('back', !!options.back);
        panel.$.toggleClass('forward', !!options.forward);
        panel.$.toggleClass('up', !!options.up);
        panel.$.toggleClass('root', !!options.root);
        panel.$.toggleClass('dir-only', !!options.dirOnly);
        
    });

   


});
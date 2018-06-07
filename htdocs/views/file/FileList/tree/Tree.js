

KISP.panel('/FileList/Tree', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    var Header = module.require('Header');
    var Main = module.require('Main');
    var Resizer = module.require('Resizer');
 

    panel.on('init', function () {
        Main.on({
            'item': function (item, status) {
                panel.fire('item', [item]);
                Header.render(status);
            },

            'dir': function (item) {
                panel.fire('dir', [item]);
            },

            'file': function (item) {
                panel.fire('dir', [item]);
            },
        });

        Header.on({
            'back': function () {
                Main.back();
            },
            'forward': function () {
                Main.forward();
            },
            'up': function () {
                Main.up();
            },
            'root': function () {
                Main.root();
            },
            'dir-only': function (sw) {
                Main.dirOnly(sw);
            },
        });

       

    });

    panel.on('init', function () {
        var width = 300;


        Resizer.on({
            'change': function (dx) {
                console.log(dx);

                var w = width + dx;

                if (w < 220) {
                    panel.$.width(220);
                    return;
                }



                panel.$.width(w);
                panel.fire('resize', 'change', [dx]);
            },

            'stop': function () {
                width = panel.$.width();
                panel.fire('resize', 'stop');
            },
        });
    });


    /**
    * 渲染。
    *   options = {
    *       dir$dirs: {},   //某个目录对应的子目录列表（仅当前层级，不包括子目录的）。
    *       dir$files: {},  //某个目录对应的文件列表（仅当前层级，不包括子目录的）。
    *   };
    */
    panel.on('render', function (options) {

        Header.render();
        Main.render(options);
        Resizer.render();
        
    });

    return {
        open: function (id) {
            Main.open(id);
        },
    };


});
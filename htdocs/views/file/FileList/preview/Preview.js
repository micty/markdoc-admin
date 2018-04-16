

KISP.panel('/FileList/Preview', function (require, module, panel) {
    var KISP = require('KISP');
    var Tabs = module.require('Tabs');
    var MarkDoc = module.require('MarkDoc');

    var current = {}; //外面传进来的数据。
    var width = 776;


    panel.on('init', function () {
        Tabs.on({
            'change': function (type) {
                current.type = type;
                MarkDoc.render(current);
            },
        });

        MarkDoc.on({
            'render': function (titles) {
                panel.fire('render', [titles]);
            },
        });

       
    });



    /**
    * 渲染。
    *   options = {
    *       content: '',    //文件内容。
    *       ext: '',        //如 `.json`。
    *       isImage: false, //是否为图片。
    *   };
    */
    panel.on('render', function (options) {
        var isImage = options.isImage;
       
        var ext = isImage ? '.md' : options.ext; //如果是图片，则当成 `.md` 来展示。


        current = {
            'content': options.content,
            'ext': ext,
            'isImage': isImage,
            'type': '', //在 Tabs.change 会给写入。
        };

        Tabs.render();
    });


    return {
        get: function () {
            return current;
        },

        outline: function (index) {
            MarkDoc.outline(index);
        },

        resize: function (dx) {
            if (dx === true) {
                width = panel.$.get(0).style.width;
                width = width.slice(12, -3);
                width = Number(width);
                return;
            }


            var w = width + dx;
            var calc = 'calc(100% - ' + w + 'px)';

            panel.$.css({
                'width': calc,
            });

        },
    };


});

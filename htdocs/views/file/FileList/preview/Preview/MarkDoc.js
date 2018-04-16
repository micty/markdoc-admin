

KISP.panel('/FileList/Preview/MarkDoc', function (require, module, panel) {
    var KISP = require('KISP');
    var Escape = KISP.require('Escape');
    var MarkDoc = require('MarkDoc');

    var markdoc = null;

    //预览模式下，需要保持为代码模式展示的。 但又跟源码模式不完全一样。
    var exts = ['.json', '.js', '.css', ];

    panel.on('init', function () {
        markdoc = new MarkDoc({
            container: panel.$,

        });

        markdoc.on('render', function () {
           
            var list = markdoc.getOutlines();

            panel.fire('render', [list]);

        });
       
    });



    /**
    * 渲染。
    *   options = {
    *       content: '',                    //文件内容。
    *       ext: '',                        //如 `.json`。
    *       type: 'source' | 'preview',     //是源码视图，还是预览视图。
    *       isImage: false,                 //是否为图片。 图片的则需要对样式进行微调。
    *   };
    */
    panel.on('render', function (options) {
        var content = options.content;
        var ext = options.ext.toLowerCase();
        var language = '';
        var format = true;


        //以源码方式展示，需要进行 html 编码。
        if (options.type == 'source') {
            content = Escape.html(content);
            language = ext.slice(1);
            format = false; //不格式化代码，以保留源格式。
        }
        else { //预览模式
            if (exts.includes(ext)) {
                language = ext.slice(1); //强制变为代码模式。
            }
        }


        markdoc.render({
            'content': content,
            'language': language,
            'baseUrl': '',
            'imgUrl': KISP.config('API').url, //img 标签的基准地址。
            'code': {
                'format': format,
            },
        });

        panel.$.toggleClass('image', options.isImage);

       
    });


    return {
        outline: function (index) {
           

            markdoc.toOutline(index);


        },

    };

});



KISP.panel('/DocAdd/Preview', function (require, module, panel) {
    var KISP = require('KISP');
    var MarkDoc = require('MarkDoc');

    var $div = panel.$.find('>div');
    var passive = false;    //�Ƿ񱻶��Ĺ����� ���Ƿ�����������ö�����Ĺ�����
    var markdoc = null;


    //��Ҫ����Ϊ����ģʽչʾ�ġ� 
    var exts = ['.json', '.js', '.css', ];

  


    panel.on('init', function () {
        markdoc = new MarkDoc({
            container: $div.get(0),
        });

        markdoc.on('hash', function (href) {
            panel.fire('hash', [href]);
        });


        markdoc.on('render', function () {
            var list = markdoc.getOutlines();

            panel.fire('render', [list]); 

        });



        panel.$.on('scroll', function (event) {
            if (passive) {
                passive = false;
                return;
            }

            var height = $div.outerHeight();
            var top = panel.$.get(0).scrollTop;

            panel.fire('scroll', [{
                'height': height,
                'top': top,
            }]);

        });

       
    });



    /**
    * ��Ⱦ��
    *   options = {
    *       content: '',                    //�ļ����ݡ�
    *       ext: '',                        //�� `.json`��
    *   };
    */
    panel.on('render', function (options) {
        var content = options.content;
        var ext = options.ext;
        var language = '';

        if (exts.includes(ext)) {
            language = ext.slice(1);
        }

        markdoc.render({
            'content': content,
            'language': language,
            'imgUrl': KISP.config('API').url,
            'baseUrl': '',
        });


        

    });

    return {

        /**
        *   editor = {
        *       left: 0,            //
        *       top: 0,             //
        *       height: 0,          //
        *       width: 0,           //
        *       clientHeight: 0,    //
        *   };
        */
        scroll: function (editor) {
            var height = $div.outerHeight();
            var top = (height - editor.clientHeight) * editor.top / (editor.height - editor.clientHeight);

            passive = true;
            panel.$.get(0).scrollTo(0, top);
        },

        to: function (index) {
            markdoc.toOutline(index);
        },

    };



});

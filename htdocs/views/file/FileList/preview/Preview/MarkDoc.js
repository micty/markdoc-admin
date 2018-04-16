

KISP.panel('/FileList/Preview/MarkDoc', function (require, module, panel) {
    var KISP = require('KISP');
    var Escape = KISP.require('Escape');
    var MarkDoc = require('MarkDoc');

    var markdoc = null;

    //Ԥ��ģʽ�£���Ҫ����Ϊ����ģʽչʾ�ġ� ���ָ�Դ��ģʽ����ȫһ����
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
    * ��Ⱦ��
    *   options = {
    *       content: '',                    //�ļ����ݡ�
    *       ext: '',                        //�� `.json`��
    *       type: 'source' | 'preview',     //��Դ����ͼ������Ԥ����ͼ��
    *       isImage: false,                 //�Ƿ�ΪͼƬ�� ͼƬ������Ҫ����ʽ����΢����
    *   };
    */
    panel.on('render', function (options) {
        var content = options.content;
        var ext = options.ext.toLowerCase();
        var language = '';
        var format = true;


        //��Դ�뷽ʽչʾ����Ҫ���� html ���롣
        if (options.type == 'source') {
            content = Escape.html(content);
            language = ext.slice(1);
            format = false; //����ʽ�����룬�Ա���Դ��ʽ��
        }
        else { //Ԥ��ģʽ
            if (exts.includes(ext)) {
                language = ext.slice(1); //ǿ�Ʊ�Ϊ����ģʽ��
            }
        }


        markdoc.render({
            'content': content,
            'language': language,
            'baseUrl': '',
            'imgUrl': KISP.config('API').url, //img ��ǩ�Ļ�׼��ַ��
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

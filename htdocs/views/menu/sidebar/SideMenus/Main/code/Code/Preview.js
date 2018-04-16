

KISP.panel('/SideMenus/Main/Code/Preview', function (require, module, panel) {
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
    */
    panel.on('render', function (content) {

        var title = markdoc.render({
            'content': content,
            'language': 'json',
        });


        panel.fire('render', [{ title, content, }]); //title ΪҪ�����������ʾ�ı���
        

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

    };



});



KISP.panel('/DocHelp/Editor', function (require, module, panel) {

    var KISP = require('KISP');

    var passive = false;    //�Ƿ񱻶��Ĺ����� ���Ƿ�����������ö�����Ĺ�����
    var editor = null;
    var doc = null;
    var txt = panel.$.find('textarea').get(0);



    panel.on('init', function () {

        editor = CodeMirror.fromTextArea(txt, {
            mode: 'gfm',
            cursorHeight: 1,
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
            theme: 'custom',
        });

        doc = editor.getDoc();

        editor.on('scroll', function (mirror) {
            if (passive) {
                passive = false;
                return;
            }

            var info = editor.getScrollInfo();
            panel.fire('scroll', [info]);

        });

        editor.on('change', function () {
            var doc = editor.getDoc()
            var value = doc.getValue();

            panel.fire('content', [value]);

        });

    });




    /**
    * ��Ⱦ��
    */
    panel.on('render', function (content) {
        content = content ||  txt.value;;

        doc.setValue(content); //�ᴥ�� editor.change �¼���

        //�����http://www.91r.net/ask/8349571.html
        setTimeout(function () {
            editor.refresh();
        }, 200);
      
    });




    var exports ={
        /**
        *   preview = {
        *       top: 0,         //
        *       height: 0,      //
        *   };
        */
        scroll: function (preview) {
            var info = editor.getScrollInfo();
            var top = (info.height - info.clientHeight) * preview.top / (preview.height - info.clientHeight);

            passive = true;
            editor.scrollTo(0, top);
        },
    };


    return exports;

});

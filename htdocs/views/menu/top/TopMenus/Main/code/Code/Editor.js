

KISP.panel('/TopMenus/Main/Code/Editor', function (require, module, panel) {
    var KISP = require('KISP');

    var passive = false;    //�Ƿ񱻶��Ĺ����� ���Ƿ�����������ö�����Ĺ�����
    var editor = null;
    var doc = null;
    var txt = panel.$.find('textarea').get(0);

    panel.on('init', function () {

        editor = CodeMirror.fromTextArea(txt, {
            mode: 'javascript',
            theme: 'custom',
            cursorHeight: 1,
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
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
            var JSON = KISP.require('JSON');
            var doc = editor.getDoc()
            var value = doc.getValue();

            panel.fire('change', [value]);


        });



       


    });



    panel.on('render', function (content) {
        content = content || '';

        doc.setValue(content); //�ᴥ�� editor.change �¼���

        //�����http://www.91r.net/ask/8349571.html
        setTimeout(function () {
            editor.refresh();
        }, 100);



    });




    return {
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

});

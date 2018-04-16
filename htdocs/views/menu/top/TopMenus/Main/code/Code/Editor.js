

KISP.panel('/TopMenus/Main/Code/Editor', function (require, module, panel) {
    var KISP = require('KISP');

    var passive = false;    //是否被动的滚动。 即是否由于外面调用而引起的滚动。
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

        doc.setValue(content); //会触发 editor.change 事件。

        //详见：http://www.91r.net/ask/8349571.html
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

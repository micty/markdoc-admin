

KISP.panel('/DocAdd/Editor', function (require, module, panel) {

    var KISP = require('KISP');
    var File = module.require('File');
    var CMD = module.require('CMD');
    var Table = module.require('Table');

    var passive = false;    //�Ƿ񱻶��Ĺ����� ���Ƿ�����������ö�����Ĺ�����
    var editor = null;
    var doc = null;
    var txt = panel.$.find('textarea').get(0);


    var ext$mode = {
        '.js': 'javascript',
        '.json': 'javascript',
        '.css': 'css',
        '.html': 'htmlmixed',
        '.htm': 'htmlmixed',
    };



    panel.on('init', function () {

        editor = CodeMirror.fromTextArea(txt, {
            mode: 'gfm',
            //mode: 'css',
            //theme: 'midnight',
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
            var doc = editor.getDoc()
            var value = doc.getValue();

            panel.fire('content', [value]);

        });


        panel.$.on('keydown', function (event) {
            var isSave = event.ctrlKey && event.key == 's';
            if (!isSave) {
                return;
            }

            event.preventDefault();
            panel.fire('save');
        });

        CMD.init(editor);


    });


    //����¼�Ҫ����������ܼ������ļ���
    panel.$.on('paste', function (event) {
        var clipboardData = event.originalEvent.clipboardData;
        var file = clipboardData.files[0];

        if (!file || file.type != 'image/png') {
            return;
        }
       
        File.upload(file, function (md, data) {
            editor.replaceSelection(md);
        });

    });



    /**
    * ��Ⱦ��
    *   options = {
    *       content: '',    //���ݡ�
    *       ext: '',        //��չ�����Դ���ȷ�����͡� �� '.json'��
    *   };
    */
    panel.on('render', function (options) {
        var opt = options || { ext: '.md', };
        var content = opt.content || '';
        var ext = opt.ext || '.md';
        var mode = ext$mode[ext.toLowerCase()] || 'gfm';

        editor.setOption('mode', mode);

        doc.setValue(content); //�ᴥ�� editor.change �¼���


        //�����http://www.91r.net/ask/8349571.html
        setTimeout(function () {
            editor.refresh();
        }, 100);

    
      
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

        getReadme: function () {
            return txt.value;
        },



        getContent: function () {
            var content = doc.getValue();
            return content;
        },

        setTheme: function (name) {
            editor.setOption('theme', name);
        },

        call: function (name) {
            CMD[name]();
        },

        addTable: function (data) {
            var table = Table.create(data);
           
            console.log(table);

            editor.replaceSelection(table);
            editor.focus();
        },

    };


    return exports;

});



define('/DocAdd/Editor/CMD', function (require, module, exports) {
    var KISP = require('KISP');
    var File = require('File');
    var $Date = KISP.require('Date');
    var $String = KISP.require('String');


    //把一些额外命令收拢到该模块，
    //主要是为了父模块更简洁些。

    var editor = null;



    /**
    * 使用特定的标记去包裹编辑器中所有选中的文本。
    * 如用 `**` 去加粗。
    *   options = {
    *       empty: false,   //是否允许操作空选中。 如果指定为 true，则会插入为 beginTag + endTag 的内容。
    *   };
    */
    function wrap(beginTag, endTag, options) {
        if (typeof endTag == 'object') {
            options = endTag;
            endTag = '';
        }


        endTag = endTag || beginTag;
        options = options || { empty: false, };


        var list = editor.getSelections();

        var values = list.map(function (item) {

            //没有选中时。
            if (!item) {
                return options.empty ? beginTag + endTag : item;
            }

            if (item.startsWith(beginTag) && item.endsWith(endTag)) {

                return item.slice(beginTag.length, 0 - endTag.length);
            }

            return beginTag + item + endTag;
        });


        editor.replaceSelections(values, list);

        if (list.length < 2) {
            editor.focus();
        }

    }





    return {

        init: function (edt) {
            editor = edt;
        },


        //插入横线。
        hr: function () {
            var hr = '----------\n';
            var info = editor.getCursor(); //info = { line: 100, ch: 12, xRel: 1, };

            //如果所在的光标不是在行的首字符，则在前面加多一个换行。
            if (info.ch > 0) {
                hr = '\n' + hr;
            }

            editor.replaceSelection(hr);
        },


        redo: function () {
            editor.redo();
        },

        undo: function () {
            editor.undo();
        },

        bold: function () {
            wrap('**');
        },

        italic: function () {
            wrap('*');

        },

        code: function () {
            wrap('`');
        },
       

        link: function () {
            wrap('[', '](http://)', { empty: true, });
        },


        image: function () {
            wrap('![', '](http://)', { empty: true, });
        },


        quote: function () {
            var list = editor.getSelections();
            var values = list.map(function (item) {
                if (!item) {
                    return '\n\n> \n\n';
                }

                return '\n\n> ' + item + '\n\n';
                
            });

            editor.replaceSelections(values, list);

            if (values.length < 2) {
                editor.focus();
            }
            
        },

        ol: function () {
            var list = editor.getSelections();

            var values = list.map(function (item) {
                if (!item) {
                    return '\n 1. ';
                }

                var lines = item.split('\n');

                lines = lines.map(function (line, index) {
                    //取消作为列表 item。
                    var matchs =
                        line.match(/^ \d\. /g) ||
                        line.match(/^\d\. /g);

                    if (matchs) {
                        return line.slice(matchs[0].length);
                    }


                    var no = index + 1;

                    return ' ' + no + '. ' + line;
                });

                return lines.join('\n');
               

            });

            editor.replaceSelections(values, list);

        },

        ul: function () {
            var list = editor.getSelections();

            var values = list.map(function (item) {
                if (!item) {
                    return '\n - ';
                }

                


                var lines = item.split('\n');

                lines = lines.map(function (line, index) {
                    //取消作为列表 item。
                    if (line.startsWith(' - ')) {
                        return line.slice(3);
                    }

                    //取消作为列表 item。 
                    if (line.startsWith('- ')) {
                        return line.slice(2);
                    }

                    return ' - ' + line;
                });

                return lines.join('\n');


            });

            editor.replaceSelections(values, list);

        },

        

    };





});

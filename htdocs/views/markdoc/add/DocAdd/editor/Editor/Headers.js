

define('/DocAdd/Editor/Headers', function (require, module, exports) {
    var KISP = require('KISP');
    var File = require('File');
    var $Date = KISP.require('Date');
    var $String = KISP.require('String');

    /**
    * 检查指定的文本行是否为标题。
    * 即是否可以解析为 h1 - h6，如 `# h1`、...、`###### h6`，
    * 或者下面带有 `=====` 或 `-----` 下划线的。
    */
    function check(text, underline) {
        if (!text) {
            return false;
        }


        //最多支持三个空格在前面。
        //因为超过三个，将无法解析成 header。
        var value = text.trimStart();           //去掉前导空格。
        var len = text.length - value.length;   //去掉的空格数。

        if (value.startsWith('#') && len <= 3) {
            return true;
        }

        //针对一行文本下面带有分隔线的情况。
        //如  h1
        //============================
        //或 h2
        //---------------------------
        value = underline.trimStart();
        len = underline.length - value.length;

        if (len > 3) {
            return false;
        }

        //一整行全都是 `=`，且至少要有两个 `=`，即 `==` 才能成为 h1。
        //一整行全都是 `-`，且至少要有两个 `-`，即 `--` 才能成为 h2。
        if (value.length < 2) {
            return false;
        }


        value = value.split('=').join(''); 
        if (!value) {
            return true;
        }

        value = value.split('-').join('');
        if (!value) {
            return true;
        }

        return false;
    }



    return {
        get: function (doc) {
            var list = [];      //所有的行信息。
            var headers = [];   //标题行信息。
            var top = 0;        //当前行到顶部的距离，用于累加。
            var leafs = [];     //CodeMirror 里的 LeafChunk 实例数组。
            var isDouble = doc.children[0].children; //是否为二级结构，在文档比较长时，CodeMirror 会采用二级结构。


            //含有二级结构，展开成一级结构，方便统一处理。
            if (isDouble) {
                doc.children.forEach(function (branch) {
                    leafs.push(...branch.children);
                });
            }
            else {
                leafs = doc.children;
            }




            leafs.forEach(function (leaf) {
                leaf.lines.forEach(function (line) {
                    var item = {
                        'top': top,
                        'no': list.length,      //行号，从 0 开始。
                        'height': line.height,
                        'text': line.text,
                    };
                    
                    list.push(item);
                    top += line.height;
                });
            });

            list.forEach(function (item, index) {
                var nextItem = list[index + 1] || {};
                var underline = nextItem.text || '';
                var isHeader = check(item.text, underline);

                if (isHeader) {
                    headers.push(item);
                }

            });


            return headers;
            
        },

        /**
        * 查找最近的 header。
        */
        find: function (headers, top) {

            //查找当前位置的下一个 header。
            var index = headers.findIndex(function (item, index) {
                return item.top >= top;
            });

            //
            var item = headers[index];
            //var prev = headers[index - 1]; //前一个 header。

            //if (prev) {
            //    //比较一下是前一个 header 还是当前的 header 距离比较点更近。
            //    var y1 = Math.abs(item.top - top);
            //    var y2 = Math.abs(prev.top - top);;

            //    if (y2 < y1) {
            //        index = index - 1;
            //        item = prev;
            //    }
            //}
            
            


            return {
                'index': index,
                'prev': headers[index - 1],
                'item': item,
                'next': headers[index + 1],
                'headers': headers,
            };

        },
    };





});

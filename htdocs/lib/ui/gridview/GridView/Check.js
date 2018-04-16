
/**
* 
*/
define('GridView/Check', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');



    return {
        /**
        * 选中或取消选中指定的项。
        * 或者通过该项的状态自动进行选中或取消选中。
        * 已重载 check(meta, item);            //通过该项的状态自动进行选中或取消选中。
        * 已重载 check(meta, item, checked);   //选中或取消选中指定的项。
        */
        item: function (meta, item, checked) {
            var id = item[meta.primaryKey];
            var current = meta.current;
            var id$item = current.id$item;
            var list = new Set(current.list); //记录选中的 id，通过 Set() 可以去重。

            //未指定是否选中，则自动判断。
            if (checked === undefined) {
                checked = !id$item[id];
            }

            if (checked) {
                id$item[id] = item;
                list.add(id);
            }
            else {
                delete id$item[id];
                list.delete(id);
            }

            current.list = [...list];
            $('#' + meta.countId).html(list.size);


            //映射回具体的记录。
            list = meta.this.get();

            meta.emitter.fire('check', [{
                'item': item,
                'checked': checked,
                'list': list,
                'id$item': id$item,
            }]);

            return checked;
        },

        /**
        * 检查当前填充的列表和已选中的项的关系，看是否需要勾选表头的全选框。
        */
        all: function (meta) {
            var list = meta.list;
            var id$item = meta.current.id$item;
            var key = meta.primaryKey;
            var len = list.length;
            var allChecked = len > 0;   //如果有数据，则先假设已全部选中。

            //检查当前填充的列表，
            //只要发现有一项没有选中，则全选的就去掉。
            for (var i = 0; i < len; i++) {
                var item = list[i];
                var id = item[key];

                if (!id$item[id]) {
                    allChecked = false;
                    break;
                }
            }

            $('#' + meta.checkAllId).toggleClass('on', allChecked);
        },
    };
    
});



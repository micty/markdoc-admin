

KISP.panel('/SideMenus/Main/Guide/Form', function (require, module, panel) {

    var KISP = require('KISP');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');
    var Path = require('Path');

    //外面传进来的菜单项，即正在编辑的项。
    var current = {};

    /**
    * 迭代表单所有的 input 字段。
    */
    function each(fn) {
        var inputs = panel.$.find('input').toArray();

        inputs.forEach(function (input) {
            var value = input.value;
            var name = input.name;

            fn && fn(input, name, value);
        });
    }

    /**
    * 动态填充完整文件路径。
    */
    function setUrl(item, file) {

        file = file || item.data.file || '';


        if (item.level == 2) {
            var parent = item.parent.data;
           
            file = parent.base + file + parent.ext;     //短路径。
            file = Path.join(item.data.base, file);     //加上相对于 sidebar.json 文件所在的目录。

        }

        panel.$.find('[data-id="url"]').text(file);
    }




    panel.on('init', function () {
        //添加二级菜单。
        panel.$.on('click', 'button[data-cmd="add"]', function (event) {
            
            event.preventDefault(); //在表单里，需要阻止默认的提交行为。

            panel.fire('add', [{
                level: 2,
                parent: current,
                data: {},
            }]);
        });


        panel.$.on('input', 'input[name="file"]', function () {
            var input = this;
            setUrl(current, input.value);
        });

        panel.$.on('click', '[data-id="url"]', function () {
            var a = this;
            var url = a.innerText;

            panel.fire('file', [url]);

        });

    });

    /**
    * 渲染。
    */
    panel.on('render', function (item) {
        current = item;

        var level = item.level;
        var isAdd = level == 0 || (level == 2 && !item.id);
        var data = item.data || {};

        //只有在一级菜单编辑状态下，才显示【添加二级菜单项】按钮。
        panel.$.toggleClass('edit-level-1', level == 1);
        panel.$.toggleClass('level-2', level == 2);

        each(function (input, name, value) {
            input.value = isAdd ? '' : data[name] || '';
        });

        setUrl(item);
       

    });





    return {

        /**
        * 根据表单信息，获取菜单节点，以用于新建或者更新。
        */
        get: function (key) {
            if (key == 'current') {
                return current;
            }

            var data = {};
            var valid = true; //先假设全部字段都合法。

            each(function (input, name, value) {
                if (!valid) { //只要有一个不合法，则不需要再检测后面的。
                    return;
                }

                if (input.required && !value) {
                    var tr = input.parentNode.parentNode;
                    var text = $(tr).find('th').text();

                    KISP.alert('【' + text + '】字段必填', function () {
                        input.focus();
                    });

                    valid = false;
                    return;
                }

                data[name] = value;
            });
   

            return !valid ? null : {
                'id': current.level == 0 ? '' : current.id, //根节点的，只能新建。
                'name': data.name,
                'data': data,
            };

        },

        /**
        * 清空表单所有字段。
        */
        clear: function () {

            each(function (input, name, value) {
                input.value = '';
            });

        },

        /**
        * 清空表单所有字段。
        */
        check: function (checked) {
            panel.$.toggleClass('more', checked);
        },
    };





});
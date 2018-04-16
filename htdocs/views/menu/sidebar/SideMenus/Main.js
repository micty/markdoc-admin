

KISP.panel('/SideMenus/Main', function (require, module, panel) {

    var KISP = require('KISP');
    var $String = KISP.require('String');

    var Header = module.require('Header');
    var Guide = module.require('Guide');
    var Code = module.require('Code');

    panel.on('init', function () {

        Header.on({
            'guide': function () {
                Guide.show();
                Code.hide();
            },
            'code': function () {
                var values = panel.fire('code', 'mode'); //从父级取返回值。
                var json = values[0];

                Guide.hide();
                Code.render(json);
            },
            'save': function () {
                panel.fire('save');
            },
        });


        Guide.on({
            'add': function (item) {
                panel.fire('add', [item]);
            },
            'update': function (item) {
                panel.fire('update', [item]);
            },
            'delete': function (item) {
                panel.fire('delete', [item]);
            },

            'move': function (item, step) {
                panel.fire('move', [item, step]);
            },
            'file': function (file) {
                panel.fire('file', [file]);
            },
        });

        Code.on({
            'change': function (json) {
                panel.fire('code', 'change', [json]);
            },
        });

       
    });


    /**
    * 渲染。
    *   options = {
    *       mode: '',       //文件模式，是新增还是编辑。 取值只能为 `edit` 或 `new`。
    *       file: '',       //文件路径。
    *       index: 0,       //要激活的页签序号。
    *       item: {},       //菜单项。
    *   };
    */
    panel.on('render', function (options) {

        var item = options.item;

        Header.render({
            'mode': options.mode,
            'file': options.file,
            'index': options.index,
        });

        if (item) {
            Guide.render(item);
            Code.hide();
        }
        
       
    });

    return {
        getFile: function () {
            return Header.get();
        },
    };

});
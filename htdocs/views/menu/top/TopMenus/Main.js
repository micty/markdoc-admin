

KISP.panel('/TopMenus/Main', function (require, module, panel) {

    var KISP = require('KISP');
    var $String = KISP.require('String');

    var Header = module.require('Header');
    var Guide = module.require('Guide');
    var Code = module.require('Code');

    panel.on('init', function () {

        Header.on({
            'guide': function (fromRender) {
                Guide.show();
                Code.hide();

                //说明是手动点击了 tabs 中的 `向导视图` 页签而触发的。
                //如果没有这个判断，则会死循环。
                if (!fromRender) { 
                    panel.fire('mode', 'guide');
                }

            },
            'code': function () {
                var values = panel.fire('mode', 'code'); //从父级取返回值。
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
                panel.fire('code-change', [json]);
            },
        });

       
    });


    /**
    * 渲染。
    */
    panel.on('render', function (item) {


        Header.render();

        Guide.render(item);
        Code.hide();
        
        
       
    });



});


KISP.panel('/DocAdd/Outline/List', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    var list = [];

    panel.on('init', function () {


        panel.template({
            '': function (data) {
                var list = data.list;
                var html = this.fill('item', list);

                return html;
            },

            'item': {
                '': function (item, index) {

                    var level = item.level;

                    //创建一个指定长度的数组。
                    var tabs = $String.random(level - 1).split('').map(function () {
                        return {};
                    });

                    tabs = this.fill('tab', tabs);

                    return {
                        'index': index,
                        'level': item.level,
                        'text': item.text,
                        'tabs': tabs,
                    };
                },

                'tab': function (item) {
                    return {};
                },
            },

        });

        panel.$.on('click', '[data-index]', function () {
            var index = +this.getAttribute('data-index');
            var item = list[index];

            panel.fire('item', [item, index]);
        });
    });




    /**
    * 渲染。
    *   items = [
    *       {
    *           text: '',       //
    *           level: 1,       //
    *       },
    *   ];
    */
    panel.on('render', function (items) {
        list = items;

        panel.fill({ 'list': list, });
    });



});

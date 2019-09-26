

define('Outline/Template', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var Template = KISP.require('Template');
    var $String = KISP.require('String');




    return {
        create: function () {
           
            var tpl = new Template('#tpl-Outline');


            tpl.process({
                '': function (data) {
                    var list = data.list;
                    var items = this.fill('item', list);

                    return {
                        'items': items,
                    };
                },

                'item': {
                    '': function (item, index) {
                        var level = item.level;
                        var tabs = level - 1;
                        var children = item.children || [];


                        //创建一个指定长度的数组。
                        tabs = $String.random(tabs).split('');

                        tabs = tabs.map(function () {
                            return {};
                        });

                        tabs = this.fill('tab', tabs);

                        return {
                            'index': index,
                            'level': level,
                            'tabs': tabs,
                            'text': item.text,
                            'opened': children.length > 0 ? 'opened' : '',
                            'folder-title': children.length > 0 ? '点击收起子级' : '',
                        };
                    },

                    'tab': function (item, index) {
                        return {};
                    },
                },
            });

            return tpl;

        },

    };
});
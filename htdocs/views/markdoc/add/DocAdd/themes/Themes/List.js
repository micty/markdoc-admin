

KISP.panel('/DocAdd/Themes/List', function (require, module, panel) {
    var KISP = require('KISP');
    var $String = KISP.require('String');

    var list = [
        { name: 'default', },
        { name: 'custom', desc: '深色', },
        { name: '3024-day', },
        { name: '3024-night', desc: '深色', },
        { name: 'ambiance-mobile', },
        { name: 'ambiance', desc: '深色', },
        { name: 'base16-dark', desc: '深色', },
        { name: 'base16-light', },
        { name: 'blackboard', desc: '深色', },
        { name: 'cobalt', desc: '深色', },
        { name: 'eclipse', },
        { name: 'elegant', },
        { name: 'erlang-dark', desc: '深色', },
        { name: 'lesser-dark', desc: '深色', },
        { name: 'mbo', desc: '深色', },
        { name: 'mdn-like', },
        { name: 'midnight', desc: '深色', },
        { name: 'monokai', desc: '深色', },
        { name: 'neat', },
        { name: 'neo', },
        { name: 'night', desc: '深色', },
        { name: 'paraiso-dark', desc: '深色', },
        { name: 'paraiso-light', },
        { name: 'pastel-on-dark', desc: '深色', },
        { name: 'rubyblue', desc: '深色', },
        { name: 'solarized', },
        { name: 'the-matrix', desc: '深色', },
        { name: 'tomorrow-night-eighties', desc: '深色', },
        { name: 'twilight', desc: '深色', },
        { name: 'vibrant-ink', desc: '深色', },
        { name: 'xq-dark', desc: '深色', },
        { name: 'xq-light', },
    ];

    var tabs = null;


    panel.set('show', false);

    panel.on('init', function () {
        
        tabs = KISP.create('Tabs', {
            container: panel.$,
            selector: '>li',
            activedClass: 'on',
        });

        tabs.on('change', function (item, index) {
            item = list[index];
            panel.fire('item', [item, index]);
        });



        panel.$.on('click', '[data-index]', function (event) {
            var index = +this.getAttribute('data-index');
            tabs.active(index);
        });

        panel.template({
            '': function (data) {
                var items = this.fill('item', data.list);

                return {
                    'items': items,
                };
            },

            'item': {
                '': function (item, index) {
                    var desc = this.fill('desc', item);

                    return {
                        'index': index,
                        'name': item.name,
                        'desc': desc,
                    };
                },

                'desc': function (item) {
                    return item.desc ? { 'desc': item.desc, } : '';
                },
            },
        });
    });




    panel.on('render', function (index) {
        
        panel.fill({ 'list': list, });

        if (typeof index == 'number') {
            tabs.active(index);
        }

       
    });


    return {
        active: function (index) {
            tabs.active(index);
        },

        slide: function (visible, fn) {
            visible ?
                panel.$.slideDown('fast', fn) :
                panel.$.slideUp('fast', fn);
        },
    };


});
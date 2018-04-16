
/**
* 按钮下拉列表。
*/
define('ButtonDropList', function (require, module) {
    var KISP = require('KISP');
    var $ = require('$');
    var Emitter = KISP.require('Emitter');
    var $String = KISP.require('String');



    var mapper = new Map();



    function ButtonDropList(config) {
      
        var emitter = new Emitter(this);
        var container = $(config.container);
        var list = config.list || [];

        var meta = {
            'list': list,
            'emitter': emitter,
            'container': container,
        };

        mapper.set(this, meta);


        container.on('click', '[data-index]', function () {
            var index = +this.getAttribute('data-index');
            var item = meta.list[index];
            var name = item.name;

            emitter.fire('click', name, [item, index]);
        });

    }


    ButtonDropList.prototype = { //实例方法
        constructor: ButtonDropList,

        /**
        * 
        */
        render: function (list) {
            var meta = mapper.get(this);

            list = list || meta.list;
            meta.list = list;

            var item = list[0];
            var items = list.slice(1);

            var data = Object.assign({}, item, {
                'items': items,
            });


            var Template = module.require('Template');
            var html = Template.fill(data);
            var container = meta.container;

            container.html(html);

        },

        /**
        * 给本控件实例绑定事件。
        */
        on: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var args = Array.from(arguments);
            emitter.on(args);
        },

        /**
        * 销毁本控件实例。
        */
        destroy: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var container = meta.container;

            emitter.off();
            container.html('').undelegate();
            mapper.delete(this);
        },
    };

    return ButtonDropList;

});


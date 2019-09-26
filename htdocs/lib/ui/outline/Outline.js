
/**
* 提纲列表。
*/
define('Outline', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');
    var Emitter = KISP.require('Emitter');

    var Meta = module.require('Meta');
    var Events = module.require('Events');
    var Template = module.require('Template');

  

    var mapper = new Map();





    /**
    * 构造器。
    *    options = {
    *        container: '',     //要填充的 DOM 元素，内容将会填充到该元素里面。
    *    };
    */
    function Outline(config) {
        var emitter = new Emitter(this);
        var tpl = Template.create();

        var meta = Meta.create(config, {
            'this': this,
            'emitter': emitter,
            'tpl': tpl,
        });

        mapper.set(this, meta);

        Object.assign(this, {
            'id': meta.id,
            '$': meta.$,
            'data': {},     //用户的自定义数据容器。
        });

       

    }


    Outline.prototype = {
        constructor: Outline,

        /**
        * 对传入的容器的 jQuery 对象包装，即 $(container)。
        */
        $: null,

        /**
        * 用户的自定义数据容器。
        */
        data: {},

        /**
        * 渲染生成提纲内容。
        * 该方法只能调用一次，后续要更新内容请调用 fill(list) 方法。
        *   list = [            //可选，要渲染生成的列表数据。
        *       {
        *           level: 1,   //标题级别，从 1 到 6，对应 h1 - h6。
        *           text: '',   //标题内容。
        *       },
        *   ];
        */
        render: function (list) {
            
            var meta = mapper.get(this);

            meta.$ = $(meta.container);
            list = list || meta.list;
            list && this.fill(list);

            meta.$.show();
            Events.bind(meta);

        },

        /**
        * 填充以获得 html。
        * 调用该方法之前，可以不必先调用 render()，这样可以仅获得生成的 html，以便在业务层手动处理。
        */
        fill: function (list) {

            //建立起父子关系。
            list.forEach(function (item, index) {
                item.parent = null; //先统一假设父节点为空。

                var level = item.level;

                if (level == 1) { //最顶级的，即 h1，不存在父节点。
                    return;
                }


                //再往回沿路搜索比当前节点的级别低的节点。
                //往回过程中，第一个级别低的节点即为父节点。
                for (var i = index - 1; i >= 0; i--) {
                    var parent = list[i];

                    if (level > parent.level) {
                        item.parent = parent;

                        parent.children = parent.children || [];
                        parent.children.push(item);

                        return;
                    }
                }

            });



            var meta = mapper.get(this);
            var html = meta.tpl.fill({ 'list': list, });

            meta.list = list;
            meta.$ && meta.$.html(html);

            return html;
        },

        /**
        * 显示本组件。
        */
        show: function () {
            var meta = mapper.get(this);
            meta.$.show(...arguments);
            meta.emitter.fire('show');
        },

        /**
        * 隐藏本组件。
        */
        hide: function () {
            var meta = mapper.get(this);
            meta.$.hide(...arguments);
            meta.emitter.fire('hide');
        },


        /**
        * 绑定事件。
        */
        on: function () {
            var meta = mapper.get(this);
            meta.emitter.on(...arguments);
        },

    };




    return Outline;


});

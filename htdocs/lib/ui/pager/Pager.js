
/**
* 标准分页控件。 
*/
define('Pager', function (require, module) {
    var KISP = require('KISP');
    var $ = require('$');
    var Emitter = KISP.require('Emitter');
    var $String = KISP.require('String');
    var Defaults = require('Defaults');

    var Events = module.require('Events');
    var JumpNo = module.require('JumpNo');
    var Regions = module.require('Regions');
    var Sizes = module.require('Sizes');

    var mapper = new Map();




    /**
    * 根据指定配置信息创建一个分页器实例。
    * @param {Object} config 传入的配置对象。 其中：
    * @param {string|DOMElement} container 分页控件的 DOM 元素容器。
    * @param {number} [no=1] 当前激活的页码，默认从 1 开始。
    * @param {number} size 分页大小，即每页的记录数。
    * @param {number} total 总的记录数。
    * @param {number} min 总页数小于该值时，分页器会隐藏。 
        如果不指定，则一直显示。
    * @param {function} change 页码发生变化时的回调函数。
        该函数会接受到当前页码的参数；并且内部的 this 指向当前 Pager 实例。
    * @param {function} error 控件发生错误时的回调函数。
        该函数会接受到错误消息的参数；并且内部的 this 指向当前 Pager 实例。
    */
    function Pager(config) {
        config = Defaults.clone(module, config);


        var id = $String.random();
        var emitter = new Emitter(this);
        var size = config.size ;
        var sizes = Sizes.get(config.sizes, size);

        var meta = {
            'id': id,                           //
            'txtId': $String.random(),          //
            'ulId': $String.random(),           //
            'sizerId': $String.random(),        //
            '$': null,                          //         
            'ctn': config.container,            //当前组件的容器。
            'no': config.no || 1,               //当前页码，从 1 开始。
            'size': size,                       //分页的大小，即每页的记录数。
            'total': config.total || 0,         //总的记录数。
            'min': config.min || 0,             //总页数小于该值时，分页器会隐藏。 如果不指定或指定为 0，则一直显示。
            'count': 0,                         //总页数，计算得到。
            'last': 0,                          //上一次的页码。
            'sizes': sizes,                     //可供选择的分页大小列表。
            'emitter': emitter,                 //
            'this': this,                       //引用自身，方便内部子模块使用。
        };

        mapper.set(this, meta);

        Object.assign(this, {
            'id': id,
            'meta': meta,
            '$': meta.$,
        });

    }


    Pager.prototype = { //实例方法
        constructor: Pager,

        id: '',
        $: null,

        /**
        * 
        */
        render: function (options) {
            options = options || {};

            var meta = mapper.get(this);
            var total = typeof options.total == 'number' ? options.total : meta.total;
            var size = typeof options.size == 'number' ? options.size : meta.size;
            var min = typeof options.min == 'number' ? options.min : meta.min;
            var no = typeof options.no == 'number' ? options.no : meta.no;
            var count = Math.ceil(total / size);                //总的页数，计算得到，向上取整。   
            var bind = !!meta.$;                                //是否已绑定。

            //共 0 页的时候。
            if (count == 0) {
                meta.$ && meta.$.hide();
                return;
            }

            //页码超出范围。
            if (no < 1 || no > count) {
                meta.emitter.fire('error', ['输入的页码值只能从 1 到 ' + count]);
                return false;
            }

            meta.$ = this.$ = $(meta.ctn);
            meta.count = count;
            meta.no = no;
            meta.total = total;
            meta.size = size;
            meta.min = min;


            //首次渲染，绑定事件。
            if (!bind) {
                Events.bind(meta);
            }


            if (count < min) {
                meta.$.hide();
                return;
            }

            
             
            var Template = module.require('Template');
            var regions = Regions.get(count, no);
            var toNo = JumpNo.get(count, no, meta.last);

            var html = Template.fill({
                'regions': regions,
                'no': no,
                'count': count,
                'total': total,
                'toNo': toNo,
                'txtId': meta.txtId,
                'sizerId': meta.sizerId,
                'sizes': meta.sizes,
                'size': meta.size,
            });

            meta.$.html(html).show(); //要重新显示出来，之前可能隐藏了
        },


        /**
        * 跳转到指定页码的分页。
        * @param {number} no 要跳转的页码。
        *   指定的值必须为从 1 ~ max 的整数，其中 max 为本控件最大的页码值。
        *   如果指定了非法值，则会触发 error 事件。
        */
        to: function (no) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var isValid = (/^\d+$/).test(no);

            if (!isValid) {
                emitter.fire('error', ['输入的页码必须是数字']);
                return;
            }

            no = parseInt(no);

            isValid = this.render({ 'no': no });
            if (isValid === false) {
                return;
            }

            meta.last = meta.no;
            meta.no = no;


            emitter.fire('change', [no, meta.size]);
        },


        /**
        * 跳到上一页。
        */
        previous: function () {
            var meta = mapper.get(this);
            var no = meta.no - 1;
            if (no < 1) {
                return;
            }

            this.to(no);
        },

        /**
        * 跳到下一页。
        */
        next: function () {
            var meta = mapper.get(this);
            var no = meta.no + 1;
            var count = meta.count;
            if (no > count) {
                return;
            }

            this.to(no);
        },

        /**
        * 跳到第一页。
        */
        first: function () {
            this.to(1);
        },

        /**
        * 跳到最后一页。
        */
        final: function () {
            var meta = mapper.get(this);
            var no = meta.count;
            this.to(no);
        },

        /**
        * 刷新当前页。
        */
        refresh: function () {
            var meta = mapper.get(this);
            var no = meta.no;
            this.to(no);
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

            emitter.off();
            meta.$ && meta.$.html('').undelegate();
            mapper.delete(this);
        },
    };

    return Pager;

});


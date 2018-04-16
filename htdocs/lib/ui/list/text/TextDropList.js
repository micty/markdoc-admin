
/**
* 带输入文本框的下拉列表。
*/
define('TextDropList', function (require, module) {
    var KISP = require('KISP');
    var $ = require('$');
    var Defaults = require('Defaults');

    var Emitter = KISP.require('Emitter');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');

    var Events = module.require('Events');
    var Template = module.require('Template');

    var mapper = new Map();


    function TextDropList(config) {

        console.warn('TextDropList 组件已过时，请使用新版本 TextDropList.v2');
      
        config = Defaults.clone(module, config);

        var emitter = new Emitter(this);
        var list = config.list || [];
        var id = $String.random();
        var txtId = 'txt-' + id;
        var ulId = 'ul-' + id;

        var meta = {
            'id': id,
            'list': [],             //对应于填充到列表后的数据。
            'items': list,          //填充前的数据集合。
            'emitter': emitter,     //
            'txtId': txtId,         //
            'ulId': ulId,           //
            'rendered': false,      //
            'width': config.width,  //
            'mask': config.mask,    //

            'text': config.text,    //
            'currentItem': null,    //当前选中的项。

            'readonly': config.readonly,    //
            'disabled': config.disabled,    //
            'custom': config.custom,        //是否允许自定义输入。 如果否，则在输入后必须从弹出列表中选择一项。
            '$': $(config.container),       //$(this)，内部使用的一个 jQuery 对象。 组件的容器。
            'dialog': config.dialog,
            'autoWidth': config.autoWidth,  //在填充完后是否自动调整列宽。
            'order': config.order,          //是否自动增加一列作为序号列。
            'this': this,
            'actived': false,   //当前组件是否已激活。
            'event': null,      //用于传递到业务层，以识别是手动选中触发的。
        };

        this.$ = meta.$;
        this.id = id;
        mapper.set(this, meta);
      
    }



    TextDropList.prototype = { //实例方法
        constructor: TextDropList,

        id: '',
        $: null,

        /**
        * 
        */
        render: function (list) {
            var meta = mapper.get(this);

            list = meta.items = list || meta.items;

            if (meta.rendered) {
                this.fill(list);
                return;
            }


            var data = {
                'txtId': meta.txtId,
                'ulId': meta.ulId,
                'text': meta.text,
                'readonly': meta.readonly,
                'disabled': meta.disabled,
                'list': [],
            };

            var Template = module.require('Template');
            var html = Template.fill(data);

            meta.$.html(html);
            meta.$.addClass('TextDropList');

            var width = meta.width;
            width && meta.$.css('width', width);

            Events.bind(meta);
            meta.rendered = true;

            this.fill(list);
        },

        /**
        * 填充下拉列表部分。
        * 已重载 fill(list);
        * 已重载 fill(list, fn);
        * 如果指定了关键词，则进行关键词高亮。
        * 如果指定了处理函数或过滤，则进处数据的处理转换或过滤。
        */
        fill: function (list, keyword, fn) {
            //重载 fill(list, fn);
            if (typeof keyword == 'function') {
                fn = keyword;
                keyword = '';
            }

            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var addOrder = meta.order;

            meta.items = list;

            list = $Array.map(list, function (item, index) {
                if (fn) {
                    var value = fn.call(this, item, index);

                    if (value === false) {
                        return null;
                    }

                    if (typeof value == 'object') {
                        item = value;
                    }
                }

                item = Object.assign({}, item);

                var columns = item.columns;

                if (columns && addOrder) {
                    var order = {
                        'text': index + 1,
                        'keyword': false,
                        'class': 'order',
                    };

                    item.columns = [order].concat(columns);
                }
     
                return item;
            });

            //如果指定了关键词，则进行关键词高亮。
            if (keyword) {
                var html = Template.fill('item', 'keyword', {
                    'keyword': keyword,
                });

                list = list.map(function (item) {
                    var text = item.text;
                    var columns = item.columns;

                    if (Array.isArray(columns)) {
                        columns = columns.map(function (item) {

                            //该列禁用关键词高亮。
                            if (item.keyword === false) {
                                return item;
                            }

                            var text = item.text.split(keyword).join(html);  //replaceAll

                            return Object.assign({}, item, {
                                'text': text,
                            });
                        });
                    }
                    else {
                        text = text.split(keyword).join(html);
                    }

                    return Object.assign({}, item, {
                        'text': text,
                        'columns': columns,
                    });
                });
            }

            meta.list = list;

            var shtml = Template.fill('item', list);
            var $ul = $('#' + meta.ulId);
            var $txt = $('#' + meta.txtId);

            $ul.html(shtml);
            $ul.toggleClass('nodata', list.length == 0);
            $ul.find('>li').removeClass('on');  //移除其它项的高亮。
            $txt.removeClass('error');          //移除输入框中的错误提示。

            if (meta.autoWidth) {
                this.autoWidth();
            }

            if (keyword) {
                meta.text = keyword;
            }

            emitter.fire('fill');

        },

        /**
        * 自动计算并应用列的宽度。
        * 必须在填充后执行。
        */
        autoWidth: function () {
            var meta = mapper.get(this);
            var widths = [];
            var rows = [];
            var $ul = $('#' + meta.ulId);
            var actived = meta.actived;

            //列表是隐藏状态的，无法自动计算列宽。
            //需要临时变成"可见"状态，但不在可视范围内，用于计算列宽。
            if (!actived) {
                $ul.addClass('auto-width');
            }

            $ul.find('>li').each(function () {
                var cells = [];

                $(this).find('>span').each(function (index) {
                    var $span = $(this);
                    var width = $span.outerWidth();
                    var old = widths[index] || 0;

                    widths[index] = Math.max(width, old);

                    cells.push($span);
                });

                rows.push(cells);
            });

            rows.map(function (cells) {
                cells.map(function ($span, index) {
                    var w = widths[index] + 10;
                    $span.width(w);
                });
            });

            //计算完成后，移除临时"可见"状态。
            if (!actived) {
                $ul.removeClass('auto-width');
            }


        },


        /**
        * 给本控件实例绑定事件。
        */
        on: function () {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            emitter.on(...arguments);
        },

        set: function (key, value) {
            var meta = mapper.get(this);
            var txt = document.getElementById(meta.txtId);

            switch (key) {
                case 'text':
                    meta.text = value;
                    txt.value = value;
                    txt.placeholder = meta.currentItem && value === '' ? '（无内容）' : ''; //为了更容易发现一些无内容的选项。
                    break;

                case 'disabled':
                    value = !!value;
                    meta.disabled = value;
                    txt.disabled = value;
                    break;
            }

        },

        get: function (key) {
            var meta = mapper.get(this);

            switch (key) {
                case 'text':
                case 'disabled':
                    return meta[key];
            }

            return meta.currentItem;
        },

        /**
        * 从下拉列表中选择指定的项。
        * 已重载 select() 选中文本框内的文本。
        * 已重载 select(index) 从下拉列表中选择指定索引值的项。
        * 已重载 select(id) 从下拉列表中选择指定id 值的项。
        * 已重载 select(fn) 从下拉列表中选择符合条件的项。
        */
        select: function (item) {
            var meta = mapper.get(this);
            var txt = document.getElementById(meta.txtId);

            //选中并返回文本框内的文本值。
            if (arguments.length == 0) {
                txt.select();
                return txt.value;
            }

            //选择指定的项。
            var currentItem = meta.currentItem;
            var emitter = meta.emitter;
            var $ul = $('#' + meta.ulId);
            var $txt = $(txt);
            var list = meta.list;
            var id = '';

            switch (typeof item) {
                case 'number':
                    item = list[item];
                    break;

                case 'string':
                    id = item;
                    break;

                case 'object':
                    id = item.id;

                    //后台的数据类型并不是十分严格，有可能为数字类型的 0。
                    if (typeof id == 'number') {
                        id = String(id);
                    }

                    break;

                case 'function':
                    item = list.find(item);
                    break;
            }

            if (id) {
                item = list.find(function (item, index) {
                    return item.id == id;
                });
            }

            if (!item) {
                console.warn('无法找到指定的 item。');
                emitter.fire('select', 'not-found', ['无法找到指定的 item。']);
                return;
            }

            if (item.disabled) {
                console.warn('所选择的项已给禁用。');
                emitter.fire('select', 'disabled', ['所选择的项已给禁用。']);
                return;
            }

            //选中的是同一项。
            if (currentItem && currentItem.id == item.id) {
                return;
            }

            //选中的不是同一项。
            meta.currentItem = item;


            $ul.find('>li').removeClass('on'); //移除其它项的高亮。
            $ul.find('>li[data-index="' + item.index + '"]').addClass('on'); //高亮当前项
            $txt.removeClass('error'); //移除输入框中的错误提示。

            var text = item.text;
            if (typeof text == 'string') {
                $txt.val(text).attr('title', text);
            }

            emitter.fire('select', [item, meta.event]);
        },

        /**
        * 清空所选。
        */
        empty: function (fireEvent) {
            var meta = mapper.get(this);
            var emitter = meta.emitter;
            var $ul = $('#' + meta.ulId);
            var $txt = $('#' + meta.txtId);

            meta.currentItem = null;


            $ul.find('>li').removeClass('on');  //移除其它项的高亮。
            $txt.removeClass('error');          //移除输入框中的错误提示。
            $txt.val('').attr('title', '');     //
            $txt.get(0).placeholder = '';

            meta.text = '';

            //只有明确指定为 false 才禁用事件，一般为内部调用。
            if (fireEvent !== false) {
                this.fill(meta.items);
                emitter.fire('empty');
            }


        },


        /**
        * 销毁本控件实例。
        */
        destroy: function () {
            var meta = mapper.get(this);

            //已销毁。
            if (!meta) {
                return;
            }

            var emitter = meta.emitter;

            emitter.off();
            meta.$.html('').undelegate();
            mapper.delete(this);
        },
    };

    return TextDropList;

});



define('TableResizer.v2', function (require, module, exports) {
    var KISP = require('KISP');
    var $ = require('$');
    var Defaults = require('Defaults');
    var $Array = KISP.require('Array');
    var $String = KISP.require('String');
    var $Object = KISP.require('Object');
    var Emitter = KISP.require('Emitter');
    var Template = KISP.require('Template');

    var Cols = module.require('Cols');
    var Mouse = module.require('Mouse');
    var Rows = module.require('Rows');
    var Fields = module.require('Fields');
    var Meta = module.require('Meta');

    var mapper = new Map();
    var tpl = new Template('#tpl-TableResizer-v2');


    function TableResizer(config) {
        config = Defaults.clone(module, config);

        var emitter = new Emitter(this);
        var fields = Fields.normalize(config.fields);
        var width = config.width || Fields.sum(fields);

        var meta = Meta.create(config, {
            'emitter': emitter,     //
            'this': this,           //
            'fields': fields,       //列字段集合。
            'width': width,         //表格总宽度。
        });

        mapper.set(this, meta);

        Object.assign(this, {
            'id': meta.id,
            'meta': meta,
        });

       
    }

    //实例方法。
    TableResizer.prototype = {
        constructor: TableResizer,

        id: '',
        $: null,


        render: function () {
            this.destroy(true); //弱销毁。

            var meta = mapper.get(this);

            meta.$ = this.$ = $(meta.selector);
            meta.$.addClass(meta.cssClass);

            var table = meta.table = meta.$.get(0);
            var rows = Rows.get(table, meta.rowspan);


            //指定了允许可拖曳，则在有效行(一般是第一行)的列之间生成 resizer 相应的 html。
            meta.dragable && rows.map(function (cells, no) {

                cells.map(function (cell, index) {
                    var id = $String.random();
                    var targetIndex = cell.getAttribute(meta.indexKey);

                    //指定了要关联的目标列索引值，则只创建和保留对应的 resizer。
                    if (targetIndex !== null) {
                        var ids = meta.cell$ids.get(cell) || [];
                        var nextIndex = ids.length;

                        ids.push(id);
                        meta.cell$ids.set(cell, ids);

                        if (nextIndex != targetIndex) {
                            return ;
                        }
                    }

                    var field = meta.fields[index];

                    var html = tpl.fill('resizer', {
                        'id': id,
                        'display': field.dragable === false ? 'display: none;' : '',
                    });

                    $(cell).append(html);

                    meta.id$index[id] = index;
                    Mouse.set(id, meta);

                    return;
                });
            });
            
            meta.cols = Cols.fill(meta.$, meta.fields);

            table.style.width = meta.width + 'px';
            meta.emitter.fire('render', [meta.width, meta.fields]);

        },

        /**
        * 设置指定索引号的列宽和整个表格的宽度。
        */
        set: function (data) {
            var index = data.index;
            var width = data.width;
            var tdWidth = data.tdWidth;

            var meta = mapper.get(this);

            meta.fields[index].width = tdWidth;
            meta.cols[index].width = tdWidth;
            meta.width = width;

            meta.table.style.width = width + 'px';

        },


        on: function (name, fn) {
            var meta = mapper.get(this);

            meta.emitter.on(...arguments);
        },

        destroy: function (weak) {
            var meta = mapper.get(this);

            Object.keys(meta.id$index).map(function (id) {
                Mouse.remove(id);

                var el = document.getElementById(id);
                el && el.parentNode.removeChild(el);
            });


            //当指定 weak 为 true 时，表示是弱销毁，一般是内部调用。
            if (!weak) {
                var cg = meta.$.find('>colgroup').get(0);
                cg && cg.parentNode.removeChild(cg);

                meta.emitter.destroy();
                meta.$.removeClass(meta.cssClass);
                mapper.delete(this);
            }
          
        },
    };

    return TableResizer;
});
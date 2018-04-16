
/**
* 统一管理多个模块的 render 状态。
* 因为模块 UI 在填充完和恢复现场时(如下拉列表的填充和选中)，是异步进行的。
* 要在所有模块都触发 `render` 事件后，最后才算是进入就绪状态。
*/
define('ModulesStatus', function (require, module, exports) {

    var KISP = require('KISP');
    var mapper = new Map();


    function ModulesStatus(list, done) {
        var meta = {
            'list': list,
            'done': done,
            'readys': [],
        };

        mapper.set(this, meta);

        
        this.reset();


        this.each(function (M, index) {
            M.on('render', function () {
                var readys = meta.readys;
                var done = meta.done;

                //避免重复触发。
                if (readys[index]) {
                    return
                }

                readys[index] = true;

                //查找尚未就绪的项。
                var item = readys.find(function (item) {
                    return !item;
                });

                //如果没有找到，说明全部都已经就绪。
                //这里不要用 `!item`，因为 item 本身就是 boolean 型。
                if (item == null) {
                    done && done();
                }
            });
        });
    }


    ModulesStatus.prototype = {
        constructor: ModulesStatus,

        each: function (fn) {
            var meta = mapper.get(this);

            meta.list.map(function (M, index) {
                fn && fn(M, index);
            });
        },

        reset: function (list) {
            var meta = mapper.get(this);

            meta.list = list || meta.list;

            meta.readys = meta.list.map(function (M, index) {
                return false;
            });
        },

        ready: function (done) {
            var meta = mapper.get(this);
            meta.done = done || meta.done;
        },

        render: function () {
            var args = arguments;

            this.reset();

            this.each(function (M) {
                M.render(...args);
            });
        },

    };

    return ModulesStatus;
});


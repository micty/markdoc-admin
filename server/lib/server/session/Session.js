

define('Session', function (require, module, exports) {
    var $ = require('$');
    var $String = $.require('String');

    var id$data = {};               //会话用户对应的数据。
    var id$time = {};               //会话最新的活跃时间。
    var tid = null;



    return {

        /**
        * 设置超时时间，并启动超时计时。
        */
        setTimeout:function(timeout){
            clearInterval(tid);

            tid = setInterval(function () {
                for (var id in id$time) {
                    var time = id$time[id];
                    var now = Date.now();

                    //已超时，则删除相应的记录项。
                    if (now - time >= timeout) {
                        delete id$time[id];
                        delete id$data[id];
                    }
                }

            }, timeout);

        },

        /**
        * 获取指定会话 id 对应的会话数据。
        */
        get: function (id) {
            return id$data[id];
        },

        /**
        * 添加一个会话及数据。
        * 返回会话 id。
        */
        add: function (data) {
            var id = $String.random();

            id$data[id] = data || {};
            id$time[id] = Date.now();

            return id;
        },

        /**
        * 检查指定的会话是否在有效期内。
        */
        check: function (req, res) {
            var id = req.query.token;

            if (!id) {
                res.send({
                    code: -1,
                    msg: '缺少 token 字段。',
                });
                res.end();
                return;
            }

            var data = id$data[id];

            if (!data) {
                res.send({
                    code: -2,
                    msg: '不存在该 token。',
                });
                return;
            }


            //更新活跃时间。
            id$time[id] = Date.now();

            return true;
        },
    };
});
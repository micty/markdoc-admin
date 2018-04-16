

/**
* 增强型的 response，提供一些命名的方法。
*/
define('Router/Response', function (require, module, exports) {

    function Response(res) {
        this.res = res;
    }


    //实例方法。
    Response.prototype = {

        constructor: Response,

        /**
        * 
        */
        send: function (json) {
            this.res.send(json);
        },

        /**
        * 已重载 success(msg, data);
        * 已重载 success(data);
        */
        success: function (msg, data) {

            //重载 success(data);
            if (typeof msg != 'string') {
                data = msg;
                msg = 'ok';
            }

            this.res.send({
                'code': 200,
                'msg': msg,
                'data': data || {},
            });
        },

        /**
        * 
        */
        empty: function (key) {
            this.res.send({
                code: 201,
                msg: '字段 ' + key + ' 不能为空。',
            });
        },

        /**
        * 已重载 none(msg, item);
        * 已重载 none(item);
        */
        none: function (msg, item) {
            //重载 none(item);
            if (typeof msg != 'string') {
                item = msg;
                msg = '不存在该记录';
            }

            this.res.send({
                'code': 404,
                'msg': msg,
                'data': item,
            });

        },

        /**
        * 
        */
        error: function (ex) {

            this.res.send({
                'code': 500,
                'msg': ex.message,
            });

            console.dir(ex);
        },
    };
    

    return Response;

});



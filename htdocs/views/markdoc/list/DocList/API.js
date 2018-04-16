

define('/DocList/API', function (require, module, exports) {
    var $ = require('$');
    var KISP = require('KISP');
    var Emitter = KISP.require('Emitter');
    var API = require('API');

    var emitter = new Emitter();
    var loading = null;

    var defaults = {
        'pageNo': 1,
        'pageSize': KISP.data('pager').size,
        'keyword': '',
    };


    function normalize(opt) {
        switch (typeof opt) {
            case 'number': //重载 normalize(pageNo)
                opt = { 'pageNo': opt };
                break;

            case 'string': //重载 normalize(keyword)
                opt = { 'keyword': opt, 'pageNo': 1, };
                break;
        }

        //注意，这里有记忆功能，上次的值会给记录下
        opt = Object.assign(defaults, opt);

        return opt;
    }



    
    


    return {
        on: emitter.on.bind(emitter),

        /**
        * 获取指定条件的记录列表。
        *   opt = {
        *       pageNo: 1,      //可选，当前页码。 如果不指定
        *       pageSize: 10,   //可选，分页大小。
        *       keyword: '',    //可选，要搜索的关键词。
        *   };
        */
        get: function (opt) {
            opt = normalize(opt);

            var api = new API('MarkDoc.page');

            api.on({
                'request': function () {
                    loading = loading || KISP.create('Loading', {
                        mask: 0,
                    });

                    loading.show('加载中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {

                    emitter.fire('success', 'get', [{
                        'list': data.list,
                        'total': data.total,    //总记录数。
                        'no': opt.pageNo,       //页码。
                        'size': opt.pageSize,   //分页大小。
                    }]);
                },

                'fail': function (code, msg, json, xhr) {
                    KISP.alert('获取文档列表失败: {0}', msg);
                },

                'error': function (code, msg, json, xhr) {
                    KISP.alert('获取文档列表错误: 网络繁忙，请稍候再试');
                },
            });

            api.post(opt);

        },

        /**
        * 移除指定 id 的记录。
        */
        delete: function (id) {

            var api = new API('MarkDoc.delete');

            api.on({
                'request': function () {
                    loading = loading || KISP.create('Loading');
                    loading.show('删除中...');
                },

                'response': function () {
                    loading.hide();
                },

                'success': function (data, json, xhr) {
                    var list = data;
                    emitter.fire('success', 'delete', [list]);
                },

                'fail': function (code, msg, json, xhr) {
                    KISP.alert('删除文档失败: {0}', msg);
                },
                'error': function (code, msg, json, xhr) {
                    KISP.alert('删除文档错误: 网络繁忙，请稍候再试');
                },
            });

            api.get({
                'id': id,
            });
        },
    };


});
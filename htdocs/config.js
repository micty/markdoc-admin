
(function () {

    //业务层自定义的数据。

    KISP.data({
        'pager': {
            size: 20,    //分页大小,
        },

        'demo': {
            //url: 'http://172.18.2.149/',
            url: 'http://www.definejs.com/',
            file: '{url}#!{file}',
        },
    });



    // KISP 内部模块所需要的默认配置
    KISP.config({
        'API': {
            //url: 'http://172.18.2.149:8089/',
            url: 'http://120.76.123.129:8089/',
            ext: '',
        },
        'App': {
            animated: false,
        },
        'App/Nav': {
            hash: false,
        },

        'LocalStorage': {
            name: 'markdoc-admin',
        },
        'SessionStorage': {
            name: 'markdoc-admin',
        },

        'Proxy': {
            base: 'api/',
        },

        'Mask': {
            'opacity': 0.5,
        },
    });








    /**weber.debug.begin*/ //------------------------------------------------------------------------>

    // 开发过程中用到的配置，正式发布后可去掉

    KISP.data({
        'demo': {
            url: 'http://localhost/Studio/markdoc/htdocs/',
        },
    });


    KISP.config({  // KISP 内部模块所需要的默认配置
        'API': {
            url: 'http://localhost:8089/',

            //在开发阶段，为了防止后台过快的返回数据而显示让某些需要显示
            //"数据加载中"的效果不明显， 这里强行加上一个随机延迟时间，
            //以模拟真实的慢速网络， 发布后，应该去掉该配置。
            delay: {
                min: 400,
                max: 1200,
            },
        },
        'Proxy': {
            delay: {
                min: 500,
                max: 1500
            },
        },
    });


    var alert = window.alert;

    window.alert = function () {
        var $ = KISP.require('$');

        var args = [...arguments].map(function (item, index) {
            if (typeof item == 'object') {
                return JSON.stringify(item, null, 4);
            }

            return String(item);
        });

        alert(args.join(', '));
    };


    // <----------------------------------------------------------------------------------------
    /**weber.debug.end*/




})();


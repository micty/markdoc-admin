


module.exports = {
    //网站的根目录。 相对于 bin 目录。
    htdocs: '../htdocs/',

    //样式目录。 相对于网站根目录。
    css: 'style/css/',      

    //网站地址的模板。
    url: 'http://{host}/{dir}index.html',

    //快速打开网站的二维码。
    qr: {
        width: 380,
        url: 'http://qr.topscan.com/api.php',
    },

    //输出日志文件。
    console: {
        file: 'console.log',    //如果指定则输出日出文件。
        timestamp: true,        //是否自动加上时间戳。
    },

    //监控器。
    watcher: {
        debounceDelay: 500,
        maxListeners: 9999,

        /**
        * 监控的轮询时间间隔。 
        * 如果设置得太小而文件数过多，则 CPU 占用很高。 
        * 比如设为 100 时， 2000 多个文件可高达 60%。
        */
        interval: 300,
    },

    //渲染生成资源标签所需要的 html 模板。
    templates: {
        css: '<link rel="stylesheet" href="{href}"{props} />',
        js: '<script src="{href}"{props}></script>',
    },

    //标记批量动态引入 less、html、js 的区块的开始标记和结束标记。 
    tags: {
        less: {
            begin: '<!--weber.less.begin-->',
            end: '<!--weber.less.end-->',
        },
        html: {
            begin: '<!--weber.html.begin-->',
            end: '<!--weber.html.end-->',
        },
        js: {
            begin: '<!--weber.js.begin-->',
            end: '<!--weber.js.end-->',
        },
    },


    //同时要指定该配置节点，以在无 pack 版本的命令中把之前生成的 packages 目录等资源清掉。
    packages: {
        patterns: [],   //通过指定 patterns 为 [] 或去掉，可以禁用分包打包功能。
        dest: {
            dir: 'packages/items/',         //分包资源输出的目录。
            file: 'packages/all.json',      //总包输出的文件。 必须要与 KISP 的配置一致。
        },
    },

    //通过指定 masters 为 null 或去掉，可以禁用母版页功能。
    masters: {
        patterns: ['**/*.master.html'],
        dest: '{name}.html',
    },

};
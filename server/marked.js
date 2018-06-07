
var launch = require('./launch.js'); //define.js 的启动文件。
var config = require('./config.js'); //全局的配置文件。
var marked = require('marked');
var hljs = require('highlight.js');
var cheerio = require('cheerio');

//启动程序。
launch(function (require, module, exports) {
    
    //console.log(config)

    var defineJS = require('$');

    var File = require('File');
    var $String = defineJS.require('String');



    var file = config.dir + 'panoramio.md';
    var file = 'marked.md';

    var content = File.read(file);
    var sample = File.read('sample.html');


    var html = marked(content);

    html = $String.format(sample, {
        'content': html,
    });

    var $ = cheerio.load(html);

    $('pre>code').each(function () {

        var code = $(this).html();
        console.log(code);

    });
    

    //var info = hljs.highlight('javascript', code);
    //console.log(info)

    File.write('marked.html', html);

});
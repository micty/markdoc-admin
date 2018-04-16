/**
* 路径模式工具。
*/
define('Patterns', function (require, module, exports) {
    var path = require('path');
    var minimatch = require('minimatch');
    

    //获取指定模式下的所有文件列表。
    function getFiles(patterns) {
        if (!patterns.length) {
            return [];
        }


        var files = [];

        patterns.forEach(function (item, index) {
            if (item.startsWith('!')) { // 以 '!' 开头的，如 '!../htdocs/test.js'
                return;
            }

            var index = item.indexOf('**/');
            if (index < 0) {
                index = item.indexOf('*');
            }


            //不存在 '**/' 或 '*'，则是一个普通的文件。
            if (index < 0) {
                files.push(item);
                return;
            }

            //'views/**/*.js',
            //'views/*.html',

            //截取 `**/` 或 `*` 之前的部分当作目录。
            var dir = item.slice(0, index);
            var Directory = require('Directory');
            var list = Directory.getFiles(dir);

            files = files.concat(list);
        });


        files = exports.match(patterns, files);

        return files;
    }



    return exports = {

        /**
        * 使用指定的模式去匹配指定的文件列表。
        * 即从文件列表中搜索出符合指定模式的子集合。
        */
        match: function (patterns, files) {
            var includes = {};
            var excludes = {};

            patterns.forEach(function (pattern) {
                var excluded = pattern.startsWith('!');
                var obj = excluded ? excludes : includes;

                if (excluded) {
                    pattern = pattern.slice(1);
                }

                files.forEach(function (file) {
                    var matched = minimatch(file, pattern);

                    if (matched) {
                        obj[file] = true;
                    }

                });
            });

            var matches = Object.keys(includes).filter(function (file) {
                return !(file in excludes);
            });

            return matches;

        },

        /**
        * 把一个目录和模式列表组合成一个新的模式列表。
        * 已重载 join(dir, file);
        * 已重载 join(dir, patterns);
        */
        join: function (dir, patterns) {
            //重载 join(dir, file); 
            if (!Array.isArray(patterns)) {
                patterns = [patterns];
            }

            patterns = patterns.map(function (item, index) {

                //如 '!foo/bar/index.js'
                if (item.startsWith('!')) {
                    item = '!' + path.join(dir, item.slice(1));
                }
                else {
                    item = path.join(dir, item);
                }

                //把 `\` 统一换成 `/`
                item = item.replace(/\\/g, '/');


                //以 '/' 结束，是个目录
                if (item.endsWith('/')) {
                    item += '**/*';
                }

                return item;
            });

            patterns = [...new Set(patterns)]; //去重。

            return patterns;

        },


        /**
        * 获取指定模式下的所有文件列表。
        * 已重载 getFiles(patterns);
        * 已重载 getFiles(patterns, excludes);
        * 已重载 getFiles(dir, patterns);
        * 已重载 getFiles(dir, patterns, excludes);
        */
        getFiles: function (dir, patterns, excludes) {
            //重载 getFiles(patterns, excludes);
            if (Array.isArray(dir)) {
                excludes = patterns;
                patterns = dir;
                dir = '';
            }

            patterns = exports.join(dir, patterns);

            var files = getFiles(patterns);

            //没有需要排除的。
            if (!excludes || !excludes.length) {
                return files;
            }
          
            excludes = exports.join(dir, excludes);
            excludes = getFiles(excludes);

            //没有需要排除的。
            if (!excludes.length) {
                return files;
            }


            files = files.filter(function (file) {
                return !excludes.includes(file);
            });

            return files;

        },

    };

});

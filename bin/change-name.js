

/**
* 提供顶级模块重命名的命令。
* 该命令会自动搜索所有 define() 的顶级模块，并重命名为新的模块名。
* 如使用命令 `node change-name User Users`，
* 可以把 `User` 模块及其子模块重命名为 `Users`，并且自动修正引用了这些模块的其它模块。
*/

start();


function start() {
    var master = require('web-master');
    var defaults = require('./config/defaults.js');
    var args = [...process.argv];
    var oldName = args[2];
    var newName = args[3];


    master.launch(function (require, module) {
        if (!oldName) {
            console.log('请指定要替换的原名称。'.bgRed);
            return;
        }

        if (!newName) {
            console.log('请指定新的目标名称。'.bgRed);
            return;
        }

        if (oldName == newName) {
            console.log('新的目标名称不能与原名称相同。'.bgRed);
            return;
        }

        var Patterns = require('Patterns');
        var File = require('File');

        var files = Patterns.getFiles(defaults.htdocs, [
            '**/*.js',
        ]);


        var list = [
            //单引号的顶级模块。
            {
                src: "define('" + oldName + "',",       //如 `define('User',`
                target: "define('" + newName + "',",    //如 `define('Users',`
                isTop: true,                           //是否为顶级模块的定义文件。
            },
            //双引号的顶级模块。
            {
                src: 'define("' + oldName + '",',       //如 `define("User",`
                target: 'define("' + newName + '",',    //如 `define("Users",`
                isTop: true,                           //是否为顶级模块的定义文件。
            },
            //单引号的下级模块。
            {
                src: "define('" + oldName + "/",       //如 `define('User/`
                target: "define('" + newName + "/",    //如 `define('Users/`
            },
            //双引号的下级模块。
            {
                src: 'define("' + oldName + '/',       //如 `define("User/`
                target: 'define("' + newName + '/',    //如 `define("Users/`
            },

            //业务层使用单引号对顶级模块的引用。 这里不修正变量名，因为变量名的引用关系很复杂。
            {
                src: "require('" + oldName + "');",       //如 `var User = require('User');`
                target: "require('" + newName + "');",    //如 `var User = require('Users');`
            },

            //业务层使用双引号对顶级模块的引用。 这里不修正变量名，因为变量名的引用关系很复杂。
            {
                src: 'require("' + oldName + '");',
                target: 'require("' + newName + '");',
            },
        ];



        files.forEach(function (file) {
            var content = File.read(file);
            var origin = content;
            var isTopFile = false;          //是否为顶级模块的定义文件。 只有一个。 先假设不是。

            list.forEach(function (item) {
                if (isTopFile) { //因为开始时假设不是，这里却为 true，说明已处理过了。
                    return;
                }


                isTopFile = item.isTop && content.includes(item.src);
                content = content.replace(item.src, item.target);

            });

            //发生了改变，回写。
            if (content != origin) {

                if (isTopFile) {
                    File.delete(file);  //先删除旧文件。
                    file = file.replace(oldName + '.js', newName + '.js');

                }

                File.write(file, content);
            }

        });

    });


}
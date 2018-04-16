
/**
* 这里统一存放 ES6 的新特性新方法，以兼容一些旧浏览器。
* 这是临时方案，终极方案是让用户升级浏览器。
*/

if (!Object.entries) {

    Object.entries = function (obj) {
        if (obj == null) {
            throw new Error('Cannot convert undefined or null to object');
        }

        var list = [];

        for (var key in obj) {
            var value = obj[key];
            list.push([key, value]);
        }

        return list;
    };
}
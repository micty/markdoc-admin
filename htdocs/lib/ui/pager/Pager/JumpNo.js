
define('Pager/JumpNo', function (require, module) {

    var $ = require('$');



    /**
    * 根据总页数、当前页和上一页预测出要跳转的页码。
    * @param {number} count 总页数。
    * @param {number} cno 当前激活的页码。
    * @param {number} last 上一页的页码。
    * @return {number} 返回一个跳转的页码。
    */
    function get(count, cno, last) {

        if (count <= 1) { // 0 或 1
            return count;
        }

        if (cno == count) {
            return count - 1;
        }

        var no;

        if (cno > last) {
            no = cno + 1;
        }
        else {
            no = cno - 1;
            if (no < 1) {
                no = 2;
            }
        }

        return no;

    }



    return {
        'get': get,
    };




});


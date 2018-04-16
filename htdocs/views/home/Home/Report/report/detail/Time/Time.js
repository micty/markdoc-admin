


define('/Home/Report/ReportDetail/List/Time', function () {

    var now = new Date();
    var nowDayOfWeek = now.getDay();
    nowDayOfWeek == 0 ? 7 : nowDayOfWeek;
    var nowDay = now.getDate();
    var nowMonth = now.getMonth();
    var nowYear = now.getFullYear();

    function formatDate(date) {
        date?date:new Date();
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();

        if (mymonth < 10) {
            mymonth = "0" + mymonth;
        }
        if (myweekday < 10) {
            myweekday = "0" + myweekday;
        }
        return (myyear + "-" + mymonth + "-" + myweekday);
    }



    return {
        today: function () {
            return formatDate(now);
        },
        week: function () {
            var nowMonth = now.getMonth();     //获取本周开始时间时需考虑小一个月的特殊情况

            if (nowDay - nowDayOfWeek <= 0) {
                nowMonth = nowMonth - 1;
            }
            var start = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
            return formatDate(start);

        },
        month: function () {
            var start = new Date(nowYear, nowMonth, 1);
            return formatDate(start);
        },
        year: function () {
            var start = new Date(nowYear, 1, 1);
            return formatDate(start);
        },

    };
});

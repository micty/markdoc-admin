

define('Pager/Events', function (require, module) {

    
    return {

        bind: function (meta) {

            var txtId = meta.txtId;
            var sizerId = meta.sizerId;
            var pager = meta.this;


            function jump() {
                var txt = document.getElementById(txtId);
                var no = +txt.value;
                pager.to(no);
            }


            //点击页码按钮
            meta.$.on('click', '[data-no]', function () {
                var li = this;
                if ($(li).hasClass('active')) {
                    return;
                }

                var no = +li.getAttribute('data-no');

                pager.to(no);
            });


            //点击确定。
            meta.$.on('click', '[data-button="to"]', function () {
                jump();
            });


            //点击上一页。
            meta.$.on('click', '[data-button="previous"]', function () {
                pager.previous();
            });

            //点击下一页。
            meta.$.on('click', '[data-button="next"]', function () {
                pager.next();
            });

            //点击每页大小。
            meta.$.on('change', '#' + sizerId, function () {
                var index = this.selectedIndex;
                var size = meta.sizes[index];

                pager.render({ 'size': size, 'no': 1, });
                pager.to(1);
            });


            //页面输入框中的键盘过滤。
            meta.$.on('keydown', '#' + txtId, function (event) {
                var keyCode = event.keyCode;
                console.log(keyCode);

                if (keyCode == 13) {
                    jump();
                    return;
                }

                var isNumber =
                        (48 <= keyCode && keyCode <= 48 + 9) || //主键盘的 0 - 9
                        (96 <= keyCode && keyCode <= 96 + 9);   //数字键盘的 0 - 9

                var isControl =
                        keyCode == 8 ||     //回格键。
                        keyCode == 37 ||    //向左箭头。
                        keyCode == 39 ||    //向右箭头。
                        keyCode == 46;      //Delete 键

                //F1 - F12 键。
                var isFn = 112 <= keyCode && keyCode <= 112 + 11;
                var isValid = isNumber || isControl || isFn;

                if (!isValid) {
                    event.preventDefault();
                    return;
                }

            });
        },

    };


});



define('ImageViewer/Size', function (require, module, exports) {

    return {

        get: function (img) {
            var width = img.width;
            var height = img.height;

            if (width > window.screen.width * 0.6) {
                width = window.screen.width * 0.6;
                height = width / img.width * img.height;
            }
            else if (height > window.screen.height * 0.6) {
                height = window.screen.height * 0.6;
                width = height / img.height * img.width;
            }
            return {
                width: width,
                height: height,
            }
        },

    };
});

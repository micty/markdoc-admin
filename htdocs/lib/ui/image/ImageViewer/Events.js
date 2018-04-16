
define('ImageViewer/Events', function (require, module, exports) {

    var KISP = require('KISP');
    var $ = require('$');

    var imgWidth = 0;
    var imgHeight = 0;


    return {
        bind: function (meta) {

            var emitter = meta.emitter;
            var self = meta.this;

            $('#' + meta.id).on('click', 'span', function () {
                self.close();
                meta.$img.css({
                    'margin-left': 0,
                    'margin-top': 0,
                });

            });


            self.$.click(function () {
                if (meta.volatile && meta.isClick) {
                    self.close();
                    meta.$img.css({
                        'margin-left': 0,
                        'margin-top': 0,
                    });

                }
            });

            var container = document.querySelector('#' + meta.id);
            var img = document.querySelector('#' + meta.id + '-img');

            imgWidth = imgWidth || parseFloat(img.style.width);
            imgHeight = imgHeight || parseFloat(img.style.height);

            container.addEventListener('mousewheel', function (event) {

                if (event.wheelDelta > 0 && parseFloat(img.style.width) < imgWidth * 3 && parseFloat(img.style.width) < 1940) {
                    img.style.width = parseFloat(img.style.width) + imgWidth * 0.1 + 'px';
                    img.style.height = imgHeight * parseFloat(img.style.width) / imgWidth + 'px';
                }
                if (event.wheelDelta < 0 && parseFloat(img.style.width) > imgWidth * 0.2) {
                    img.style.width = parseFloat(img.style.width) - imgWidth * 0.1 + 'px';
                    img.style.height = imgHeight * parseFloat(img.style.width) / imgWidth + 'px';
                }

                img.style.marginLeft = (window.innerWidth - parseFloat(img.style.width)) / 2 + 'px';
                img.style.marginTop = (window.innerHeight - parseFloat(img.style.height)) / 2 + 'px';

            });

            
        },
        set: function (width, height) {
            imgWidth = width;
            imgHeight = height;
        }

    };
});


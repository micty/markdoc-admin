

define('ImageViewer/Template', function (require, module) {

    var $ = require('$');
    var Template = KISP.require('Template');

    var tpl = new Template('#tpl-ImageViewer');

    tpl.process({

        '': function (data) {

            return {
                'id': data.id,
                'src': data.src,
                'cssClass': data.cssClass,
                'style': data.style,
                'width': data.width,
                'height': data.height,
                'alt': data.alt,
                'z-index': data['z-index'],
                'img-id': data.id + '-img',
            };
        },
        
    });


    return tpl;



});


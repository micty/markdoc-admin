
KISP.view('/DocHelp', function (require, module, view) {
    var KISP = require('KISP');

    var Editor = module.require('Editor');
    var Preview = module.require('Preview');
   


    view.on('init', function () {
       

        Editor.on({
            'scroll': function (info) {
                Preview.scroll(info);
            },
            'content': function (content) { //填充内容、修改内容时，都会触发。
              
                Preview.render({
                    'content': content,
                    'ext': '.md',
                });
            },
           
        });

        Preview.on({
            'render': function (info) {
               
            },
            'scroll': function (info) {
                Editor.scroll(info);
            },
        });

      

       
    });


    /**
    * 渲染内容。
    */
    view.on('render', function () {
       
        Editor.render();;

    });

  

});

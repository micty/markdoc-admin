
KISP.view('/Error', function (require, module, view) {

    var KISP = require('KISP');

 

    view.on('init', function () {

  
    });


    view.on('render', function (page, ex) {
        view.fill({
            'name': page.name,
            'ex': ex.stack,
        });


        console.log(ex);

    });




});

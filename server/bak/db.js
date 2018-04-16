


var launch = require('./launch.js');


launch(function (require, module, exports) {
    var $ = require('$');
    console.log($);

    var DataBase = require('DataBase');


    var db = new DataBase('Land', [
        { name: 'datetime', },

        { name: 'number', required: true, alias: '土地挂牌编号', },
        { name: 'numberDesc', },
        { name: 'town', },
        { name: 'townDesc', },
        { name: 'location', },
        { name: 'locationDesc', },
        { name: 'size', type: 'number', },
        { name: 'sizeDesc', },
        { name: 'use', },
        { name: 'useDesc', },
        { name: 'diy', type: 'boolean', },
        { name: 'diyDesc', },
        { name: 'residenceSize', type: 'number', },
        { name: 'residenceSizeDesc', },
        { name: 'commerceSize', type: 'number', },
        { name: 'commerceSizeDesc', },
        { name: 'officeSize', type: 'number', },
        { name: 'officeSizeDesc', },
        { name: 'otherSize', type: 'number', },
        { name: 'otherSizeDesc', },
        { name: 'parkSize', type: 'number', },
        { name: 'parkSizeDesc', },
        { name: 'otherSize1', type: 'number', },
        { name: 'otherSize1Desc', },
        { name: 'winner', },
        { name: 'winnerDesc', },
        { name: 'price', type: 'number', },
        { name: 'priceDesc', },
        { name: 'date', },
        { name: 'dateDesc', },
        { name: 'contract', },
        { name: 'contractDesc', },
        { name: 'license', },
        { name: 'licenseDesc', },
    ]);

    db.add({
        number: 'aaaaaaaaaaaaaaaa',

    });

});


define('Pager/Sizes', function (require, module) {

    
    return {

        get: function (sizes, size) {
            size = size || sizes[0];
            sizes = [size, ...sizes];
            sizes = [...new Set(sizes)];

            sizes.sort(function (x, y) {
                return x > y ? 1 : -1;
            });

            return sizes;
        },

    };


});


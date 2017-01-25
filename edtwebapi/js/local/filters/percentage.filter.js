app.filter('percentage',  function ($filter) {
    return function (input, decimals) {        
        return input.toFixed(decimals) + '%';
    };
});
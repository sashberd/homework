app.filter('html', ['$sce', function ($sce) {
    return function (text) {       
        var result=text;
        try{
            result=$sce.trustAsHtml(text);
        }
        catch (ex) { }
        return result;
    };
}]);
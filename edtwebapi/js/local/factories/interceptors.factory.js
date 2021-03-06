﻿app.factory("interceptors", function () {

    return {

        // if beforeSend is defined call it
        'request': function (request) {
            
            if (request.beforeSend) {
                
                request.beforeSend();
            }
            return request;
        },


        // if complete is defined call it
        'response': function (response) {

            if (response.config.complete)
                response.config.complete(response);

            return response;
        }
    };

});

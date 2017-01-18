app.factory('$abstractFactory', function ($api, localStorageService) {

    return {
        /**
         * return vehilces list from server side
         */
        getVehicleList: function () {
            return $api.sendAPIRequest('Map', 'GetUserVehiclesInfo', localStorageService.get('$T')).then(function (response) { return response.data });
        },
        /**
         * return groups defined for logged in user
         * @returns {type} 
         */
        getGroupsData: function () {
            return $api.sendAPIRequest('Map', 'GetUserGroupsData', localStorageService.get('$T'));
        },
    }
});
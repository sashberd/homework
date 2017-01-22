app.factory('$mapFactory', function ($commonUtils, $api, localStorageService, leafletData, $filter, uiGridConstants, $timeout, ivhTreeviewMgr) {

    return {
        /**
         * return vehilces list from server side
         */
        //getVehicleList: function () {
        //    return $api.sendAPIRequest('Map', 'GetUserVehiclesInfo', localStorageService.get('$T')).then(function (response) { return response.data });
        //},
        /**
         * returns map data by provided vehicle list
         * @param {type} $vehiclesList
         */
        getMapData: function ($vehiclesList) {
            var obj = localStorageService.get('$T');
            obj.vehicleids = $vehiclesList.map(function (item) { return item.VEHICLE_ID }).join(',');
            return $api.sendAPIRequest('Map', 'GetMapData', obj).then(function (response) { return response.data });
        },
        
        /**
         * calculates current filter car label
         * @param {type} state
         * @param {type} item
         * @returns {type} 
         */
        carsCountFunction: function (state, item) {
            if (null != state && typeof state === 'object' && Object.prototype.toString.call(state) === '[object Object]') {
                var temp = state;
                state = item;
                item = temp;
            }
            return (item.Vehicle_State == state && item.DEVICE_TYPE_NUMBER !== '30' && state != 4) || (state == 4 && item.ONLINE_STATUS == 4);
        },
        /**
         * returns leaflet foramtted map data
         * @param {type} $mapData
         * @param {type} $scope
         * @returns {type} 
         */
        buildMapData: function ($mapData, $scope) {
            var bounds = $commonUtils.refitKeys(new L.LatLngBounds($mapData.filter(function (item) { return item.VEHICLE_LATITUDE && item.VEHICLE_LONGITUDE }).map(function (item) { return [item.VEHICLE_LATITUDE, item.VEHICLE_LONGITUDE] })), { '_northEast': 'northEast', '_southWest': 'southWest' });
            //Object.renameProperty(bounds, '_northEast', 'northEast');
            //Object.renameProperty(bounds, '_southWest', 'southWest');            

            var markers = $mapData.map(function (item) {
                return {
                    lat: item.VEHICLE_LATITUDE,
                    lng: item.VEHICLE_LONGITUDE,
                    label: {
                        message: item.VEHICLE_LABEL,
                        options: {
                            noHide: true
                        }
                    }
                }
            }).reduce(function (o, v, i) {
                o[i] = v;
                return o;
            }, {});
            var cluster = L.markerClusterGroup();
            var markers = $mapData.map(function (item) {
                return L.marker([item.VEHICLE_LATITUDE, item.VEHICLE_LONGITUDE], {
                    icon: L.icon({
                        iconUrl: 'js/dist/css/images/' + item.VEHICLE_TYPE_IMAGE_FILENAME.toLowerCase().replace(/\d+/, ''),
                        iconSize: [32, 32],
                        //iconAnchor: [22, 94],
                        //popupAnchor: [-3, -76],
                        //shadowUrl: 'js/grunt/dist/images/marker-shadow.png',
                        //shadowSize: [32, 32],
                        //shadowAnchor: [22, 94]
                    })
                }).bindTooltip(item.VEHICLE_LABEL,
                {
                    permanent: true,
                    direction: 'bottom',
                    offset: [5, 10]
                });
            }).forEach(function (item) {
                cluster.addLayer(item);
            });

            leafletData.getMap().then(function (map) {
                Object.values(map._layers).filter(function (layer) { return !(layer instanceof L.GridLayer) }).forEach(function (item) {
                    if (map._layers[item._leaflet_id]) {
                        map._layers[item._leaflet_id].remove();
                        delete map._layers[item._leaflet_id];
                    }
                });

                map.addLayer(cluster);
                cluster.refreshClusters();
            });

            var leafletOptions = {
                //These should reduce memory usage
                unloadInvisibleTiles: true,
                updateWhenIdle: true,
                //reuseTiles: true
            };

            var layers = this.getMapLayers();
            return { bounds: bounds, center: {}, layers: layers }
        },
        /**
         * returns row status
         * @param {type} grid
         * @param {type} row
         * @returns {type} 
         */
        getRowStatus: function (grid, row) {
            var result = '';
            var currentStatus = row.entity.ONLINE_STATUS;
            switch (currentStatus) {
                case 1:
                    result = 'carInMotionLight';
                    break;
                case 2:
                    result = 'carInIdleLight';
                    break;
                case 4:
                    result = 'carAlertLight';
                    break;
            }
            return result;
        },
        /**
         * returns rows tooltip by row status
         * @param {type} grid
         * @param {type} row
         * @returns {type} 
         */
        getRawTooltip: function (grid, row) {
            var result = 'Engine off';
            var currentStatus = row.entity.ONLINE_STATUS;
            switch (currentStatus) {
                case 1:
                    result = 'In motion';
                    break;
                case 2:
                    result = 'In idle';
                    break;
                case 4:
                    result = 'Alert';
                    break;
            }
            return result;
        },
        /**
         * promise for class definition in ui-grid. returns font color class by condition
         * @param {type} grid
         * @param {type} row
         * @param {type} col
         * @param {type} rowIndex
         * @param {type} colIndex
         * @returns {type} 
         */
        getTimeColumnCellClass: function (grid, row, col, rowIndex, colIndex) {
            var result = 'alert-no';
            if (row.entity.Event_Time && row.entity.Vehicle_State < 3) {               
                var totalDiffHours = Math.abs(new Date() - Date.parse(row.entity.Event_Time)) / 36e5;
                switch (row.entity.DEVICE_TYPE_NUMBER) {
                    case '15':
                        if ($commonUtils.numberInRange(totalDiffHours, 72, 168)) {
                            return 'alert-ominous';
                        } else if (totalDiffHours > 168) {
                            return 'alert-danger'
                        }
                        break;
                    case '31':
                        if ($commonUtils.numberInRange(totalDiffHours, 24, 48)) {
                            return 'alert-ominous';
                        } else if (totalDiffHours > 48) {
                            return 'alert-danger'
                        }
                        break;
                    default:
                        if ($commonUtils.numberInRange(totalDiffHours, 2, 24)) {
                            return 'alert-ominous';
                        } else if (totalDiffHours > 24) {
                            return 'alert-danger'
                        }
                        break;
                }
            }
            return result;
        },
        /**
         * promise for class definition in ui-grid. returns font color class by condition
         * @param {type} grid
         * @param {type} row
         * @param {type} col
         * @param {type} rowIndex
         * @param {type} colIndex
         * @returns {type} 
         */
        getNicknameCellClass: function (grid, row, col, rowIndex, colIndex) {
            var result = 'alert-no';
            if (row.entity.Immobilizer_State && +row.entity.Immobilizer_State) {
                result = 'alert-danger';
            }
            return result;
        },
        /**
         * creates and returns layers for map
         * @returns {type} 
         */
        getMapLayers: function () {
            return {
                baselayers: {
                    // Google
                    google: {
                        name: 'Google',
                        type: 'google',
                        url: 'http://mt{s}.google.com/vt/lyrs=m@167000000&hl=iw&x={x}&y={y}&z={z}',
                        layerOptions: { minZoom: 0, maxZoom: 21 } || leafletOptions
                    },

                    // OSM1
                    ocm1: {
                        name: 'OSM1',
                        type: 'xyz',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        layerOptions: { minZoom: 0, maxZoom: 18, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' } || leafletOptions
                    },

                    //// OSM2
                    //ocm2:{
                    //    caption: 'OSM2', tooltip: 'OpenStreetMap Cycle',
                    //    tLayer: null,
                    //    tUrl: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                    //    tOptions: { subdomains: 'abc', minZoom: 0, maxZoom: 18 } || leafletOptions
                    //},

                    //// Bing
                    //bing:   {
                    //    caption: 'Bing', tooltip: 'Bing street map',
                    //    type: ENUM_LF_MAP_TYPES.Bing, BingType: 'r',
                    //    tLayer: null,
                    //    tOptions: { minZoom: 1, maxZoom: 20 } || leafletOptions
                    //},

                    //// Bing
                    //bing_sat:  {
                    //    caption: 'Bing Sat.', tooltip: 'Bing satellite',
                    //    type: ENUM_LF_MAP_TYPES.Bing, BingType: 'a',
                    //    tLayer: null,
                    //    tOptions: { minZoom: 1, maxZoom: 19 } || leafletOptions
                    //},

                    //// Bing
                    //bing_hyb :{
                    //    caption: 'Bing Hyb.', tooltip: 'Bing satellite with street names',
                    //    type: ENUM_LF_MAP_TYPES.Bing, BingType: 'h',
                    //    tLayer: null,
                    //    tOptions: { minZoom: 1, maxZoom: 19 } || leafletOptions
                    //},
                    //tomtom:{
                    //    caption: 'TomTom', tooltip: 'TomTom Maps',
                    //    tLayer: null,
                    //    tUrl: 'http://{s}.api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=vuhr55xbaumc49g69v7sq48n',
                    //    tOptions: { subdomains: 'abcd', minZoom: 0, maxZoom: 18 } || leafletOptions || { continuousWorld: false }
                    //},
                    //onemap:{
                    //    caption: 'OneMap', tooltip: 'OneMap Singapore',
                    //    tLayer: null,
                    //    tUrl: 'https://maps-{s}.onemap.sg/v3/Original/{z}/{x}/{y}.png',
                    //    tOptions: { subdomains: 'abc', minZoom: 11, maxZoom: 19 } || leafletOptions || { continuousWorld: false }
                    //}
                }
            }

        },
        /**
         * group fiiltering grid data
         * @param {type} selectedItem
         * @param {type} isSelected
         */
        filterByGroups: function (selectedItem, isSelected) {
            var $this = this;
            var getGroupsID = function (leaf) {
                if (leaf.children && leaf.children.length) {
                    leaf.children.forEach(function (child) {
                        getGroupsID(child)
                    });
                }
                if (isSelected) {
                    $this.filters.groupFilters.push(leaf.value);
                }
                else {
                    $this.filters.groupFilters = $this.filters.groupFilters.filter(function (item) { return item != leaf.value });
                }
            }
            getGroupsID(selectedItem);
            this.handleFiltering();

        },
        /**
         * vehicle filtering grid data
         * @param {type} item
         * @param {type} isSelected
         */
        filterByVehicles: function (item, isSelected) {

            var vehicleID = Object.prototype.toString.call(item.id) === '[object String]' ? parseInt(angular.element(item.id).find('label')[1].innerText) : item.id;
            if (isSelected) {
                this.filters.vehicleFilters.push(vehicleID);
            }
            else {
                this.filters.vehicleFilters = this.filters.vehicleFilters.filter(function (item) { return item != vehicleID });
            }
            this.handleFiltering()
        },
        /**
         * status filtering grid data
         * @param {type} status
         * @param {type} isSelected
         */
        filterByStatus: function (status, isSelected) {

            if (isSelected) {
                this.filters.statusFilters.push(status);
            }
            else {
                this.filters.statusFilters = this.filters.statusFilters.filter(function (item) { return item != status });
            }
            this.handleFiltering()
        },
        /**
         * handle all filtering in one callback function
         */
        handleFiltering: function () {
            this.gridOptions.isFiltered = true;
            this.hasFilters = true
            if (Object.values(this.filters).every(function (filter) { return $commonUtils.isObjectEmpty(filter) })) {
                this.gridOptions.isFiltered = false;
                this.hasFilters = false;
            }
            this.alertFilterSelected = false;
            this.inMotionFilterSelected = false;
            this.engineOffFilterSelected = false;
            this.idleFilterSelected = false;

            this.gridOptions.data = this.applyFiltersOnMapGrid(this.filters, this.vehiclesList);
        },
        /**
         * apply filters on map
         * @param {type} filters
         * @param {type} data
         * @returns {type} 
         */
        applyFiltersOnMapGrid: function (filters, data) {
            var results = [];
            var $this = this;
            if (filters.groupFilters.length) {
                data = data.filter(function (item) { return filters.groupFilters.some(function (filter) { return filter == item.GROUP_ID }) });
                this.calculateCarsLabels(data);
            }
            if (filters.vehicleFilters.length) {
                data = data.filter(function (item) { return filters.vehicleFilters.some(function (filter) { return filter == item.VEHICLE_BB_ID }) });
                this.calculateCarsLabels(data);
            }
            if (filters.statusFilters.length) {
                data = data.filter(function (item) { return filters.statusFilters.some($this.carsCountFunction.bind(this, item)) });
                filters.statusFilters.forEach(function (item) {
                    switch (item) {
                        case 1:
                            $this.inMotionFilterSelected = true;;
                            break;
                        case 2:
                            $this.idleFilterSelected = true;;
                            break;
                        case 3:
                            $this.engineOffFilterSelected = true;;
                            break;
                        case 4:
                            $this.alertFilterSelected = true;;
                            break;
                    }
                });
            }
            if (filters.textFilter.length) {
                data = data.filter(function (item) { return item.NICK_NAME.toLowerCase().indexOf(filters.textFilter.toLowerCase()) > -1 || item.DRIVER_NAME.toLowerCase().indexOf(filters.textFilter.toLowerCase()) > -1 });
                this.calculateCarsLabels(data);
            }
            return data;
        },
        /**
         * returnsdefinitions for map grid columns
         * @returns {type} 
         */
        getMapGridColumnsDefinition: function () {
            return [{
                name: 'Status',
                width: 60,
                enableSorting: false,
                cellTemplate:
                    '<div class="grid-tooltip" uib-tooltip={{grid.appScope.getRowTooltip(grid,row)}} tooltip-placement="top" tooltip-append-to-body="true"> '
                    + '<div  ng-class="\'carIdleLight \' +grid.appScope.getRowStatus(grid,row)" ></div></div>'
            },
          {
              name: 'Nickname',
              field: 'NICK_NAME',
              cellClass: this.getNicknameCellClass,
              sort: {
                  direction: uiGridConstants.ASC,
                  priority: 0
              }
          },
           {
               name: 'Time',
               field: 'Event_Time',
               cellFilter: 'date : "dd/MM HH:mm:ss"',
               width: 120,
               cellClass: this.getTimeColumnCellClass
           },
            {
                name: 'Driver name',
                field: 'DRIVER_NAME',
                cellClass: 'alert-no'
            },
             {
                 name: 'Event',
                 field: 'EVENT_NAME',
                 cellClass: 'alert-no',
                 width: '*'
             }
            ]
        },
        /**
         * select all vehicles callback
         * @param {type} $innerScope
         */
        selectAllVehicles: function ($innerScope) {
            var $this = this;
            $timeout(function ($innerScope) {
                $this.unselectAllVehicles($innerScope);
                $innerScope.open = false;
            }, 500, true, $innerScope);
        },
        /**
         * unselect all vehicles callback
         * @param {type} $innerScope
         */
        unselectAllVehicles: function ($innerScope) {
            var $this = this;
            $innerScope.deselectAll(true);
            this.vehiclesList.forEach(function (item) {
                $this.filterByVehicles({ id: item.VEHICLE_ID }, false);
            });
        },
        /**
         * select all groups callback
         */
        selectAllGroups: function () {
            ivhTreeviewMgr.selectAll(this.groupTreeData);
            this.popoverIsOpen = false;
            this.filterByGroups(this.groupTreeData[0], true);
            $timeout(function ($scope) {
                $scope.unselectAllGroups();
            }, 500, true, this);
        },
        /**
         * unselect all groups callback
         */
        unselectAllGroups: function () {
            ivhTreeviewMgr.deselectAll(this.groupTreeData);
            this.filterByGroups(this.groupTreeData[0], false);
        },
        /**
         * clear all filters fnction
         */
        clearAllFilters: function () {
            this.filters = { groupFilters: [], vehicleFilters: [], statusFilters: [], textFilter: '' }
            this.handleFiltering();
            this.applyFiltersOnMap();
            this.isMapFiltered = false;
            this.calculateCarsLabels(this.vehiclesList);
        },

    }

});
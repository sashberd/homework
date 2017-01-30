app.factory('$refuelsGridFactory', function ($commonUtils, uiGridValidateService, $api, localStorageService) {
    return {

        /**
         * Returns resolve for all configuarion resolves functions
         */
        getResolveSuccessFunction: function () {
            return function (response) {
                return response.data;
            }
        },
        /**
         * generates validators for ui-grid validation model
         */
        setValidators: function () {
            uiGridValidateService.setValidator('timeInputValidator',
                function (argument) {
                    return function (oldValue, newValue, rowEntity, colDef) {
                        var result = false;
                        if (newValue && $commonUtils.formatTime(newValue)) {
                            result = true;
                        }
                        return result;
                    };
                },
                function (argument) {
                    return 'The time format should be HH:mm';
                });

            uiGridValidateService.setValidator('emptyInputValidator',
                function (argument) {
                    return function (oldValue, newValue, rowEntity, colDef) {
                        var result = true;
                        if (newValue == null || typeof (newValue) === 'undefined') {
                            result = false;
                        }
                        return result;
                    };
                },
                function (argument) {
                    return 'Field can not be empty';
                });
        },
        /**
         * filters pumps data array for provided criteria from use input
         * @param {type} filterText
         */
        filterPumps: function (filterText) {
            return this.refuelsPumpsResolve.filter(function (pumpData) {
                return pumpData.ID.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                    pumpData.NAME.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
            });
        },
        /**
         * filters drivers data array for provided criteria from user input
         * @param {type} filterText
         */
        filterDrivers: function (filterText) {
            return this.driversResolve.filter(function (driverData) {
                return driverData.DriverBBID.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                    driverData.DriverName.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
            });
        },
        /**
         * filters tags data array for provided criteria from user input
         * @param {type} filterText
         */
        filterTags: function (filterText) {
            return this.searchTagsResolve.filter(function (tagData) {
                return tagData.V_BB_VEHICLE_ID.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                    tagData.ID.toLowerCase().indexOf(filterText.toLowerCase()) > -1;
            });
        },
        /**
         * determines if there are erors in user input search
         */
        checkSearchFilter: function () {
            var isValid = true;
            this.errorMessageData = {
                refuelAlertType: 'danger',
                refuelErrorMessage: ''
            };
            if (!this.pumpSelectedItem && !this.driverSelectedItem && !this.tagSelectedItem && !this.endDateTime && !this.startDateTime) {
                isValid = false;
                this.errorMessageData.refuelErrorMessage += 'Please select pump or driver or vehicle or range of dates in order to search';
            }
           
            if (this.endDateTime && this.startDateTime && moment(this.endDateTime).isAfter(moment(this.startDateTime).add(30,'d'))) {
                isValid = false;
                this.errorMessageData.refuelErrorMessage += 'The search period can not be more then 30 days';
            }

            if (isValid) {
                this.searchRefuels();
            }
        },
        /**
         * returns array of definitions of ui-grid
         * @param {type} $this
         * @returns {type} 
         */
        getGridColumnsDefinitions: function ($this) {
            return [{
                name: 'Transaction No.',
                field: 'E_ID',
                width: '*',
                enableCellEdit: false
            }, {
                name: 'Pump',
                field: 'PUMP_NAME',
                editDropdownOptionsArray: $this.refuelsPumpsResolve.slice(1),
                editDropdownValueLabel: 'LIST_ITEM_DISPLAY_NAME_ID',
                editDropdownIdLabel: 'NAME',
                editableCellTemplate: 'ui-grid/dropdownEditor',
            }, {
                name: 'Type and source',
                field: 'R_FUELING_METHOD_NAME',
                editDropdownOptionsArray: $this.typesAndSourcesResolve.slice(1),
                editDropdownValueLabel: 'PHRASE_NAME',
                editDropdownIdLabel: 'PHRASE_NAME',
                editableCellTemplate: 'ui-grid/dropdownEditor'
            }, {
                name: 'Date',
                field: 'R_DATE',
                cellFilter: 'date : "dd/MM/yyyy"',
                validators: {
                    emptyInputValidator: ''
                },
                width: 85,
                cellTemplate: 'ui-grid/cellTitleValidator',
                editableCellTemplate: '<div><form name="inputForm"><div ui-grid-edit-datepicker ng-class="\'colt\' + col.uid"></div></form></div>'
            }, {
                name: 'Time',
                field: 'R_TIME',
                width: 50,
                validators: {
                    emptyInputValidator: '',
                    timeInputValidator: '',
                    maxLength: 6
                },
                cellTemplate: 'ui-grid/cellTitleValidator'
            }, {
                name: '[ID] Driver name',
                field: 'DRIVER_NAME',
                editDropdownOptionsArray: $this.driversResolve,
                editDropdownValueLabel: 'DriverName',
                editDropdownIdLabel: 'DriverName',
                editableCellTemplate: 'ui-grid/dropdownEditor'
            }, {
                name: '[Tag ID] Vehicle',
                field: 'VEHICLE_NAME',
                editDropdownOptionsArray: $this.searchTagsResolve,
                editDropdownValueLabel: 'NAME',
                editDropdownIdLabel: 'NAME',
                editableCellTemplate: 'ui-grid/dropdownEditor'
            }, {
                name: 'Odometer',
                field: 'R_VEHICLE_ODOMETER',
                type: 'number',
                validators: {
                    emptyInputValidator: ''
                },
                cellTemplate: 'ui-grid/cellTitleValidator'
            }, {
                name: 'Quantity',
                field: 'R_TOTAL_COUNTER',
                width: '*',
                enableCellEdit: false
            }, {
                name: 'Start Counter',
                field: 'R_START_COUNTER',
                width: '*',
                enableCellEdit: false
            }, {
                name: 'End Counter',
                field: 'R_END_COUNTER',
                width: '*',
                enableCellEdit: false
            }, {
                name: 'Engine hours',
                field: 'R_ENGINE_HOURS',
                width: '*',
                type: 'number',
                validators: {
                    emptyInputValidator: ''
                },
                cellTemplate: 'ui-grid/cellTitleValidator'
            }, {
                name: 'Project',
                field: 'R_PROJECT'
            }, {
                name: 'Fuel supplier',
                field: 'FUEL_SUPPLIER',
                editDropdownOptionsArray: $this.fuelSupplierResolve,
                editDropdownValueLabel: 'LU_DESC',
                editDropdownIdLabel: 'LU_DESC',
                editableCellTemplate: 'ui-grid/dropdownEditor'
            }, {
                name: 'Doc. number',
                field: 'R_SUPPLIER_INVOICE_NUMBER',
                type: 'number'
            }, {
                name: 'Actual payment',
                field: 'R_ACTUAL_PAYMENT',
                type: 'number',
                validators: {
                    emptyInputValidator: ''
                },
                cellTemplate: 'ui-grid/cellTitleValidator'
            }]

        },
        /**
         * function that call server side and search refules data by provided user criteria
         */
        searchRefuels: function () {
            this.loading = true;
            this.gridOptions.data.length = 0;
            var $this = this;
            var refuelObject = {
                pumpID: this.pumpSelectedItem ? this.pumpSelectedItem.ID : '-1',
                fuelingMethod: this.selectedRefuelTypeAndSourceOption ? this.selectedRefuelTypeAndSourceOption.PHRASE_ID : '-1',
                endDate: this.endDateTime,
                startDate: this.startDateTime,
                startTime: this.startTime,
                endTime: this.endTime,
                tagID: this.tagSelectedItem ? this.tagSelectedItem.ID : '-1',
                driverID: this.driverSelectedItem ? this.driverSelectedItem.DriverBBID : '-1'
            }
            angular.extend(refuelObject, localStorageService.get('$T'));
            return $api.sendAPIRequest('Refuels', 'SearchRefuels', refuelObject).then(function (response) {
                if (response.data && response.data.length) {
                    $this.gridOptions.data = response.data.map(function (item, index) {
                        item.R_TIME = $commonUtils.extractTime(item.R_TIME);
                        item.sequence = index;
                        return item;
                    });
                } else {
                    $this.errorMessageData = {
                        refuelErrorMessage: 'No data was found by given criteria',
                        refuelAlertType: 'warning'
                    }
                }

            }, function (response) {
                $this.errorMessageData = {
                    refuelErrorMessage: 'There was a problem with search engine. Please concat administrator.',
                    refuelAlertType: 'danger'
                }
            }).finally(this.onPromiseComplete);
        },
        /**
         *  save row promise callback 
         * @param {type} rowEntity
         */
        saveRow: function (rowEntity) {
            var isValid = true;

            var $scope = this.grid.appScope;
            // check if the entity is invalid on any of its columns
            for (var i = 0; i < $scope.gridOptions.columnDefs.length; i++) {
                if (this.validate.isInvalid(rowEntity, $scope.gridOptions.columnDefs[i]) !== undefined) {
                    isValid = isValid && !this.validate.isInvalid(rowEntity, $scope.gridOptions.columnDefs[i]);
                }
            }
            if (isValid) {
                rowEntity.R_BB_PUMP_ID = $scope.pumpsData.filter(function (item) {
                    return item.NAME === rowEntity.PUMP_NAME
                })[0].ID;               
                rowEntity.R_TIME = moment(rowEntity.R_TIME, ['HH:mm']).toDate()// Date.parseExact(rowEntity.R_TIME, 'HH:mm');
                rowEntity.R_FUELING_METHOD = $scope.typesAndSourcesList.filter(function (item) {
                    return item.PHRASE_NAME === rowEntity.R_FUELING_METHOD_NAME
                })[0].ID;
                rowEntity.R_BB_DRIVER_ID = $scope.driversList.filter(function (item) {
                    var arr = rowEntity.DRIVER_NAME.split(' ');
                    if (arr.length > 2) {
                        arr.shift();
                    }
                    return arr.every(function (str) {
                        return item.DriverName.includes(str);
                    });
                })[0].DriverBBID;
                rowEntity.R_TAG_ID = $scope.searchTagsList.filter(function (item) {
                    var arr = rowEntity.VEHICLE_NAME.split(' ');
                    if (arr.length > 2) {
                        arr.shift();
                    }
                    return arr.every(function (str) {
                        return item.NAME.includes(str);
                    });
                })[0].ID;
                rowEntity.R_FUEL_SUPPLIER_ID = $scope.fuelSuppliersList.filter(function (item) {
                    return item.LU_DESC.indexOf(rowEntity.FUEL_SUPPLIER) > -1
                })[0].LU_ID;
                $scope.loading = true;
                this.rowEdit.setSavePromise(rowEntity, $api.sendAPIRequest('Refuels', 'UpdateRefuelRow', rowEntity, 'PUT').then($scope.showSuccessMessage, $scope.showErrorMessage).finally($scope.onPromiseComplete));
            }
            else {
                var promise = $q.defer();
                this.rowEdit.setSavePromise(rowEntity, promise.promise);
                promise.resolve();
                $scope.errorMessageData = {
                    refuelErrorMessage: 'Some values in grid are not well-formed',
                    refuelAlertType: 'danger'
                }
            }
        }
    }

});
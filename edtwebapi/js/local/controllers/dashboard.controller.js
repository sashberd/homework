app.controller('dashboardController', function ($scope, $dashboardFactory, $commonUtils, $uibModal, $vehiclesList, $mapFactory, $api, localStorageService) {

    this.changeClass = function (buttonName) {
        this[buttonName] = !this[buttonName]
    }
    this.isCustomHeaderOpen = true;
    this.vehicleList = $vehiclesList;
    this.dashboardController = $dashboardFactory;


    this.gridsterOptions = {
        margins: [20, 20],
        columns: 4,
        rows: 4,
        rowHeight: 300,
        colWidth: 300,
        draggable: {
            handle: 'h3'
        },
        sparse: true,
        //dynamicColumns: true, 
        //minWidthToAddANewColumn: 200,
        minRows: Math.ceil($commonUtils.getDeviceDimentions().height / 300)
    };
    this.widgets = $dashboardFactory.getWidgets();;
    this.createIdleTimeWidget = function () {
        var $this = this
        $dashboardFactory.getIdleTimeCurrentStatus().then(function (response) {
            var widgetObj = {
                id: $commonUtils.generateQuickGuid(),
                name: 'Idle time - current status',
                sizeY: 1,
                sizeX: 2,
                template: 'widgets/clock/clock.template.html',
                settingsTemplate: 'modal/commonSettings.template.html',
                widgetData: {}
            };

            Object.keys(response.data).forEach(function (item) {
                var obj = $dashboardFactory.genereteIdleStatusObject(item, response.data[item]);
                Object.defineProperty(widgetObj.widgetData, Object.keys(obj)[0], {
                    value: obj[Object.keys(obj)[0]],
                    writable: true,
                    enumerable: true,
                    configurable: true
                });

            });

            $this.widgets.push(widgetObj);
        });

    };

    this.createIrrigationMotorWidget = function () {

        this.widgets.push({
            id: $commonUtils.generateQuickGuid(),
            name: 'Irrigation motor',
            sizeY: 1,
            sizeX: 3,
            template: 'widgets/common.widget.template.html',//TODO to template
            settingsTemplate: 'widgets/dygraph/dygraph.irrigationMotor.settings.widget.template.html',
            widgetData: [],
            widgetOptions: [],
            widgetApi: [],
            controllerName: 'irrigationMotor.widget.settings.controller',
            controllerAsAlias: 'irrigationMotorWidgetSettingsCtrl',
            //onReadyCallback: function (scope, element) {
            //    setTimeout(function () {
            //        if (scope.data[0].extraValueUnit) {
            //            var currentLable = scope.chart.yAxis._axisLabel();
            //            scope.chart.yAxis.axisLabel(currentLable + ' (' + scope.data[0].extraValueUnit + ')');
            //        }

            //    }, 0);
            //},

        });
    }

    this.remove = function (widget) {
        this.widgets.splice(this.widgets.indexOf(widget), 1);       
    };

    this.openSettings = function (widget) {
        var $this = this;
        $uibModal.open({
            templateUrl: widget.settingsTemplate,
            controllerAs: widget.controllerAsAlias,
            bindToController: true,
            controller: widget.controllerName,
            resolve: {
                $widget: function () {
                    return widget;
                },
                $dashboardParent: function () { return $this; }
            }
        });
    };

    this.getIrrigationMotorData = function (filterObject, widgetId) {
        var $this = this;
        $api.sendAPIRequest('Dashboard', 'GetIrrigationMotorData', angular.extend(localStorageService.get('$T'), filterObject)).then(function (response) {
            var widget = $this.widgets.find(function (item) { return item.id === widgetId });
            $dashboardFactory.emptyWidget(widget);

            var charts = $dashboardFactory.createCharts(widgetId, response.data);

            response.data.IrrigationMotorData.forEach(function (item, index) {

                var eventDate = moment(item.DATE_TIME);
                if (!$commonUtils.checkIfDefined(item.RPM, true)) {
                    charts.rmpData.values.push({ date: eventDate, value: item.RPM })
                }
                if (!$commonUtils.checkIfDefined(item.FUEL_LEVEL_PCT)) {
                    charts.fuelData.values.push({
                        date: eventDate, value: item.FUEL_LEVEL_PCT, extraValue: item.FUEL_LEVEL_QTY
                    });
                }
                if (!$commonUtils.checkIfDefined(item.WATER_FLOW_L_PER_MIN)) {
                    charts.waterData.values.push({ date: eventDate, value: item.WATER_FLOW_L_PER_MIN });
                }
                if (!$commonUtils.checkIfDefined(item.PSI)) {
                    charts.psiData.values.push({ date: eventDate, value: item.PSI });
                }
                if (!$commonUtils.checkIfDefined(item.ENGINE_HOURS)) {
                    charts.engineHoursData.values.push({ date: eventDate, value: item.ENGINE_HOURS });
                }

                if (!$commonUtils.checkIfDefined(item.VOM_CURRENT_ODOMETER, true)) {
                    charts.odometerData.values.push({ date: eventDate, value: item.VOM_CURRENT_ODOMETER });
                }

            });
            
            var chartData = Object.values(charts)
            if (chartData.some(function (item) { return item.values.length })) {
                chartData.forEach(function (item, index, array) {                   
                    if (item.values.length) {
                        widget.widgetOptions.push($dashboardFactory.generateChartOptions(item));
                        widget.widgetData.push([item]);
                        widget.widgetApi.push({});
                    }
                });
            }
            else {
                widget.widgetOptions.push($dashboardFactory.generateChartOptions(chartData[0]));
                widget.widgetData.push([chartData[0]]);
                widget.widgetApi.push({});
            }
                  
            widget.template = 'widgets/dygraph/dygraph.irrigationMotor.widget.template.html';
            widget.sizeY = widget.widgetData.length;

            $this.showEmptySettingsMessage = true;
            $this.showSpinner = false;

           
        });
    }

    this.getWidgetOption = $dashboardFactory.getWidgetOption
    this.showEmptySettingsMessage = true;
    this.showSpinner = false;

});
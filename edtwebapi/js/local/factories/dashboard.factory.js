app.factory('$dashboardFactory', function ($commonUtils, $api, localStorageService, $uibModal, $abstractFactory, uiGridConstants, uiGridExporterConstants, $filter) {
    var widgets = [];
    var settingsData = {};

    return {
        /**
         * Getter for widget
         * @returns {Object} 
         */
        getWidgets: function () {
            return widgets;
        },
        /**
         * Getter and setter for settings data
         * @returns {Object} 
         */
        getSettingsData: function (widgetId) { return settingsData[widgetId] },
        setSettingsData: function (widgetId, _settingsData) { settingsData[widgetId] = _settingsData },
        /**************************************/
        /**
         * Calling api of idle status
         * @returns {Promise} 
         */
        getIdleTimeCurrentStatus: function (filters) {
            return $api.sendAPIRequest('Dashboard', 'GetIdleTimeCurrentStatus', angular.extend(localStorageService.get('$T'), filters));
        },
        /**
         * 
         * @param key string for create object with this key
         * @param totla seconds from server api
         * @returns {Object} 
         */
        genereteIdleStatusObject: function (key, seconds) {
            if (key.toLowerCase().indexOf('now') > -1) {
                key = 'now'
            }
            else if (key.toLowerCase().indexOf('today') > -1) {
                key = 'today'
            }
            else if (key.toLowerCase().indexOf('week') > -1) {
                key = 'week'
            }
            else if (key.toLowerCase().indexOf('month') > -1) {
                key = 'month'
            }
            var obj = {}
            obj[key] = {
                totalHours: $commonUtils.convertNumberToLeadingZero(Math.floor(seconds / 3600)),
                totalMinutes: $commonUtils.convertNumberToLeadingZero(Math.floor(seconds / 60) % 60),
                totalSeconds: $commonUtils.convertNumberToLeadingZero(seconds % 60),
            }
            return obj;
        },
        /**
         * Custom generate tooltip for charts and graths
         * @param Data of current point
         * @param current Chart Options
         * @returns {HTML string} 
         */
        generateTooltipHTML: function (d, currentChartOptions) {
            if (d === null) {
                return '';
            }

            var table = d3.select(document.createElement('table'));

            var theadEnter = table.selectAll('thead')
                .data([d])
                .enter().append('thead');

            theadEnter.append('tr')
                .append('td')
                .attr('colspan', 3)
                .append('strong')
                .classed('x-value', true)
                .html(currentChartOptions.xTickFormat(d.value));


            var tbodyEnter = table.selectAll('tbody')
                .data([d])
                .enter().append('tbody');

            var trowEnter = tbodyEnter.selectAll('tr')
                    .data(function (p) { return p.series })
                    .enter()
                    .append('tr')
                    .classed('highlight', function (p) { return p.highlight });

            trowEnter.append('td')
                .classed('legend-color-guide', true)
                .append('div')
                .style('background-color', function (p) { return p.color });

            trowEnter.append('td')
                .classed('key', true)
                .classed('total', function (p) { return !!p.total })
                .html(function (p, i) { return currentChartOptions.tooltipKeyFormat(p.key, i) });

            trowEnter.append('td')
                .classed('value', true)
                .html(function (p, i) {
                    var formatFunction = p.formatFunction || currentChartOptions.yTickFormat;
                    var extraString = '';
                    if (p.data && p.data.extraValue) {
                        extraString = ', ' + p.data.extraValue + ' ' + currentChartOptions.extraValueUnit;
                    }
                    return formatFunction(p.value, i) + extraString;
                });

            trowEnter.filter(function (p, i) { return p.percent !== undefined }).append('td')
                .classed('percent', true)
                .html(function (p, i) { return '(' + d3.format('%')(p.percent) + ')' });

            trowEnter.selectAll('td').each(function (p) {
                if (p.highlight) {
                    var opacityScale = d3.scale.linear().domain([0, 1]).range(['#fff', p.color]);
                    var opacity = 0.6;
                    d3.select(this)
                        .style('border-bottom-color', opacityScale(opacity))
                        .style('border-top-color', opacityScale(opacity))
                    ;
                }
            });

            var html = table.node().outerHTML;
            if (d.footer !== undefined)
                html += '<div class="footer">' + d.footer + '</div>';
            return html;

        },
        /**
         * Get widget option bu curremt id. Used in html ng-repeat of irrigation motor template
         * @param currentData
         */
        getWidgetOption: function (currentData) {
            return function (currentOption) {
                return currentOption.chart.chartId === currentData.chartId;
            }
        },
        /**
         * Generate chart option from provided chart data
         * @param currentChartOptions
         * @returns {Object} 
         */
        generateChartOptions: function (currentChartOptions) {
            var $this = this;
            return {
                chart: {
                    chartId: currentChartOptions.chartId,
                    widgetId: currentChartOptions.widgetId,
                    key: currentChartOptions.key,
                    lineColor: currentChartOptions.color,
                    type: currentChartOptions.chartType,
                    height: 200,
                    width: 780,
                    margin: {
                        top: 40,
                        right: 70,
                        bottom: 60,
                        left: 70
                    },
                    x: function (d) {
                        return d.date.toDate();
                    },
                    y: function (d) {
                        return d.value;
                    },
                    useInteractiveGuideline: true,
                    xAxis: {
                        axisLabel: currentChartOptions.xaxisLabel,
                        tickFormat: currentChartOptions.xTickFormat,
                        showMaxMin: true,
                        staggerLabels: true,
                        axisLabelDistance: 10

                    },
                    yAxis: {
                        axisLabel: !currentChartOptions.extraValueUnit ? currentChartOptions.yaxisLabel : currentChartOptions.yaxisLabel + '  (' + currentChartOptions.extraValueUnit + ')',
                        tickFormat: currentChartOptions.yTickFormat,
                        axisLabelDistance: 5,
                        domain: currentChartOptions.yRange,
                        range: currentChartOptions.yRange
                    },
                    tooltip: {
                        duration: 0,
                        hideDelay: 0
                    },

                    interactiveLayer: {
                        tooltip: {
                            duration: 0,
                            hideDelay: 0,
                            contentGenerator: function (pointData) {
                                $this.getWidgets().find(function (item, index) { return currentChartOptions.widgetId === item.id })
                                    .widgetOptions.filter(function (item) { return item.chart.chartId !== currentChartOptions.chartId })
                                    .forEach(function (item, index) {
                                        var nextData = item.chart.chartValues[pointData.index];
                                        pointData.series.push({ color: item.chart.lineColor, key: item.chart.key, value: nextData.value, formatFunction: item.chart.yAxis.tickFormat });
                                    });

                                return $this.generateTooltipHTML(pointData, currentChartOptions);
                            }

                        },
                        dispatch: {
                            elementMousemove: function (e, a, b, c, d) {
                                /*debugger*/
                                var temp = currentChartOptions;
                                var t = $this;
                            },
                            elementMouseout: function (e) { console.log('mouseout') }
                        }
                    },
                    chartValues: currentChartOptions.values,
                    yDomain: currentChartOptions.yRange
                }
            };

        },
        /**
         * Creates chart objects for specific widget from api response data
         * @param widgetId
         * @param responseData
         * @returns {type} 
         */
        createCharts: function (widgetId, responseData) {
            //TODO CRETAE BASE OBJECT AND DO OBJECT.ASSIGHN

            var charts = {
                odometerData: {
                    widgetId: widgetId,
                    chartId: $commonUtils.generateQuickGuid(),
                    values: [],
                    key: 'Odometer',
                    color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                    strokeWidth: 1,
                    classed: '',
                    chartType: 'lineChart',
                    yaxisLabel: 'Odometer',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append('foreignObject')
                                   .attr('x', -50)
                                   .attr('width', 80)
                                   .attr('height', 20)
                                   .append('xhtml:p')
                                   .attr('style', 'word-wrap: break-word; text-align:center;font:400 12px Arial,sans-serif; font-weight:700')
                                   .html(result);

                            el.remove();

                        }
                        return result
                    },
                    yTickFormat: function (d) { return d.toFixed(1); },
                    tooltipKeyFormat: function (d, i) { return d; },
                },
                rmpData: {
                    widgetId: widgetId,
                    chartId: $commonUtils.generateQuickGuid(),
                    values: [],
                    key: 'RPM',
                    color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                    strokeWidth: 1,
                    classed: '',
                    chartType: 'lineChart',
                    yaxisLabel: 'RPM',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append('foreignObject')
                                   .attr('x', -50)
                                   .attr('width', 80)
                                   .attr('height', 20)
                                   .append('xhtml:p')
                                   .attr('style', 'word-wrap: break-word; text-align:center;font:400 12px Arial,sans-serif; font-weight:700')
                                   .html(result);

                            el.remove();

                        }
                        return result
                    },
                    yTickFormat: function (d) { return d.toFixed(2); },
                    tooltipKeyFormat: function (d, i) { return d; },
                    yRange: [0, ]
                },
                waterData: {
                    widgetId: widgetId,
                    chartId: $commonUtils.generateQuickGuid(),
                    values: [],
                    key: 'Water', color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                    strokeWidth: 1,
                    classed: '',
                    chartType: 'lineChart',
                    yaxisLabel: 'Water per minute',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append('foreignObject')
                                   .attr('x', -50)
                                   .attr('width', 80)
                                   .attr('height', 20)
                                   .append('xhtml:p')
                                   .attr('style', 'word-wrap: break-word; text-align:center;font:400 12px Arial,sans-serif; font-weight:700')
                                   .html(result);

                            el.remove();

                        }
                        return result
                    },
                    yTickFormat: function (d) { return d + responseData.VolumeUnit.substring(0, 1); },
                    tooltipKeyFormat: function (d, i) { return d; },
                },
                psiData: {
                    widgetId: widgetId,
                    chartId: $commonUtils.generateQuickGuid(),
                    values: [],
                    key: 'PSI',
                    color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                    strokeWidth: 1,
                    classed: '',
                    chartType: 'lineChart',
                    yaxisLabel: 'PSI',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append('foreignObject')
                                   .attr('x', -50)
                                   .attr('width', 80)
                                   .attr('height', 20)
                                   .append('xhtml:p')
                                   .attr('style', 'word-wrap: break-word; text-align:center;font:400 12px Arial,sans-serif; font-weight:700')
                                   .html(result);

                            el.remove();

                        }
                        return result
                    },
                    yTickFormat: function (d) { return d.toFixed(1) + 'psi'; },
                    tooltipKeyFormat: function (d, i) { return d; },

                },

                fuelData: {
                    widgetId: widgetId,
                    chartId: $commonUtils.generateQuickGuid(),
                    values: [],
                    key: 'Fuel',
                    color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                    strokeWidth: 1,
                    classed: '',
                    chartType: 'lineChart',
                    extraValueUnit: responseData.VolumeUnit,
                    yaxisLabel: 'Fuel',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append('foreignObject')
                                   .attr('x', -50)
                                   .attr('width', 80)
                                   .attr('height', 20)
                                   .append('xhtml:p')
                                   .attr('style', 'word-wrap: break-word; text-align:center;font:400 12px Arial,sans-serif; font-weight:700')
                                   .html(result);

                            el.remove();

                        }
                        return result
                    },
                    yTickFormat: function (d) { return d.toFixed(1) + '%'; },
                    tooltipKeyFormat: function (d, i) { return d },
                    yRange: [0, 100]

                },
                engineHoursData: {
                    widgetId: widgetId,
                    chartId: $commonUtils.generateQuickGuid(),
                    values: [],
                    key: 'Engine Hours',
                    color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                    strokeWidth: 1,
                    classed: '',
                    chartType: 'lineChart',
                    yaxisLabel: 'Hours',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append('foreignObject')
                                   .attr('x', -50)
                                   .attr('width', 80)
                                   .attr('height', 20)
                                   .append('xhtml:p')
                                   .attr('style', 'word-wrap: break-word; text-align:center;font:400 12px Arial,sans-serif; font-weight:700')
                                   .html(result);

                            el.remove();

                        }
                        return result
                    },
                    yTickFormat: function (d) { return d.toFixed(1); },
                    tooltipKeyFormat: function (d, i) { return d }
                }
            }

            responseData.IrrigationMotorData.forEach(function (item, index) {

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
            return charts;
        },
        /**
         * Empty current widget on referesh or other actions
         * @param widget
         * @returns {type} 
         */
        emptyWidget: function (widget) {
            widget.widgetData = [];
            widget.widgetOptions = [];
            widget.widgetApi = [];
            return widget;
        },
        /**
         * Create idle time widget
         */
        getIdleTimeData: function (widget, filters) {
            var $this = this
            this.dashboardFactory.getIdleTimeCurrentStatus(filters).then(function (response) {               
                Object.keys(response.data).forEach(function (item) {
                    var obj = $this.dashboardFactory.genereteIdleStatusObject(item, response.data[item]);
                    Object.defineProperty(widget.widgetData, Object.keys(obj)[0], {
                        value: obj[Object.keys(obj)[0]],
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                });
                var index = $this.widgets.indexOf(widget);
                if (index > -1) {
                    $this.widgets[index] = widget;
                    $this.vm.$broadcast('updateClockWidget');
                }
                else {
                    $this.widgets.push(widget);
                }
            });
        },

        createIdleTimeWidget: function () {
            var widgetObj = {
                id: $commonUtils.generateQuickGuid(),
                title: 'Idle time - current status options',
                name: 'Idle time - current status',
                sizeY: 1,
                sizeX: 2,
                template: 'widgets/clock/clock.template.html',
                //settingsTemplate: 'modal/commonSettings.template.html',
                widgetData: {},
                widgetResolve: {},
                widgetApi: [],
                settingsControllerName: 'idleTimeCurrentStatus.widget.settings.controller',
                settingsControllerAsAlias: 'idleTimeCurrentStatusSettingsCtrl',
                showEmptySettingsMessage: true,
                showSpinner: false,
                widgetResolve: {
                    $groupsData: $abstractFactory.getGroupsData(),
                    $vehicleList: $abstractFactory.getVehicleList(),
                    $vehicleTypesList: $abstractFactory.getVehicleTypesList()
                },
                settingsTemplateParts: { showCompanyTreeSelect: true, showCompanyVehicles: true, showCompanyVehicleType: true }
            };
            return widgetObj;
        },
        /**
         * Creates irrigation motor widget and push it ro widgets
         */
        createIrrigationMotorWidget: function () {
            this.widgets.push({
                id: $commonUtils.generateQuickGuid(),
                name: 'Irrigation motor',
                settingsTitle: 'Irrigation motor options',
                sizeY: 1,
                sizeX: 3,
                template: 'widgets/dygraph/dygraph.irrigationMotor.widget.template.html',//'widgets/common.widget.template.html',//TODO to template
                //settingsTemplate: 'widgets/dygraph/dygraph.irrigationMotor.settings.widget.template.html',
                widgetData: [],
                widgetOptions: [],
                widgetApi: [],
                settingsControllerName: 'irrigationMotor.widget.settings.controller',
                settingsControllerAsAlias: 'irrigationMotorWidgetSettingsCtrl',
                widgetResolve: {
                    $groupsData: $abstractFactory.getGroupsData(),
                    $vehicleList: $abstractFactory.getVehicleList()
                },
                showEmptySettingsMessage: true,
                showSpinner: false,
                settingsTemplateParts: { showDateRangePicker: true, showCompanyTreeSelect: true, showCompanyVehicles: true }
            });
        },
        /**
         * Remove widget button callback
         * @param widget
         */
        removeWidget: function (widget) {
            this.widgets.splice(this.widgets.indexOf(widget), 1);
            widget.showEmptySettingsMessage = true;
            widget.showSpinner = false;
        },
        /**
         * OPen widget button callback
         * @param widget
         */
        openWidgetSettings: function (widget) {
            var $this = this;
            var commonResolves = {
                $widget: function () {
                    return widget;
                },
                $dashboardParent: function () { return $this; }
            };
            var resolve = angular.extend(commonResolves, widget.widgetResolve);
            $uibModal.open({
                templateUrl: 'widgets/dynamic.widget.template.html',//widget.settingsTemplate,
                controllerAs: widget.settingsControllerAsAlias,
                bindToController: true,
                controller: widget.settingsControllerName,
                resolve: resolve
            });
        },
        /**
         * Get irrigation motor widget data from api by user selected filter
         * @param filterObject
         * @param widgetId
         */
        getIrrigationMotorData: function (filterObject, widgetId) {
            var $this = this;
            $api.sendAPIRequest('Dashboard', 'GetIrrigationMotorData', angular.extend(localStorageService.get('$T'), filterObject)).then(function (response) {
                var widget = $this.widgets.find(function (item) { return item.id === widgetId });
                $this.dashboardFactory.emptyWidget(widget);
                var chartData = Object.values($this.dashboardFactory.createCharts(widgetId, response.data))
                if (chartData.some(function (item) { return item.values.length })) {
                    chartData.forEach(function (item, index, array) {
                        if (item.values.length) {
                            widget.widgetOptions.push($this.dashboardFactory.generateChartOptions(item));
                            widget.widgetData.push([item]);
                            widget.widgetApi.push({});
                        }
                    });
                }
                else {
                    widget.widgetOptions.push($this.dashboardFactory.generateChartOptions(chartData[0]));
                    widget.widgetData.push([chartData[0]]);
                    widget.widgetApi.push({});
                }

                widget.template = 'widgets/dygraph/dygraph.irrigationMotor.widget.template.html';
                widget.sizeY = widget.widgetData.length;

                //widget.showEmptySettingsMessage = true;
                widget.showSpinner = false;
            });
        },


        createOverspeedingBreakdownWidget: function () {
            this.widgets.push({
                id: $commonUtils.generateQuickGuid(),
                name: 'Over speeding breakdown by amount',
                settingsTitle: 'Over speeding breakdown by amount options',
                sizeY: 1,
                sizeX: 3,
                template: 'widgets/pieChart/pieChart.overspeedingBreakdown.widget.template.html',//'widgets/common.widget.template.html',//TODO to template
                //settingsTemplate: 'widgets/pieChart/pieChart.overspeedingBreakdown.settings.widget.template.html',
                widgetData: [],
                widgetOptions: [],
                widgetApi: [],
                settingsControllerName: 'overspeedingBreakdown.widget.settings.controller',
                settingsControllerAsAlias: 'overspeedingBreakdownSettingsCtrl',
                widgetResolve: {
                    $groupsData: $abstractFactory.getGroupsData(),
                    $vehicleTypesList: $abstractFactory.getVehicleTypesList()
                },
                showEmptySettingsMessage: true,
                showSpinner: false,
                settingsTemplateParts: { showDateRangePicker: true, showCompanyTreeSelect: true, showCompanyVehicleType: true }
            });
        },
        getOverSpeedingDistributionByAmount: function (filterObject, widgetId) {
            var $this = this;
            $api.sendAPIRequest('Dashboard', 'GetOverSpeedingDistributionByAmount', angular.extend(localStorageService.get('$T'), filterObject)).then(function (response) {

                var widget = $this.widgets.find(function (item) { return item.id === widgetId });
                var totalVehicleSum = response.data.reduce(function (sum, current) { return sum + current.VEHCILES_COUNT; }, 0);
                response.data = response.data.map(function (item, index) { return angular.extend(item, { percentage: $filter('percentage')((item.VEHCILES_COUNT / totalVehicleSum) * 100, 1), colors: $this.dashboardFactory.getRandomColors() }) });
                $this.gridOptions = {
                    enableSorting: false,
                    enableColumnMenus: false,
                    minRowsToShow: 4,
                    showColumnFooter: true,
                    appScopeProvider: $this,
                    data: response.data,
                    enableHorizontalScrollbar: 0,
                    enableVerticalScrollbar: 0,
                    enableGridMenu: false,
                    exporterPdfDefaultStyle: { fontSize: 9 },
                    exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
                    exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'white', fillColor: '#6495ED' },
                    exporterPdfHeader: { text: "Over Speeding Distribution By Amount Report", style: 'headerStyle' },
                    exporterPdfFooter: function (currentPage, pageCount) {
                        return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
                    },
                    exporterPdfCustomFormatter: function (docDefinition) {
                        docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                        docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                        docDefinition.content[0].table.body.forEach(function (item, index, array) {
                            if (index /*&& index != array.length - 1*/) {
                                item.forEach(function (cell, ind, arr) {
                                    if (!ind)
                                        arr[ind] = { text: cell, fillColor: $this.gridOptions.data[index - 1].colors.medium, color: 'white' }
                                    else
                                        arr[ind] = { text: cell, fillColor: '#FFF8DC', color: 'black' }
                                });
                            }
                        });
                        return docDefinition;
                    },
                    exporterPdfOrientation: 'portrait',
                    exporterPdfPageSize: 'LETTER',
                    exporterPdfMaxGridWidth: 500,
                    onRegisterApi: function (gridApi) {
                        $this.gridApi = gridApi;
                    },
                    downloadPDF: function () {
                        $this.gridApi.exporter.pdfExport(uiGridExporterConstants.VISIBLE, uiGridExporterConstants.ALL);
                    },
                    columnDefs: [
                    {
                        name: 'Occurences',
                        field: 'OVERSPEED_AMOUNT',
                        width: 100,
                        cellTemplate: '<div ng-style="colRenderIndex?{\'background-color\':\'{{grid.options.data[rowRenderIndex].colors.light}}\'}:{\'background-color\':\'{{grid.options.data[rowRenderIndex].colors.medium}}\', \'color\':\'white\'}" class="ui-grid-cell-contents" >{{COL_FIELD }}</div>'
                    },
                    {
                        name: 'Vehicles',
                        field: 'VEHCILES_COUNT',
                        width: 100,
                        cellTemplate: '<div ng-style="colRenderIndex?{\'background-color\':\'{{grid.options.data[rowRenderIndex].colors.light}}\'}:{\'background-color\':\'{{grid.options.data[rowRenderIndex].colors.medium}}\'}" class="ui-grid-cell-contents" >{{COL_FIELD }}</div>',
                        aggregationType: uiGridConstants.aggregationTypes.sum,
                        footerCellTemplate: '<div class="ui-grid-cell-contents" >Total: {{col.getAggregationValue()}}</div>'
                    },
                     {
                         name: '%',
                         width: '*',
                         field: 'percentage',
                         cellTemplate: '<div ng-style="colRenderIndex?{\'background-color\':\'{{grid.options.data[rowRenderIndex].colors.light}}\'}:{\'background-color\':\'{{grid.options.data[rowRenderIndex].colors.medium}}\'}" class="ui-grid-cell-contents" >{{COL_FIELD }}</div>',
                         footerCellTemplate: '<img ng-click="grid.options.downloadPDF()" class="reports" src="js/dist/css/images/reports.png"/>'
                     }
                    ]
                };
                widget.widgetOptions = {
                    chart: {
                        id: $commonUtils.generateQuickGuid(),
                        widgetId: widgetId,
                        color: function (d, i) { return $this.gridOptions.data.find(function (item) { return item.OVERSPEED_AMOUNT == d.OVERSPEED_AMOUNT }).colors.medium },
                        type: 'pieChart',
                        height: 250,
                        x: function (d) { return parseFloat(d.percentage).toFixed(1) + '%'; },
                        y: function (d) { return parseFloat(d.percentage).toFixed(1); },
                        showLabels: true,
                        duration: 500,
                        labelThreshold: 0.01,
                        labelSunbeamLayout: true,
                        showLegend: false,
                        tooltip: {
                            keyFormatter: function (d) { return ''; }
                        },
                        labelFormat: function (d) { var t = $this; return d + '%' },
                        margin: { 'top': -5, 'right': 20, 'bottom': 20, 'left': 50 },
                        donut: true,
                    }
                };
                widget.widgetData = response.data;
                widget.showSpinner = false;

                widget.template = 'widgets/pieChart/pieChart.overspeedingBreakdown.widget.template.html';
            });

        },
        getRandomColors: function () {
            var red = Math.ceil(Math.random() * 230);
            var green = Math.ceil(Math.random() * 230);
            var blue = Math.ceil(Math.random() * 230);
            medium = 'rgb(' + red + ',' + green + ',' + blue + ')'; //RGB value

            var darkRed = Math.ceil(red * 0.6);
            var darkGreen = Math.ceil(green * 0.6);
            var darkBlue = Math.ceil(blue * 0.6);
            dark = 'rgb(' + (darkRed) + ',' + (darkGreen) + ',' + darkBlue + ')'; //RGB value
            //notice the difference in setting ltRed,ltGreen and ltBlue. The result is the same
            var ltRed = Math.ceil(red * 1.5);
            if (ltRed > 255) ltRed = 255;
            var ltGreen = Math.ceil(green * 1.5);
            ltGreen = Math.min(ltGreen, 255);
            var ltBlue = Math.min(Math.ceil(blue * 1.5), 255);
            light = 'rgb(' + (ltRed) + ',' + (ltGreen) + ',' + ltBlue + ')'; //RGB value
            return { dark: $commonUtils.rgb2hex(dark), light: $commonUtils.rgb2hex(light), medium: $commonUtils.rgb2hex(medium) }
        }
    }
});
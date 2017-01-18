app.factory('$dashboardFactory', function ($commonUtils, $api, localStorageService) {
    var widgets = [];
    var settingsData = {};
    return {
        getWidgets: function () {
            return widgets;
        },
        getSettingsData: function () { return settingsData },
        setSettingsData: function (_settingsData) { settingsData = _settingsData },
        getIdleTimeCurrentStatus: function () {
            return $api.sendAPIRequest('Dashboard', 'GetIdleTimeCurrentStatus', angular.extend(localStorageService.get('$T'), {}/*this.getSelectedFilters*/));
        },
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
        generateTooltipHTML: function (d, currentChartOptions) {
            if (d === null) {
                return '';
            }

            var table = d3.select(document.createElement("table"));

            var theadEnter = table.selectAll("thead")
                .data([d])
                .enter().append("thead");

            theadEnter.append("tr")
                .append("td")
                .attr("colspan", 3)
                .append("strong")
                .classed("x-value", true)
                .html(currentChartOptions.xTickFormat(d.value));


            var tbodyEnter = table.selectAll("tbody")
                .data([d])
                .enter().append("tbody");

            var trowEnter = tbodyEnter.selectAll("tr")
                    .data(function (p) { return p.series })
                    .enter()
                    .append("tr")
                    .classed("highlight", function (p) { return p.highlight });

            trowEnter.append("td")
                .classed("legend-color-guide", true)
                .append("div")
                .style("background-color", function (p) { return p.color });

            trowEnter.append("td")
                .classed("key", true)
                .classed("total", function (p) { return !!p.total })
                .html(function (p, i) { return currentChartOptions.tooltipKeyFormat(p.key, i) });

            trowEnter.append("td")
                .classed("value", true)
                .html(function (p, i) {
                    var formatFunction = p.formatFunction || currentChartOptions.yTickFormat;
                    var extraString = '';
                    if (p.data && p.data.extraValue) {
                        extraString = ', ' + p.data.extraValue + ' '+currentChartOptions.extraValueUnit;
                    }
                    return formatFunction(p.value, i) + extraString;
                });

            trowEnter.filter(function (p, i) { return p.percent !== undefined }).append("td")
                .classed("percent", true)
                .html(function (p, i) { return "(" + d3.format('%')(p.percent) + ")" });

            trowEnter.selectAll("td").each(function (p) {
                if (p.highlight) {
                    var opacityScale = d3.scale.linear().domain([0, 1]).range(["#fff", p.color]);
                    var opacity = 0.6;
                    d3.select(this)
                        .style("border-bottom-color", opacityScale(opacity))
                        .style("border-top-color", opacityScale(opacity))
                    ;
                }
            });

            var html = table.node().outerHTML;
            if (d.footer !== undefined)
                html += "<div class='footer'>" + d.footer + "</div>";
            return html;

        },
        getWidgetOption: function (currentData) {
            return function (currentOption) {
                return currentOption.chart.chartId === currentData.chartId;
            }
        },
        generateChartOptions: function (currentChartOptions) {
            var $this = this;
            return {
                chart: {
                    chartId: currentChartOptions.chartId,
                    widgetId: currentChartOptions.widgetId,
                    key: currentChartOptions.key,
                    lineColor: currentChartOptions.color,
                    type: 'lineChart',
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
        createCharts: function (widgetId, responseData) {
            //TODO CRETAE BASE OBJECT AND DO OBJECT.ASSIGHN
            return {
                odometerData: {
                    widgetId: widgetId,
                    chartId: $commonUtils.generateQuickGuid(),
                    values: [],
                    key: 'Odometer',
                    color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                    strokeWidth: 1,
                    classed: '',
                    yaxisLabel: 'Odometer',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append("foreignObject")
                                   .attr('x', -50)
                                   .attr("width", 80)
                                   .attr("height", 20)
                                   .append("xhtml:p")
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
                    yaxisLabel: 'RPM',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append("foreignObject")
                                   .attr('x', -50)
                                   .attr("width", 80)
                                   .attr("height", 20)
                                   .append("xhtml:p")
                                   .attr('style', 'word-wrap: break-word; text-align:center;font:400 12px Arial,sans-serif; font-weight:700')
                                   .html(result);

                            el.remove();

                        }
                        return result
                    },
                    yTickFormat: function (d) { return d.toFixed(2);  },
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
                    yaxisLabel: 'Water per minute',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append("foreignObject")
                                   .attr('x', -50)
                                   .attr("width", 80)
                                   .attr("height", 20)
                                   .append("xhtml:p")
                                   .attr('style', 'word-wrap: break-word; text-align:center;font:400 12px Arial,sans-serif; font-weight:700')
                                   .html(result);

                            el.remove();

                        }
                        return result
                    },
                    yTickFormat: function (d) { return d + responseData.VolumeUnit.substring(0,1); },
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
                    yaxisLabel: 'PSI',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append("foreignObject")
                                   .attr('x', -50)
                                   .attr("width", 80)
                                   .attr("height", 20)
                                   .append("xhtml:p")
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
                    extraValueUnit: responseData.VolumeUnit,
                    yaxisLabel: 'Fuel',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append("foreignObject")
                                   .attr('x', -50)
                                   .attr("width", 80)
                                   .attr("height", 20)
                                   .append("xhtml:p")
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
                    yaxisLabel: 'Hours',
                    xaxisLabel: 'Date',
                    xTickFormat: function (d) {
                        var result = d3.time.format('%d/%m/%Y %H:%M')(new Date(d));
                        if (typeof this != 'undefined') {
                            var el = d3.select(this);
                            var p = d3.select(this.parentNode);
                            p.append("foreignObject")
                                   .attr('x', -50)
                                   .attr("width", 80)
                                   .attr("height", 20)
                                   .append("xhtml:p")
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
        },
        emptyWidget: function (widget) {
            widget.widgetData = [];
            widget.widgetOptions = [];
            widget.widgetApi = [];
            return widget;
        }
    }
});
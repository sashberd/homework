angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('dashboard.template.html',
    "<uib-accordion><div uib-accordion-group class=\"panel-default\" is-open=\"dashboardCtrl.isCustomHeaderOpen\"><uib-accordion-heading>{{ dashboardCtrl.isCustomHeaderOpen ? 'Hide widget panel' : 'Show widget panel'}} <i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': dashboardCtrl.isCustomHeaderOpen, 'glyphicon-chevron-right': !dashboardCtrl.isCustomHeaderOpen}\"></i></uib-accordion-heading><button class=\"btn\" ng-class=\"{' btn-success':dashboardCtrl.idleTimeSelected,'btn-info':!dashboardCtrl.idleTimeSelected}\" ng-click=\"dashboardCtrl.createIdleTimeWidget();dashboardCtrl.changeClass('idleTimeSelected');\">First Button</button><!--IDLE TIME-CURRENT STATUS--> <button class=\"btn\" ng-class=\"{' btn-success':dashboardCtrl.irrigationMotorSelected,'btn-info':!dashboardCtrl.irrigationMotorSelected}\" ng-click=\"dashboardCtrl.createIrrigationMotorWidget();dashboardCtrl.changeClass('irrigationMotorSelected');\">Second Button</button><!--Irrigation Motor status--></div></uib-accordion><div class=\"container-fluid\"><div class=\"col-md-12\"><!--<div dashboard=\"dashboardCtrl.dashboardOptions\" class=\"dashboard-container\"></div>--><div gridster=\"dashboardCtrl.gridsterOptions\"><ul><li gridster-item=\"widget\" ng-repeat=\"widget in dashboardCtrl.widgets\"><div class=\"box\"><div class=\"box-header\"><h3>{{ widget.name }}</h3><div class=\"box-header-btns pull-right\"><a title=\"settings\" ng-click=\"dashboardCtrl.openWidgetSettings(widget)\"><i class=\"glyphicon glyphicon-cog\"></i></a> <a title=\"Remove widget\" ng-click=\"dashboardCtrl.removeWidget(widget)\"><i class=\"glyphicon glyphicon-trash\"></i></a></div></div><div class=\"box-content\" ng-include=\"widget.template\"></div></div></li></ul></div></div></div>"
  );


  $templateCache.put('login.template.html',
    "<!-- Where all the magic happens --><!-- LOGIN FORM --><!--<div class=\"text-center\" style=\"padding: 50px 0\" on-key-enter=\"loginCtrl.doLogin()\">\r" +
    "\n" +
    "    <div class=\"logo\">{{ 'login' | translate }}</div>\r" +
    "\n" +
    "  \r" +
    "\n" +
    "    <div class=\"login-form-1\">\r" +
    "\n" +
    "        <form id=\"login-form\" class=\"text-left\">\r" +
    "\n" +
    "            <div class=\"login-form-main-message\"></div>\r" +
    "\n" +
    "            <div class=\"main-login-form\">\r" +
    "\n" +
    "                <div class=\"login-group\">\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <label for=\"lg_username\" class=\"sr-only\">{{ 'username' | translate }}</label>\r" +
    "\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"lg_username\" name=\"lg_username\" placeholder=\"{{ 'username' | translate }}\" ng-model=\"loginCtrl.username\" on-key-enter=\"loginCtrl.doLogin()\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <label for=\"lg_password\" class=\"sr-only\">{{ 'password' | translate }}</label>\r" +
    "\n" +
    "                        <input type=\"password\" class=\"form-control\" id=\"lg_password\" name=\"lg_password\" placeholder=\"{{ 'password' | translate }}\" ng-model=\"loginCtrl.password\" on-key-enter=\"loginCtrl.doLogin()\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group\">\r" +
    "\n" +
    "                        <label for=\"txtCompany\" class=\"sr-only\">{{ 'companyName' | translate }}</label>\r" +
    "\n" +
    "                        <input type=\"text\" class=\"form-control\" id=\"txtCompany\" name=\"lg_company\" placeholder=\"{{ 'companyName' | translate }}\" ng-model=\"loginCtrl.companyName\" on-key-enter=\"loginCtrl.doLogin()\">\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"form-group login-group-checkbox\">\r" +
    "\n" +
    "                        <input type=\"checkbox\" id=\"lg_remember\" name=\"lg_remember\">\r" +
    "\n" +
    "                        <label for=\"lg_remember\">{{ 'rememberMe' | translate }}</label>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <button type=\"button\" class=\"login-button\" ng-click=\"loginCtrl.doLogin()\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <div class=\"etc-login-form\">\r" +
    "\n" +
    "                <p>{{ 'forgotPassword' | translate }} <a href=\"#\">{{ 'clickHere' | translate }}</a></p>             \r" +
    "\n" +
    "                <ui-select ng-model=\"   \"  style=\"min-width: 100px;\" theme=\"bootstrap\" search-enabled=\"false\" on-select=\"loginCtrl.onLanguageChange()\"> \r" +
    "\n" +
    "                      <ui-select-match placeholder=\"{{'chooseLanguage'|translate}}\"><img style=\"padding-left:5px;vertical-align: super;\" ng-src=\"{{ $select.selected.url }}\" />&nbsp;&nbsp; {{$select.selected.name}}</ui-select-match>                  \r" +
    "\n" +
    "                    <ui-select-choices repeat=\"lang in loginCtrl.languageList\">\r" +
    "\n" +
    "                      <img ng-src=\"{{ lang.url }}\" />&nbsp;&nbsp;\r" +
    "\n" +
    "                      <div ng-bind-html=\"lang.name | highlight: $select.search\" style=\"display: inline\"></div>\r" +
    "\n" +
    "                    </ui-select-choices>\r" +
    "\n" +
    "            </ui-select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            <div uib-alert ng-class=\"'alert-danger'\" ng-show=\"loginCtrl.showAlert\">{{ loginCtrl.loginMessage | translate}}  </div>\r" +
    "\n" +
    "        </form>\r" +
    "\n" +
    "        <tek-progress-bar bar-class=\"progress-bar-info\" ng-show=\"loginCtrl.showProgressBar\" ng-model=\"loginCtrl.progressBarValue\" manager=\"loginCtrl.progressManager\">{{loginCtrl.progressBarValue}}%</tek-progress-bar>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "</div>--><div class=\"container\"><form class=\"form-signin\" on-key-enter=\"loginCtrl.doLogin()\"><h2 class=\"form-signin-heading\">{{ 'login' | translate }}</h2><label for=\"inputEmail\" class=\"sr-only\">{{ 'username' | translate }}</label><input type=\"text\" id=\"inputEmail\" class=\"form-control\" placeholder=\"{{ 'username' | translate }}\" required autofocus ng-model=\"loginCtrl.username\" on-key-enter=\"loginCtrl.doLogin()\"><label for=\"inputPassword\" class=\"sr-only\">{{ 'password' | translate }}</label><input type=\"password\" id=\"inputPassword\" class=\"form-control\" placeholder=\"{{ 'password' | translate }}\" required ng-model=\"loginCtrl.password\" on-key-enter=\"loginCtrl.doLogin()\"><label for=\"inputCompanyName\" class=\"sr-only\">{{ 'companyName' | translate }}</label><input type=\"text\" id=\"txtCompanyName\" class=\"form-control\" placeholder=\"{{ 'companyName' | translate }}\" required ng-model=\"loginCtrl.companyName\" on-key-enter=\"loginCtrl.doLogin()\"><div class=\"checkbox\"><label><input type=\"checkbox\" value=\"remeber me\"> {{ 'rememberMe' | translate }}</label></div><button class=\"btn btn-lg btn-primary btn-block\" type=\"submit\" ng-click=\"loginCtrl.doLogin()\">{{ 'login' | translate }}</button><p>{{ 'forgotPassword' | translate }} <a href=\"#\">{{ 'clickHere' | translate }}</a></p><ui-select ng-model=\"  loginCtrl.selectedLanguage \" style=\"min-width: 100px\" theme=\"bootstrap\" search-enabled=\"false\" on-select=\"loginCtrl.onLanguageChange()\"><ui-select-match placeholder=\"{{'chooseLanguage'|translate}}\"><img style=\"padding-left:5px;vertical-align: super\" ng-src=\"{{ $select.selected.url }}\">&nbsp;&nbsp; {{$select.selected.name}}</ui-select-match><ui-select-choices repeat=\"lang in loginCtrl.languageList\"><img ng-src=\"{{ lang.url }}\">&nbsp;&nbsp;<div ng-bind-html=\"lang.name | highlight: $select.search\" style=\"display: inline\"></div></ui-select-choices></ui-select><div uib-alert ng-class=\"'alert-danger'\" ng-show=\"loginCtrl.showAlert\">{{ loginCtrl.loginMessage | translate}}</div></form><tek-progress-bar bar-class=\"progress-bar-info\" ng-show=\"loginCtrl.showProgressBar\" ng-model=\"loginCtrl.progressBarValue\" manager=\"loginCtrl.progressManager\">{{loginCtrl.progressBarValue}}%</tek-progress-bar></div>"
  );


  $templateCache.put('map.template.html',
    "<div class=\"row mapGridFilters\"><div class=\"col-xs-6 col-sm-6 col-md-6\"><div ng-dropdown-multiselect=\"\" options=\"mapCtrl.vehiclesList\" ng-style=\"{'width':multiselectULMinWidth}\" translation-texts=\"mapCtrl.multiSelectCustomTexts\" events=\"mapCtrl.multiselectEvents\" selected-model=\"mapCtrl.multiSelectModel\" extra-settings=\"mapCtrl.multiSelectSettings\" checkboxes=\"true\" headers='{ \"Nickname\": \"NICK_NAME\", \"ID\": \"VEHICLE_BB_ID\"}'></div><button id=\"btnMapGroupsFilter\" uib-popover-template=\"'treeSelect/treeselect.checkbox.template.html'\" popover-is-open=\"mapCtrl.popoverIsOpen\" ng-click=\"mapCtrl.popoverIsOpen = !mapCtrl.popoverIsOpen\" popover-trigger=\"'outsideClick'\" popover-placement=\"bottom\" type=\"button\" class=\"btn btn-default\">Click to filter by groups <span class=\"caret pull-right\"></span></button></div></div><div class=\"row mapGridFilters form-inline\"><div class=\"col-xs-6 col-sm-6 col-md-6\"><input type=\"text\" class=\"form-control\" ng-model=\"mapCtrl.filters.textFilter\" ng-change=\"mapCtrl.filterByText()\" placeholder=\"Search by free text\"> <button uib-tooltip=\"Clear all filters\" tooltip-placement=\"top\" id=\"btnFilterButton\" type=\"button\" class=\"btn btn-default\" ng-click=\"mapCtrl.clearAllFilters()\" ng-disabled=\"!mapCtrl.hasFilters\" ng-class=\"{'btn-warning':mapCtrl.hasFilters}\"><span class=\"glyphicon\" aria-hidden=\"true\"></span></button> <button uib-tooltip=\"Apply selected vehicles on map\" tooltip-placement=\"top\" id=\"btnApplyOnMap\" type=\"button\" ng-click=\"mapCtrl.applyFiltersOnMap()\" class=\"btn btn-default\" ng-disabled=\"!mapCtrl.hasFilters || !mapCtrl.gridOptions.data.length>0\" ng-class=\"{'btn-warning':mapCtrl.hasFilters && mapCtrl.gridOptions.data.length>0}\"><span class=\"glyphicon\" aria-hidden=\"true\"></span></button></div></div><div class=\"gridSpinner\" ng-show=\"mapCtrl.isRefresh\"></div><div id=\"mapLegendaDiv\"><a href=\"javascript: void(0)\" class=\"mapAlertLink hvr-underline-from-center\" ng-class=\"{'active':mapCtrl.alertFilterSelected }\" ng-click=\"mapCtrl.alertFilterSelected=!mapCtrl.alertFilterSelected;mapCtrl.filterByStatus(4,mapCtrl.alertFilterSelected)\"></a><label>({{mapCtrl.alertCarsCount}})</label><a href=\"javascript: void(0)\" class=\"mapMotionLink hvr-underline-from-center\" ng-class=\"{'active':mapCtrl.inMotionFilterSelected }\" ng-click=\"mapCtrl.inMotionFilterSelected=!mapCtrl.inMotionFilterSelected;mapCtrl.filterByStatus(1,mapCtrl.inMotionFilterSelected)\"></a><label>({{mapCtrl.inMotionCarsCount}})</label><a href=\"javascript: void(0)\" class=\"mapEngineOffLink hvr-underline-from-center\" ng-class=\"{'active':mapCtrl.engineOffFilterSelected }\" ng-click=\"mapCtrl.engineOffFilterSelected=!mapCtrl.engineOffFilterSelected;mapCtrl.filterByStatus(3,mapCtrl.engineOffFilterSelected)\"></a><label>({{mapCtrl.engineOffCarsCount}})</label><a href=\"javascript: void(0)\" class=\"mapIdleLink hvr-underline-from-center\" ng-class=\"{'active':mapCtrl.idleFilterSelected }\" ng-click=\"mapCtrl.idleFilterSelected=!mapCtrl.idleFilterSelected;mapCtrl.filterByStatus(2,mapCtrl.idleFilterSelected)\"></a><label>({{mapCtrl.idleCarsCount}})</label><a href=\"javascript: void(0)\" class=\"mapSumSign\"></a><label class=\"mapSumLabel\">({{mapCtrl.totalCarsCount}})</label><div id=\"mapCarsDataGrid\" ui-grid=\"mapCtrl.gridOptions\" ui-grid-auto-fit-columns class=\"grid\"><span us-spinner=\"{radius:30, width:8, length: 16,color:'black'}\" spinner-on=\"mapCtrl.loading\"></span><div class=\"watermark\" ng-show=\"!mapCtrl.gridOptions.data.length && !mapCtrl.loading\">No data available</div></div></div><leaflet style=\"float: right; display: inline-block\" bounds=\"bounds\" layers=\"layers\" center=\"center\" width=\"60%\" height=\"950px\"></leaflet><!--markers=\"markers\"-->"
  );


  $templateCache.put('refuel.grid.template.html',
    "<uib-accordion><div uib-accordion-group class=\"panel-info\" is-open=\"refuelCtrl.isOpen\"><uib-accordion-heading>Refuel Search Panel <button type=\"button\" class=\"btn btn-primary btn-sm btn-float-right\">Close</button></uib-accordion-heading><div class=\"row\"><div class=\"col-lg-3\"><label class=\"label-refuel\" for=\"cbxPumps\">Pump:</label><div class=\"overlay-wrapper\"><span class=\"overlay-x\" ng-show=\"refuelCtrl.pumpSelectedItem!=null\" ng-click=\"refuelCtrl.pumpSelectedItem=null\">X</span> <input id=\"cbxPumps\" placeholder=\"Start type pump name or id\" type=\"text\" ng-model=\"refuelCtrl.pumpSelectedItem\" ng-model-options=\"refuelCtrl.modelOptions\" typeahead-on-select=\"refuelCtrl.onPumpSelected($item, $model, $label, $event);\" uib-typeahead=\"pumpData as pump.LIST_ITEM_DISPLAY_NAME_ID for pump in refuelCtrl.filterPumps($viewValue)\" class=\"form-control\"></div></div><div class=\"col-lg-3\"><label class=\"label-refuel\" for=\"cbxDrivers\">Driver:</label><div class=\"overlay-wrapper\"><span class=\"overlay-x\" ng-show=\"refuelCtrl.driverSelectedItem!=null\" ng-click=\"refuelCtrl.driverSelectedItem=null\">X</span> <input id=\"cbxDrivers\" placeholder=\"Start type driver name or id\" type=\"text\" ng-model=\"refuelCtrl.driverSelectedItem\" ng-model-options=\"refuelCtrl.modelOptions\" typeahead-on-select=\"refuelCtrl.onDriverSelected($item, $model, $label, $event);\" uib-typeahead=\"driverData as (driver.DriverBBID +'&emsp;&emsp;&emsp;'+ driver.DriverName) for driver in refuelCtrl.filterDrivers($viewValue)\" class=\"form-control\"></div></div><div class=\"col-lg-3\"><p class=\"input-group\"><label for=\"txtStartDate\">Start Date:</label><input id=\"txtStartDate\" placeholder=\"dd/MM/yyyy\" type=\"text\" class=\"form-control\" uib-datepicker-popup=\"{{refuelCtrl.format}}\" ng-model=\"refuelCtrl.startDateTime\" is-open=\"refuelCtrl.startDateTimeData.opened\" datepicker-options=\"refuelCtrl.dateOptions\" close-text=\"Close\" alt-input-formats=\"refuelCtrl.altInputFormats\"> <span class=\"input-group-btn\" id=\"btnOpenStartDateCalendar\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"refuelCtrl.startDateOpen()\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div><div class=\"col-lg-3\" id=\"startTimeDiv\"><div uib-timepicker ng-model=\"refuelCtrl.startTime\" show-meridian=\"false\"></div></div></div><div class=\"row\"><div class=\"col-lg-3\"><label class=\"label-refuel\" for=\"cbxTypeandSource\">Type and source:</label><div class=\"btn-group\" uib-dropdown keyboard-nav><button id=\"cbxTypeandSource\" type=\"button\" class=\"btn btn-default\" uib-dropdown-toggle>{{refuelCtrl.selectedRefuelTypeAndSourceOption.PHRASE_NAME || 'Select type and source' }} <span class=\"caret\"></span></button><ul class=\"dropdown-menu\" uib-dropdown-menu role=\"menu\" aria-labelledby=\"simple-btn-keyboard-nav\"><li role=\"menuitem\" ng-repeat=\"typeandsource in refuelCtrl.typesAndSourcesList\"><a href=\"\" ng-click=\"refuelCtrl.changeTypeAndSourceSelectedItem(typeandsource)\">{{ typeandsource.PHRASE_NAME }}</a></li></ul></div></div><div class=\"col-lg-3\"><label class=\"label-refuel\" for=\"cbxRefuelTags\">Tag ID:</label><div class=\"overlay-wrapper\"><span class=\"overlay-x\" ng-show=\"refuelCtrl.tagSelectedItem!=null\" ng-click=\"refuelCtrl.tagSelectedItem=null\">X</span> <input id=\"cbxRefuelTags\" placeholder=\"Start type tag id\" type=\"text\" ng-model=\"refuelCtrl.tagSelectedItem\" ng-model-options=\"refuelCtrl.modelOptions\" typeahead-on-select=\"refuelCtrl.onTagSelected($item, $model, $label, $event);\" uib-typeahead=\"tagData as (tag.V_BB_VEHICLE_ID +'&emsp;&emsp;&emsp;'+ tag.ID) for tag in refuelCtrl.filterTags($viewValue)\" class=\"form-control\"></div></div><div class=\"col-lg-3\"><p class=\"input-group\"><label for=\"txtEndDate\">End Date:</label><input id=\"txtEndDate\" placeholder=\"dd/MM/yyyy\" type=\"text\" class=\"form-control\" uib-datepicker-popup=\"{{refuelCtrl.format}}\" ng-model=\"refuelCtrl.endDateTime\" is-open=\"refuelCtrl.endDateTimeData.opened\" datepicker-options=\"refuelCtrl.dateOptions\" close-text=\"Close\" alt-input-formats=\"refuelCtrl.altInputFormats\"> <span class=\"input-group-btn\" id=\"btnOpenEndDateCalendar\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"refuelCtrl.endDateOpen()\"><i class=\"glyphicon glyphicon-calendar\"></i></button></span></p></div><div class=\"col-lg-3\" id=\"endTimeDiv\"><div uib-timepicker ng-model=\"refuelCtrl.endTime\" show-meridian=\"false\"></div></div></div><div class=\"row col-lg-offset-11\"><button id=\"searchButton\" class=\"btn btn-primary\" ng-click=\"refuelCtrl.checkSearchFilters()\">Search</button></div></div></uib-accordion><div uib-alert ng-show=\"refuelCtrl.errorMessageData.refuelErrorMessage.length\" ng-class=\"'alert-' + (refuelCtrl.errorMessageData.refuelAlertType || 'danger')\">{{refuelCtrl.errorMessageData.refuelErrorMessage}}</div><div id=\"refuelGrid\" ui-grid=\"refuelCtrl.gridOptions\" ui-grid-auto-fit-columns ui-grid-edit ui-grid-row-edit ui-grid-validate class=\"grid\"><span us-spinner=\"{radius:30, width:8, length: 16,color:'black'}\" spinner-on=\"refuelCtrl.loading\"></span><div class=\"watermark\" ng-show=\"!refuelCtrl.gridOptions.data.length && !refuelCtrl.loading\">No data available</div></div>"
  );


  $templateCache.put('modal/commonSettings.template.html',
    "<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"cancel()\">&times;</button><h3>Widget Options <small>{{widget.name}}</small></h3></div><!--<div class=\"modal-body\">\r" +
    "\n" +
    "    <form name=\"form\" novalidate class=\"form-horizontal\">\r" +
    "\n" +
    "        <div class=\"form-group\">\r" +
    "\n" +
    "            <label for=\"widgetTitle\" class=\"col-sm-2 control-label\">Title</label>\r" +
    "\n" +
    "            <div class=\"col-sm-10\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"widgetTitle\" ng-model=\"result.title\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div ng-if=\"widget.settingsModalOptions.partialTemplateUrl\" ng-include=\"widget.settingsModalOptions.partialTemplateUrl\"></div>\r" +
    "\n" +
    "    </form>\r" +
    "\n" +
    "</div>--><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"ok()\">OK</button></div>"
  );


  $templateCache.put('modal/timeout.template.html',
    "<div class=\"modal-header\"><h3>You're Idle. Do Something!</h3></div><div class=\"modal-body\"><timer finish-callback=\"timeoutFinished()\" interval=\"1000\" countdown=\"60\">You'll be logged out in {{countdown}} second(s)</timer><button type=\"button\" class=\"btn btn-primary\" uib-btn-checkbox ng-click=\"\">Continue</button></div>"
  );


  $templateCache.put('treeSelect/treeselect.checkbox.template.html',
    "<input type=\"text\" class=\"form-control\" ng-model=\"groupTreeQuery\" placeholder=\"Search group...\"><div class=\"form-group\" ivh-treeview=\"mapCtrl.groupTreeData\" ivh-treeview-on-cb-change=\"mapCtrl.filterByGroups(ivhNode, ivhIsSelected, ivhTree)\" ivh-treeview-filter=\"groupTreeQuery\"><div class=\"gridSpinne\" ng-show=\"mapCtrl.isGroupsLoading\"></div></div><button type=\"button\" class=\"btn btn-primary\" ng-click=\"mapCtrl.selectAllGroups()\">Select all</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"mapCtrl.unselectAllGroups()\">Unselect all</button>"
  );


  $templateCache.put('treeSelect/treeselect.template.html',
    "<input type=\"text\" class=\"form-control\" ng-model=\"groupTreeQuery\" placeholder=\"Search group...\"><div class=\"form-group\" ivh-treeview=\"groupTreeData\" ivh-treeview-use-checkboxes=\"false\" ivh-treeview-on-toggle=\"selectedGroupCallback(ivhNode, ivhIsSelected, ivhTree)\" ivh-treeview-filter=\"groupTreeQuery\"><div class=\"gridSpinne\" ng-show=\"isGroupsLoading\"></div></div>"
  );


  $templateCache.put('widgets/clock/clock.template.html',
    "<div class=\"clock-container\"><label>Now</label><div ngx-timer widgetid=\"{{widget.id}}\" timewidgetfor=\"now\" type=\"totalHours\" class=\"box hours\" id=\"hours\"></div><div class=\"divider\">:</div><div widgetid=\"{{widget.id}}\" timewidgetfor=\"now\" ngx-timer type=\"totalMinutes\" class=\"box minutes\" id=\"minutes\"></div><div class=\"divider\">:</div><div ngx-timer widgetid=\"{{widget.id}}\" timewidgetfor=\"now\" type=\"totalSeconds\" class=\"box seconds\" id=\"seconds\"></div></div><div class=\"clock-container\"><label>Today</label><div ngx-timer widgetid=\"{{widget.id}}\" timewidgetfor=\"today\" type=\"totalHours\" class=\"box hours\" id=\"hours\"></div><div class=\"divider\">:</div><div widgetid=\"{{widget.id}}\" timewidgetfor=\"today\" ngx-timer type=\"totalMinutes\" class=\"box minutes\" id=\"minutes\"></div><div class=\"divider\">:</div><div ngx-timer widgetid=\"{{widget.id}}\" timewidgetfor=\"today\" type=\"totalSeconds\" class=\"box seconds\" id=\"seconds\"></div></div><div class=\"clock-container\"><label>Week</label><div ngx-timer widgetid=\"{{widget.id}}\" timewidgetfor=\"week\" type=\"totalHours\" class=\"box hours\" id=\"hours\"></div><div class=\"divider\">:</div><div widgetid=\"{{widget.id}}\" timewidgetfor=\"week\" ngx-timer type=\"totalMinutes\" class=\"box minutes\" id=\"minutes\"></div><div class=\"divider\">:</div><div ngx-timer widgetid=\"{{widget.id}}\" timewidgetfor=\"week\" type=\"totalSeconds\" class=\"box seconds\" id=\"seconds\"></div></div><div class=\"clock-container\"><label>Month</label><div ngx-timer widgetid=\"{{widget.id}}\" timewidgetfor=\"month\" type=\"totalHours\" class=\"box hours\" id=\"hours\"></div><div class=\"divider\">:</div><div widgetid=\"{{widget.id}}\" timewidgetfor=\"month\" ngx-timer type=\"totalMinutes\" class=\"box minutes\" id=\"minutes\"></div><div class=\"divider\">:</div><div ngx-timer widgetid=\"{{widget.id}}\" timewidgetfor=\"month\" type=\"totalSeconds\" class=\"box seconds\" id=\"seconds\"></div></div>"
  );


  $templateCache.put('widgets/clock/clockWidget.template.html',
    "<div class=\"inner-box\"><span class=\"top\">{{current}}</span><span class=\"top-next\">{{next}}</span><span class=\"bottom-next\">{{next}}</span>	<span class=\"bottom\">{{current}}</span></div>"
  );


  $templateCache.put('widgets/common.widget.template.html',
    "<div ng-show=\"dashboardCtrl.showEmptySettingsMessage\"><label>Click the Settings icon to configure this widget.</label></div><span us-spinner=\"{radius:10, width:3, length: 5,color:'blue'}\" spinner-on=\"dashboardCtrl.showSpinner\"></span>"
  );


  $templateCache.put('widgets/dygraph/dygraph.irrigationMotor.settings.widget.template.html',
    "<div class=\"modal-header\"><button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\" ng-click=\"cancel()\">&times;</button><h3>Widget Options <small>{{widget.title}}</small></h3></div><div class=\"modal-body\"><div class=\"row\"><label for=\"clockWidgetRanges\" class=\"control-label\">Select Date Range</label><ob-daterangepicker id=\"clockWidgetRanges\" auto-apply=\"true\" on-apply=\"rangeApplied(start,end)\" ranges=\"ranges\" range=\"range\" calendars-always-on=\"false\" class=\"center\"></ob-daterangepicker></div><div class=\"clockWidgetFilters row\"><label for=\"clockWidgetFromDate\" class=\"control-label\">From</label><input id=\"clockWidgetFromDate\" ng-model=\"selectedRange.from\"><label for=\"clockWidgetToDate\" class=\"control-label\">To</label><input id=\"clockWidgetToDate\" ng-model=\"selectedRange.to\"> <input id=\"clockWidgetFromHour\" class=\"clockSettingsMinutes\" ng-model=\"selectedRange.fromHour\"> <input id=\"clockWidgetToHour\" class=\"clockSettingsMinutes\" ng-model=\"selectedRange.toHour\"></div><div class=\"row mapGridFilters\"><div class=\"col-xs-6 col-sm-6 col-md-6\"><div class=\"row\"><label for=\"clockWidgetFromDate\" class=\"control-label\">Vehicle group</label><button id=\"btnMapGroupsFilter\" uib-popover-template=\"'treeSelect/treeselect.template.html'\" popover-is-open=\"popoverIsOpen\" ng-click=\"popoverIsOpen = !popoverIsOpen\" popover-trigger=\"'outsideClick'\" popover-placement=\"bottom\" type=\"button\" class=\"btn btn-default\">{{treeButtonText}} <span class=\"caret pull-right\"></span></button></div><div class=\"row\"><label for=\"clockWidgetFromDate\" class=\"control-label\">Vehicle</label><div ng-dropdown-multiselect=\"\" options=\"vehiclesList\" ng-style=\"{'width':multiselectULMinWidth}\" translation-texts=\"multiSelectCustomTexts\" selected-model=\"multiSelectModel\" extra-settings=\"multiSelectSettings\" headers='{ \"Nickname\": \"NICK_NAME\", \"ID\": \"VEHICLE_BB_ID\"}'></div><div uib-alert ng-class=\"'alert-danger' \" ng-show=\"errorMessage.showError\">{{errorMessage.message}}</div></div></div></div></div><div class=\"modal-footer\"><button type=\"button\" class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button> <button type=\"button\" class=\"btn btn-primary\" ng-click=\"ok()\">OK</button></div>"
  );


  $templateCache.put('widgets/dygraph/dygraph.irrigationMotor.widget.template.html',
    "<!--<div ng-repeat=\"data in widget.widgetData\">\r" +
    "\n" +
    "    <nvd3 options=\"widget.widgetOptions\" data=\"data\" api=\"widget.api\" on-ready=\"widget.onReadyCallback\"></nvd3>\r" +
    "\n" +
    "</div>--><nvd3 ng-repeat=\"data in widget.widgetData\" options=\"(widget.widgetOptions|filter:dashboardCtrl.getWidgetOption(data[0]))[0]\" data=\"data\" api=\"widget.widgetApi[$index]\" on-ready=\"widget.onReadyCallback\" config=\"{ deepWatchDataDepth: 0}\"></nvd3><!--<div ng-repeat=\"data in widget.widgetData\">\r" +
    "\n" +
    "    <canvas id=\"line\" class=\"chart chart-line\" chart-data=\"data\"\r" +
    "\n" +
    "        chart-labels=\"widget.widgetLabel\" chart-series=\"series\" chart-options=\"widget.widgetOptions\"></canvas>\r" +
    "\n" +
    "</div>-->"
  );

}]);

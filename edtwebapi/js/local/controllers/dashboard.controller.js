app.controller('dashboardController', function ( $dashboardFactory, $commonUtils,  $vehiclesList, $mapFactory) {

    /**
     *  Buttom chnage color function
     * @param {type} buttonName
     */
    this.changeClass = function (buttonName) {
        this[buttonName] = !this[buttonName]
    }
    /**Local variables **/
    this.isCustomHeaderOpen = true;
    this.vehicleList = $vehiclesList;
    this.dashboardFactory = $dashboardFactory;
    this.getWidgetOption = $dashboardFactory.getWidgetOption
    this.showEmptySettingsMessage = true;
    this.showSpinner = false;


    /*Gridster grid init options*/
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

    /*Get widgets from factory setter*/
    this.widgets = $dashboardFactory.getWidgets();

    /**
     * Create idle time widget by button click
     */
    this.createIdleTimeWidget = $dashboardFactory.createIdleTimeWidget;

    /**
     * create irrigation motor widget by button click
     */
    this.createIrrigationMotorWidget = $dashboardFactory.createIrrigationMotorWidget;

    /**
     * Remove button common click callback
     * @param {type} widget
     */
    this.removeWidget = $dashboardFactory.removeWidget;

    /**
     * Open settings button common callback
     * @param {type} widget
     */
    this.openWidgetSettings = $dashboardFactory.openWidgetSettings;

    /**
     * Callback from settings menu for building irrigation motors charts 
     * by filtering object
     * @param {type} filterObject
     * @param {type} widgetId
     */
    this.getIrrigationMotorData = $dashboardFactory.getIrrigationMotorData

  
});
app.config(function ($httpProvider, localStorageServiceProvider, ivhTreeviewOptionsProvider/*, IdleProvider*/) {
    $httpProvider.interceptors.push('interceptors');
    localStorageServiceProvider
  .setPrefix('EDT')
  .setStorageType('sessionStorage');

        ivhTreeviewOptionsProvider.set({
            idAttribute: 'id',
            labelAttribute: 'label',
            childrenAttribute: 'children',
            selectedAttribute: 'selected',
            useCheckboxes: true,
            expandToDepth: 1,
            indeterminateAttribute: '__ivhTreeviewIndeterminate',
            expandedAttribute: '__ivhTreeviewExpanded',
            defaultSelectedState: false,
            validate: true,
            twistieExpandedTpl: '<span   class="twistie openFolder"></span>',
            twistieCollapsedTpl: '<span  class="twistie closeGroupFolder"></span>',
            twistieLeafTpl: '<span style="color:#00FF00;" class="twistie glyphicon glyphicon-leaf"></span>'
            //nodeTpl: '...'
        });

    //IdleProvider.idle(1080);/*18 minutes*/
    //IdleProvider.interrupt('keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll click')
    //IdleProvider.timeout(120);/*18 minutes+120 seconds*/
});
/*(function() {*/
  var app = angular.module('angular-360-no-scope', []);

  // Decorate both $controllerProvider.register and $controller service fn
  // Have them wrap the incoming controller definition in the makeController surrogate
  app.config([ '$controllerProvider', '$provide', function($controllerProvider, $provide) {
    var realRegister = $controllerProvider.register;
    $controllerProvider.register = function registerDecorator(name, constructor) {        
      return realRegister(name, makeController(constructor));
    };

    $provide.decorator('$controller', function($delegate) {
      return function $controllerDecorator() {
        return $delegate.apply($delegate, arguments);
      }
    });
  }]);

  var injector = angular.injector();

  // This is the heart of this implementation. This function wraps
  // a controller inside a surrogate controller function which will
  // add $watch capability on the controller.
  function makeController(ctrlImpl) {
    // Figure out what deps the ctrlImpl requires.
    // Append the two injectables we require
    var deps = injector.annotate(ctrlImpl).concat([ '$scope', '$injector', '$parse' ]);

    // This is the surrogate controller which is returned
    // It wraps the ctrlImpl the app developer defines and adds
    // the $watch passthrough.
    function surrogateController() {
      // When this is invoked later by angular, it will be injected with services/locals
      // Snag the injected objects
      var injected = arguments, instance = this, locals = {};;

      // We always inject $scope, $injector, and $parse.  Snag those three things.
      var $scope = arguments[arguments.length - 3];
      var $injector = arguments[arguments.length - 2];
      var $parse = arguments[arguments.length - 1];

      // Recreate a "locals" array (in case any locals were injected)
      // We map the 'deps' and 'injected' arrays back into an assoc-array
      for (var i = 0; i < deps.length; i++) { locals[deps[i]] = injected[i]; }

      // Add a $scope.$watch passthrough onto the ctrlImpl's prototype (and
      // therefore onto the surrogate controller's prototype as well)
      ctrlImpl.prototype.$watch = function() {
        var args = arguments, watchExpr = args[0];

        if (angular.isString(watchExpr)) {
          // If watchExpr is a String, set up a $parse fn which evaluates against `instance`
          var getExpr = $parse(watchExpr);
          args[0] = function() { return getExpr(instance); }
        }

        return $scope.$watch.apply($scope, args);
      }

      ctrlImpl.prototype.$watchGroup = function () {
          var args = arguments, watchExpr = args[0];         
          watchExpr.forEach(function (item,index,array) {
              var getExpr = $parse(item);
              array[index] = function () { return getExpr(instance); }
          });
          return $scope.$watchGroup.apply($scope, args);          
      }

      // Add some other $scope passthroughs to ctrlImpl prototype; just because.
      angular.forEach(['$on', '$broadcast', '$emit'], function(fnName) {
        ctrlImpl.prototype[fnName] = function() {
          $scope[fnName].apply($scope, arguments);
        }
      });

      // This worked in 1.2.x but 1.3.0 introduced invoking controllers 'later'
      // return instance = $injector.instantiate(ctrlImpl, locals);

      // Finally, return the result of calling "ctrlImpl(injectedVars...)" with
      // `this` bound to the surrogate instance.  This will let the controller code
      // use 'this' and apply it to the surrogate.
      $injector.invoke(ctrlImpl, instance, locals);
    }

    // Annotate the surrogateController surrogate function with required injectables
    surrogateController.$inject = deps;
    // Make the surrogate's protoype the ctrlImp's prototype because the surrogate
    // is what is actually returned and set into the $scope.
    surrogateController.prototype = ctrlImpl.prototype;

    // return the surrogate fn here
    return surrogateController;
  }
/*})();*/

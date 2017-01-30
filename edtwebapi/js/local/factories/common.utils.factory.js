app.factory('$commonUtils', function () {
    var localBaseURL = 'http://localhost:60000/{0}/{1}';
    return {

        extractTime: function (input) {
            var moment = window.moment(input);
            return [this.convertNumberToLeadingZero(moment.hours()), this.convertNumberToLeadingZero(moment.minutes())].join(':')
        },
        convertNumberToLeadingZero: function (number) {
            return number.toString().length == 1 ? ('0' + number) : number;
        },
        formatTime: function (time) {
            var result = false, m;
            var re = /^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/;
            if ((m = time.match(re))) {
                result = (m[1].length === 2 ? "" : "0") + m[1] + ":" + m[2];
            }
            return result;
        },
        formatString: function (stringToFormat) {
            var args = Array.prototype.slice.call(arguments, 1);
            return stringToFormat.replace(/\{(\d+)\}/g, function (match, index) {
                return args[index];
            });
        },
        getBaseURL: function (environment) {
            //switch (environment) { }
            return localBaseURL;
        },
        getCommonTypeaheadModelOptions: function () {
            return {
                debounce: {
                    default: 500,
                    blur: 250
                },
                getterSetter: true
            };
        },
        getCommonDatePickerOptions: function () {
            return {
                dateOptions: {
                    formatYear: 'yyyy',
                    startingDay: 0
                },
                dateFormat: 'dd/MM/yyyy',
                inputFormats: ['d!/M!/yyyy']
            }
        },
        getUTCDateTime: function (year, month, day, hours, minutes, seconds) {
            var date = new Date();
            return new Date(year || date.getUTCFullYear(), month || date.getUTCMonth(), day || date.getUTCDate(), hours || date.getUTCHours(), minutes || date.getUTCMinutes(), seconds || date.getUTCSeconds());
        },
        generateQuickGuid: function () {
            return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
        },
        getAbsoluteURL: function (url) {
            var a;
            url = url || location.href
            if (!a) a = document.createElement('a');
            a.href = url;
            return a.href;

        },
        numberInRange: function (number, lower, upper) {
            return number >= lower && number <= upper;
        },
        getElementOffset: function (element) {
            var _x = 0;
            var _y = 0;
            var body = document.documentElement || document.body;
            var scrollX = window.pageXOffset || body.scrollLeft;
            var scrollY = window.pageYOffset || body.scrollTop;
            _x = element[0].getBoundingClientRect().left + scrollX;
            _y = element[0].getBoundingClientRect().top + scrollY;
            return { left: _x, top: _y };
        },
        setElementOffset: function (element, offset) {
            element[0].style.left = (offset.left + 170) + 'px';
            element[0].style.top = offset.top + 'px';
        },
        getArrayUniqueObjects: function (array, byProperties) {
            function compare(a, b) {
                var prop;
                if (byProperties) {
                    for (var j = 0; j < byProperties.length; j++) {
                        prop = byProperties[j];
                        if (a[prop] != b[prop]) {
                            return false;
                        }
                    }
                } else {
                    for (prop in a) {
                        if (a[prop] != b[prop]) {
                            return false;
                        }
                    }

                }
                return true;
            }
            return array.filter(function (item, index, list) {
                for (var i = 0; i < index; i++) {
                    if (compare(item, list[i])) {
                        return false;
                    }
                }
                return true;
            });
        },
        listToTree: function (data, options) {
            options = options || {};
            var ID_KEY = options.idKey || 'id';
            var PARENT_KEY = options.parentKey || 'parent';
            var CHILDREN_KEY = options.childrenKey || 'children';
            var CUSTOM_ID_KEY_NAME = options.customID || 'value';
            var CUSTOM_ID_VALUE_NAME = options.customValue || 'label';

            var tree = [],
                childrenOf = {};
            var item, id, parentId;

            for (var i = 0, length = data.length; i < length; i++) {
                item = data[i];
                id = item[ID_KEY];
                parentId = item[PARENT_KEY] || 0;
                // every item may have children
                childrenOf[id] = childrenOf[id] || [];
                // init its children
                item[CHILDREN_KEY] = childrenOf[id];
                if (parentId != 0) {
                    // init its parent's children object
                    childrenOf[parentId] = childrenOf[parentId] || [];
                    // push it into its parent's children object
                    childrenOf[parentId].push(item);
                } else {

                    tree.push(item);
                }
            };

            return tree;
        },
        refitKeys: function (o, mapping) {
            var build, key, destKey, ix, value;

            build = {};
            var isArray = Array.isArray(o);
            for (key in o) {
                // Get the destination key
                destKey = mapping[key] || key;

                // Get the value
                value = o[key];

                // If this is an object, recurse
                if (typeof value === "object") {
                    value = this.refitKeys(value, mapping);
                }

                // Set it on the result using the destination key
                build[destKey] = value;
            }
            return isArray ? Object.values(build) : build;
        },
        isObjectEmpty: function (obj) {
            if (obj == null) return true;

            // Assume if it has a length property with a non-zero value
            // that that property is correct.
            if (obj.length > 0) return false;
            if (obj.length === 0) return true;

            // If it isn't an object at this point
            // it is empty, but it can't be anything *but* empty
            // Is it empty?  Depends on your application.
            if (typeof obj !== "object") return true;

            // Otherwise, does it have any properties of its own?
            // Note that this doesn't handle
            // toString and valueOf enumeration bugs in IE < 9
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
            }

            return true;
        },
        getArrayUniqueValues: function (arr1, arr2, prop) {
            arr2.forEach(function (arr2obj) {
                var arr1obj = arr1.find(function (arr1obj) {
                    return arr1obj[prop] === arr2obj[prop];
                });

                //arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
                if (!arr1obj) {
                    arr1.push(arr2obj)
                }
            });
            return arr1;
        },
        hasOwnDeepProperty: function (obj, prop) {
            if (typeof obj === 'object' && obj !== null) { // only performs property checks on objects (taking care of the corner case for null as well)
                if (obj.hasOwnProperty(prop)) {              // if this object already contains the property, we are done
                    return true;
                }
                for (var p in obj) {                         // otherwise iterate on all the properties of this object
                    if (obj.hasOwnProperty(p) &&               // and as soon as you find the property you are looking for, return true
                       this.hasOwnDeepProperty(obj[p], prop)) {
                        return true;
                    }
                }
                return false;                                // no object property in the passed in 'obj' contains the property we are looking for
            }
            return false;                                  // value passed in is not an object
        },
        createObjectBy: function (objectFrom, arrayOfProperties) {
            var _this = objectFrom;
            var obj = {};
            arr.forEach(function (key) {
                obj[key] = _this[key];
            });
            return obj;
        },
        mergeObjectsUndefinedProperties: function () {
            var object = arguments[0];
            var args = arguments;
            for (var i = 1; i < arguments.length; i++) {
                if (arguments[i]) {
                    Object.keys(arguments[i]).forEach(function (key, index) {
                        if (object[key] === undefined ||
                       ((object[key] === Object.prototype[key] || (object[key] !== object[key] && Object.prototype[key] !== Object.prototype[key])) && !hasOwnProperty.call(object, key))) {
                            object[key] = args[i][key];
                        }

                    });
                }
            }
            return object;
        },
        checkIfDefined: function (value,checkIfZero) {
            var result = value == null || value === null || value == undefined || typeof (value) === 'undefined' || (Object.prototype.toString.call(value) === '[object String]' && !value.length);
            if (checkIfZero) {
                result = result || (value==0);
            }
            return result;
        },
        getDeviceDimentions: function () {
            return {
                width: (window.innerWidth > 0) ? window.innerWidth : screen.width,
                height: (window.innerHeight > 0) ? window.innerHeight : screen.height
            }
        },
        rgb2hex:function(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
         ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    }
})

var Page;
(function (Page) {
    var Demopage;
    (function (Demopage) {
        var errorsBlockId = "error-messages";
        var errorsBlock = document.getElementById(errorsBlockId);
        if (!errorsBlock) {
            console.error("Cannot find element '" + errorsBlockId + "'.");
        }
        function getErrorById(id) {
            return errorsBlock.querySelector("span[id=error-message-" + id + "]");
        }
        function setErrorMessage(id, message) {
            if (errorsBlock) {
                var existingSpan = getErrorById(id);
                if (existingSpan) {
                    existingSpan.innerHTML = message;
                    return;
                }
                else {
                    var newSpan = document.createElement("span");
                    newSpan.id = "error-message-" + id;
                    newSpan.innerText = message;
                    errorsBlock.appendChild(newSpan);
                    errorsBlock.appendChild(document.createElement("br"));
                }
            }
        }
        Demopage.setErrorMessage = setErrorMessage;
        function removeErrorMessage(id) {
            if (errorsBlock) {
                var span = getErrorById(id);
                if (span) {
                    var br = span.nextElementSibling;
                    if (br) {
                        errorsBlock.removeChild(br);
                    }
                    errorsBlock.removeChild(span);
                }
            }
        }
        Demopage.removeErrorMessage = removeErrorMessage;
    })(Demopage = Page.Demopage || (Page.Demopage = {}));
})(Page || (Page = {}));

var Page;
(function (Page) {
    var Helpers;
    (function (Helpers) {
        var URL;
        (function (URL) {
            var PARAMETERS_PREFIX = "page";
            var URLBuilder = /** @class */ (function () {
                function URLBuilder(url) {
                    this.queryParameters = {};
                    var queryStringDelimiterIndex = url.indexOf(URLBuilder.queryDelimiter);
                    if (queryStringDelimiterIndex < 0) {
                        this.baseUrl = url;
                    }
                    else {
                        this.baseUrl = url.substring(0, queryStringDelimiterIndex);
                        var queryString = url.substring(queryStringDelimiterIndex + URLBuilder.queryDelimiter.length);
                        var splitParameters = queryString.split(URLBuilder.parameterDelimiter);
                        for (var _i = 0, splitParameters_1 = splitParameters; _i < splitParameters_1.length; _i++) {
                            var parameter = splitParameters_1[_i];
                            var keyValue = parameter.split(URLBuilder.keyValueDelimiter);
                            if (keyValue.length === 2) {
                                var key = decodeURIComponent(keyValue[0]);
                                var value = decodeURIComponent(keyValue[1]);
                                this.queryParameters[key] = value;
                            }
                            else {
                                console.log("Unable to parse query string parameter '" + parameter + "'.");
                            }
                        }
                    }
                }
                URLBuilder.prototype.setQueryParameter = function (name, value) {
                    if (value === null) {
                        delete this.queryParameters[name];
                    }
                    else {
                        this.queryParameters[name] = value;
                    }
                };
                URLBuilder.prototype.loopOnParameters = function (prefix, callback) {
                    for (var _i = 0, _a = Object.keys(this.queryParameters); _i < _a.length; _i++) {
                        var parameterName = _a[_i];
                        if (parameterName.indexOf(prefix) === 0 && parameterName.length > prefix.length) {
                            var parameterValue = this.queryParameters[parameterName];
                            var shortParameterName = parameterName.substring(prefix.length);
                            callback(shortParameterName, parameterValue);
                        }
                    }
                };
                URLBuilder.prototype.buildUrl = function () {
                    var parameters = [];
                    for (var _i = 0, _a = Object.keys(this.queryParameters); _i < _a.length; _i++) {
                        var parameterName = _a[_i];
                        var parameterValue = this.queryParameters[parameterName];
                        var encodedName = encodeURIComponent(parameterName);
                        var encodedValue = encodeURIComponent(parameterValue);
                        parameters.push(encodedName + URLBuilder.keyValueDelimiter + encodedValue);
                    }
                    var queryString = parameters.join(URLBuilder.parameterDelimiter);
                    if (queryString) {
                        return this.baseUrl + URLBuilder.queryDelimiter + queryString;
                    }
                    else {
                        return this.baseUrl;
                    }
                };
                URLBuilder.queryDelimiter = "?";
                URLBuilder.parameterDelimiter = "&";
                URLBuilder.keyValueDelimiter = "=";
                return URLBuilder;
            }());
            function buildPrefix() {
                var prefixes = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    prefixes[_i] = arguments[_i];
                }
                return prefixes.join(":") + ":";
            }
            function updateUrl(newUrl) {
                window.history.replaceState("", "", newUrl);
            }
            function loopOnParameters(prefix, callback) {
                var urlBuilder = new URLBuilder(window.location.href);
                var fullPrefix = buildPrefix(PARAMETERS_PREFIX, prefix);
                urlBuilder.loopOnParameters(fullPrefix, callback);
            }
            URL.loopOnParameters = loopOnParameters;
            function setQueryParameter(prefix, name, value) {
                var urlBuilder = new URLBuilder(window.location.href);
                var fullPrefix = buildPrefix(PARAMETERS_PREFIX, prefix);
                urlBuilder.setQueryParameter(fullPrefix + name, value);
                updateUrl(urlBuilder.buildUrl());
            }
            URL.setQueryParameter = setQueryParameter;
            function removeQueryParameter(prefix, name) {
                var urlBuilder = new URLBuilder(window.location.href);
                var fullPrefix = buildPrefix(PARAMETERS_PREFIX, prefix);
                urlBuilder.setQueryParameter(fullPrefix + name, null);
                updateUrl(urlBuilder.buildUrl());
            }
            URL.removeQueryParameter = removeQueryParameter;
        })(URL = Helpers.URL || (Helpers.URL = {}));
        var Events;
        (function (Events) {
            function callAfterDOMLoaded(callback) {
                if (document.readyState === "loading") { // Loading hasn't finished yet
                    document.addEventListener("DOMContentLoaded", callback);
                }
                else { // `DOMContentLoaded` has already fired
                    callback();
                }
            }
            Events.callAfterDOMLoaded = callAfterDOMLoaded;
        })(Events = Helpers.Events || (Helpers.Events = {}));
    })(Helpers = Page.Helpers || (Page.Helpers = {}));
})(Page || (Page = {}));

var Page;
(function (Page) {
    var Controls;
    (function (Controls) {
        function getElementBySelector(selector) {
            var elt = document.querySelector(selector);
            if (!elt) {
                console.error("Cannot find control '" + selector + "'.");
            }
            return elt;
        }
        function setVisibility(id, visible) {
            var control = getElementBySelector("div#control-" + id);
            if (control) {
                control.style.display = visible ? "" : "none";
            }
        }
        Controls.setVisibility = setVisibility;
    })(Controls = Page.Controls || (Page.Controls = {}));
})(Page || (Page = {}));
(function (Page) {
    var Sections;
    (function (Sections) {
        function getElementBySelector(selector) {
            var elt = document.querySelector(selector);
            if (!elt) {
                console.error("Cannot find section '" + selector + "'.");
            }
            return elt;
        }
        function reevaluateSeparatorsVisibility(controlsBlockElement) {
            function isHr(element) {
                return element.tagName.toLowerCase() === "hr";
            }
            function isVisible(element) {
                return element.style.display !== "none";
            }
            var sectionsOrHr = controlsBlockElement.querySelectorAll("section, hr");
            //remove duplicate HRs
            var lastWasHr = false;
            for (var i = 0; i < sectionsOrHr.length; i++) {
                if (isHr(sectionsOrHr[i])) {
                    sectionsOrHr[i].style.display = lastWasHr ? "none" : "";
                    lastWasHr = true;
                }
                else if (isVisible(sectionsOrHr[i])) {
                    lastWasHr = false;
                }
            }
            // remove leading HRs
            for (var i = 0; i < sectionsOrHr.length; i++) {
                if (isHr(sectionsOrHr[i])) {
                    sectionsOrHr[i].style.display = "none";
                }
                else if (isVisible(sectionsOrHr[i])) {
                    break;
                }
            }
            // remove trailing HRs
            for (var i = sectionsOrHr.length - 1; i >= 0; i--) {
                if (isHr(sectionsOrHr[i])) {
                    sectionsOrHr[i].style.display = "none";
                }
                else if (isVisible(sectionsOrHr[i])) {
                    break;
                }
            }
        }
        function setVisibility(id, visible) {
            var section = getElementBySelector("section#section-" + id);
            if (section) {
                section.style.display = visible ? "" : "none";
                reevaluateSeparatorsVisibility(section.parentElement);
            }
        }
        Sections.setVisibility = setVisibility;
    })(Sections = Page.Sections || (Page.Sections = {}));
})(Page || (Page = {}));


var Page;
(function (Page) {
    var Checkbox;
    (function (Checkbox_1) {
        var Checkbox = /** @class */ (function () {
            function Checkbox(element) {
                var _this = this;
                this.observers = [];
                this.id = element.id;
                this.element = element;
                this.reloadValue();
                this.element.addEventListener("change", function () {
                    _this.reloadValue();
                    Storage.storeState(_this);
                    _this.callObservers();
                });
            }
            Object.defineProperty(Checkbox.prototype, "checked", {
                get: function () {
                    return this._checked;
                },
                set: function (newChecked) {
                    this.element.checked = newChecked;
                    this.reloadValue();
                },
                enumerable: false,
                configurable: true
            });
            Checkbox.prototype.callObservers = function () {
                for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    observer(this.checked);
                }
            };
            Checkbox.prototype.reloadValue = function () {
                this._checked = this.element.checked;
            };
            return Checkbox;
        }());
        var Cache;
        (function (Cache) {
            function loadCache() {
                var result = {};
                var selector = "div.checkbox > input[type=checkbox][id]";
                var elements = document.querySelectorAll(selector);
                for (var i = 0; i < elements.length; i++) {
                    var checkbox = new Checkbox(elements[i]);
                    result[checkbox.id] = checkbox;
                }
                return result;
            }
            var checkboxesCache;
            function getCheckboxById(id) {
                Cache.load();
                return checkboxesCache[id] || null;
            }
            Cache.getCheckboxById = getCheckboxById;
            function load() {
                if (typeof checkboxesCache === "undefined") {
                    checkboxesCache = loadCache();
                }
            }
            Cache.load = load;
        })(Cache || (Cache = {}));
        var Storage;
        (function (Storage) {
            var PREFIX = "checkbox";
            var CHECKED = "true";
            var UNCHECKED = "false";
            function storeState(checkbox) {
                var stateAsString = checkbox.checked ? CHECKED : UNCHECKED;
                Page.Helpers.URL.setQueryParameter(PREFIX, checkbox.id, stateAsString);
            }
            Storage.storeState = storeState;
            function clearStoredState(checkbox) {
                Page.Helpers.URL.removeQueryParameter(PREFIX, checkbox.id);
            }
            Storage.clearStoredState = clearStoredState;
            function applyStoredState() {
                Page.Helpers.URL.loopOnParameters(PREFIX, function (checkboxId, value) {
                    var checkbox = Cache.getCheckboxById(checkboxId);
                    if (!checkbox || (value !== CHECKED && value !== UNCHECKED)) {
                        console.log("Removing invalid query parameter '" + checkboxId + "=" + value + "'.");
                        Page.Helpers.URL.removeQueryParameter(PREFIX, checkboxId);
                    }
                    else {
                        checkbox.checked = (value === CHECKED);
                        checkbox.callObservers();
                    }
                });
            }
            Storage.applyStoredState = applyStoredState;
        })(Storage || (Storage = {}));
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            Cache.load();
            Storage.applyStoredState();
        });
        /**
         * @return {boolean} Whether or not the observer was added
         */
        function addObserver(checkboxId, observer) {
            var checkbox = Cache.getCheckboxById(checkboxId);
            if (checkbox) {
                checkbox.observers.push(observer);
                return true;
            }
            return false;
        }
        Checkbox_1.addObserver = addObserver;
        function setChecked(checkboxId, value) {
            var checkbox = Cache.getCheckboxById(checkboxId);
            if (checkbox) {
                checkbox.checked = value;
            }
        }
        Checkbox_1.setChecked = setChecked;
        function isChecked(checkboxId) {
            var checkbox = Cache.getCheckboxById(checkboxId);
            if (checkbox) {
                return checkbox.checked;
            }
            return false;
        }
        Checkbox_1.isChecked = isChecked;
        function storeState(checkboxId) {
            var checkbox = Cache.getCheckboxById(checkboxId);
            Storage.storeState(checkbox);
        }
        Checkbox_1.storeState = storeState;
        function clearStoredState(checkboxId) {
            var checkbox = Cache.getCheckboxById(checkboxId);
            Storage.clearStoredState(checkbox);
        }
        Checkbox_1.clearStoredState = clearStoredState;
    })(Checkbox = Page.Checkbox || (Page.Checkbox = {}));
})(Page || (Page = {}));


var Page;
(function (Page) {
    var Range;
    (function (Range_1) {
        var Range = /** @class */ (function () {
            function Range(container) {
                var _this = this;
                this.onInputObservers = [];
                this.onChangeObservers = [];
                this.inputElement = container.querySelector("input[type='range']");
                this.progressLeftElement = container.querySelector(".range-progress-left");
                this.tooltipElement = container.querySelector("output.range-tooltip");
                this.id = this.inputElement.id;
                var inputMin = +this.inputElement.min;
                var inputMax = +this.inputElement.max;
                var inputStep = +this.inputElement.step;
                this.nbDecimalsToDisplay = Range.getMaxNbDecimals(inputMin, inputMax, inputStep);
                this.inputElement.addEventListener("input", function (event) {
                    event.stopPropagation();
                    _this.reloadValue();
                    _this.callSpecificObservers(_this.onInputObservers);
                });
                this.inputElement.addEventListener("change", function (event) {
                    event.stopPropagation();
                    _this.reloadValue();
                    Storage.storeState(_this);
                    _this.callSpecificObservers(_this.onChangeObservers);
                });
                this.reloadValue();
            }
            Object.defineProperty(Range.prototype, "value", {
                get: function () {
                    return this._value;
                },
                set: function (newValue) {
                    this.inputElement.value = "" + newValue;
                    this.reloadValue();
                },
                enumerable: false,
                configurable: true
            });
            Range.prototype.callObservers = function () {
                this.callSpecificObservers(this.onInputObservers);
                this.callSpecificObservers(this.onChangeObservers);
            };
            Range.prototype.callSpecificObservers = function (observers) {
                for (var _i = 0, observers_1 = observers; _i < observers_1.length; _i++) {
                    var observer = observers_1[_i];
                    observer(this.value);
                }
            };
            Range.prototype.updateAppearance = function () {
                var currentLength = +this.inputElement.value - +this.inputElement.min;
                var totalLength = +this.inputElement.max - +this.inputElement.min;
                var progression = currentLength / totalLength;
                progression = Math.max(0, Math.min(1, progression));
                this.progressLeftElement.style.width = (100 * progression) + "%";
                var text;
                if (this.nbDecimalsToDisplay < 0) {
                    text = this.inputElement.value;
                }
                else {
                    text = (+this.inputElement.value).toFixed(this.nbDecimalsToDisplay);
                }
                this.tooltipElement.textContent = text;
            };
            Range.prototype.reloadValue = function () {
                this._value = +this.inputElement.value;
                this.updateAppearance();
            };
            Range.getMaxNbDecimals = function () {
                var numbers = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    numbers[_i] = arguments[_i];
                }
                var nbDecimals = -1;
                for (var _a = 0, numbers_1 = numbers; _a < numbers_1.length; _a++) {
                    var n = numbers_1[_a];
                    var local = Range.nbDecimals(n);
                    if (n < 0) {
                        return -1;
                    }
                    else if (nbDecimals < local) {
                        nbDecimals = local;
                    }
                }
                return nbDecimals;
            };
            Range.nbDecimals = function (x) {
                var xAsString = x.toString();
                if (/^[0-9]+$/.test(xAsString)) {
                    return 0;
                }
                else if (/^[0-9]+\.[0-9]+$/.test(xAsString)) {
                    return xAsString.length - (xAsString.indexOf(".") + 1);
                }
                return -1; // failed to parse
            };
            return Range;
        }());
        var Cache;
        (function (Cache) {
            function loadCache() {
                var result = {};
                var selector = ".range-container > input[type='range']";
                var rangeElements = document.querySelectorAll(selector);
                for (var i = 0; i < rangeElements.length; i++) {
                    var container = rangeElements[i].parentElement;
                    var id = rangeElements[i].id;
                    result[id] = new Range(container);
                }
                return result;
            }
            var rangesCache;
            function getRangeById(id) {
                Cache.load();
                return rangesCache[id] || null;
            }
            Cache.getRangeById = getRangeById;
            function load() {
                if (typeof rangesCache === "undefined") {
                    rangesCache = loadCache();
                }
            }
            Cache.load = load;
        })(Cache || (Cache = {}));
        var Storage;
        (function (Storage) {
            var PREFIX = "range";
            function storeState(range) {
                var valueAsString = "" + range.value;
                Page.Helpers.URL.setQueryParameter(PREFIX, range.id, valueAsString);
            }
            Storage.storeState = storeState;
            function clearStoredState(range) {
                Page.Helpers.URL.removeQueryParameter(PREFIX, range.id);
            }
            Storage.clearStoredState = clearStoredState;
            function applyStoredState() {
                Page.Helpers.URL.loopOnParameters(PREFIX, function (controlId, value) {
                    var range = Cache.getRangeById(controlId);
                    if (!range) {
                        console.log("Removing invalid query parameter '" + controlId + "=" + value + "'.");
                        Page.Helpers.URL.removeQueryParameter(PREFIX, controlId);
                    }
                    else {
                        range.value = +value;
                        range.callObservers();
                    }
                });
            }
            Storage.applyStoredState = applyStoredState;
        })(Storage || (Storage = {}));
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            Cache.load();
            Storage.applyStoredState();
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
        /**
         * Callback will be called every time the value changes.
         * @return {boolean} Whether or not the observer was added
         */
        function addObserver(rangeId, observer) {
            var range = Cache.getRangeById(rangeId);
            if (range) {
                if (isIE11) { // bug in IE 11, input event is never fired
                    range.onChangeObservers.push(observer);
                }
                else {
                    range.onInputObservers.push(observer);
                }
                return true;
            }
            return false;
        }
        Range_1.addObserver = addObserver;
        /**
         * Callback will be called only when the value stops changing.
         * @return {boolean} Whether or not the observer was added
         */
        function addLazyObserver(rangeId, observer) {
            var range = Cache.getRangeById(rangeId);
            if (range) {
                range.onChangeObservers.push(observer);
                return true;
            }
            return false;
        }
        Range_1.addLazyObserver = addLazyObserver;
        function getValue(rangeId) {
            var range = Cache.getRangeById(rangeId);
            if (!range) {
                return null;
            }
            return range.value;
        }
        Range_1.getValue = getValue;
        function setValue(rangeId, value) {
            var range = Cache.getRangeById(rangeId);
            if (range) {
                range.value = value;
            }
        }
        Range_1.setValue = setValue;
        function storeState(rangeId) {
            var range = Cache.getRangeById(rangeId);
            Storage.storeState(range);
        }
        Range_1.storeState = storeState;
        function clearStoredState(rangeId) {
            var range = Cache.getRangeById(rangeId);
            Storage.clearStoredState(range);
        }
        Range_1.clearStoredState = clearStoredState;
    })(Range = Page.Range || (Page.Range = {}));
})(Page || (Page = {}));


var Page;
(function (Page) {
    var Tabs;
    (function (Tabs_1) {
        var Tabs = /** @class */ (function () {
            function Tabs(container) {
                var _this = this;
                this.observers = [];
                this.id = Tabs.computeShortId(container.id);
                this.inputElements = [];
                var inputElements = container.querySelectorAll("input");
                for (var i = 0; i < inputElements.length; i++) {
                    this.inputElements.push(inputElements[i]);
                    inputElements[i].addEventListener("change", function (event) {
                        event.stopPropagation();
                        _this.reloadValues();
                        Storage.storeState(_this);
                        _this.callObservers();
                    }, false);
                }
                this.reloadValues();
            }
            Tabs.computeShortId = function (fullId) {
                if (fullId.lastIndexOf(Tabs.ID_SUFFIX) != fullId.length - Tabs.ID_SUFFIX.length) {
                    throw new Error("Invalid tabs container id: '" + fullId + "'.");
                }
                return fullId.substring(0, fullId.length - Tabs.ID_SUFFIX.length);
            };
            Object.defineProperty(Tabs.prototype, "values", {
                get: function () {
                    return this._values;
                },
                set: function (newValues) {
                    for (var _i = 0, _a = this.inputElements; _i < _a.length; _i++) {
                        var inputElement = _a[_i];
                        var isWanted = false;
                        for (var _b = 0, newValues_1 = newValues; _b < newValues_1.length; _b++) {
                            var newValue = newValues_1[_b];
                            if (inputElement.value === newValue) {
                                isWanted = true;
                                break;
                            }
                        }
                        inputElement.checked = isWanted;
                    }
                    this.reloadValues();
                },
                enumerable: false,
                configurable: true
            });
            Tabs.prototype.callObservers = function () {
                for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    observer(this._values);
                }
            };
            Tabs.prototype.reloadValues = function () {
                var values = [];
                for (var _i = 0, _a = this.inputElements; _i < _a.length; _i++) {
                    var inputElement = _a[_i];
                    if (inputElement.checked) {
                        values.push(inputElement.value);
                    }
                }
                this._values = values;
            };
            Tabs.ID_SUFFIX = "-id";
            return Tabs;
        }());
        var Cache;
        (function (Cache) {
            function loadCache() {
                var result = {};
                var containerElements = document.querySelectorAll("div.tabs[id]");
                for (var i = 0; i < containerElements.length; i++) {
                    var tabs = new Tabs(containerElements[i]);
                    result[tabs.id] = tabs;
                }
                return result;
            }
            var tabsCache;
            function getTabsById(id) {
                Cache.load();
                return tabsCache[id] || null;
            }
            Cache.getTabsById = getTabsById;
            function load() {
                if (typeof tabsCache === "undefined") {
                    tabsCache = loadCache();
                }
            }
            Cache.load = load;
        })(Cache || (Cache = {}));
        var Storage;
        (function (Storage) {
            var PREFIX = "tabs";
            var SEPARATOR = ";";
            function storeState(tabs) {
                var valuesList = tabs.values;
                var values = valuesList.join(SEPARATOR);
                Page.Helpers.URL.setQueryParameter(PREFIX, tabs.id, values);
            }
            Storage.storeState = storeState;
            function clearStoredState(tabs) {
                Page.Helpers.URL.removeQueryParameter(PREFIX, tabs.id);
            }
            Storage.clearStoredState = clearStoredState;
            function applyStoredState() {
                Page.Helpers.URL.loopOnParameters(PREFIX, function (controlId, value) {
                    var values = value.split(SEPARATOR);
                    var tabs = Cache.getTabsById(controlId);
                    if (!tabs) {
                        console.log("Removing invalid query parameter '" + controlId + "=" + value + "'.");
                        Page.Helpers.URL.removeQueryParameter(PREFIX, controlId);
                    }
                    else {
                        tabs.values = values;
                        tabs.callObservers();
                    }
                });
            }
            Storage.applyStoredState = applyStoredState;
        })(Storage || (Storage = {}));
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            Cache.load();
            Storage.applyStoredState();
        });
        /**
         * @return {boolean} Whether or not the observer was added
         */
        function addObserver(tabsId, observer) {
            var tabs = Cache.getTabsById(tabsId);
            if (tabs) {
                tabs.observers.push(observer);
                return true;
            }
            return false;
        }
        Tabs_1.addObserver = addObserver;
        function getValues(tabsId) {
            var tabs = Cache.getTabsById(tabsId);
            return tabs.values;
        }
        Tabs_1.getValues = getValues;
        function setValues(tabsId, values, updateURLStorage) {
            if (updateURLStorage === void 0) { updateURLStorage = false; }
            var tabs = Cache.getTabsById(tabsId);
            tabs.values = values;
            if (updateURLStorage) {
                Storage.storeState(tabs);
            }
        }
        Tabs_1.setValues = setValues;
        function storeState(tabsId) {
            var tabs = Cache.getTabsById(tabsId);
            Storage.storeState(tabs);
        }
        Tabs_1.storeState = storeState;
        function clearStoredState(tabsIdd) {
            var tabs = Cache.getTabsById(tabsIdd);
            Storage.clearStoredState(tabs);
        }
        Tabs_1.clearStoredState = clearStoredState;
    })(Tabs = Page.Tabs || (Page.Tabs = {}));
})(Page || (Page = {}));


var Page;
(function (Page) {
    var Select;
    (function (Select_1) {
        var Select = /** @class */ (function () {
            function Select(container) {
                var _this = this;
                this.observers = [];
                this.id = container.id;
                this.containerElement = container;
                this.currentValueElement = container.querySelector(".select-current-value");
                this.valuesListElement = container.querySelector(".select-values-list");
                this.placeholder = this.valuesListElement.dataset["placeholder"];
                this.currentValue = this.currentValueElement.dataset["value"];
                this.valueElements = [];
                var elements = this.valuesListElement.querySelectorAll(".select-value[data-value]");
                for (var i = 0; i < elements.length; i++) {
                    this.valueElements.push(elements[i]);
                }
                this.containerElement.style.width = "".concat(this.computeMinimumWidth(), "px");
                document.addEventListener("click", function (event) {
                    var clickedElement = event.target;
                    var isExpanded = _this.containerElement.classList.contains(Select.EXPANDED_CLASS);
                    if (isExpanded) {
                        var clickedOnValuesList = _this.valuesListElement.contains(clickedElement);
                        if (clickedOnValuesList) {
                            for (var _i = 0, _a = _this.valueElements; _i < _a.length; _i++) {
                                var valueElement = _a[_i];
                                if (valueElement.contains(clickedElement)) {
                                    _this.currentValue = valueElement.dataset["value"];
                                    _this.currentValueElement.dataset["value"] = _this.currentValue;
                                    _this.currentValueElement.textContent = valueElement.textContent;
                                    Storage.storeState(_this);
                                    _this.callObservers();
                                }
                            }
                        }
                        _this.containerElement.classList.remove(Select.EXPANDED_CLASS);
                    }
                    else {
                        var clickedOnCurrentValue = _this.currentValueElement.contains(clickedElement);
                        if (clickedOnCurrentValue) {
                            _this.containerElement.classList.add(Select.EXPANDED_CLASS);
                        }
                    }
                });
            }
            Object.defineProperty(Select.prototype, "value", {
                get: function () {
                    return this.currentValue || null;
                },
                set: function (v) {
                    if (v === null) {
                        this.currentValueElement.removeAttribute("data-value");
                        this.currentValueElement.textContent = this.placeholder;
                        this.currentValue = null;
                    }
                    else {
                        for (var _i = 0, _a = this.valueElements; _i < _a.length; _i++) {
                            var valueElement = _a[_i];
                            var valueFromHtml = valueElement.dataset["value"];
                            if (valueFromHtml === v) {
                                this.currentValue = valueFromHtml;
                                this.currentValueElement.dataset["value"] = valueFromHtml;
                                this.currentValueElement.textContent = valueElement.textContent;
                                return;
                            }
                        }
                        console.log("No \"".concat(v, "\" value for \"").concat(this.id, "\" select."));
                    }
                },
                enumerable: false,
                configurable: true
            });
            Select.prototype.callObservers = function () {
                for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    observer(this.value);
                }
            };
            Select.prototype.computeMinimumWidth = function () {
                var result = 0;
                this.valuesListElement.style.opacity = "0";
                this.valuesListElement.style.width = "auto";
                this.valuesListElement.style.fontWeight = "bold";
                this.valuesListElement.style.display = "block";
                var placeholderValue = document.createElement("div");
                placeholderValue.classList.add("select-value");
                placeholderValue.textContent = this.placeholder;
                this.valuesListElement.appendChild(placeholderValue);
                var parentNode = this.containerElement.parentNode;
                var nextSiblingNode = this.containerElement.nextSibling;
                parentNode.removeChild(this.containerElement);
                document.body.appendChild(this.containerElement);
                result = this.valuesListElement.getBoundingClientRect().width;
                document.body.removeChild(this.containerElement);
                parentNode.insertBefore(this.containerElement, nextSiblingNode);
                this.valuesListElement.removeChild(placeholderValue);
                this.valuesListElement.style.display = "";
                this.valuesListElement.style.fontWeight = "";
                this.valuesListElement.style.width = "";
                this.valuesListElement.style.opacity = "";
                var MARGIN = 30;
                return result + MARGIN;
            };
            Select.EXPANDED_CLASS = "expanded";
            return Select;
        }());
        var Cache;
        (function (Cache) {
            function loadCache() {
                var result = {};
                var containerElements = document.querySelectorAll(".select-container[id]");
                for (var i = 0; i < containerElements.length; i++) {
                    var select = new Select(containerElements[i]);
                    result[select.id] = select;
                }
                return result;
            }
            var selectsCache;
            function getSelectById(id) {
                Cache.load();
                return selectsCache[id] || null;
            }
            Cache.getSelectById = getSelectById;
            function load() {
                if (typeof selectsCache === "undefined") {
                    selectsCache = loadCache();
                }
            }
            Cache.load = load;
        })(Cache || (Cache = {}));
        var Storage;
        (function (Storage) {
            var PREFIX = "select";
            function storeState(select) {
                Page.Helpers.URL.setQueryParameter(PREFIX, select.id, select.value);
            }
            Storage.storeState = storeState;
            function clearStoredState(select) {
                Page.Helpers.URL.removeQueryParameter(PREFIX, select.id);
            }
            Storage.clearStoredState = clearStoredState;
            function applyStoredState() {
                Page.Helpers.URL.loopOnParameters(PREFIX, function (controlId, value) {
                    var select = Cache.getSelectById(controlId);
                    if (!select) {
                        console.log("Removing invalid query parameter '" + controlId + "=" + value + "'.");
                        Page.Helpers.URL.removeQueryParameter(PREFIX, controlId);
                    }
                    else {
                        select.value = value;
                        select.callObservers();
                    }
                });
            }
            Storage.applyStoredState = applyStoredState;
        })(Storage || (Storage = {}));
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            Cache.load();
            Storage.applyStoredState();
        });
        function addObserver(id, observer) {
            var select = Cache.getSelectById(id);
            select.observers.push(observer);
        }
        Select_1.addObserver = addObserver;
        function getValue(id) {
            var select = Cache.getSelectById(id);
            return select.value;
        }
        Select_1.getValue = getValue;
        function setValue(id, value) {
            var select = Cache.getSelectById(id);
            select.value = value;
        }
        Select_1.setValue = setValue;
        function storeState(id) {
            var select = Cache.getSelectById(id);
            Storage.storeState(select);
        }
        Select_1.storeState = storeState;
        function clearStoredState(id) {
            var select = Cache.getSelectById(id);
            Storage.clearStoredState(select);
        }
        Select_1.clearStoredState = clearStoredState;
    })(Select = Page.Select || (Page.Select = {}));
})(Page || (Page = {}));

var Page;
(function (Page) {
    var FileControl;
    (function (FileControl) {
        var FileUpload = /** @class */ (function () {
            function FileUpload(container) {
                var _this = this;
                this.observers = [];
                this.inputElement = container.querySelector("input");
                this.labelSpanElement = container.querySelector("label > span");
                this.inputElement.addEventListener("change", function (event) {
                    event.stopPropagation();
                    var files = _this.inputElement.files;
                    if (files.length === 1) {
                        _this.labelSpanElement.innerText = FileUpload.truncate(files[0].name);
                        for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                            var observer = _a[_i];
                            observer(files);
                        }
                    }
                }, false);
            }
            FileUpload.prototype.clear = function () {
                this.inputElement.value = "";
                this.labelSpanElement.innerText = this.labelSpanElement.dataset["placeholder"];
            };
            FileUpload.truncate = function (name) {
                if (name.length > FileUpload.filenameMaxSize) {
                    return name.substring(0, FileUpload.filenameMaxSize - 1) + "..." +
                        name.substring(name.length - (FileUpload.filenameMaxSize - 1));
                }
                return name;
            };
            FileUpload.filenameMaxSize = 16;
            return FileUpload;
        }());
        var FileDownload = /** @class */ (function () {
            function FileDownload(container) {
                var _this = this;
                this.observers = [];
                this.buttonElement = container.querySelector("input");
                this.buttonElement.addEventListener("click", function (event) {
                    event.stopPropagation();
                    for (var _i = 0, _a = _this.observers; _i < _a.length; _i++) {
                        var observer = _a[_i];
                        observer();
                    }
                }, false);
            }
            return FileDownload;
        }());
        var Cache;
        (function (Cache) {
            function loadFileUploadsCache() {
                var result = {};
                var selector = ".file-control.upload > input[id]";
                var fileUploadInputsElements = document.querySelectorAll(selector);
                for (var i = 0; i < fileUploadInputsElements.length; i++) {
                    var container = fileUploadInputsElements[i].parentElement;
                    var id = fileUploadInputsElements[i].id;
                    result[id] = new FileUpload(container);
                }
                return result;
            }
            function loadFileDownloadsCache() {
                var result = {};
                var selector = ".file-control.download > input[id]";
                var fileDownloadInputsElements = document.querySelectorAll(selector);
                for (var i = 0; i < fileDownloadInputsElements.length; i++) {
                    var container = fileDownloadInputsElements[i].parentElement;
                    var id = fileDownloadInputsElements[i].id;
                    result[id] = new FileDownload(container);
                }
                return result;
            }
            var fileUploadsCache;
            var fileDownloadsCache;
            function getFileUploadById(id) {
                Cache.load();
                return fileUploadsCache[id] || null;
            }
            Cache.getFileUploadById = getFileUploadById;
            function getFileDownloadById(id) {
                Cache.load();
                return fileDownloadsCache[id] || null;
            }
            Cache.getFileDownloadById = getFileDownloadById;
            function load() {
                if (typeof fileUploadsCache === "undefined") {
                    fileUploadsCache = loadFileUploadsCache();
                }
                if (typeof fileDownloadsCache === "undefined") {
                    fileDownloadsCache = loadFileDownloadsCache();
                }
            }
            Cache.load = load;
        })(Cache || (Cache = {}));
        Page.Helpers.Events.callAfterDOMLoaded(function () {
            Cache.load();
        });
        /**
         * @return {boolean} Whether or not the observer was added
         */
        function addDownloadObserver(id, observer) {
            var fileDownload = Cache.getFileDownloadById(id);
            if (fileDownload) {
                fileDownload.observers.push(observer);
                return true;
            }
            return false;
        }
        FileControl.addDownloadObserver = addDownloadObserver;
        /**
         * @return {boolean} Whether or not the observer was added
         */
        function addUploadObserver(uploadId, observer) {
            var fileUpload = Cache.getFileUploadById(uploadId);
            if (fileUpload) {
                fileUpload.observers.push(observer);
                return true;
            }
            return false;
        }
        FileControl.addUploadObserver = addUploadObserver;
        function clearFileUpload(id) {
            var fileUpload = Cache.getFileUploadById(id);
            fileUpload.clear();
        }
        FileControl.clearFileUpload = clearFileUpload;
    })(FileControl = Page.FileControl || (Page.FileControl = {}));
})(Page || (Page = {}));



var Page;
(function (Page) {
    var Canvas;
    (function (Canvas) {
        function getElementBySelector(selector) {
            var elt = document.querySelector(selector);
            if (!elt) {
                console.error("Cannot find element '" + selector + "'.");
            }
            return elt;
        }
        function getCanvasById(id) {
            return getElementBySelector("canvas[id=" + id + "]");
        }
        function getCheckboxFromId(id) {
            return getElementBySelector("input[type=checkbox][id=" + id + "]");
        }
        var canvasContainer = document.getElementById("canvas-container");
        var canvas = getCanvasById("canvas");
        var buttonsColumn = document.getElementById("canvas-buttons-column");
        var fullscreenCheckbox = getCheckboxFromId("fullscreen-checkbox-id");
        var sidePaneCheckbox = getCheckboxFromId("side-pane-checkbox-id");
        var loader = canvasContainer.querySelector(".loader");
        var maxWidth = 512;
        var maxHeight = 512;
        function bindCanvasButtons() {
            function hideOverflow(value) {
                document.body.style.overflow = value ? "hidden" : "auto";
            }
            if (fullscreenCheckbox) {
                Page.Helpers.Events.callAfterDOMLoaded(function () {
                    hideOverflow(fullscreenCheckbox.checked);
                    fullscreenCheckbox.addEventListener("change", function () {
                        hideOverflow(fullscreenCheckbox.checked);
                    });
                });
                if (sidePaneCheckbox) {
                    fullscreenCheckbox.addEventListener("change", function () {
                        if (fullscreenCheckbox.checked) {
                            sidePaneCheckbox.checked = false;
                        }
                    }, false);
                }
            }
        }
        bindCanvasButtons();
        function getCanvasSize() {
            var rect = canvas.getBoundingClientRect();
            return [Math.floor(rect.width), Math.floor(rect.height)];
        }
        var lastCanvasSize = [0, 0];
        var canvasResizeObservers = [];
        function inPx(size) {
            return size + "px";
        }
        /**
         * Calls callbacks if needed.
         */
        function updateCanvasSize() {
            canvasContainer.style.width = "100vw";
            var size = getCanvasSize();
            if (fullscreenCheckbox.checked) {
                canvasContainer.style.height = "100%";
                canvasContainer.style.maxWidth = "";
                canvasContainer.style.maxHeight = "";
            }
            else {
                size[1] = size[0] * maxHeight / maxWidth;
                canvasContainer.style.height = inPx(size[1]);
                canvasContainer.style.maxWidth = inPx(maxWidth);
                canvasContainer.style.maxHeight = inPx(maxHeight);
            }
            if (size[0] !== lastCanvasSize[0] ||
                size[1] !== lastCanvasSize[1]) {
                lastCanvasSize = getCanvasSize();
                for (var _i = 0, canvasResizeObservers_1 = canvasResizeObservers; _i < canvasResizeObservers_1.length; _i++) {
                    var observer = canvasResizeObservers_1[_i];
                    observer(lastCanvasSize[0], lastCanvasSize[1]);
                }
            }
        }
        Page.Helpers.Events.callAfterDOMLoaded(updateCanvasSize);
        fullscreenCheckbox.addEventListener("change", updateCanvasSize, false);
        window.addEventListener("resize", updateCanvasSize, false);
        var fullscreenToggleObservers = [updateCanvasSize];
        var mouseDownObservers = [];
        var mouseUpObservers = [];
        var mouseDragObservers = [];
        var mouseMoveObservers = [];
        var mouseEnterObservers = [];
        var mouseLeaveObservers = [];
        var mouseWheelObservers = [];
        /* Bind fullscreen events */
        if (fullscreenCheckbox) {
            fullscreenCheckbox.addEventListener("change", function () {
                var isFullscreen = fullscreenCheckbox.checked;
                for (var _i = 0, fullscreenToggleObservers_1 = fullscreenToggleObservers; _i < fullscreenToggleObservers_1.length; _i++) {
                    var observer = fullscreenToggleObservers_1[_i];
                    observer(isFullscreen);
                }
            }, false);
        }
        document.addEventListener("keydown", function (event) {
            if (event.keyCode === 27) {
                Canvas.toggleFullscreen(false);
            }
        });
        function clientToRelative(clientX, clientY) {
            var rect = canvas.getBoundingClientRect();
            return [
                (clientX - rect.left) / rect.width,
                (clientY - rect.top) / rect.height,
            ];
        }
        var Mouse;
        (function (Mouse) {
            var mousePosition = [0, 0];
            var clientMousePosition = [0, 0];
            var isMouseDownInternal = false;
            function getMousePosition() {
                return [mousePosition[0], mousePosition[1]];
            }
            Mouse.getMousePosition = getMousePosition;
            function setMousePosition(x, y) {
                mousePosition[0] = x;
                mousePosition[1] = y;
            }
            Mouse.setMousePosition = setMousePosition;
            function isMouseDown() {
                return isMouseDownInternal;
            }
            Mouse.isMouseDown = isMouseDown;
            function mouseDown(clientX, clientY) {
                var pos = clientToRelative(clientX, clientY);
                setMousePosition(pos[0], pos[1]);
                isMouseDownInternal = true;
                for (var _i = 0, mouseDownObservers_1 = mouseDownObservers; _i < mouseDownObservers_1.length; _i++) {
                    var observer = mouseDownObservers_1[_i];
                    observer();
                }
            }
            Mouse.mouseDown = mouseDown;
            function mouseUp() {
                if (isMouseDownInternal) {
                    isMouseDownInternal = false;
                    for (var _i = 0, mouseUpObservers_1 = mouseUpObservers; _i < mouseUpObservers_1.length; _i++) {
                        var observer = mouseUpObservers_1[_i];
                        observer();
                    }
                }
            }
            Mouse.mouseUp = mouseUp;
            function mouseMove(clientX, clientY) {
                clientMousePosition[0] = clientX;
                clientMousePosition[1] = clientY;
                var newPos = clientToRelative(clientX, clientY);
                var dX = newPos[0] - mousePosition[0];
                var dY = newPos[1] - mousePosition[1];
                // Update the mousePosition before calling the observers,
                // because they might call getMousePosition() and it needs to be up to date.
                mousePosition[0] = newPos[0];
                mousePosition[1] = newPos[1];
                if (isMouseDownInternal) {
                    for (var _i = 0, mouseDragObservers_1 = mouseDragObservers; _i < mouseDragObservers_1.length; _i++) {
                        var observer = mouseDragObservers_1[_i];
                        observer(dX, dY);
                    }
                }
                for (var _a = 0, mouseMoveObservers_1 = mouseMoveObservers; _a < mouseMoveObservers_1.length; _a++) {
                    var observer = mouseMoveObservers_1[_a];
                    observer(newPos[0], newPos[1]);
                }
            }
            Mouse.mouseMove = mouseMove;
            if (canvas) {
                canvas.addEventListener("mousedown", function (event) {
                    if (event.button === 0) {
                        mouseDown(event.clientX, event.clientY);
                    }
                }, false);
                canvas.addEventListener("mouseenter", function () {
                    for (var _i = 0, mouseEnterObservers_1 = mouseEnterObservers; _i < mouseEnterObservers_1.length; _i++) {
                        var observer = mouseEnterObservers_1[_i];
                        observer();
                    }
                }, false);
                canvas.addEventListener("mouseleave", function () {
                    for (var _i = 0, mouseLeaveObservers_1 = mouseLeaveObservers; _i < mouseLeaveObservers_1.length; _i++) {
                        var observer = mouseLeaveObservers_1[_i];
                        observer();
                    }
                }, false);
                canvas.addEventListener("wheel", function (event) {
                    if (mouseWheelObservers.length > 0) {
                        var delta = (event.deltaY > 0) ? 1 : -1;
                        for (var _i = 0, mouseWheelObservers_1 = mouseWheelObservers; _i < mouseWheelObservers_1.length; _i++) {
                            var observer = mouseWheelObservers_1[_i];
                            observer(delta, mousePosition);
                        }
                        event.preventDefault();
                        return false;
                    }
                    return true;
                }, false);
                window.addEventListener("mousemove", function (event) {
                    mouseMove(event.clientX, event.clientY);
                });
                window.addEventListener("mouseup", function (event) {
                    if (event.button === 0) {
                        mouseUp();
                    }
                });
                canvasResizeObservers.push(function () {
                    mouseMove(clientMousePosition[0], clientMousePosition[1]);
                });
            }
        })(Mouse || (Mouse = {}));
        (function Touch() {
            var currentTouches = [];
            var currentDistance = 0; // for pinching management
            function computeDistance(firstTouch, secondTouch) {
                var dX = firstTouch.clientX - secondTouch.clientX;
                var dY = firstTouch.clientY - secondTouch.clientY;
                return Math.sqrt(dX * dX + dY * dY);
            }
            function handleTouchStart(event) {
                var isFirstTouch = (currentTouches.length === 0);
                for (var i = 0; i < event.changedTouches.length; ++i) {
                    var touch = event.changedTouches[i];
                    var alreadyRegistered = false;
                    for (var _i = 0, currentTouches_1 = currentTouches; _i < currentTouches_1.length; _i++) {
                        var knownTouch = currentTouches_1[_i];
                        if (touch.identifier === knownTouch.id) {
                            alreadyRegistered = true;
                            break;
                        }
                    }
                    if (!alreadyRegistered) {
                        currentTouches.push({
                            id: touch.identifier,
                            clientX: touch.clientX,
                            clientY: touch.clientY,
                        });
                    }
                }
                if (isFirstTouch && currentTouches.length > 0) {
                    var currentTouch = currentTouches[0];
                    Mouse.mouseDown(currentTouch.clientX, currentTouch.clientY);
                }
                else if (currentTouches.length === 2) {
                    currentDistance = computeDistance(currentTouches[0], currentTouches[1]);
                }
            }
            function handleTouchEnd(event) {
                var knewAtLeastOneTouch = (currentTouches.length > 0);
                for (var i = 0; i < event.changedTouches.length; ++i) {
                    var touch = event.changedTouches[i];
                    for (var iC = 0; iC < currentTouches.length; ++iC) {
                        if (touch.identifier === currentTouches[iC].id) {
                            currentTouches.splice(iC, 1);
                            iC--;
                        }
                    }
                }
                if (currentTouches.length === 1) {
                    var newPos = clientToRelative(currentTouches[0].clientX, currentTouches[0].clientY);
                    Mouse.setMousePosition(newPos[0], newPos[1]);
                }
                else if (knewAtLeastOneTouch && currentTouches.length === 0) {
                    Mouse.mouseUp();
                }
            }
            function handleTouchMove(event) {
                var touches = event.changedTouches;
                for (var i = 0; i < touches.length; ++i) {
                    var touch = touches[i];
                    for (var _i = 0, currentTouches_2 = currentTouches; _i < currentTouches_2.length; _i++) {
                        var knownTouch = currentTouches_2[_i];
                        if (touch.identifier === knownTouch.id) {
                            knownTouch.clientX = touch.clientX;
                            knownTouch.clientY = touch.clientY;
                        }
                    }
                }
                var nbObservers = mouseMoveObservers.length + mouseDragObservers.length;
                if (Mouse.isMouseDown() && nbObservers > 0) {
                    event.preventDefault();
                }
                if (currentTouches.length === 1) {
                    Mouse.mouseMove(currentTouches[0].clientX, currentTouches[0].clientY);
                }
                else if (currentTouches.length === 2) {
                    var newDistance = computeDistance(currentTouches[0], currentTouches[1]);
                    var deltaDistance = (currentDistance - newDistance);
                    var zoomFactor = deltaDistance / currentDistance;
                    currentDistance = newDistance;
                    var zoomCenterXClient = 0.5 * (currentTouches[0].clientX + currentTouches[1].clientX);
                    var zoomCenterYClient = 0.5 * (currentTouches[0].clientY + currentTouches[1].clientY);
                    var zoomCenter = clientToRelative(zoomCenterXClient, zoomCenterYClient);
                    for (var _a = 0, mouseWheelObservers_2 = mouseWheelObservers; _a < mouseWheelObservers_2.length; _a++) {
                        var observer = mouseWheelObservers_2[_a];
                        observer(5 * zoomFactor, zoomCenter);
                    }
                }
            }
            if (canvas) {
                canvas.addEventListener("touchstart", handleTouchStart, false);
                window.addEventListener("touchend", handleTouchEnd);
                window.addEventListener("touchmove", handleTouchMove, { passive: false });
            }
        })();
        var Indicators;
        (function (Indicators) {
            var indicatorSpansCache = {};
            var suffix = "-indicator-id";
            function getIndicator(id) {
                return getElementBySelector("#" + id + suffix);
            }
            Indicators.getIndicator = getIndicator;
            function getIndicatorSpan(id) {
                if (!indicatorSpansCache[id]) { // not yet in cache
                    var fullId = id + suffix;
                    indicatorSpansCache[id] = getElementBySelector("#" + fullId + " span");
                }
                return indicatorSpansCache[id];
            }
            Indicators.getIndicatorSpan = getIndicatorSpan;
        })(Indicators || (Indicators = {}));
        var Storage;
        (function (Storage) {
            var PREFIX = "canvas";
            var FULLSCREEN_PARAMETER = "fullscreen";
            var SIDE_PANE_PARAMETER = "sidepane";
            var TRUE = "true";
            var FALSE = "false";
            function updateBooleanParameter(name, checked) {
                var value = checked ? TRUE : FALSE;
                Page.Helpers.URL.setQueryParameter(PREFIX, name, value);
            }
            function attachStorageEvents() {
                if (fullscreenCheckbox) {
                    fullscreenCheckbox.addEventListener("change", function () {
                        updateBooleanParameter(FULLSCREEN_PARAMETER, fullscreenCheckbox.checked);
                        Page.Helpers.URL.removeQueryParameter(PREFIX, SIDE_PANE_PARAMETER);
                    });
                }
                if (sidePaneCheckbox) {
                    sidePaneCheckbox.addEventListener("change", function () {
                        updateBooleanParameter(SIDE_PANE_PARAMETER, sidePaneCheckbox.checked);
                    });
                }
            }
            Storage.attachStorageEvents = attachStorageEvents;
            function applyStoredState() {
                Page.Helpers.URL.loopOnParameters(PREFIX, function (name, value) {
                    if (name === FULLSCREEN_PARAMETER && (value === TRUE || value === FALSE)) {
                        if (fullscreenCheckbox) {
                            fullscreenCheckbox.checked = (value === TRUE);
                        }
                    }
                    else if (name === SIDE_PANE_PARAMETER && (value === TRUE || value === FALSE)) {
                        if (sidePaneCheckbox) {
                            sidePaneCheckbox.checked = (value === TRUE);
                        }
                    }
                    else {
                        console.log("Removing invalid query parameter '" + name + "=" + value + "'.");
                        Page.Helpers.URL.removeQueryParameter(PREFIX, name);
                    }
                });
            }
            Storage.applyStoredState = applyStoredState;
        })(Storage || (Storage = {}));
        Storage.applyStoredState();
        Storage.attachStorageEvents();
        Canvas.Observers = Object.freeze({
            canvasResize: canvasResizeObservers,
            fullscreenToggle: fullscreenToggleObservers,
            mouseDown: mouseDownObservers,
            mouseDrag: mouseDragObservers,
            mouseEnter: mouseEnterObservers,
            mouseLeave: mouseLeaveObservers,
            mouseMove: mouseMoveObservers,
            mouseWheel: mouseWheelObservers,
            mouseUp: mouseUpObservers,
        });
        function getAspectRatio() {
            var size = getCanvasSize();
            return size[0] / size[1];
        }
        Canvas.getAspectRatio = getAspectRatio;
        function getCanvas() {
            return canvas;
        }
        Canvas.getCanvas = getCanvas;
        function getCanvasContainer() {
            return canvasContainer;
        }
        Canvas.getCanvasContainer = getCanvasContainer;
        function getSize() {
            return getCanvasSize();
        }
        Canvas.getSize = getSize;
        function getMousePosition() {
            return Mouse.getMousePosition();
        }
        Canvas.getMousePosition = getMousePosition;
        function isFullScreen() {
            return fullscreenCheckbox && fullscreenCheckbox.checked;
        }
        Canvas.isFullScreen = isFullScreen;
        function isMouseDown() {
            return Mouse.isMouseDown();
        }
        Canvas.isMouseDown = isMouseDown;
        function setIndicatorText(id, text) {
            var indicator = Indicators.getIndicatorSpan(id);
            if (indicator) {
                indicator.innerText = text;
            }
        }
        Canvas.setIndicatorText = setIndicatorText;
        function setIndicatorVisibility(id, visible) {
            var indicator = Indicators.getIndicator(id);
            if (indicator) {
                indicator.style.display = visible ? "" : "none";
            }
        }
        Canvas.setIndicatorVisibility = setIndicatorVisibility;
        function setIndicatorsVisibility(visible) {
            var indicators = document.getElementById("indicators");
            indicators.style.display = visible ? "" : "none";
        }
        Canvas.setIndicatorsVisibility = setIndicatorsVisibility;
        function setMaxSize(newMaxWidth, newMaxHeight) {
            maxWidth = newMaxWidth;
            maxHeight = newMaxHeight;
            updateCanvasSize();
        }
        Canvas.setMaxSize = setMaxSize;
        function setResizable(resizable) {
            buttonsColumn.style.display = resizable ? "" : "none";
        }
        Canvas.setResizable = setResizable;
        function setLoaderText(text) {
            if (loader) {
                loader.querySelector("span").innerText = text;
            }
        }
        Canvas.setLoaderText = setLoaderText;
        function showLoader(show) {
            if (loader) {
                loader.style.display = (show) ? "block" : "";
            }
        }
        Canvas.showLoader = showLoader;
        function toggleFullscreen(fullscreen) {
            if (fullscreenCheckbox) {
                var needToUpdate = fullscreen !== fullscreenCheckbox.checked;
                if (needToUpdate) {
                    fullscreenCheckbox.checked = fullscreen;
                    if (typeof window.CustomEvent === "function") {
                        fullscreenCheckbox.dispatchEvent(new CustomEvent("change"));
                    }
                    else if (typeof CustomEvent.prototype.initCustomEvent === "function") {
                        var changeEvent = document.createEvent("CustomEvent");
                        changeEvent.initCustomEvent("change", false, false, undefined);
                        fullscreenCheckbox.dispatchEvent(changeEvent);
                    }
                }
            }
        }
        Canvas.toggleFullscreen = toggleFullscreen;
    })(Canvas = Page.Canvas || (Page.Canvas = {}));
})(Page || (Page = {}));

Page.Canvas.setMaxSize(512,512);
Object.renameProperty = function (object,oldName, newName) {
    // Do nothing if the names are the same
    if (oldName == newName) {
        return object;
    }
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (object.hasOwnProperty(oldName)) {
        object[newName] = object[oldName];
        delete object[oldName];
    }
    return object;
};
Object.map = function (o, f, ctx) {
    ctx = ctx || this;
    var result = {};
    Object.keys(o).forEach(function (k) {
        result[k] = f.call(ctx, o[k], k, o);
    });
    return result;
};

(function (window, document, undefined) {

    function parseHTML(htmlString) {
        var frag = document.createDocumentFragment(),
            el,
            parser;

        if (!htmlString || typeof htmlString !== "string") {
            return "";
        }

        else if (!!DOMParser) {

            parser = new DOMParser();
            el = parser.parseFromString(htmlString, "text/html").querySelector("body");

            return !!frag.appendChild(el).children[0] ? frag.appendChild(el).children[0] : "";

        } else {

            el = document.createElement("div");
            el.setAttribute("id", "wrapper");
            el.innerHTML = htmlString;

            return !!frag.appendChild(el).querySelector("div#wrapper") ? frag.appendChild(el).querySelector("div#wrapper").children[0] : "";

        }

    }

    this.parseHTML = parseHTML;

})(window, document);



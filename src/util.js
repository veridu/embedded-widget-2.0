export default {

    addStyleSheet: function(str) {
        var node = document.createElement('link');
        node.setAttribute("rel", "stylesheet");
        node.setAttribute("type", "text/css");
        node.setAttribute("href", str);
        document.body.appendChild(node);
    },

    /**
     * Opens a window with default configs.
     * 
     * @param {string} url      The url.
     * @param {object} options  The options object.
     * 
     * @returns window          The new window object reference.
     */
    showWindow(url, options) {
        var opts = {
            status: 0,
            toolbar: 0,
            location: 1,
            resizable: 0,
            scrollbars: 0,
            width: 800,
            height: 600
        };
        opts.top = Math.max((screen.height - opts.height) / 2, 0);
        opts.left = Math.max((screen.width  - opts.width) / 2, 0);

        var args = '';
        for (var opt in opts)
            args += `${opt}=${opts[opt]},`;

        if (window.top != window.self)
            return window.top.open(url, '_blank', args);

        return window.open(url, '_blank', args);
    },

    /**
     * Gets the top and left offset of an element.
     * 
     * @param {DOMElement} el The DOM element.
     * 
     * @returns {object}      The offset object.
     */
    offset(el) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    },

    /**
     * Gets the query parameter value of the given key.
     * 
     * @param {string} key  The key.
     *
     * @returns {any}       The querystring key value or null.
     */
    getURLParameter(key) {
        return decodeURIComponent((new RegExp('[?|&]' + key + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    }

};

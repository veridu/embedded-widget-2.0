export default {

    addStyleSheet: function(str) {
        var node = document.createElement('link');
        node.setAttribute("rel", "stylesheet");
        node.setAttribute("type", "text/css");
        node.setAttribute("href", str);
        document.body.appendChild(node);
    },


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

    getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    }

};

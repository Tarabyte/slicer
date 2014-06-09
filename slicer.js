/*global jQuery*/
(function ($) {
    /**
     * @private
     * Util function to manipulate css-rules dynamically.
     */
    var ensureStyle = (function () {
        var cache = {}, id = 'slice' + $.now(),
            sheet;

        /**
         * @private
         * Creates style-element and append it to document.head.
         */
        function initSheet() {
            var style, addRule;

            style = $('#' + id);
            if (!style.length) { //create new style element
                style = $('<style type="text/css" id="' + id + '"></style>').appendTo('head');
            }

            style = (style = style[0]).sheet || style.styleSheet; //.styleSheet for IE<9

            //addRule wrapper.
            addRule = style.addRule ? function (selector, css) {
                return style.addRule(selector, css);
            } : function (selector, css) { //For IE<9
                return style.insertRule(selector + '{' + css + '}', (style.cssRules || style.rules).length);
            };
            
            //Add default rules.
            addRule('.word', 'white-space:nowrap;'); //words should not be wrapped
            addRule('.sliced', 'color: transparent; position: relative; display: inline-block; top: 0;left: 0;'); //.sliced acts as an invisible container.
            addRule('.sliced > .slice', 'position: absolute; pointer-events: none; overflow: hidden; display: inline-block; top: 0; left: 0;'); //each slice is an absolute positioned span.

            sheet = {
                addRule: addRule
            };
            return sheet;
        }

        /**
         * @private
         * Generates rules of type
         * * column-i-of-n
         * * row-j-of-m
         */
        function generateStyles(prefix, prop, n) {
            var i = 0,
                step = (100 / n) | 0,
                start = '.sliced > .slice.' + prefix + '-',
                style = sheet || initSheet();
            if (n > 1) {
                while (++i <= n) { //NB we need i==n to avoid rounding error 
                    //.sliced > .slice.column-i-of-n: {width: i*dx%;}
                    //.sliced > .slice.row-j-of-m: {height: j*dy%;}
                    style.addRule(start + i + '-of-' + n,
                    prop + ':' + (step * i) + '%;');
                }
            }
        }

        /**
         * Ensure that rules of type '.'
         */
        return function (n, m) {
            var vertical = 'vertical_' + n,
                horizontal = 'horizontal_' + m;

            if (!cache[vertical]) {
                cache[vertical] = 1;
                generateStyles('column', 'width', n);
            }
            if (!cache[horizontal]) {
                cache[horizontal] = 1;
                generateStyles('row', 'height', m);
            }
        };
    }()),
        /**
         * @private
         * Convert to Number or default.
         */
        toInt = function (n) {
            n = +n;
            return !n || n < 1 ? 2 : n|0;
        },
        //html escape.
        escape = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;'
        };

    /**
     * @class Slicer
     */
    function Slicer(n, m) {
        var makeClass;
        this.n = n;
        this.m = m;
        
        ensureStyle(n, m);
        
        //Inheritance and factory? Or why bother about single if?
        if (n == 1) {
            makeClass = function (_, j) {
                var m = this.m;
                return ' row-' + j + '-of-' + m + ' slice-' + j + '-of-' + m;
            };
        } else if (m == 1) {
            makeClass = function (i) {
                var n = this.n;
                return ' column-' + i + '-of-' + n + ' slice-' + i + '-of-' + n;
            };
        } else {
            makeClass = function (i, j) {
                var n = this.n,
                    m = this.m;
                return ' column-' + i + '-of-' + n + ' row-' + j + '-of-' + m + ' slice-' + i + '-' + j + '-of-' + n + 'x' + m;
            };
        }
        this.makeClass = makeClass;
    }

    $.extend(Slicer.prototype, {
        /**
         * Slice text for all matched set of elements.
         */
        slice: function (el) {
            var wrap = $.proxy(this.wrapLetter, this),
                clz = 'sliced-' + this.n + 'x' + this.m;
            el.each(function () {
                var container = $(this),
                    txt = container.text().split(''),
                    isWord = false;

                txt = $.map(txt, function (letter) {
                    if (/\s/.test(letter)) {
                        if (isWord) {
                            isWord = false;
                            return '</span>' + letter;
                        }
                        return letter;
                    }
                    if (isWord) {
                        return wrap(letter);
                    }
                    isWord = true;
                    return '<span class="word">' + wrap(letter);

                });

                container.addClass(clz).html(txt.join(''));
            });
        },

        /**
         * Wrap letter with spans.
         * Html entities <>& will be escaped.
         * @returns {String} - html.
         */
        wrapLetter: function (letter) {
            var out = '<span class="sliced">',
                span = '</span>',
                i, j;
            letter = escape[letter] || letter; //escape html
            out += letter;
            for (i = this.n; i; i--) {
                for (j = this.m; j; j--) {
                    out += '<span class="slice' + this.makeClass(i, j) + '">' + letter + span;
                }
            }

            out += span;

            return out;
        }

    });

    $.extend($.fn, {
        /**
         * Slice text of matching elements vertically.
         * @param {Number} n - Number of slices. Default 2.
         * @returns {jQuery} - Current jQuery instance.
         */
        sliceVertical: function (n) {
            new Slicer(toInt(n), 1).slice(this);
            return this;
        },
        
        /**
         * Slice text of matching elements horizontally.
         * @param {Number} n - Number of slices. Default 2.
         * @returns {jQuery} - Current jQuery instance.
         */
        sliceHorizontal: function (n) {
            new Slicer(1, toInt(n)).slice(this);
            return this;
        },
        
        /**
         * Slice text of matching elements in both directions.
         * @param {Number} n - Number of vertical slices. Default 2.
         * @param {Number} m - Number of horizontal slices. Default 2.
         * @returns {jQuery} - Current jQuery instance.
         */
        sliceBoth: function (n, m) {
            new Slicer(toInt(n), toInt(m)).slice(this);
            return this;
        }
    });


}(jQuery));

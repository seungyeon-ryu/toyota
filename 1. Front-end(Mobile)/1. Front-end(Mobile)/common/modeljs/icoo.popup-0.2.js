(function ($c, window, undefined) {
    var stack = [], owner, bg, Popup, closeOption, initialized, animate,

    /* popup */
    fn = (Popup = function (id, option) {
        owner.append(this.content = $(ox.TPL(id, option.data)));
        this.option = option;

        if (closeOption && option.closeBtn) {
            this.closeBtn = $('<div class="close"/>');
            closeOption.src && this.closeBtn.append('<img src="' + closeOption.src + '" />');
            closeOption.css && this.closeBtn.css(closeOption.css);
            this.content.append(this.closeBtn.click(close));
        }

        this.content.css({"z-index": "10000", "position": option.position});
    }).prototype;

    fn.setPosition = function () {
        var contH, contW, top, left, scrollTop;

        if (this.option.bottom === undefined) {
            scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            contH = this.content.outerHeight();
            top = this.option.top || ($c.VIEW.height() - contH) >> 1;
            top = (this.option.position == 'absolute' ? scrollTop : 0) + top;
            top = Math.max(this.option.minTop, top);
            this.content.css('top', top);
        } else {
            this.content.css('bottom', this.option.bottom);
        }

        if (this.option.left !== undefined) {
            this.content.css({left: this.option.left});
        } else if (this.option.right !== undefined) {
            this.content.css({right: this.option.right});
        } else {
            contW = this.content.outerWidth();
            left = ($c.VIEW.width() - contW) >> 1;
            this.content.css({left: left});
        }
    };

    fn.save = function () {
        this.option.onSave && this.option.onSave(this);
        this.content.css("z-index", "9998");
    };

    fn.restore = function (data) {
        this.option.onRestore && this.option.onRestore(this, data);
        this.content.css("z-index", "10000");
    };

    fn.destroy = function () {
        var ret;
        this.option.onDestroy && (ret = this.option.onDestroy(this));
        this.content.remove();
        return ret;
    };


    /* popup */

    function init() {
        initialized = true;
        $c.css('.c-popup', "display:none; position:absolute; left:0; top:0; width:100%; z-index:9999");
        $c.css('.c-popup .bg', "position:fixed; width:100%; height:100%; background:black; opacity:.8; filter:alpha(opacity=50); left:0; top:0; z-index:9999");
        $c.css('.c-popup .close', "position:absolute; top:0; right:0; cursor:pointer;");
        $c.css('.c-popup .close img', "display:block; width:100%; height:100%;");
        var dom = '<div class="c-popup">' +
            '<div class="bg"></div>' +
            '</div>';

        owner = $(dom).appendTo('body');
        bg = $('.bg', owner).click(close);

        $(window).resize(function () {
            var i = stack.length;
            while (i--) stack[i].setPosition();
        });
    }

    function open(id) {
        var i, callback, option, popup, imgs, loop;
        if (!initialized) init();
        option = {
            animate: false,
            position: 'absolute',
            closeBtn: true,
            minTop: 50
        };
        for (i = 1; i < arguments.length; ++i) {
            switch (typeof arguments[i]) {
                case "object":
                    option = $.extend(option, arguments[i]);
                    break;
                case "function":
                    callback = arguments[i];
                    break;
            }
        }

        popup = new Popup(id, option);

        imgs = popup.content.find('img');
        (loop = function() {
            var i = imgs.length;
            if (i) while(i--) {
                if (!imgs[i].complete) {
                    setTimeout(loop,100);
                    return;
                }
            }
            if (stack.length > 0) {
                stack[stack.length - 1].save();
            } else {
                if (animate) owner.stop().fadeIn();
                else owner.stop().show();
            }

            popup.setPosition();
            callback && callback(popup);
            stack.push(popup);
        })();

        return this;
    }

    function close() {
        stack[stack.length - 1].option.closeAll ? closeAll() : closeOne();
    }

    function closeOne() {
        if (stack.length == 0) return;
        var ret = stack.pop().destroy();
        if (stack.length == 0) {
            if (animate) owner.stop().fadeOut();
            else owner.stop().hide();
            return;
        }
        stack[stack.length - 1].restore(ret);
        return this;
    }

    function closeAll() {
        while(stack.length) closeOne();
    }

    function setCloseBtn(option) {
        closeOption = option;
        return this;
    }

    function setAnimate(val) {
        animate = val;
        return this;
    }

    window.Pop = {
        open: open,
        close: close,
        closeAll: closeAll,
        closeBtn: setCloseBtn,
        animate: setAnimate
    };
})($c, this);
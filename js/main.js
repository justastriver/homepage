define('common/js/ImgSlider', ['require'], function (require) {
    var SLIDER = 'slider';
    var ANIMATE_TIME = 1000;
    function ImgSlider(options) {
        this.now = 0;
        this.prevBtn = $('#' + options.prevBtn);
        this.nextBtn = $('#' + options.nextBtn);
        this.container = $('#' + options.container);
        this.imgContainer = $('#' + options.imgContainer);
        this.dotContainer = $('#' + options.dotContainer);
        this.items = this.imgContainer.children();
        this.itemWidth = this.items.eq(0).width();
        this.animateType = options.animateType;
        this.dotText = options.dotText;
        this.delay = options.delay;
        this.animationTime = options.animationTime || ANIMATE_TIME;
        this.callback = options.callback || blank;
        this.mouseoverCallback = options.mouseoverCallback || blank;
        this.mouseoutCallback = options.mouseoutCallback || blank;
        this.prevCallback = options.prevCallback || blank;
        this.nextCallback = options.nextCallback || blank;
        this.init();
    }
    ImgSlider.prototype.init = function () {
        if (this.items.length <= 1) {
            return;
        }
        this.initDot();
        this.bindEvent();
        if (this.animateType === SLIDER) {
            copyFirstChild(this);
        }
        this.delay && autoPlay(this);
    };
    ImgSlider.prototype.initDot = function () {
        var self = this;
        var dotContainer = self.dotContainer;
        var len = self.items.length;
        if (dotContainer.length && len) {
            var dots = '';
            var dotText = self.dotText || [];
            for (var i = 0; i < len; i++) {
                dots += '<span class="dot-item">' + (dotText[i] || '&nbsp;&nbsp;') + '</span>';
            }
            dotContainer.html(dots);
            self.dots = dotContainer.children();
            self.dots.eq(0).addClass('active');
        }
    };
    ImgSlider.prototype.bindEvent = function () {
        var self = this;
        if (self.prevBtn) {
            self.prevBtn.on('click', function () {
                prev(self);
            });
        }
        if (self.nextBtn) {
            self.nextBtn.on('click', function () {
                next(self);
            });
        }
        if (self.dots && self.dots.length) {
            self.dots.on('click', function (e) {
                tab(self, e);
            });
        }
        self.container.on('mouseover', function () {
            stopAuto(self);
            self.mouseoverCallback(self);
        });
        self.container.on('mouseout', function () {
            self.delay && autoPlay(self);
            self.mouseoutCallback(self);
        });
    };
    ImgSlider.prototype.autoPlay = function (delay) {
        this.delay = delay;
        autoPlay(this);
    };
    var animate = {
            fade: function (self) {
                var len = self.items.length;
                var dots = self.dots;
                if (len <= 1) {
                    return;
                }
                if (self.now >= len) {
                    self.now = 0;
                }
                self.items.removeClass('item-active').eq(self.now).addClass('item-active');
                dots && dots.removeClass('active').eq(self.now).addClass('active');
                self.callback(self);
            },
            slider: function (self) {
                var len = self.items.length;
                if (len <= 1) {
                    return;
                }
                var imgContainer = self.imgContainer;
                var dots = self.dots;
                if (!imgContainer.is(':animated')) {
                    imgContainer.animate({ left: -self.itemWidth * self.now }, self.animationTime, function () {
                        if (self.now >= len) {
                            self.now = 0;
                            imgContainer.css('left', 0);
                        }
                        self.items.removeClass('item-active').eq(self.now).addClass('item-active');
                        dots && dots.removeClass('active').eq(self.now).addClass('active');
                        self.callback(self);
                    });
                }
            }
        };
    function prev(self) {
        if (!self.imgContainer.is(':animated')) {
            self.now--;
            var len = self.items.length;
            if (self.now < 0) {
                self.now = len - 1;
                self.imgContainer.css('left', -self.itemWidth * len);
            }
            self.prevCallback();
            play(self);
        }
    }
    function next(self) {
        if (!self.imgContainer.is(':animated')) {
            self.now++;
            self.nextCallback();
            play(self);
        }
    }
    function tab(self, e) {
        if (!self.imgContainer.is(':animated')) {
            self.now = $(e.target).index();
            play(self);
        }
    }
    function play(self) {
        animate[self.animateType](self);
    }
    function autoPlay(self) {
        var delay = self.delay;
        clearTimeout(self.timer);
        self.timer = setTimeout(function () {
            clearTimeout(self.timer);
            if (!self.imgContainer.is(':animated')) {
                self.now++;
                play(self);
            }
            self.timer = setTimeout(arguments.callee, delay);
        }, delay);
    }
    function stopAuto(self) {
        clearTimeout(self.timer);
    }
    function copyFirstChild(self) {
        var firstChild = self.items.eq(0).clone(true).removeClass('item-active');
        self.imgContainer.append(firstChild);
    }
    function blank() {
    }
    return ImgSlider;
});


/** d e f i n e */
define('new/common/js/ImgSlider', ['common/js/ImgSlider'], function (target) { return target; });

define('common/js/layer', ['require'], function (require) {
    var exports = {};
    var viewLayer = [];
    exports.hover = function (options) {
        var target = $('#' + options.target);
        var layer = $('#' + options.layer);
        var timer;
        target.on('mouseover', function () {
            clearTimeout(timer);
            layer.show();
        });
        target.on('mouseout', function () {
            timer = setTimeout(function () {
                layer.hide();
            }, 200);
        });
        layer.on('mouseover', function () {
            clearTimeout(timer);
            layer.show();
        });
    };
    function toggle(target, layer) {
        target.on('click', function () {
            hideOthers(layer);
            layer.toggle();
            return false;
        });
    }
    function closeLayer(btn, layer) {
        btn.on('click', function () {
            hide(layer);
        });
    }
    function hideOthers(layer) {
        $.each(viewLayer, function (index, val) {
            if (val !== layer) {
                hide(val);
            }
        });
    }
    function hide(layer) {
        layer.hide();
    }
    exports.init = function (options) {
        options = options || {};
        var target = $('#' + options.target);
        var layer = $('#' + options.layer);
        var btn = $('#' + options.closeBtn);
        viewLayer.push(layer);
        toggle(target, layer);
        closeLayer(btn, layer);
    };
    return exports;
});


/** d e f i n e */
define('new/common/js/layer', ['common/js/layer'], function (target) { return target; });

define('common/js/visual', ['require'], function (require) {
    var exports = {};
    var offsetTop = 0;
    var clientHeight = $(window).height();
    var DIS = 200;
    $(window).on('resize', function () {
        clientHeight = $(window).height();
    });
    exports.isVisual = function (target) {
        var scrollTop = $(document).scrollTop();
        if (scrollTop + clientHeight > offsetTop + DIS) {
            return true;
        }
        return false;
    };
    exports.visualProcess = function (id, fn) {
        var target = $('#' + id);
        offsetTop = target.offset().top;
        visualHandler(target, fn);
        $(window).on('scroll', function () {
            throttle(visualHandler, null, 100, target, fn);
        });
    };
    function throttle(method, context, wait) {
        clearTimeout(method.tId);
        var args = Array.prototype.slice.call(arguments, 3);
        method.tId = setTimeout(function () {
            method.apply(context, args);
        }, wait);
    }
    function visualHandler(target, fn) {
        if (exports.isVisual(target)) {
            fn && fn();
        }
    }
    return exports;
});


/** d e f i n e */
define('new/common/js/visual', ['common/js/visual'], function (target) { return target; });

define('common/js/util', ['require'], function (require) {
    var exports = {};
    exports.copyRight = function () {
        var text = '&copy;' + new Date().getFullYear() + ' Baidu';
        $('.copy-right').html(text);
    };
    exports.stamp = function (id) {
        var elem = $('#' + id);
        var href = elem.prop('href');
        if (href) {
            var t = new Date().getTime();
            var index = href.indexOf('?');
            if (index === href.length - 1) {
                href += 't=' + t;
            } else if (index > -1) {
                href += '&t=' + t;
            } else {
                href += '?t=' + t;
            }
            elem.prop('href', href);
        }
    };
    exports.isWeixin = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    };
    exports.deviceType = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (/(iphone|ipad|ipod|ios)/i.test(ua)) {
            return 'ios';
        } else if (/(android)/i.test(ua)) {
            return 'android';
        } else {
            return 'pc';
        }
    };
    exports.qiao = function () {
        var isHome = false;
        if (location.pathname === '/') {
            isHome = true;
        } else if (location.href.indexOf('/home') !== -1) {
            isHome = true;
        }
        var bdhmProtocol = 'https:' == document.location.protocol ? ' https://' : ' http://';
        var oS = document.createElement('script');
        oS.type = 'text/javascript';
        if (isHome) {
            oS.src = unescape(bdhmProtocol + 'hm.baidu.com/h.js%3F8db5c93095eb9ce1eecafd9c1ff57ab5');
        } else {
            oS.src = unescape(bdhmProtocol + 'hm.baidu.com/h.js%3F2d2ed72c744e301be04d113503ce96c9');
        }
        document.body.appendChild(oS);
    };
    exports.navHover = function (container) {
        var nav = $('.' + container);
        var items = nav.find('.nav-item');
        var active = nav.find('.active');
        var timer;
        items.on('mouseover', function () {
            clearTimeout(timer);
            items.find('a').removeClass('active');
            $(this).children().eq(0).addClass('active');
        });
        nav.on('mouseleave', function () {
            timer = setTimeout(function () {
                items.find('a').removeClass('active');
                active.addClass('active');
            }, 300);
        });
    };
    exports.json2url = function (url, data) {
        var arr = [];
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                arr.push(i + '=' + encodeURIComponent(data[i]));
            }
        }
        return url + '?' + arr.join('&');
    };
    return exports;
});


/** d e f i n e */
define('new/common/js/util', ['common/js/util'], function (target) { return target; });

define('home/main', [
    'require',
    'common/js/ImgSlider',
    'common/js/layer',
    'common/js/visual',
    'common/js/util'
], function (require) {
    var ImgSlider = require('common/js/ImgSlider');
    var layer = require('common/js/layer');
    var visual = require('common/js/visual');
    var util = require('common/js/util');
    var banner = $('.banner');
    var DELAY_TIME = 7000;
    var introduceContent = $('#introduceContent');
    var sliders = introduceContent.find('.slider-animation');
    var timer = null;
    function initNav() {
        layer.hover({
            target: 'navProduct',
            layer: 'navProductLayer'
        });
        util.navHover('nav');
    }
    function initBanner() {
        new ImgSlider({
            container: 'bannerContainer',
            imgContainer: 'bannerImg',
            dotContainer: 'bannerDot',
            animateType: 'fade',
            delay: 5000
        });
    }
    function initIntroduce() {
        var introduce = new ImgSlider({
                container: 'introduce',
                imgContainer: 'introduceContent',
                animateType: 'slider',
                prevBtn: 'introducePrev',
                nextBtn: 'introduceNext',
                callback: introduceAnimation,
                animationTime: 800
            });
        visual.visualProcess('introduce', function () {
            introduce.autoPlay(DELAY_TIME);
            var sliderActive = introduceContent.find('.item-active').find('.slider-animation');
            if (!sliderActive.hasClass('play')) {
                setPlay(sliderActive);
            }
        });
    }
    function introduceAnimation(type) {
        var sliderActive = introduceContent.find('.item-active').find('.slider-animation');
        setPlay(sliderActive);
    }
    function setPlay(sliderActive) {
        clearTimeout(timer);
        removePlay();
        timer = setTimeout(function () {
            sliderActive.addClass('play');
        }, 100);
    }
    function removePlay() {
        sliders.removeClass('play');
    }
    function main() {
        initNav();
        initBanner();
        initIntroduce();
        util.copyRight();
        util.qiao();
    }
    return main;
});
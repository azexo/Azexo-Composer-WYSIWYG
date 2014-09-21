function azexo_init() {
    if (!document.body)
        return;
    var e = document.body;
    var t = document.documentElement;
    var n = window.innerHeight;
    var r = e.scrollHeight;
    azexo_root = document.compatMode.indexOf("CSS") >= 0 ? t : e;
    azexo_activeElement = e;
    azexo_initdone = true;
    if (top != self) {
        azexo_frame = true
    } else if (r > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
        azexo_root.style.height = "auto";
        if (azexo_root.offsetHeight <= n) {
            var i = document.createElement("div");
            i.style.clear = "both";
            e.appendChild(i)
        }
    }
    if (!azexo_fixedback) {
        e.style.backgroundAttachment = "scroll";
        t.style.backgroundAttachment = "scroll"
    }
    if (azexo_keyboardsupport) {
        azexo_addEvent("keydown", azexo_keydown)
    }
}
function azexo_scrollArray(e, t, n, r) {
    r || (r = 1e3);
    azexo_directionCheck(t, n);
    azexo_que.push({x: t, y: n, lastX: t < 0 ? .99 : -.99, lastY: n < 0 ? .99 : -.99, start: +(new Date)});
    if (azexo_pending) {
        return
    }
    var i = function() {
        var s = +(new Date);
        var o = 0;
        var u = 0;
        for (var a = 0; a < azexo_que.length; a++) {
            var f = azexo_que[a];
            var l = s - f.start;
            var c = l >= azexo_animtime;
            var h = c ? 1 : l / azexo_animtime;
            if (azexo_pulseAlgorithm) {
                h = azexo_pulse(h)
            }
            var p = f.x * h - f.lastX >> 0;
            var d = f.y * h - f.lastY >> 0;
            o += p;
            u += d;
            f.lastX += p;
            f.lastY += d;
            if (c) {
                azexo_que.splice(a, 1);
                a--
            }
        }
        if (t) {
            var v = e.scrollLeft;
            e.scrollLeft += o;
            if (o && e.scrollLeft === v) {
                t = 0
            }
        }
        if (n) {
            var m = e.scrollTop;
            e.scrollTop += u;
            if (u && e.scrollTop === m) {
                n = 0
            }
        }
        if (!t && !n) {
            azexo_que = []
        }
        if (azexo_que.length) {
            setTimeout(i, r / azexo_framerate + 1)
        } else {
            azexo_pending = false
        }
    };
    setTimeout(i, 0);
    azexo_pending = true
}
function azexo_wheel(e) {
    if (!azexo_initdone) {
        azexo_init()
    }
    var t = e.target;
    var n = azexo_overflowingAncestor(t);
    if (!n || e.defaultPrevented || azexo_isNodeName(azexo_activeElement, "embed") || azexo_isNodeName(t, "embed") && /\.pdf/i.test(t.src)) {
        return true
    }
    var r = e.wheelDeltaX || 0;
    var i = e.wheelDeltaY || 0;
    if (!r && !i) {
        i = e.wheelDelta || 0
    }
    if (Math.abs(r) > 1.2) {
        r *= azexo_stepsize / 120
    }
    if (Math.abs(i) > 1.2) {
        i *= azexo_stepsize / 120
    }
    azexo_scrollArray(n, -r, -i);
    e.preventDefault()
}
function azexo_keydown(e) {
    var t = e.target;
    var n = e.ctrlKey || e.altKey || e.metaKey;
    if (/input|textarea|embed/i.test(t.nodeName) || t.isContentEditable || e.defaultPrevented || n) {
        return true
    }
    if (azexo_isNodeName(t, "button") && e.keyCode === azexo_key.spacebar) {
        return true
    }
    var r, i = 0, s = 0;
    var o = azexo_overflowingAncestor(azexo_activeElement);
    var u = o.clientHeight;
    if (o == document.body) {
        u = window.innerHeight
    }
    switch (e.keyCode) {
        case azexo_key.up:
            s = -azexo_arrowscroll;
            break;
        case azexo_key.down:
            s = azexo_arrowscroll;
            break;
        case azexo_key.spacebar:
            r = e.shiftKey ? 1 : -1;
            s = -r * u * .9;
            break;
        case azexo_key.pageup:
            s = -u * .9;
            break;
        case azexo_key.pagedown:
            s = u * .9;
            break;
        case azexo_key.home:
            s = -o.scrollTop;
            break;
        case azexo_key.end:
            var a = o.scrollHeight - o.scrollTop - u;
            s = a > 0 ? a + 10 : 0;
            break;
        case azexo_key.left:
            i = -azexo_arrowscroll;
            break;
        case azexo_key.right:
            i = azexo_arrowscroll;
            break;
        default:
            return true
    }
    azexo_scrollArray(o, i, s);
    e.preventDefault()
}
function azexo_mousedown(e) {
    azexo_activeElement = e.target
}
function azexo_setCache(e, t) {
    for (var n = e.length; n--; )
        azexo_cache[azexo_uniqueID(e[n])] = t;
    return t
}
function azexo_overflowingAncestor(e) {
    var t = [];
    var n = azexo_root.scrollHeight;
    do {
        var r = azexo_cache[azexo_uniqueID(e)];
        if (r) {
            return azexo_setCache(t, r)
        }
        t.push(e);
        if (n === e.scrollHeight) {
            if (!azexo_frame || azexo_root.clientHeight + 10 < n) {
                return azexo_setCache(t, document.body)
            }
        } else if (e.clientHeight + 10 < e.scrollHeight) {
            overflow = getComputedStyle(e, "").getPropertyValue("overflow");
            if (overflow === "scroll" || overflow === "auto") {
                return azexo_setCache(t, e)
            }
        }
    } while (e = e.parentNode)
}
function azexo_addEvent(e, t, n) {
    window.addEventListener(e, t, n || false)
}
function azexo_removeEvent(e, t, n) {
    window.removeEventListener(e, t, n || false)
}
function azexo_isNodeName(e, t) {
    return e.nodeName.toLowerCase() === t.toLowerCase()
}
function azexo_directionCheck(e, t) {
    e = e > 0 ? 1 : -1;
    t = t > 0 ? 1 : -1;
    if (azexo_direction.x !== e || azexo_direction.y !== t) {
        azexo_direction.x = e;
        azexo_direction.y = t;
        azexo_que = []
    }
}
function azexo_pulse_(e) {
    var t, n, r;
    e = e * azexo_pulseScale;
    if (e < 1) {
        t = e - (1 - Math.exp(-e))
    } else {
        n = Math.exp(-1);
        e -= 1;
        r = 1 - Math.exp(-e);
        t = n + r * (1 - n)
    }
    return t * azexo_pulseNormalize
}
function azexo_pulse(e) {
    if (e >= 1)
        return 1;
    if (e <= 0)
        return 0;
    if (azexo_pulseNormalize == 1) {
        azexo_pulseNormalize /= azexo_pulse_(1)
    }
    return azexo_pulse_(e)
}
var azexo_framerate = 150;
var azexo_animtime = 500;
var azexo_stepsize = 150;
var azexo_pulseAlgorithm = true;
var azexo_pulseScale = 6;
var azexo_pulseNormalize = 1;
var azexo_keyboardsupport = true;
var azexo_arrowscroll = 50;
var azexo_frame = false;
var azexo_direction = {x: 0, y: 0};
var azexo_initdone = false;
var azexo_fixedback = true;
var azexo_root = document.documentElement;
var azexo_activeElement;
var azexo_key = {left: 37, up: 38, right: 39, down: 40, spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36};
var azexo_que = [];
var azexo_pending = false;
var azexo_cache = {};
setInterval(function() {
    azexo_cache = {}
}, 10 * 1e3);
var azexo_uniqueID = function() {
    var e = 0;
    return function(t) {
        return t.azexo_uniqueID || (t.azexo_uniqueID = e++)
    }
}();
jQuery(document).ready(function(e) {
    function t() {
        var e = navigator.appName, t = navigator.userAgent, n;
        var r = t.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (r && (n = t.match(/version\/([\.\d]+)/i)) != null)
            r[2] = n[1];
        r = r ? [r[1], r[2]] : [e, navigator.appVersion, "-?"];
        return r[0]
    }
    var n = t().toLowerCase();
    if (n === "firefox" || n === "chrome" || n === "safari") {
        azexo_addEvent("mousedown", azexo_mousedown);
        azexo_addEvent("mousewheel", azexo_wheel);
        azexo_addEvent("load", azexo_init)
    }
})

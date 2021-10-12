var ox = {};

ox.VAL = function (list) {
    if ('nodeName' in list && list.nodeName == "FORM") list = list.elements;
    var i, l, e, r = {};
    for (i = 0, l = list.length; i < l; ++i) {
        if (list[i].name === "") {
            continue;
        }
        e = list[i];
        switch (e.nodeName) {
            case 'INPUT':
                switch (e.type) {
                    case 'text':
                    case 'tel':
                    case 'file':
                    case 'hidden':
                    case 'password':
                        if (e.getAttribute('data-optional') == 1) continue;
                        else if (e.value == "") {
                            try {
                                e.focus();
                            } catch ($e) {
                            }
                            return e.name;
                        }
                        break;
                    case 'radio':
                        if (!r[e.name]) r[e.name] = e.checked;
                        break;
                    case 'checkbox':
                }
                break;
            case 'TEXTAREA':
            case 'SELECT':
                if (e.getAttribute('data-optional') == 1) continue;
                else if (e.value == "") {
                    try {
                        e.focus();
                    } catch ($e) {
                    }
                    return e.name;
                }
                break;
        }
    }
    for (i in r) {
        if (!r[i]) return i;
    }
    return false;
};


ox.F2S = function (form) {
    var i, j, l, e, q = [];
    for (i = 0, l = form.elements.length; i < l; ++i) {
        if (form.elements[i].name === "") {
            continue;
        }
        e = form.elements[i];
        switch (e.nodeName) {
            case 'INPUT':
                switch (e.type) {
                    case 'text':
                    case 'tel':
                        if (e.getAttribute('data-optional') == 1 && e.getAttribute('empty') == 1) {
                            q.push(e.name + "=");
                            break;
                        }
                    case 'hidden':
                    case 'password':
                    case 'button':
                    case 'reset':
                    case 'submit':
                        q.push(e.name + "=" + encodeURIComponent(e.value));
                        break;
                    case 'radio':
                    case 'checkbox':
                        if (e.checked) {
                            q.push(e.name + "=" + encodeURIComponent(e.value));
                        }
                        break;
                    case 'file':
                        break;
                }
                break;
            case 'TEXTAREA':
                if (e.getAttribute('data-optional') == 1 && e.getAttribute('empty') == 1) {
                    q.push(e.name + "=");
                } else {
                    q.push(e.name + "=" + encodeURIComponent(e.value));
                }
                break;
            case 'SELECT':
                switch (e.type) {
                    case 'select-one':
                        q.push(e.name + "=" + encodeURIComponent(e.value));
                        break;
                    case 'select-multiple':
                        for (j = e.options.length - 1; j >= 0; j = j - 1) {
                            if (e.options[j].selected) {
                                q.push(e.name + "=" + encodeURIComponent(e.options[j].value));
                            }
                        }
                        break;
                }
                break;
            case 'BUTTON':
                switch (e.type) {
                    case 'reset':
                    case 'submit':
                    case 'button':
                        q.push(e.name + "=" + encodeURIComponent(e.value));
                        break;
                }
                break;
        }
    }
    return q.join("&");
};

ox.F2O = function (form) {
    var i, j, l, e, q = {};

    function add($name, $value) {
        if ($name.slice(-2) == "[]") {
            $name = $name.slice(0, -2);
        }

        if (q[$name]) {
            if (!(q[$name] instanceof Array)) {
                q[$name] = [q[$name]];
            }
            q[$name].push($value);
        } else q[$name] = $value;
    }

    for (i = 0, l = form.elements.length; i < l; ++i) {
        if (form.elements[i].name === "") {
            continue;
        }
        e = form.elements[i];
        switch (e.nodeName) {
            case 'INPUT':
                switch (e.type) {
                    case 'text':
                    case 'tel':
                        if (e.getAttribute('data-optional') == 1 && e.getAttribute('empty') == 1) {
                            add(e.name, '');
                            break;
                        }
                    case 'hidden':
                    case 'password':
                    case 'button':
                    case 'reset':
                    case 'submit':
                        add(e.name, e.value);
                        break;
                    case 'radio':
                    case 'checkbox':
                        if (e.checked) {
                            add(e.name, e.value);
                        }
                        break;
                    case 'file':
                        break;
                }
                break;
            case 'TEXTAREA':
                if (e.getAttribute('data-optional') == 1 && e.getAttribute('empty') == 1) {
                    add(e.name, '');
                } else {
                    add(e.name, e.value);
                }
                break;
            case 'SELECT':
                switch (e.type) {
                    case 'select-one':
                        add(e.name, e.value);
                        break;
                    case 'select-multiple':
                        for (j = e.options.length - 1; j >= 0; j = j - 1) {
                            if (e.options[j].selected) {
                                add(e.name, e.options[j].value);
                            }
                        }
                        break;
                }
                break;
            case 'BUTTON':
                switch (e.type) {
                    case 'reset':
                    case 'submit':
                    case 'button':
                        add(e.name, e.value);
                        break;
                }
                break;
        }
    }
    return q;
};

ox.O2S = function ($data) {
    var t0, t1, t2, i, j;
    t0 = [];
    t1 = null;
    for (t1 in $data) {
        t2 = $data[t1];
        if (t2 === undefined) continue;
        if (t2 === null) continue;
        if (typeof t2 == 'object') {
            if ('nodeName' in t2 && t2.nodeName === "FORM") {
                t0.push(ox.F2S(t2));
            } else if (t2.length) {
                for (i = 0, j = t2.length; i < j; ++i) t0.push(t1 + "[]=" + encodeURIComponent(t2[i])); ////////////// php 는 []  java 는 그냥
            } else {
                t0.push(ox.O2S(t2));
            }
        } else {
            t0.push(t1 + "=" + encodeURIComponent(t2));
        }
    }
    return t0.join("&");
};


ox.O2F = (function () {
    function addInput($key, $value, $form) {
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = $key;
        input.value = $value;
        $form.appendChild(input);
    }

    return function ($data, $form) {
        var t1, t2, i, j;
        for (t1 in $data) {
            t2 = $data[t1];
            if (t2 === undefined) continue;
            if (t2 === null) continue;
            if (typeof t2 == 'object') {
                if ('nodeName' in t2 && t2.nodeName === "FORM") {
                    ox.O2F(ox.F2O(t2), $form);
                } else if (t2.length) {
                    for (i = 0, j = t2.length; i < j; ++i) addInput(t1 + "[]", t2[i], $form);////////////// php 는 []  java 는 그냥
                } else {
                    ox.O2F(t2, $form);
                }
            } else {
                addInput(t1, t2, $form);
            }
        }
    };
})();


ox.SR = function ($data) {
    if ($data == null) return '';
    if (typeof $data == 'object') {
        if ('nodeName' in $data && $data.nodeName === "FORM") {
            $data = ox.F2S($data);
        } else {
            $data = ox.O2S($data);
        }
    }
    return $data;
};

ox.AX = (function ($W) {
    var _xhr = null;

    function _init() {
        if ($W['XMLHttpRequest']) {
            _xhr = function () {
                return new XMLHttpRequest;
            };
        } else {
            _xhr = (function () {
                var temp, i, j;
                temp = ['Microsoft.XMLHTTP', 'MSXML2.XMLHTTP', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.5.0'];
                i = temp.length;
                j = temp[0];
                while (i--) {
                    try {
                        j = temp[i];
                        new ActiveXObject(j);
                    } catch ($e) {
                        continue;
                    }
                    break;
                }
                return function () {
                    return new ActiveXObject(j);
                };
            })();
        }
    }


    return function ($url, $method, $data, $callback, $isSync, $contType) {
        if (!_xhr) _init();

        $data = ox.SR($data);
        //trace($data);
        $method = $method || 'GET';
        $method = $method.toUpperCase();
        $url += $method == 'GET' && $data ? '?' + $data : '';
        $isSync = $isSync ? true : false;

        var temp;
        temp = xhr();
        temp.open($method, $url);
        temp.setRequestHeader("Content-Type", $contType ? $contType : "application/x-www-form-urlencoded");
        temp.send($method == 'POST' && $data ? $data : '');
        if ($isSync && $callback) $callback(temp.responseText);

        function xhr() {
            var xhr, timer;
            xhr = _xhr();
            timer = -1;
            if ($isSync) return xhr;
            xhr.onreadystatechange = function () {
                if (xhr.readyState != 4 || timer < 0) return;
                clearTimeout(timer), timer = -1;
                if ($callback) {
                    if (xhr.status == 200 || xhr.status == 0) {
                        if ($callback.setList) $callback.setList(JSON.parse(xhr.responseText));
                        else if ($callback.setList) $callback.setList(JSON.parse(xhr.responseText));
                        else $callback(xhr.responseText);
                    } else {
                        if ($callback.setList) $callback.setList([]);
                        else $callback('{"error" : "' + xhr.status + '"}');
                    }
                }
            };
            timer = setTimeout(function () {
                if (timer < 0) return;
                timer = -1;
                if ($callback) {
                    if ($callback.setList) $callback.setList([]);
                    else $callback('{"error" : "timeout"}');
                }
            }, 5000);
            return xhr;
        }
    };
})(window);

ox.submit = (function () {
    var frame, initialized, framename = '__oxsubmit__', seq = 0;

    function init() {
        if (initialized) return;
        initialized = true;
        frame = document.createElement("iframe");
        frame.style.display = "none";
        frame.name = framename;
        document.body.appendChild(frame);
    }

    return function (form, callback) {
        init();
        form.target = framename;
        if (callback) {
            if (!form.ox_submit) {
                var cbi = document.createElement("input");
                cbi.type = "hidden";
                cbi.name = "ox_submit";
                form.appendChild(cbi);
            }
            var cb = 'cb_' + (seq++);
            form.ox_submit.value = cb;
            ox.submit[cb] = callback;
        }
        form.submit();
    };
})();

ox.JP = (function ($W) {
    var _rSeq, _head;
    _rSeq = 0;

    function getHead() {
        if (_head) return _head;
        return _head = document.getElementsByTagName("head")[0];
    }

    return function jp($url, $params, $callback, $callbackName) {
        var tag, src, cb;

        tag = document.createElement("script");
        tag.type = "text/javascript";

        if ($params) $url += "?" + ox.SR($params);

        if ($callback) {
            cb = "ox_jp_cb" + (_rSeq++);
            $callbackName = $callbackName || "callback";
            $W[cb] = function ($r) {
                $callback($r);
                delete $W[cb];
            };
            $url += ($params ? "&" : "?") + $callbackName + "=" + cb ;
        }

        tag.src = $url;
        getHead().appendChild(tag);
    }
})(window);

ox.FB = function ($id, $scope, $scopeConfirm) {
    window.fbAsyncInit = function () {
        function _r($r, $success, $fail) {
            if ($r && $r.authResponse) {
                if ($scope && $scopeConfirm) {
                    FB.api('/me/permissions', function (response) {
                        var d = response.data;
                        for (var i = 0; i < d.length; ++i) {
                            if ($scope.indexOf(d[i].permission) != -1 && d[i].status == 'declined') {
                                $fail && $fail(false);
                                return;
                            }
                        }
                        ox.FB.ID = $r.authResponse.userID;
                        $success && $success(true);
                    });
                } else {
                    ox.FB.ID = $r.authResponse.userID;
                    $success && $success(true);
                }

            } else {
                $fail && $fail(false);
            }
        }

        function _auth($success, $fail) {
            if (ox.FB.ID) {
                $success(true);
                return;
            }
            FB.login(function ($r) {
                _r($r, $success, $fail);
            }, {scope: $scope, default_audience: 'everyone'});
        }

        ox.FB = {
            info: function ($callback) {
                if (ox.FB.NAME) {
                    $callback(ox.FB);
                    return;
                }
                _auth(function () {
                    FB.api("/me?locale=ko_KR", function (data) {
                        ox.FB.DATA = data;
                        ox.FB.NAME = data.name;
                        $callback(ox.FB);
                    });
                }, $callback);
            },
            login: function ($callback) {
                _auth($callback, $callback);
            }
        };

        FB.init({appId: $id, xfbml: true, version: 'v2.1'});
        FB.getLoginStatus(_r);
    };

    // (function (d, s, id) {
    //     var js, fjs = d.getElementsByTagName(s)[0];
    //     if (d.getElementById(id)) {
    //         return;
    //     }
    //     js = d.createElement(s);
    //     js.id = id;
    //     js.src = "//connect.facebook.net/ko_KR/sdk.js";
    //     fjs.parentNode.insertBefore(js, fjs);
    // }(document, 'script', 'facebook-jssdk'));
};


ox.TW = (function () {
    var pending, auth;

    function openLogin() {
        window.open("/twitter/login.php", "twitter", "height=300,width=550,resizable=1");
    }

    return {
        info: function ($callback) {
            ox.AX('/twitter/status.php', 'GET', {}, function ($r) {
                if ($r == 0) {
                    pending = $callback;
                    openLogin();
                } else {
                    auth = 1;
                    var t0 = JSON.parse($r);
                    ox.TW.NAME = t0.NAME;
                    ox.TW.ID = t0.ID;
                    $callback(ox.TW);
                }
            });
        },
        login: function ($callback) {
            if (ox.TW.TOKEN && ox.TW.SECRET) {
                $callback(ox.TW);
                return;
            }
            pending = $callback;
            openLogin();
        },
        callback: function ($r) {
            auth = 1;
            var t0 = JSON.parse($r);
            ox.TW.NAME = t0.NAME;
            ox.TW.ID = t0.ID;
            ox.TW.TOKEN = t0.TOKEN;
            ox.TW.SECRET = t0.SECRET;
            pending(ox.TW);
        },
        post: function ($param, $callback) {
            if (auth) {
                $param.TOKEN = ox.TW.TOKEN;
                $param.SECRET = ox.TW.SECRET;
                ox.AX('/twitter/post.php', 'POST', $param, $callback);
            } else {
                this.info(function ($r) {
                    $r.post($param, $callback);
                });
            }
        },
        upload: function ($img, $callback) {
            if (auth) {
                ox.AX('/twitter/upload.php', 'POST', {IMG: $img}, $callback);
            } else {
                this.info(function ($r) {
                    $r.upload($img, $callback);
                });
            }
        }
    };
})();

ox.KS = function ($id) {
    Kakao.init($id);
    ox.KS = {
        login: function ($callback) {
            if (ox.KS.ID) return $callback(ox.KS);
            Kakao.Auth.login({
                success: function (authObj) {
                    Kakao.API.request({url: '/v1/user/me'}).then(function (res) {
                        ox.KS.ID = res.id;
                        $callback(ox.KS);
                    });
                },
                fail: function (err) {
                    $callback(false, err);
                }
            });
        },
        info: function ($callback) {
            if (ox.KS.DATA) return $callback(ox.KS);
            this.login(function (r, err) {
                if (r) {
                    Kakao.API.request({url: '/v1/api/story/profile'}).then(function (res) {
                        ox.KS.DATA = res;
                        $callback(ox.KS);
                    }, function (err) {
                        $callback(false, err);
                    });
                } else {
                    $callback(false, err);
                }
            });
        },
        post: function ($param, $callback) {
            Kakao.API.request({
                url: '/v1/api/story/linkinfo',
                data: {
                    url: $param.url
                }
            }).then(function (res) {
                return Kakao.API.request({
                    url: '/v1/api/story/post/link',
                    data: {
                        link_info: res,
                        content: $param.text
                    }
                });
            }).then(function (res) {
                $callback(res);
            }, function (err) {
                $callback(false, err);
            });
        }
    };
};


ox.TPL = function ($id, $info) {
    return ox.COMPILE(document.getElementById($id).innerHTML, $info);
};

ox.COMPILE = function (tpl, $info) {
    var key, i, j, t0, t1, t2, t3, out;
    tpl = tpl.replace(/>[\s^<]*</g, "><");
    tpl = tpl.replace(/^[\s^<]*</g, "<");
    tpl = tpl.replace(/>[\s^<]*$/g, ">");
    while (t0 = tpl.match(/<LOOP#([^>]*)>/)) {
        t1 = t0[1];
        t0 = new RegExp("<LOOP#" + t1 + ">(.*)</LOOP#" + t1 + ">");
        t1 = $info[t1];
        if (t1 && t1.length) {
            t2 = tpl.match(t0)[1], t3 = "";
            if (t1 instanceof Array) {
            } else t1 = [t1];
            for (i = 0, j = t1.length; i < j; ++i) {
                t3 += ox.COMPILE(t2, typeof t1[i] == "object" ? (t1[i]["@i"] = i, t1[i]) : {VAL: t1[i], "@i": i});
            }
            tpl = tpl.replace(t0, t3);
        }
    }
    while (t0 = tpl.match(/<IF#([^>]*)>/)) tpl = tpl.replace(new RegExp("<IF#" + t0[1] + ">(.*)</IF#" + t0[1] + ">", "m"), $info[t0[1]] ? "$1" : "");
    for (key in $info) tpl = tpl.replace(new RegExp("##" + key + "##", "g"), $info[key]);
    if (!ox.TPL.SQ) ox.TPL.SQ = 0;
    tpl = tpl.replace(/##\$SQ##/g, ox.TPL.SQ);
    tpl = tpl.replace(/##[^#]+##/g, "");
    ox.TPL.SQ++;
    return tpl;
};

ox.HV = function ($key, $value) {
    var raw;
    if ($key == null) return null;
    try {
        if (location.hash == "") raw = {};
        else {
            raw = JSON.parse(Base64.decode(location.hash.slice(1)));
        }
        if ($value != null) {
            raw[$key] = $value;
            location.hash = Base64.encode(JSON.stringify(raw));
        }
        return raw[$key] || null;
    } catch (e) {
        location.hash = '';
        return null;
    }
};

ox.PAD = function ($val, $unit, $pad) {
    $unit = $unit || 2;
    $pad = $pad || "0";
    while ($val.length < $unit) {
        $val = $pad + $val;
    }
    return $val;
};

ox.APM = function ($val) {
    var h, m, apm;
    h = $val.slice(0, 2);
    m = $val.slice(3, 5);
    apm = $val.slice(6);
    if (apm) {
        if (apm == 'AM' && h == '12') h = '00';
        if (apm == 'PM' && h != '12') h = ox.PAD(h * 1 + 12);
        return h + ":" + m;
    } else {
        h = h * 1;
        if (h < 12) {
            apm = 'AM';
        } else {
            apm = 'PM';
            if (h > 12) h -= 12;
        }
        return ox.PAD(h) + ":" + m + " " + apm;
    }
};


var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        return output;
    }
};


if (typeof(String.prototype.trim) != 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
}


ox.PAGE = function (cw, ch, params) {
    var vd = {r: 0}, dir, moving, now, out;

    function start($w) {
        var el, ht, wd, $s, $e, anc;
        el = $(".ox-el");
        $s = "$s";
        $e = "$e";

        var o_prop = 'ow,ol,or,oh,ot,ob'.split(","),
            a_prop = 'aw,al,ar,ah,at,ab'.split(","),
            s_prop = 'width,left,right,height,top,bottom'.split(",");

        function getV($v, $t, $t2, $r) {
            if (typeof $v == "number") return $v * $r;
            var r, t0, t1, d = $v.match(/[-\d.]+[%sf]?/g), l = d.length;
            r = 0;
            while (l--) {
                t0 = d[l] + "";
                t1 = t0.match(/[-\d.]+/)[0];
                if (t0.match(/%$/)) {
                    r += $t * t1 * 0.01;
                } else if (t0.match(/s$/)) {
                    r += $t2 * t1 * $r;
                } else if (t0.match(/f$/)) {
                    r += t1 * 1;
                } else {
                    r = t1 * $r;
                }
            }

            if ($v.match(/^c/)) r = $t * 0.5 + r;
            return r;
        }

        function res() {
            var r;
            ht = $w.height();
            wd = $w.width();
            r = Math.min(ht / ch, wd / cw);
            el.each(function () {
                var rr = r;
                this.xr && this.xr < rr && (rr = this.xr); // xr은 최대비율
                this.ir && this.ir > rr && (rr = this.ir); // ir은 최소비율
                this.h && (this.style.height = rr * this.h + "px");
                this.w && (this.style.width = rr * this.w + "px");
                this.fs && (this.style.fontSize = rr * this.fs + "px");
                var rat = (this.h || this.w || this.xr || this.ir) ? rr : 1;
                $(this).data('rat', rat);
                var i, j, t0, t1, t2, t3, plen;


                i = o_prop.length;
                plen = this.p ? this.p.length : 0;
                while (i--) {
                    t0 = this[a_prop[i]];
                    t1 = this[o_prop[i]];
                    t2 = i < 3 ? wd : ht;
                    t3 = i < 3 ? ( this.aw || this.ow ) : ( this.ah || this.oh );

                    if (t0) {
                        for (j = 0; j < plen; ++j) {
                            t0[j] = getV(t1[j], t2, t3 && (t3[j] || t3[0]), rat);
                        }
                    } else if (t1) {
                        this.style[s_prop[i]] = getV(t1[0], t2, t3 && t3[0], rat) + "px";
                    }
                }
            });
            render(vd.r);
        }

        function getIDX(arr, r) {
            var i = arr.length;
            if (arr[i - 1] <= r) return $e;
            if (arr[0] >= r) return $s;
            while (i--) if (arr[i] >= r && arr[i - 1] < r) return i;
        }

        function interpolate(e, r) {
            var i, t, last, k, t0;
            if (!e.p) return;
            last = e.p.length - 1;
            i = getIDX(e.p, r);
            if (i === undefined) return;
            k = a_prop.length;
            if (i === $e) {
                while (k--) if (t0 = e[a_prop[k]]) e.style[s_prop[k]] = t0[last] + "px";
                e.oa && e.jq.css('opacity', e.oa[last]);
            } else if (i === $s) {
                while (k--) if (t0 = e[a_prop[k]]) {
                    e.style[s_prop[k]] = t0[0] + "px";
                }
                e.oa && e.jq.css('opacity', e.oa[0]);
            } else {
                t = ((r - e.p[i - 1]) / (e.p[i] - e.p[i - 1])) || 1;
                while (k--) if (t0 = e[a_prop[k]]) {
                    e.style[s_prop[k]] = (t0[i - 1] + (t0[i] - t0[i - 1]) * t) + "px"
                }
                e.oa && e.jq.css('opacity', e.oa[i - 1] + (e.oa[i] - e.oa[i - 1]) * t);
            }
        }

        function isIn($e, $t) {
            return $e.range ? ($e.page[0] <= $t && $e.page[1] >= $t) : $e.page == $t;
        }


        function render(r) {
            el.each(function () {
                var t0, show, isNow, isOut;
                if (!this.page) return;
                isNow = isIn(this, now);
                isOut = isIn(this, out);
                show = isNow || (moving && isOut);

                if (show) {
                    if (this.display != "block") {
                        this.display = "block";
                        this.style.display = "block";
                        if (this.noshow != 1) {
                            if (this.onshow) {
                                try {this.onshow();} catch (e) {}
                            } else if (t0 = this.getAttribute('data-show')) {
                                this.onshow = new Function(t0);
                                try {this.onshow();} catch (e) {}
                            } else this.noshow = 1;
                        }
                    }
                    if (!this.range || !(isNow && isOut)) interpolate(this, isNow ? r : r + dir);
                } else {
                    if (this.display == "block") {
                        this.display = "none";
                        this.style.display = "none";
                        if (this.nohide != 1) {
                            if (this.onhide) {
                                try {this.onhide();} catch (e) {}
                            } else if (t0 = this.getAttribute('data-hide')) {
                                this.onhide = new Function(t0);
                                try {this.onhide();} catch (e) {}
                            } else this.nohide = 1;
                        }
                    }
                }
            });
        }


        el.each(function () {
            var tmp, i;
            if (tmp = this.getAttribute("data-size")) {
                tmp = tmp.split(",");
                if (tmp[0] && tmp[0] > 0) this.setAttribute("data-scale-width", tmp[0]), this.setAttribute("data-width", tmp[0]);
                if (tmp[1] && tmp[1] > 0) this.setAttribute("data-scale-height", tmp[1]), this.setAttribute("data-height", tmp[1]);
                if (tmp[2]) this.setAttribute("data-max-scale", tmp[2]);
                if (tmp[3]) this.setAttribute("data-min-scale", tmp[3]);
            }
            if (tmp = this.getAttribute("data-wh")) {
                tmp = tmp.split("|");
                if (tmp[0]) this.setAttribute("data-width", tmp[0]);
                if (tmp[1]) this.setAttribute("data-height", tmp[1]);
            }
            if (tmp = this.getAttribute("data-lt")) {
                tmp = tmp.split("|");
                if (tmp[0]) this.setAttribute("data-left", tmp[0]);
                if (tmp[1]) this.setAttribute("data-top", tmp[1]);
            }
            if (tmp = this.getAttribute("data-rt")) {
                tmp = tmp.split("|");
                if (tmp[0]) this.setAttribute("data-right", tmp[0]);
                if (tmp[1]) this.setAttribute("data-top", tmp[1]);
            }
            if (tmp = this.getAttribute("data-rb")) {
                tmp = tmp.split("|");
                if (tmp[0]) this.setAttribute("data-right", tmp[0]);
                if (tmp[1]) this.setAttribute("data-bottom", tmp[1]);
            }
            if (tmp = this.getAttribute("data-lb")) {
                tmp = tmp.split("|");
                if (tmp[0]) this.setAttribute("data-left", tmp[0]);
                if (tmp[1]) this.setAttribute("data-bottom", tmp[1]);
            }

            this.jq = $(this);
            if (tmp = this.getAttribute("data-scale-height")) this.h = (tmp.indexOf('%') != -1) ? parseFloat(tmp) * 0.01 * ch : tmp;
            if (tmp = this.getAttribute("data-scale-width")) this.w = (tmp.indexOf('%') != -1) ? parseFloat(tmp) * 0.01 * cw : tmp;
            if (tmp = this.getAttribute("data-max-scale")) this.xr = tmp;
            if (tmp = this.getAttribute("data-min-scale")) this.ir = tmp;
            if (tmp = this.getAttribute("data-fs")) this.fs = tmp;

            if (tmp = this.getAttribute("data-p")) {
                this.p = tmp.split(',');
            }

            if (tmp = this.getAttribute("data-page")) {
                if (this.jq.hasClass('ox-range')) {
                    this.range = true;
                    this.page = tmp.split(",");
                }
                else this.page = tmp;
                if (!this.p) {
                    this.p = [-1, 0, 1];
                }
            } else if (tmp = this.jq.parents(".ox-page").data('page')) {
                this.page = tmp;
            }


            if (tmp = this.getAttribute("data-alpha")) {
                this.oa = tmp.split(',');
                if (this.p) {
                    tmp = this.oa.length;
                    while (tmp--) this.oa[tmp] = parseFloat(this.oa[tmp]);
                } else this.jq.css('opacity', this.oa[0]);
            }

            i = o_prop.length;
            if (this.p) {
                while (i--) {
                    if (tmp = this.getAttribute("data-" + s_prop[i])) {
                        if ((this[o_prop[i]] = tmp.split(',')).length === this.p.length) this[a_prop[i]] = [];
                    }
                }
            } else {
                while (i--) {
                    if (tmp = this.getAttribute("data-" + s_prop[i])) {
                        this[o_prop[i]] = tmp.split(',');
                    }
                }
            }
        });

        anc = $(".ox-anc").css('cursor', 'pointer').each(function () {
            var tmp = this.getAttribute("data-anc").split(",");
            this.anc = tmp[0];
            if (tmp.length == 1) tmp[1] = tmp[0];
            this.range = tmp;
            this.jq = $(this);
        }).click(function () {
            if (params && params.anc && params.anc(now, this.anc)) return;
            animateTo(this.anc);
        });


        function animateTo(to, dura) {
            if (moving) return;
            if (now == to) return;
            if (params && params.leave && params.leave(now, to)) return;
            onpage(to);
            var t0 = now + '->' + to;
            dir = to > now ? 1 : -1;
            vd.r = to > now ? -1 : 1;
            out = now;
            now = to * 1;
            moving = true;
            var target = now;
            $(vd).animate({r: 0}, {
                step: render,
                complete: function () {
                    arrive(target);
                },
                duration: dura || (params && params.durations && params.durations[t0]) || 1000,
                easing: (params && params.easings && params.easings[t0]) || 'easeOutExpo'
            });

            return now;
        }

        function jumpTo(to) {
            if (now == to) return;
            $(vd).stop();
            dir = to > now ? 1 : -1;
            now = to * 1;
            onpage(to);
            arrive(now);
        }

        function arrive(end) {
            moving = false;
            render(0);
            params && params.arrive && params.arrive(end, dir);
        }

        function onpage(page) {
            anc.each(function () {
                if (this.range[0] <= page && page <= this.range[1]) this.jq.addClass('on'); else this.jq.removeClass('on');
            });
            params && params.onpage && params.onpage(page);
        }


        $w.resize(res);
        now = out = params && params.page ? params.page : 1;
        res();

        ox.PAGE = {
            go: animateTo,
            jumpTo: jumpTo,
            getNow: function () {
                return now;
            }
        };

        params && params.start && params.start();
        onpage(now);
    }

    //var imgs = $("img"), $w = $(window), ing = setInterval(function () {
    //    var i = imgs.length, j = 0;
    //    if (i) while (i--) {
    //        imgs[i].complete && ++j;
    //    }
    //    if (j == imgs.length) {
    //        clearInterval(ing);
    //        start($w);
    //    } else {
    //    }
    //}, 100);
    start($(window));
};


(function ($) {
    $.fn.oxClick = function (fnc) {
        this.each(function () {
            var key = this.className.split(" ")[0];
            $(this).click(fnc[key]);
        });
    };

    $.fn.yoyo = function (prop, start, range, dura) {
        var o1 = {}, o2 = {}, self = this;
        var r = this.data('rat') || this.parent().data('rat') || 1;
        o1[prop] = r * start;
        o2[prop] = r * (start + range);
        this.css(o1);
        var f1 = function () {
            self.animate(o2, dura || 500, f2);
        };
        var f2 = function () {
            self.animate(o1, dura || 500, f1);
        };
        f1();
        return this;
    };

    $.fn.repeat = function (start, end, dura) {
        var self = this;
        var f1 = function () {
            self.stop().css(start).animate(end, dura || 500, f1);
        };
        f1();
        return this;
    };
    $.fn.clip = function() {
        this.each(function(){
            this.style.backgroundImage = 'url('+this.src+')';
            this.src = 'css/clear.gif';
        });
    };

    (function () {
        var tpl = '<div class="down"></div><input type="text" name="cnt" class="cnt"><div class="up"></div>';
        $.fn.stepper = function (v, cb) {
            var t0, min = 0;
            if (v) min = 1;
            this.html(tpl);
            this.find(".down").click(function () {
                var i = $("input", this.parentNode);
                i.val(Math.max(i.val() * 1 - 1, min));
                cb && cb();
            });
            this.find(".up").click(function () {
                var i = $("input", this.parentNode);
                i.val(i.val() * 1 + 1);
                cb && cb();
            });
            (t0 = this.find("input")).val(v || t0.val() || 0).blur(function () {
                this.value = this.value * 1 || 0;
                if (this.value < min) this.value = min;
                cb && cb();
            });
        };
    })();

    $.fn.options = function () {
        this.find("div").click(function () {
            $(this).siblings().removeClass('on');
            var t1 = $(this).addClass('on');
            $("input.product", this.parentNode).val(t1.data('value'));
            $("input.optionName", this.parentNode).val(t1.data('name'));
        }).filter(":first-child").click();
    };

    /*Sprite*/
    (function () {
        var numeric = /\d+$/,geo_suffix = function(org) {
            if (numeric.test(org[0])) org[0] += "px";
            if (numeric.test(org[1])) org[1] += "px";
        },geo = function(obj){
            if (this.geo_mark) return this.jq;
            var tmp, style;
            style = {};
            if (tmp = this.getAttribute('data-bg')) {
                tmp = tmp.split(" ");
                if (tmp[0].indexOf(".") != -1) tmp[0] = 'url("'+tmp[0]+'")';
                style.background = tmp.join(" ");
            }
            if (tmp = this.getAttribute('data-wh')) {
                tmp = tmp.split(",");
                if (obj) {
                    obj.width = tmp[0];
                    obj.height = tmp[1];
                }
                geo_suffix(tmp);
                style.width = tmp[0];
                style.height = tmp[1];
            }
            if (tmp = this.getAttribute('data-lt')) {
                geo_suffix(tmp = tmp.split(","));
                style.position = 'absolute';
                style.left = tmp[0];
                style.top = tmp[1];
            } else if (tmp = this.getAttribute('data-rt')) {
                geo_suffix(tmp = tmp.split(","));
                style.position = 'absolute';
                style.right = tmp[0];
                style.top = tmp[1];
            } else  if (tmp = this.getAttribute('data-rb')) {
                geo_suffix(tmp = tmp.split(","));
                style.position = 'absolute';
                style.right = tmp[0];
                style.bottom = tmp[1];
            } else if (tmp = this.getAttribute('data-lb')) {
                geo_suffix(tmp = tmp.split(","));
                style.position = 'absolute';
                style.left = tmp[0];
                style.bottom = tmp[1];
            }
            if (tmp = this.getAttribute('data-z')) style['z-index'] = tmp;

            return this.jq = $(this).css(style);
        },Sprite, fn = (Sprite = function (el) {
            var t0 = geo.call(el,this);
            if (this.len = t0.data('len')); else throw Error("len이 없음");
            this.col = t0.data('col') || this.len;
            this.interval = t0.data('interval') || 100;
            this.jq = t0;
            this.cursor = 0;
            el.sprite = this;
        }).prototype;

        fn.moveTo = function ($f, $cb) {
            clearInterval(this.intervalId);
            if (this.cursor == $f) return;
            var step = (this.cursor < $f) ? 1 : -1;
            var self = this;
            this.intervalId = setInterval(function () {
                self.cursor += step;
                self._sync();
                if (self.cursor == $f) { self.stop(); $cb && $cb(this); }
            }, this.interval);
        };
        fn.jumpTo = function ($f) {
            clearInterval(this.intervalId);
            this.cursor = $f;
            this._sync();
        };

        fn.forward = function ($cb) {
            if (this.cursor == this.len - 1) this.cursor = -1;
            this.moveTo(this.len - 1, $cb);
        };

        fn.rewind = function ($cb) {
            this.moveTo(0, $cb);
        };

        fn.yoyo = function (intermediate) {
            clearInterval(this.intervalId);
            var self = this, delay;
            self.direction = self.cursor == self.len - 1? -1 : 1;
            this.intervalId = setInterval(function () {
                if (delay) { delay--; return; }
                self.cursor += self.direction;
                if (self.cursor == self.len - 1) self.direction = -1;
                else if (self.cursor == 0) {
                    delay = intermediate;
                    self.direction = 1;
                }
                self._sync();
            }, this.interval);
        };

        fn.repeat = function (intermediate) {
            clearInterval(this.intervalId);
            var self = this, delay;
            this.intervalId = setInterval(function () {
                if (delay) { delay--; return; }
                self.cursor += 1;
                if (self.cursor == self.len ) {
                    delay = intermediate;
                    self.cursor = 0;
                }
                self._sync();
            }, this.interval);
        };

        fn._sync = function() {
            var x,y;
            y = (this.cursor / this.col) >> 0;
            x = this.cursor - y*this.col;
            this.jq.css('background-position', (-this.width * x) + "px "+ (-this.height * y) +"px");
        };

        fn.stop = function () {
            clearInterval(this.intervalId);
        };

        $.fn.sprite = function () {
            this.each(function () { if (!this.sprite) new Sprite(this); });
            return this;
        };
        $.fn.spriteYoyo = function (intermediate) {
            this.each(function () { this.sprite && this.sprite.yoyo(intermediate); });
            return this;
        };
        $.fn.spriteRepeat = function (intermediate) {
            this.each(function () { this.sprite && this.sprite.repeat(intermediate); });
            return this;
        };
        $.fn.spriteRewind = function ($cb) {
            this.each(function () { this.sprite && this.sprite.rewind($cb); });
            return this;
        };
        $.fn.spriteForward = function ($cb) {
            this.each(function () { this.sprite && this.sprite.forward($cb); });
            return this;
        };
        $.fn.spriteTo = function ($f, $cb) {
            this.each(function () { this.sprite && this.sprite.moveTo($f, $cb); });
            return this;
        };
        $.fn.spriteJump = function ($f) {
            this.each(function () { this.sprite && this.sprite.jumpTo($f); });
            return this;
        };
        $.fn.spriteStop = function () {
            this.each(function () { this.sprite && this.sprite.stop(); });
            return this;
        };
        $.fn.geo = function(){
            this.each(geo);
            return this;
        };
    })();
})(jQuery);


if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

ox.POS = (function() {
    var o_prop = {l:"left",t:"top",r:"right",b:"bottom",w:"width",h:"height"};
    var offset_prop = {left:"innerWidth",top:"innerHeight",right:"innerWidth",bottom:"innerHeight",width:"innerWidth",height:"innerHeight"};
    var require_absolute = ["l","t","r","b"];
    var initialized = false;
    var timeoutId = -1;
    var boundary = 960;
    var viewport = 640;
    var viewportRatio;
    var isMobile;

    function getRV(v) {
        if (isMobile) {
            return v*viewportRatio;
        } else {
            return v*1;
        }
    }

    function getV($v, $t) { // 값, 비율기준값
        if (!isNaN($v)) return getRV($v);
        var r, t0, t1, d = $v.match(/[-\d.]+%?/g), l = d.length;
        r = 0;
        while (l--) {
            t0 = d[l] + "";
            t1 = t0.match(/[-\d.]+/)[0];
            if (t0.match(/%$/)) {
                r += $t * t1 * 0.01;
            } else {
                r += getRV(t1);
            }

        }
        if ($v.match(/^c/)) r = $t * 0.5 + r;
        return r;
    }

    function proc(el,attr) {
        var props = attr.name.slice(1).split(""),i,j,prop,isAbs = false, values = attr.value.split(','), options = {};
        if (props.length !== values.length) throw new Error("@key,value불일치");
        for (i=0,j=props.length; i < j ; ++i) {
            prop = props[i];
            isAbs = isAbs || require_absolute.indexOf(prop) > -1;
            if (o_prop[prop]) {
                options[o_prop[prop]] = values[i];
            }
        }
        if (isAbs) el.style.position = "absolute";
        el.setAttribute('oxpos',attr.name);
        el.oxpos = options;
    }

    function setPosition() {
        viewportRatio = window.innerWidth/viewport;
        isMobile = window.innerWidth < boundary;
        var elements = document.querySelectorAll('[oxpos]'), i = elements.length,el,options,k;
        while(i--) {
            el = elements[i];
            options = el.oxpos;
            for (k in options) {
                el.style[k] = getV(options[k],window[offset_prop[k]])+"px";
            }
        }
    }

    function setPositionPadd() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(setPosition,500);
    }

    function addElements(root) {
        root = root || document;
        var elements = root.getElementsByTagName('*'), i = elements.length, attrs, j, el;
        if (!i) return;
        while(i--) {
            el = elements[i];
            if (el.getAttribute('oxpos')) continue;
            attrs = el.attributes;
            if (!attrs) continue;
            j = attrs.length;
            while (j--) {
                if (attrs[j].name[0] === "@") proc(el, attrs[j]);
            }
        }
    }

    return function(root) {
        addElements(root);
        setPosition();
        if (!initialized) {
            window.addEventListener("resize",setPositionPadd);
            initialized = true;
        }

    }
})();

ox.getScrollBody = (function(){
    var first = true, scrollBody, $b, $h, $bh;
    function init() {
        first = false;
        $b = $("body"), $h = $("html"), $bh = $("body,html");
    }
    return function() {
        if (scrollBody) return scrollBody;
        if (first) init();
        var x,y;
        if ((x = $b.scrollTop()) == 0 && (y = $h.scrollTop()) == 0) return $bh;
        scrollBody = (x < y) ? $h : $b;
        return scrollBody;
    }
})();

ox.getOffsetTop = function (el) {
    var t1, t0;
    if (!el) return -1;
    t0 = el, t1 = el.offsetTop;
    while (t0 !== t0.offsetParent && (t0 = t0.offsetParent) !== null && t0.nodeName !== 'body' && t0) t1 += t0.offsetTop;
    return t1;
};
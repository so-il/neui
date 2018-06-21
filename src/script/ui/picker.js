
/****************************************************************** 
 * @picker
 *******************************************************************/

(function (Ne) {
    var picker = {
        util: {
            prefix: function () {
                var _p;
                var testProps = function (props) {
                    var i;
                    for (i in props) {
                        if (document.createElement('modernizr').style[props[i]] !== undefined) {
                            return true;
                        }
                    }
                    return false;
                };
                ['Webkit', 'Moz', 'O', 'ms'].forEach(function (p) {
                    if (testProps([p + 'Transform'])) {
                        _p = '-' + p.toLowerCase() + '-';
                        return false;
                    }
                });
                return _p;
            }(),
            testTouch: function (e, elm) {
                if (e.type == 'touchstart') {
                    elm.setAttribute('data-touch', '1');
                } else if (elm.getAttribute('data-touch')) {
                    elm.removeAttribute('data-touch');
                    return false;
                }
                return true;
            },
            objectToArray: function (obj) {
                var arr = [],
                    i;

                for (i in obj) {
                    arr.push(obj[i]);
                }

                return arr;
            },
            arrayToObject: function (arr) {
                var obj = {},
                    i;

                if (arr) {
                    for (i = 0; i < arr.length; i++) {
                        obj[arr[i]] = arr[i];
                    }
                }

                return obj;
            },
            isNumeric: function (a) {
                return a - parseFloat(a) >= 0;
            },
            getCoord: function (e, c, page) {
                var ev = e.originalEvent || e,
                    prop = (page ? 'page' : 'client') + c;

                // Multi touch support
                if (ev.targetTouches && ev.targetTouches[0]) {
                    return ev.targetTouches[0][prop];
                }

                if (ev.changedTouches && ev.changedTouches[0]) {
                    return ev.changedTouches[0][prop];
                }

                return e[prop];
            },
            getPosition: function (t, vertical) {
                var style = getComputedStyle(t[0]),
                    matrix,
                    px;

                Ne._.each(['t', 'webkitT', 'MozT', 'OT', 'msT'], function (i, v) {
                    if (style[v + 'ransform'] !== undefined) {
                        matrix = style[v + 'ransform'];
                        return false;
                    }
                });
                matrix = matrix.split(')')[0].split(', ');
                px = vertical ? (matrix[13] || matrix[5]) : (matrix[12] || matrix[4]);


                return px;
            },
            constrain: function (val, min, max) {
                return Math.max(min, Math.min(val, max));
            },
            vibrate: function (time) {
                if ('vibrate' in navigator) {
                    navigator.vibrate(time || 50);
                }
            },
            datetime: {
                defaults: {
                    shortYearCutoff: "+10",
                    monthNames: "January,February,March,April,May,June,July,August,September,October,November,December".split(","),
                    monthNamesShort: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),
                    dayNames: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                    dayNamesShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","),
                    dayNamesMin: "S,M,T,W,T,F,S".split(","),
                    amText: "am",
                    pmText: "pm",
                    getYear: function (i) {
                        return i.getFullYear()
                    },
                    getMonth: function (i) {
                        return i.getMonth()
                    },
                    getDay: function (i) {
                        return i.getDate()
                    },
                    getDate: function (i, o, l, f, j, L, z) {
                        i = new Date(i, o, l, f || 0, j || 0, L || 0, z || 0);
                        23 == i.getHours() && 0 === (f || 0) && i.setHours(i.getHours() + 2);
                        return i
                    },
                    getMaxDayOfMonth: function (i, o) {
                        return 32 - (new Date(i, o, 32, 12)).getDate()
                    },
                    getWeekNumber: function (i) {
                        i = new Date(i);
                        i.setHours(0, 0, 0);
                        i.setDate(i.getDate() + 4 - (i.getDay() || 7));
                        var o = new Date(i.getFullYear(), 0, 1);
                        return Math.ceil(((i - o) / 864E5 + 1) / 7)
                    }
                },
                adjustedDate: function (i, o, l, f, j, L, z) {
                    i = new Date(i, o, l, f || 0, j || 0, L || 0, z || 0);
                    23 == i.getHours() && 0 === (f || 0) && i.setHours(i.getHours() + 2);
                    return i
                },
                formatDate: function (m, w, l) {
                    if (!w) return null;
                    var l = Ne._.extend({}, picker.util.datetime.defaults, l),
                        f = function (f) {
                            for (var e = 0; z + 1 < m.length && m.charAt(z + 1) == f;) e++, z++;
                            return e
                        },
                        j = function (i, e, d) {
                            e = "" + e;
                            if (f(i))
                                for (; e.length < d;) e = "0" + e;
                            return e
                        },
                        L = function (i, e, d, a) {
                            return f(i) ? a[e] : d[e]
                        },
                        z, t, r = "",
                        C = !1;

                    for (z = 0; z < m.length; z++)
                        if (C) "'" == m.charAt(z) && !f("'") ? C = !1 : r += m.charAt(z);
                        else switch (m.charAt(z)) {
                            case "d":
                                r += j("d", l.getDay(w), 2);
                                break;
                            case "D":
                                r += L("D", w.getDay(), l.dayNamesShort, l.dayNames);
                                break;
                            case "o":
                                r += j("o", (w.getTime() - (new Date(w.getFullYear(), 0, 0)).getTime()) / 864E5, 3);
                                break;
                            case "m":
                                r += j("m", l.getMonth(w) + 1, 2);
                                break;
                            case "M":
                                r += L("M", l.getMonth(w), l.monthNamesShort, l.monthNames);
                                break;
                            case "y":
                                t = l.getYear(w);
                                r += f("y") ? t : (10 > t % 100 ? "0" : "") + t % 100;
                                break;
                            case "h":
                                t = w.getHours();
                                r += j("h", 12 < t ? t - 12 : 0 === t ? 12 : t, 2);
                                break;
                            case "H":
                                r += j("H", w.getHours(), 2);
                                break;
                            case "i":
                                r += j("i", w.getMinutes(), 2);
                                break;
                            case "s":
                                r += j("s", w.getSeconds(), 2);
                                break;
                            case "a":
                                r += 11 < w.getHours() ? l.pmText : l.amText;
                                break;
                            case "A":
                                r += 11 < w.getHours() ? l.pmText.toUpperCase() : l.amText.toUpperCase();
                                break;
                            case "'":
                                f("'") ? r += "'" : C = !0;
                                break;
                            default:
                                r += m.charAt(z)
                        }
                    return r
                },
                parseDate: function (m, t, l) {
                    var l = Ne._.extend({}, picker.util.datetime.defaults, l),
                        f = l.defaultValue || new Date;
                    if (!m || !t) return f;
                    if (t.getTime) return t;
                    var t = "object" == typeof t ? t.toString() : t + "",
                        j = l.shortYearCutoff,
                        L = l.getYear(f),
                        z = l.getMonth(f) + 1,
                        N = l.getDay(f),
                        r = -1,
                        C = f.getHours(),
                        u = f.getMinutes(),
                        e = 0,
                        d = -1,
                        a = !1,
                        b = function (a) {
                            (a = V + 1 < m.length && m.charAt(V + 1) == a) && V++;
                            return a
                        },
                        c = function (a) {
                            b(a);
                            a = t.substr(H).match(RegExp("^\\d{1," + ("@" == a ? 14 : "!" == a ? 20 : "y" == a ? 4 : "o" == a ? 3 : 2) + "}"));
                            if (!a) return 0;
                            H += a[0].length;
                            return parseInt(a[0], 10)
                        },
                        A = function (a, c, d) {
                            a = b(a) ? d : c;
                            for (c = 0; c < a.length; c++)
                                if (t.substr(H, a[c].length).toLowerCase() == a[c].toLowerCase()) return H += a[c].length, c + 1;
                            return 0
                        },
                        H = 0,
                        V;
                    for (V = 0; V < m.length; V++)
                        if (a) "'" == m.charAt(V) && !b("'") ? a = !1 : H++;
                        else switch (m.charAt(V)) {
                            case "d":
                                N = c("d");
                                break;
                            case "D":
                                A("D", l.dayNamesShort, l.dayNames);
                                break;
                            case "o":
                                r = c("o");
                                break;
                            case "m":
                                z = c("m");
                                break;
                            case "M":
                                z = A("M", l.monthNamesShort, l.monthNames);
                                break;
                            case "y":
                                L = c("y");
                                break;
                            case "H":
                                C = c("H");
                                break;
                            case "h":
                                C = c("h");
                                break;
                            case "i":
                                u = c("i");
                                break;
                            case "s":
                                e = c("s");
                                break;
                            case "a":
                                d = A("a", [l.amText, l.pmText], [l.amText, l.pmText]) - 1;
                                break;
                            case "A":
                                d = A("A", [l.amText, l.pmText], [l.amText, l.pmText]) - 1;
                                break;
                            case "'":
                                b("'") ? H++ : a = !0;
                                break;
                            default:
                                H++
                        }
                    100 > L && (L += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (L <= ("string" != typeof j ? j : (new Date).getFullYear() % 100 + parseInt(j, 10)) ? 0 : -100));
                    if (-1 < r) {
                        z = 1;
                        N = r;
                        do {
                            j = 32 - (new Date(L, z - 1, 32, 12)).getDate();
                            if (N <= j) break;
                            z++;
                            N -= j
                        } while (1)
                    }
                    C = l.getDate(L, z - 1, N, -1 == d ? C : d && 12 > C ? C + 12 : !d && 12 == C ? 0 : C, u, e);
                    return l.getYear(C) != L || l.getMonth(C) + 1 != z || l.getDay(C) != N ? f : C
                }
            }
        },
        presets: {
            scroller: {
                date: function (j) {
                    function l(a, b, c) {
                        return p[b] !== undefined && (a = +a[p[b]], !isNaN(a)) ? a : W[b] !== undefined ? W[b] : c !== undefined ? c : E[b](ba)
                    }

                    function N(a) {
                        return {
                            value: a,
                            display: (J.match(/yy/i) ? a : (a + "").substr(2, 2)) + (q.yearSuffix || "")
                        }
                    }

                    function r(a) {
                        return a
                    }

                    function C(a, b, c, d, e, f, g) {
                        b.push({
                            data: d,
                            label: c,
                            min: f,
                            max: g,
                            getIndex: e,
                            cssClass: a
                        })
                    }

                    function u(a, b, c, d) {
                        return Math.min(d, Math.floor(a / b) * b + c)
                    }

                    function e(a) {
                        if (null === a) return a;
                        var b = l(a, "y"),
                            c = l(a, "m"),
                            d = Math.min(l(a, "d"), q.getMaxDayOfMonth(b, c)),
                            e = l(a, "h", 0);
                        return q.getDate(b, c, d, l(a, "a", 0) ? e + 12 : e, l(a, "i", 0), l(a, "s", 0), l(a, "u", 0))
                    }

                    function d(b, c) {
                        var d, f, g = !1,
                            h = !1,
                            i = 0,
                            j = 0;
                        F = e(H(F));
                        P = e(H(P));
                        if (a(b)) return b;
                        b < F && (b = F);
                        b > P && (b = P);
                        f = d = b;
                        if (2 !== c)
                            for (g = a(d); !g && d < P;) d = new Date(d.getTime() + 864E5), g = a(d), i++;
                        if (1 !== c)
                            for (h = a(f); !h && f > F;) f = new Date(f.getTime() - 864E5), h = a(f), j++;
                        return 1 === c && g ? d : 2 === c && h ? f : j <= i && h ? f : d
                    }

                    function a(a) {
                        return a < F || a > P ? !1 : b(a, x) ? !0 : b(a, B) ? !1 : !0
                    }

                    function b(a, b) {
                        var c, d, e;
                        if (b)
                            for (d = 0; d < b.length; d++)
                                if (c = b[d], e = c + "", !c.start)
                                    if (c.getTime) {
                                        if (a.getFullYear() == c.getFullYear() && a.getMonth() == c.getMonth() && a.getDate() == c.getDate()) return !0
                                    } else if (e.match(/w/i)) {
                            if (e = +e.replace("w", ""), e == a.getDay()) return !0
                        } else if (e = e.split("/"), e[1]) {
                            if (e[0] - 1 == a.getMonth() && e[1] == a.getDate()) return !0
                        } else if (e[0] == a.getDate()) return !0;
                        return !1
                    }

                    function c(a, b, c, d, e, f, g) {
                        var h, i, j;
                        if (a)
                            for (h = 0; h < a.length; h++)
                                if (i = a[h], j = i + "", !i.start)
                                    if (i.getTime) q.getYear(i) == b && q.getMonth(i) == c && (f[q.getDay(i)] = g);
                                    else if (j.match(/w/i)) {
                            j = +j.replace("w", "");
                            for (s = j - d; s < e; s += 7) 0 <= s && (f[s + 1] = g)
                        } else j = j.split("/"), j[1] ? j[0] - 1 == c && (f[j[1]] = g) : f[j[0]] = g
                    }

                    function A(a, b, c, d, e, f, h, j, k) {
                        var B, l, n, p, m, o, r, s, y, x, w, z, A, J, aa, L, D, E, G = {},
                            C = {
                                h: X,
                                i: g,
                                s: U,
                                a: 1
                            },
                            F = q.getDate(e, f, h),
                            H = ["a", "h", "i", "s"];
                        a && (Ne._.each(a, function (a, b) {
                            if (b.start && (b.apply = !1, B = b.d, l = B + "", n = l.split("/"), B && (B.getTime && e == q.getYear(B) && f == q.getMonth(B) && h == q.getDay(B) || !l.match(/w/i) && (n[1] && h == n[1] && f == n[0] - 1 || !n[1] && h == n[0]) || l.match(/w/i) && F.getDay() == +l.replace("w", "")))) b.apply = !0, G[F] = !0
                        }), Ne._.each(a, function (a, d) {
                            J = A = 0;
                            w = v[c];
                            z = K[c];
                            r = o = !0;
                            aa = !1;
                            if (d.start && (d.apply || !d.d && !G[F])) {
                                p = d.start.split(":");
                                m = d.end.split(":");
                                for (x = 0; 3 > x; x++) p[x] === t && (p[x] = 0), m[x] === t && (m[x] = 59), p[x] = +p[x], m[x] = +m[x];
                                p.unshift(11 < p[0] ? 1 : 0);
                                m.unshift(11 < m[0] ? 1 : 0);
                                Y && (12 <= p[1] && (p[1] -= 12), 12 <= m[1] && (m[1] -= 12));
                                for (x = 0; x < b; x++)
                                    if (Z[x] !== t) {
                                        s = u(p[x], C[H[x]], v[H[x]], K[H[x]]);
                                        y = u(m[x], C[H[x]], v[H[x]], K[H[x]]);
                                        E = D = L = 0;
                                        Y && 1 == x && (L = p[0] ? 12 : 0, D = m[0] ? 12 : 0, E = Z[0] ? 12 : 0);
                                        o || (s = 0);
                                        r || (y = K[H[x]]);
                                        if ((o || r) && s + L < Z[x] + E && Z[x] + E < y + D) aa = !0;
                                        Z[x] != s && (o = !1);
                                        Z[x] != y && (r = !1)
                                    }
                                if (!k)
                                    for (x = b + 1; 4 > x; x++) 0 < p[x] && (A = C[c]), m[x] < K[H[x]] && (J = C[c]);
                                aa || (s = u(p[b], C[c], v[c], K[c]) + A, y = u(m[b], C[c], v[c], K[c]) - J, o && (w = s), (z = y + 1));
                                if (o || r || aa)
                                    for (x = w; x < z; x++) j[x] = !k
                            }
                        }))
                    }

                    function H(a, b) {
                        var c = [];
                        if (null === a || a === undefined) return a;
                        Ne._.each("y,m,d,a,h,i,s,u".split(","), function (d, e) {
                            p[e] !== undefined && (c[p[e]] = E[e](a));
                            b && (W[e] = E[e](a))
                        });
                        return c
                    }

                    function V(a) {
                        var b, c, d, e = [];
                        if (a) {
                            for (b = 0; b < a.length; b++)
                                if (c = a[b], c.start && c.start.getTime)
                                    for (d = new Date(c.start); d <= c.end;) e.push(w(d.getFullYear(), d.getMonth(), d.getDate())), d.setDate(d.getDate() + 1);
                                else e.push(c);
                            return e
                        }
                        return a
                    }

                    var n = Ne.dom(this),
                        D = {},
                        format;
                    if (n.is("input")) {
                        format = n.attr("data-format") ? n.attr("data-format") : null;
                        switch (n.attr("type")) {
                            case "date":
                                format = format || "yy-mm-dd";
                                break;
                            case "datetime":
                                format = format || "yy-mm-dd HH:ii:ss";
                                break;
                            case "datetime-local":
                                format = format || "yy-mm-dd HH:ii:ss";
                                break;
                            case "month":
                                format = format || "yy-mm";
                                D.dateOrder = "mmyy";
                                break;
                            case "time":
                                format = format || "HH:ii:ss"
                        }
                        var G = n.attr("min"),
                            n = n.attr("max");
                        G && (D.minDate = picker.util.datetime.parseDate(format, G));
                        n && (D.maxDate = picker.util.datetime.parseDate(format, n))
                    }
                    var k, s, O, da, v, K, R, G = Ne._.extend({}, j.settings),
                        q = Ne._.extend(j.settings, picker.util.datetime.defaults, {
                            startYear: (new Date).getFullYear() - 100,
                            endYear: (new Date).getFullYear() + 1,
                            separator: " ",
                            dateFormat: "mm/dd/yy",
                            dateDisplay: "MMddyy",
                            timeFormat: "hh:ii A",
                            dayText: "Day",
                            monthText: "Month",
                            yearText: "Year",
                            hourText: "Hours",
                            minuteText: "Minutes",
                            ampmText: "&nbsp;",
                            secText: "Seconds",
                            nowText: "Now"
                        }, D, G),
                        T = 0,
                        Z = [],
                        D = [],
                        Q = [],
                        p = {},
                        W = {},
                        E = {
                            y: function (a) {
                                return q.getYear(a)
                            },
                            m: function (a) {
                                return q.getMonth(a)
                            },
                            d: function (a) {
                                return q.getDay(a)
                            },
                            h: function (a) {
                                a = a.getHours();
                                a = Y && 12 <= a ? a - 12 : a;
                                return u(a, X, ja, ma)
                            },
                            i: function (a) {
                                return u(a.getMinutes(), g, ha, ga)
                            },
                            s: function (a) {
                                return u(a.getSeconds(), U, ia, S)
                            },
                            u: function (a) {
                                return a.getMilliseconds()
                            },
                            a: function (a) {
                                return h && 11 < a.getHours() ? 1 : 0
                            }
                        },
                        B = q.invalid,
                        x = q.valid,
                        G = q.preset,
                        aa = q.dateWheels || q.dateFormat,
                        J = q.dateWheels || q.dateDisplay,
                        y = q.timeWheels || q.timeFormat,
                        fa = J.match(/D/),
                        h = y.match(/a/i),
                        Y = y.match(/h/),
                        ea = "datetime" == G ? q.dateFormat + q.separator + q.timeFormat : "time" == G ? q.timeFormat : q.dateFormat,
                        ba = new Date,
                        n = q.steps || {},
                        X = n.hour || q.stepHour || 1,
                        g = n.minute || q.stepMinute || 1,
                        U = n.second || q.stepSecond || 1,
                        n = n.zeroBased,
                        F = q.min || q.minDate || picker.util.datetime.adjustedDate(q.startYear, 0, 1),
                        P = q.max || q.maxDate || picker.util.datetime.adjustedDate(q.endYear, 11, 31, 23, 59, 59),
                        ja = n ? 0 : F.getHours() % X,
                        ha = n ? 0 : F.getMinutes() % g,
                        ia = n ? 0 : F.getSeconds() % U,
                        ma = Math.floor(((Y ? 11 : 23) - ja) / X) * X + ja,
                        ga = Math.floor((59 - ha) / g) * g + ha,
                        S = Math.floor((59 - ha) / g) * g + ha;
                    format = format || ea;
                    if (G.match(/date/i)) {
                        Ne._.each(["y", "m", "d"], function (a, b) {
                            k = aa.search(RegExp(b, "i")); - 1 < k && Q.push({
                                o: k,
                                v: b
                            })
                        });
                        Q.sort(function (a, b) {
                            return a.o > b.o ? 1 : -1
                        });
                        Ne._.each(Q, function (a, b) {
                            p[b.v] = a
                        });
                        n = [];
                        for (s = 0; 3 > s; s++)
                            if (s == p.y) T++, C("ne-picker-datetime-whl-y", n, q.yearText, N, r, q.getYear(F), q.getYear(P));
                            else if (s == p.m) {
                            T++;
                            O = [];
                            for (k = 0; 12 > k; k++) R = J.replace(/[dy]/gi, "").replace(/mm/, (9 > k ? "0" + (k + 1) : k + 1) + (q.monthSuffix || "")).replace(/m/, k + 1 + (q.monthSuffix || "")), O.push({
                                value: k,
                                display: R.match(/MM/) ? R.replace(/MM/, '<span class="ne-picker-datetime-month">' + q.monthNames[k] + "</span>") : R.replace(/M/, '<span class="ne-picker-datetime-month">' + q.monthNamesShort[k] + "</span>")
                            });
                            C("ne-picker-datetime-whl-m", n, q.monthText, O)
                        } else if (s == p.d) {
                            T++;
                            O = [];
                            for (k = 1; 32 > k; k++) O.push({
                                value: k,
                                display: (J.match(/dd/i) && 10 > k ? "0" + k : k) + (q.daySuffix || "")
                            });
                            C("ne-picker-datetime-whl-d", n, q.dayText, O)
                        }
                        D.push(n)
                    }
                    if (G.match(/time/i)) {
                        da = !0;
                        Q = [];
                        Ne._.each(["h", "i", "s", "a"], function (a, b) {
                            a = y.search(RegExp(b, "i")); - 1 < a && Q.push({
                                o: a,
                                v: b
                            })
                        });
                        Q.sort(function (a, b) {
                            return a.o > b.o ? 1 : -1
                        });
                        Ne._.each(Q, function (a, b) {
                            p[b.v] = T + a
                        });
                        n = [];
                        for (s = T; s < T + 4; s++)
                            if (s == p.h) {
                                T++;
                                O = [];
                                for (k = ja; k < (Y ? 12 : 24); k += X) O.push({
                                    value: k,
                                    display: Y && 0 === k ? 12 : y.match(/hh/i) && 10 > k ? "0" + k : k
                                });
                                C("ne-picker-datetime-whl-h", n, q.hourText, O)
                            } else if (s == p.i) {
                            T++;
                            O = [];
                            for (k = ha; 60 > k; k += g) O.push({
                                value: k,
                                display: y.match(/ii/) && 10 > k ? "0" + k : k
                            });
                            C("ne-picker-datetime-whl-i", n, q.minuteText, O)
                        } else if (s == p.s) {
                            T++;
                            O = [];
                            for (k = ia; 60 > k; k += U) O.push({
                                value: k,
                                display: y.match(/ss/) && 10 > k ? "0" + k : k
                            });
                            C("ne-picker-datetime-whl-s", n, q.secText, O)
                        } else s == p.a && (T++, G = y.match(/A/), C("ne-picker-datetime-whl-a", n, q.ampmText, G ? [{
                            value: 0,
                            display: q.amText.toUpperCase()
                        }, {
                            value: 1,
                            display: q.pmText.toUpperCase()
                        }] : [{
                            value: 0,
                            display: q.amText
                        }, {
                            value: 1,
                            display: q.pmText
                        }]));
                        D.push(n)
                    }
                    j.getVal = function (a) {
                        return j._hasValue || a ? e(j.getArrayVal(a)) : null
                    };
                    j.setDate = function (a, b, c, d, e) {
                        j.setArrayVal(H(a), b, e, d, c)
                    };
                    j.getDate = j.getVal;
                    j.format = ea;
                    j.order = p;
                    B = V(B);
                    x = V(x);
                    v = {
                        y: F.getFullYear(),
                        m: 0,
                        d: 1,
                        h: ja,
                        i: ha,
                        s: ia,
                        a: 0
                    };
                    K = {
                        y: P.getFullYear(),
                        m: 11,
                        d: 31,
                        h: ma,
                        i: ga,
                        s: S,
                        a: 1
                    };
                    return {
                        compClass: "ne-picker-datetime",
                        wheels: D,
                        headerText: q.headerText ?
                            function () {
                                return picker.util.datetime.formatDate(ea, e(j.getArrayVal(!0)), q)
                            } : !1,
                        formatValue: function (a) {
                            return picker.util.datetime.formatDate(format, e(a), q)
                        },
                        parseValue: function (a) {
                            a || (W = {});
                            return H(a ? picker.util.datetime.parseDate(format, a, q) : q.defaultValue && q.defaultValue.getTime ? q.defaultValue : new Date, !!a && !!a.getTime)
                        },
                        validate: function (a) {
                            var b, f, g, h;
                            b = a.index;
                            var k = a.direction,
                                n = j.settings.wheels[0][p.d],
                                a = d(e(a.values), k),
                                m = H(a),
                                o = [],
                                a = {},
                                r = l(m, "y"),
                                s = l(m, "m"),
                                y = q.getMaxDayOfMonth(r, s),
                                u = !0,
                                w = !0;
                            Ne._.each("y,m,d,a,h,i,s".split(","), function (a, b) {
                                if (p[b] !== undefined) {
                                    var d = v[b],
                                        e = K[b],
                                        g = l(m, b);
                                    o[p[b]] = [];
                                    u && F && (d = E[b](F));
                                    w && P && (e = E[b](P));
                                    if (b != "y")
                                        for (f = v[b]; f <= K[b]; f++)(f < d || f > e) && o[p[b]].push(f);
                                    g < d && (g = d);
                                    g > e && (g = e);
                                    u && (u = g == d);
                                    w && (w = g == e);
                                    if (b == "d") {
                                        d = q.getDate(r, s, 1).getDay();
                                        e = {};
                                        c(B, r, s, d, y, e, 1);
                                        c(x, r, s, d, y, e, 0);
                                        Ne._.each(e, function (a, c) {
                                            c && o[p[b]].push(a)
                                        })
                                    }
                                }
                            });
                            da && Ne._.each(["a", "h", "i", "s"], function (a, b) {
                                var c = l(m, b),
                                    d = l(m, "d"),
                                    e = {};
                                p[b] !== undefined && (o[p[b]] = [], A(B, a, b, m, r, s, d, e, 0), A(x, a, b, m, r, s, d, e, 1), Ne._.each(e, function (a, c) {
                                    c && o[p[b]].push(a)
                                }), Z[a] = j.getValidValue(p[b], c, k, e))
                            });
                            if (n && (n._length !== y || fa && (b === t || b === p.y || b === p.m))) {
                                a[p.d] = n;
                                n.data = [];
                                for (b = 1; b <= y; b++) h = q.getDate(r, s, b).getDay(), g = J.replace(/[my]/gi, "").replace(/dd/, (10 > b ? "0" + b : b) + (q.daySuffix || "")).replace(/d/, b + (q.daySuffix || "")), n.data.push({
                                    value: b,
                                    display: g.match(/DD/) ? g.replace(/DD/, '<span class="ne-picker-datetime-day">' + q.dayNames[h] + "</span>") : g.replace(/D/, '<span class="ne-picker-datetime-day">' + q.dayNamesShort[h] + "</span>")
                                });
                                j._tempWheelArray[p.d] = m[p.d];
                                j.changeWheel(a)
                            }
                            return {
                                disabled: o,
                                valid: m
                            }
                        }
                    }
                },
                select: function (that) {
                    function j() {
                        var a, e, f, j, k, l = 0,
                            h = 0,
                            m = {};
                        n = {};
                        c = {};
                        V = [];
                        b = [];
                        invalid.length = 0;
                        !!settings.data ? Ne._.each(settings.data, function (d, i) {
                            j = i[settings.dataText];
                            k = i[settings.dataValue];
                            e = i[settings.dataGroup];
                            f = {
                                value: k,
                                text: j,
                                index: d
                            };
                            n[k] = f;
                            V.push(f);
                            grouplength && (m[e] === t ? (a = {
                                text: e,
                                value: h,
                                options: [],
                                index: h
                            }, c[h] = a, m[e] = h, b.push(a), h++) : a = c[m[e]], f.group = m[e], a.options.push(f));
                            i[settings.dataDisabled] && invalid.push(k)
                        }) : grouplength ? Ne.dom("optgroup", Elm).each(function (a) {
                            c[a] = {
                                text: this.label,
                                value: a,
                                options: [],
                                index: a
                            };
                            b.push(c[a]);
                            Ne.dom("option", this).each(function (b) {
                                f = {
                                    value: this.value,
                                    text: this.text,
                                    index: l++,
                                    group: a
                                };
                                n[this.value] = f;
                                V.push(f);
                                c[a].options.push(f);
                                this.disabled && invalid.push(this.value)
                            })
                        }) : Ne.dom("option", Elm).each(function (a) {
                            f = {
                                value: this.value,
                                text: this.text,
                                index: a
                            };
                            n[this.value] = f;
                            V.push(f);
                            this.disabled && invalid.push(this.value)
                        });
                        V.length && (d = V[0].value);
                        grouplength && (V = [], l = 0, Ne._.each(c, function (a, b) {
                            k = "__group" + a;
                            f = {
                                text: b.text,
                                value: k,
                                group: a,
                                index: l++,
                                cssClass: "ne-picker-select-group"
                            };
                            n[k] = f;
                            V.push(f);
                            invalid.push(f.value);
                            Ne._.each(b.options, function (a, b) {
                                b.index = l++;
                                V.push(b)
                            })
                        }))
                    }
                
                    function o(a, b, c) {
                        var d, e = [];
                        for (d = 0; d < a.length; d++) e.push({
                            value: a[d].value,
                            display: a[d].text,
                            cssClass: a[d].cssClass
                        });
                        return {
                            circular: !1,
                            multiple: b,
                            data: e,
                            label: c
                        }
                    }
                
                    function z() {
                        return o(V, isNumeric, "")
                    }
                
                    function N() {
                        var a, c = [
                            []
                        ];
                        grouplength && (a = o(b, !1, settings.groupLabel), c[A] = [a]);
                        a = z();
                        c[D] = [a];
                        return c
                    }
                
                    function r(b) {
                        isNumeric && (b && w(b) && (b = b.split(",")), Ne._.isArray(b) && (b = b[0]));
                        H = b === undefined || null === b || "" === b || !n[b] ? d : b;
                        grouplength && (a = n[H] ? n[H].group : null)
                    }
                
                    function u() {
                        var a = {};
                        a[D] = z();
                        visiable = !0;
                        that.changeWheel(a)
                    }
                
                    that.setVal = function (a, b, c, d, e) {
                        isNumeric && (a && w(a) && (a = a.split(",")), that._tempSelected[D] = m.arrayToObject(a), d || (that._selected[D] = m.arrayToObject(a)), a = a ? a[0] : null);
                        that.setVal(a, b, c, d, e)
                    };
                
                    that.getVal = function (a, b) {
                        var c;
                        c = isNumeric ? m.objectToArray(a ? that._tempSelected[D] : that._selected[D]) : (c = a ? that._tempWheelArray : that._hasValue ? that._wheelArray : null) ? settings.group && b ? c : c[D] : null;
                        return c
                    };
                    
                    that.refresh = function () {
                        var c = {};
                        j();
                        settings.wheels = N();
                        r(H);
                        c[D] = z();
                        that._tempWheelArray[D] = H;
                        grouplength && (c[A] = o(b, !1, settings.groupLabel), that._tempWheelArray[A] = a);
                        that._isVisible && that.changeWheel(c, 0, !0)
                    };
                
                    var e, d, a, b, c, A, H, V, n, D,
                        visiable,
                        Elm = Ne.dom(this),
                        settings = Ne._.extend(that.settings, {
                            invalid: [],
                            groupLabel: "",
                            dataText: "text",
                            dataValue: "value",
                            dataGroup: "group",
                            dataDisabled: "disabled"
                        }),
                        isNumeric = picker.util.isNumeric(settings.select) ? settings.select : "multiple" == settings.select || Elm.prop("multiple"),
                        grouplength = Ne.dom("optgroup", Elm).length,
                        invalid = [];
                
                    if (settings.invalid.length == 0) {
                        settings.invalid = invalid;
                    };
                    if (grouplength > 0) {
                        A = 0;
                        D = 1;
                    } else {
                        A = -1;
                        D = 0;
                    }
                    if (isNumeric) {
                        Elm.prop("multiple", !0);
                        that._selected[D] = {};
                        var elmVal = Elm.val() || [];
                        elmVal && w(elmVal) && (elmVal = elmVal.split(","));
                        that._selected[D] = m.arrayToObject(elmVal);
                    }
                
                    j();
                    r(Elm.val());
                    return {
                        headerText: false,
                        compClass: "ne-picker-select",
                        formatValue: function (a) {
                            var b, c = [];
                            if (isNumeric) {
                                for (b in that._tempSelected[D]) c.push(n[b] ? n[b].text : "");
                                return c.join(", ")
                            }
                            a = a[D];
                            return n[a] ? n[a].text : ""
                        },
                        parseValue: function (b) {
                            r(b === undefined ? Elm.val() : b);
                            return grouplength ? [a, H] : [H]
                        },
                        validate: function (a) {
                            var a = a.index,
                                b = [];
                            b[D] = settings.invalid;
                            visiable = false;
                            return {
                                disabled: b
                            }
                        },
                        onFill: function () {
                            var a = that.getVal();
                            //e.val(that._tempValue);
                            Elm.val(a)
                        },
                        onBeforeShow: function () {
                            if (isNumeric && settings.counter) settings.headerText = function () {
                                var a = 0;
                                Ne._.each(that._tempSelected[D], function () {
                                    a++
                                });
                                return (a > 1 ? settings.selectedPluralText || settings.selectedText : settings.selectedText).replace(/{count}/, a)
                            };
                            r(Elm.val());
                            that.settings.wheels = N();
                            visiable = true
                        },
                        onWheelGestureStart: function (a) {
                            if (a.index == A) settings.readonly = [false, true]
                        },
                        onWheelAnimationEnd: function (b) {
                            var d = that.getArrayVal(true);
                            if (b.index == A) {
                                if (d[A] != a) {
                                    a = d[A];
                                    H = c[a].options[0].value;
                                    d[D] = H;
                                    that.setArrayVal(d, false, false, true, 200);
                                }
                            } else if (b.index == D && d[D] != H) {
                                H = d[D];
                                if (grouplength && n[H].group != a) {
                                    a = n[H].group;
                                    d[A] = a;
                                    that.setArrayVal(d, false, false, true, 200)
                                }
                            }
                        }
                    }
                }
            }
        },
        classes: {
            ScrollView: function (el, settings) {
                var raf = window.requestAnimationFrame || function (x) {
                        x();
                    },
                    rafc = window.cancelAnimationFrame || function () {};
            
                var $btn,
                    btnTimer,
                    contSize,
                    diffX,
                    diffY,
                    diff,
                    dir,
                    easing,
                    elastic,
                    endX,
                    endY,
                    eventObj,
                    isBtn,
                    lastX,
                    maxScroll,
                    maxSnapScroll,
                    minScroll,
                    move,
                    moving,
                    nativeScroll,
                    rafID,
                    rafRunning,
                    scrolled,
                    scrollDebounce,
                    scrollTimer,
                    snap,
                    snapPoints,
                    startPos,
                    startTime,
                    startX,
                    startY,
                    style,
                    target,
                    transTimer,
                    vertical,
                    that = this,
                    currPos,
                    currSnap = 0,
                    currSnapDir = 1,
                    $elm = Ne.dom(el),
                    preset;
            
                function onStart(ev) {
            
                    that.trigger('onStart');
            
                    // Better performance if there are tap events on document
                    if (that.settings.stopProp) {
                        ev.stopPropagation();
                        ev.preventDefault();
                    }
            
                    if (that.settings.prevDef || ev.type == 'mousedown') {
                        // Prevent touch highlight and focus
                        // ev.preventDefault();
                    }
            
                    if (that.settings.readonly || (that.settings.lock && moving)) {
                        return;
                    }
            
                    if (picker.util.testTouch(ev, this) && !move) {
            
                        if ($btn) {
                            $btn.removeClass('ne-picker-btn-a');
                        }
            
                        // Highlight button
                        isBtn = false;
            
                        if (!moving) {
                            $btn = Ne.dom(ev.target).closest('.ne-picker-item', this);
            
                            if ($btn.length && !$btn.hasClass('ne-picker-btn-d')) {
                                isBtn = true;
                                btnTimer = setTimeout(function () {
                                    $btn.addClass('ne-picker-btn-a');
                                }, 100);
                            }
                        }
            
                        move = true;
                        scrolled = false;
                        nativeScroll = false;
            
                        that.scrolled = moving;
            
                        startX = picker.util.getCoord(ev, 'X');
                        startY = picker.util.getCoord(ev, 'Y');
                        endX = lastX = startX;
                        diffX = 0;
                        diffY = 0;
                        diff = 0;
            
                        startTime = new Date();
            
                        startPos = +picker.util.getPosition(target, vertical) || 0;
            
                        // Stop scrolling animation, 1ms is needed for Android 4.0
                        scroll(startPos, /(iphone|ipod|ipad)/i.test(navigator.userAgent) ? 0 : 1);
            
                        if (ev.type === 'mousedown') {
                            Ne.dom(document).on('mousemove', onMove).on('mouseup', onEnd);
                        }
                    }
                }
            
                function onMove(ev) {
                    if (move) {
                        if (that.settings.stopProp) {
                            ev.stopPropagation();
                        }
            
                        endX = picker.util.getCoord(ev, 'X');
                        endY = picker.util.getCoord(ev, 'Y');
                        diffX = endX - startX;
                        diffY = endY - startY;
                        diff = vertical ? diffY : diffX;
            
                        if (isBtn && (Math.abs(diffY) > 5 || Math.abs(diffX) > 5)) {
                            clearTimeout(btnTimer);
                            $btn.removeClass('ne-picker-btn-a');
                            isBtn = false;
                        }
            
                        if (that.scrolled || (!nativeScroll && Math.abs(diff) > 5)) {
            
                            if (!scrolled) {
                                that.trigger('onGestureStart', eventObj);
                            }
            
                            that.scrolled = scrolled = true;
            
                            if (!rafRunning) {
                                rafRunning = true;
                                rafID = raf(onMoving);
                            }
                        }
            
                        if (vertical || that.settings.scrollLock) {
                            // Always prevent native scroll, if vertical
                            //ev.preventDefault();
                        } else {
                            if (that.scrolled) {
                                // Prevent native scroll
                                //ev.preventDefault();
                            } else if (Math.abs(diffY) > 7) {
                                nativeScroll = true;
                                that.scrolled = true;
                                $elm.trigger('touchend');
                            }
                        }
                    }
                }
            
                function onMoving() {
                    //var time = new Date();
            
                    if (maxSnapScroll) {
                        diff = picker.util.constrain(diff, -snap * maxSnapScroll, snap * maxSnapScroll);
                    }
            
                    scroll(picker.util.constrain(startPos + diff, minScroll - elastic, maxScroll + elastic));
            
                    //if (that.settings.momentum) {
                    //    startTime = time;
                    //    lastX = endX;
                    //}
            
                    rafRunning = false;
                }
            
                function onEnd(ev) {
                    if (move) {
                        var speed,
                            time = new Date() - startTime;
            
                        // Better performance if there are tap events on document
                        if (that.settings.stopProp) {
                            ev.stopPropagation();
                        }
            
                        rafc(rafID);
                        rafRunning = false;
            
                        if (!nativeScroll && that.scrolled) {
                            // Calculate momentum distance
                            if (that.settings.momentum && time < 300) {
                                speed = diff / time;
                                //speed = Math.abs(lastX - endX) / time;
                                diff = Math.max(Math.abs(diff), (speed * speed) / that.settings.speedUnit) * (diff < 0 ? -1 : 1);
                            }
            
                            finalize(diff);
                        }
            
                        if (isBtn) {
                            clearTimeout(btnTimer);
                            $btn.addClass('ne-picker-btn-a');
                            setTimeout(function () {
                                $btn.removeClass('ne-picker-btn-a');
                            }, 100);
            
                            if (!nativeScroll && !that.scrolled) {
                                that.trigger('onBtnTap', {
                                    target: $btn[0]
                                });
                            }
                        }
            
                        // Detach document events
                        if (ev.type == 'mouseup') {
                            Ne.dom(document).off('mousemove', onMove).off('mouseup', onEnd);
                        }
            
                        move = false;
                    }
                }
            
                function onScroll(ev) {
                    ev = ev.originalEvent || ev;
            
                    diff = vertical ? ev.deltaY || ev.wheelDelta || ev.detail : ev.deltaX;
            
                    that.trigger('onStart');
            
                    if (that.settings.stopProp) {
                        ev.stopPropagation();
                    }
            
                    if (diff) {
            
                        ev.preventDefault();
            
                        if (that.settings.readonly) {
                            return;
                        }
            
                        diff = diff < 0 ? 20 : -20;
            
                        startPos = currPos;
            
                        if (!scrolled) {
                            eventObj = {
                                posX: vertical ? 0 : currPos,
                                posY: vertical ? currPos : 0,
                                originX: vertical ? 0 : startPos,
                                originY: vertical ? startPos : 0,
                                direction: diff > 0 ? (vertical ? 270 : 360) : (vertical ? 90 : 180)
                            };
                            that.trigger('onGestureStart', eventObj);
                        }
            
                        if (!rafRunning) {
                            rafRunning = true;
                            rafID = raf(onMoving);
                        }
            
                        scrolled = true;
            
                        clearTimeout(scrollDebounce);
                        scrollDebounce = setTimeout(function () {
                            rafc(rafID);
                            rafRunning = false;
                            scrolled = false;
            
                            finalize(diff);
                        }, 200);
                    }
                }
            
                function finalize(diff) {
                    var i,
                        time,
                        newPos;
            
                    // Limit scroll to snap size
                    if (maxSnapScroll) {
                        diff = picker.util.constrain(diff, -snap * maxSnapScroll, snap * maxSnapScroll);
                    }
            
                    // Calculate snap and limit between min and max
                    currSnap = Math.round((startPos + diff) / snap);
                    newPos = picker.util.constrain(currSnap * snap, minScroll, maxScroll);
            
                    // Snap to nearest element
                    if (snapPoints) {
                        if (diff < 0) {
                            for (i = snapPoints.length - 1; i >= 0; i--) {
                                if (Math.abs(newPos) + contSize >= snapPoints[i].breakpoint) {
                                    currSnap = i;
                                    currSnapDir = 2;
                                    newPos = snapPoints[i].snap2;
                                    break;
                                }
                            }
                        } else if (diff >= 0) {
                            for (i = 0; i < snapPoints.length; i++) {
                                if (Math.abs(newPos) <= snapPoints[i].breakpoint) {
                                    currSnap = i;
                                    currSnapDir = 1;
                                    newPos = snapPoints[i].snap1;
                                    break;
                                }
                            }
                        }
                        newPos = picker.util.constrain(newPos, minScroll, maxScroll);
                    }
            
                    time = that.settings.time || (currPos < minScroll || currPos > maxScroll ? 200 : Math.max(200, Math.abs(newPos - currPos) * that.settings.timeUnit));
            
                    eventObj.destinationX = vertical ? 0 : newPos;
                    eventObj.destinationY = vertical ? newPos : 0;
                    eventObj.duration = time;
                    eventObj.transitionTiming = easing;
            
                    that.trigger('onGestureEnd', eventObj);
            
                    // Scroll to the calculated position
                    scroll(newPos, time);
                }
            
                function scroll(pos, time, callback) {
                    var changed = pos != currPos,
                        anim = time > 1,
                        done = function () {
                            clearInterval(scrollTimer);
            
                            moving = false;
                            currPos = pos;
                            eventObj.posX = vertical ? 0 : pos;
                            eventObj.posY = vertical ? pos : 0;
            
                            if (changed) {
                                that.trigger('onMove', eventObj);
                            }
            
                            if (anim) {
                                //that.scrolled = false;
                                that.trigger('onAnimationEnd', eventObj);
                            }
            
                            if (callback) {
                                callback();
                            }
                        };
            
                    eventObj = {
                        posX: vertical ? 0 : currPos,
                        posY: vertical ? currPos : 0,
                        originX: vertical ? 0 : startPos,
                        originY: vertical ? startPos : 0,
                        direction: pos - currPos > 0 ? (vertical ? 270 : 360) : (vertical ? 90 : 180)
                    };
            
                    currPos = pos;
            
                    if (anim) {
                        eventObj.destinationX = vertical ? 0 : pos;
                        eventObj.destinationY = vertical ? pos : 0;
                        eventObj.duration = time;
                        eventObj.transitionTiming = easing;
            
                        that.trigger('onAnimationStart', eventObj);
                    }
                    var jsPrefix = picker.util.prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');
                    style[jsPrefix + 'Transition'] = time ? picker.util.prefix + 'transform ' + Math.round(time) + 'ms ' + easing : '';
                    style[jsPrefix + 'Transform'] = 'translate3d(' + (vertical ? '0,' + pos + 'px,' : pos + 'px,' + '0,') + '0)';
            
                    if ((!changed && !moving) || !time || time <= 1) {
                        done();
                    } else if (time) {
                        moving = true;
            
                        clearInterval(scrollTimer);
                        scrollTimer = setInterval(function () {
                            var p = +picker.util.getPosition(target, vertical) || 0;
                            eventObj.posX = vertical ? 0 : p;
                            eventObj.posY = vertical ? p : 0;
                            that.trigger('onMove', eventObj);
                        }, 100);
            
                        clearTimeout(transTimer);
                        transTimer = setTimeout(function () {
                            done();
                            var jsPrefix = picker.util.prefix.replace(/^\-/, '').replace(/\-$/, '').replace('moz', 'Moz');
                            style[jsPrefix + 'Transition'] = '';
                        }, time);
                    }
                }
            
                /**
                 * Triggers an event
                 */
                that.trigger = function (name, ev) {
                    var ret;
                    if (that.settings[name]) { // Call preset event
                        ret = that.settings[name].call(el, ev || {}, that);
                    }
                    return ret;
                };
            
                /**
                 * Scroll to the given position or element
                 */
                that.scroll = function (pos, time, callback) {
                    // If position is not numeric, scroll to element
                    if (!picker.util.isNumeric(pos)) {
                        pos = Math.ceil((Ne.dom(pos, el).length ? Math.round(target.offset()[dir] - Ne.dom(pos, el).offset()[dir]) : currPos) / snap) * snap;
                    } else {
                        pos = Math.round(pos / snap) * snap;
                    }
            
                    currSnap = Math.round(pos / snap);
            
                    startPos = currPos;
            
                    scroll(picker.util.constrain(pos, minScroll, maxScroll), time, callback);
                };
            
                that.refresh = function (noScroll) {
                    var tempScroll;
            
                    contSize = that.settings.contSize === undefined ? vertical ? $elm.height() : $elm.width() : that.settings.contSize;
                    minScroll = that.settings.minScroll === undefined ? (vertical ? contSize - target.height() : contSize - target.width()) : that.settings.minScroll;
                    maxScroll = that.settings.maxScroll === undefined ? 0 : that.settings.maxScroll;
            
                    
                    if (typeof that.settings.snap === 'string') {
                        snapPoints = [];
                        target.find(that.settings.snap).each(function () {
                            var offset = vertical ? this.offsetTop : this.offsetLeft,
                                size = vertical ? this.offsetHeight : this.offsetWidth;
            
                            snapPoints.push({
                                breakpoint: offset + size / 2,
                                snap1: -offset,
                                snap2: contSize - offset - size
                            });
                        });
                    }
            
                    snap = picker.util.isNumeric(that.settings.snap) ? that.settings.snap : 1;
                    maxSnapScroll = that.settings.snap ? that.settings.maxSnapScroll : 0;
                    easing = that.settings.easing;
                    elastic = that.settings.elastic ? (picker.util.isNumeric(that.settings.snap) ? snap : (picker.util.isNumeric(that.settings.elastic) ? that.settings.elastic : 0)) : 0; // && that.settings.snap ? snap : 0;
            
                    if (currPos === undefined) {
                        currPos = that.settings.initialPos;
                        currSnap = Math.round(currPos / snap);
                    }
            
                    if (!noScroll) {
                        that.scroll(that.settings.snap ? (snapPoints ? snapPoints[currSnap]['snap' + currSnapDir] : (currSnap * snap)) : currPos);
                    }
                };
            
                that.scrolled = false;
                that.settings = {};
            
                // Create settings object
                Ne._.extend(that.settings, {
                    speedUnit: 0.0022,
                    timeUnit: 0.8,
                    //timeUnit: 3,
                    initialPos: 0,
                    axis: 'Y',
                    easing: 'ease-out',
                    //easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                    stopProp: true,
                    momentum: true,
                    mousewheel: true,
                    elastic: true
                }, settings);
            
                vertical = that.settings.axis == 'Y';
                dir = vertical ? 'top' : 'left';
                target = that.settings.moveElement || $elm.children().eq(0);
                style = target[0].style;
            
                that.refresh();
            
                $elm.on('touchstart mousedown', onStart)
                    .on('touchmove', onMove)
                    .on('touchend touchcancel', onEnd);
            
                if (that.settings.mousewheel) {
                    $elm.on('wheel mousewheel', onScroll);
                }
            
                el.addEventListener('click', function (ev) {
                    if (that.scrolled) {
                        that.scrolled = false;
                        ev.stopPropagation();
                        ev.preventDefault();
                    }
                }, true);
            },
            Scroller: function (el, settings) {
                var $elm = Ne.dom(el),
                    $markup,
                    that = this,
                    batchSize = 20,
                    tempWheelArray,
                    isValidating,
                    wheels = [],
                    wheelsMap = {};
            
                var _defaults = {
                    // Core
                    setText: '确定',
                    cancelText: '取消',
                    clearText: '明确',
                    selectedText: '{count} 选',
                    // Datetime component
                    dateFormat: 'yy/mm/dd',
                    dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
                    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
                    dayText: '日',
                    hourText: '时',
                    minuteText: '分',
                    monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    monthNamesShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
                    monthText: '月',
                    secText: '秒',
                    timeFormat: 'HH:ii',
                    yearText: '年',
                    nowText: '当前',
                    pmText: '下午',
                    amText: '上午',
                    // Calendar component
                    dateText: '日',
                    timeText: '时间',
                    calendarText: '日历',
                    closeText: '关闭',
                    // Daterange component
                    fromText: '开始时间',
                    toText: '结束时间',
                    // Measurement components
                    wholeText: '合计',
                    fractionText: '分数',
                    unitText: '单位',
                    // Time / Timespan component
                    labels: ['年', '月', '日', '小时', '分钟', '秒', ''],
                    labelsShort: ['年', '月', '日', '点', '分', '秒', ''],
                    // Timer component
                    startText: '开始',
                    stopText: '停止',
                    resetText: '重置',
                    lapText: '圈',
                    hideText: '隐藏',
                    // Listview
                    backText: '背部',
                    undoText: '复原',
                    // Form
                    offText: '关闭',
                    onText: '开启',
                    groupLabel: "分组",
                    // Numpad
                    decimalSeparator: ',',
                    thousandsSeparator: ' ',
                    // Options
                    context: 'body',
                    disabled: false,
                    closeOnOverlayTap: true,
                    showOnFocus: false,
                    showOnTap: true,
                    display: 'center',
                    scrollLock: true,
                    tap: true,
                    btnClass: 'ne-btn',
                    btnWidth: true,
                    focusTrap: true,
                    focusOnClose: !/(iphone|ipod|ipad).* os 8_/i.test(navigator.userAgent), // Temporary for iOS8
                    // Options
                    minWidth: 80,
                    height: 40,
                    rows: 5,
                    multiline: 1,
                    delay: 300,
                    readonly: false,
                    showLabel: true,
                    //scroll3d: false,
                    wheels: [],
                    speedUnit: 0.0012,
                    timeUnit: 0.08,
                    validate: function () {},
                    formatValue: function (d) {
                        return d.join(' ');
                    },
                    parseValue: function (value, inst) {
                        var val = [],
                            ret = [],
                            i = 0,
                            found,
                            data;
            
                        if (value !== null && value !== undefined) {
                            val = (value + '').split(' ');
                        }
            
                        Ne._.each(inst.settings.wheels, function (j, wg) {
                            Ne._.each(wg, function (k, w) {
                                data = w.data;
                                // Default to first wheel value if not found
                                found = getItemValue(data[0]);
                                Ne._.each(data, function (l, item) {
                                    // Don't do strict comparison
                                    if (val[i] == getItemValue(item)) {
                                        found = getItemValue(item);
                                        return false;
                                    }
                                });
                                ret.push(found);
                                i++;
                            });
                        });
                        return ret;
                    }
                };
            
                function getIndex(wheel, val) {
                    return (wheel._array ? wheel._map[val] : wheel.getIndex(val)) || 0;
                }
            
                function getItem(wheel, i, def) {
                    var data = wheel.data;
            
                    if (i < wheel.min || i > wheel.max) {
                        return def;
                    }
                    return wheel._array ?
                        (wheel.circular ? Ne.dom(data).get(i % wheel._length) : data[i]) :
                        (Ne._.isFunction(data) ? data(i) : '');
                }
            
                function getItemValue(item) {
                    return Ne._.isPlainObject(item) ? (item.value !== undefined ? item.value : item.display) : item;
                }
            
                function getValue(wheel, i, def) {
                    return getItemValue(getItem(wheel, i, def));
                }
            
                function toggleItem(i, $selected) {
                    var wheel = wheels[i],
                        $item = $selected || wheel._$markup.find('.ne-picker-item[data-val="' + tempWheelArray[i] + '"]'),
                        idx = +$item.attr('data-index'),
                        val = getValue(wheel, idx),
                        selected = that._tempSelected[i],
                        maxSelect = picker.util.isNumeric(wheel.multiple) ? wheel.multiple : Infinity;
            
                    if (wheel.multiple && !wheel._disabled[val]) {
                        if (selected[val] !== undefined) {
                            $item.removeClass('ne-picker-item-selected').removeAttr('aria-selected');
                            delete selected[val];
                        } else if (picker.util.objectToArray(selected).length < maxSelect) {
                            $item.addClass('ne-picker-item-selected').attr('aria-selected', 'true');
                            selected[val] = val;
                        }
                        return true;
                    }
                }
            
                function step(index, direction) {
                    var wheel = wheels[index];
                    setWheelValue(wheel, index, wheel._current + direction, 200, direction == 1 ? 1 : 2);
                }
            
                function isReadOnly(i) {
                    return Ne._.isArray(that.settings.readonly) ? that.settings.readonly[i] : that.settings.readonly;
                }
            
                function initWheel(w, l, keep) {
                    var index = w._index - w._batch;
            
                    w.data = w.data || [];
                    w.key = w.key !== undefined ? w.key : l;
                    w.label = w.label !== undefined ? w.label : l;
            
                    w._map = {};
                    w._array = Ne._.isArray(w.data);
            
                    // Map keys to index
                    if (w._array) {
                        w._length = w.data.length;
                        Ne._.each(w.data, function (i, v) {
                            w._map[getItemValue(v)] = i;
                        });
                    }
            
                    w.circular = that.settings.circular === undefined ?
                        (w.circular === undefined ? (w._array && w._length > that.settings.rows) : w.circular) :
                        (Ne._.isArray(that.settings.circular) ? that.settings.circular[l] : that.settings.circular);
                    w.min = w._array ? (w.circular ? -Infinity : 0) : (w.min === undefined ? -Infinity : w.min);
                    w.max = w._array ? (w.circular ? Infinity : w._length - 1) : (w.max === undefined ? Infinity : w.max);
            
                    w._nr = l;
                    w._index = getIndex(w, tempWheelArray[l]);
                    w._disabled = {};
                    w._batch = 0;
                    w._current = w._index;
                    w._first = w._index - batchSize;  
                    w._last = w._index + batchSize;
                    w._offset = w._first;
            
                    if (keep) {
                        w._offset -= w._margin / that.settings.height + (w._index - index);
                        w._margin += (w._index - index) * that.settings.height;
                    } else {
                        w._margin = 0; //w._first * that.settings.height;
                    }
            
                    w._refresh = function (noScroll) {
                        Ne._.extend(w._scroller.settings, {
                            minScroll: -((w.multiple ? Math.max(0, w.max - that.settings.rows + 1) : w.max) - w._offset) * that.settings.height,
                            maxScroll: -(w.min - w._offset) * that.settings.height
                        });
            
                        w._scroller.refresh(noScroll);
                    };
            
                    wheelsMap[w.key] = w;
            
                    return w;
                }
            
                function generateItems(wheel, index, start, end) {
                    var i,
                        css,
                        item,
                        value,
                        text,
                        lbl,
                        selected,
                        html = '',
                        checked = that._tempSelected[index],
                        disabled = wheel._disabled || {};
            
                    for (i = start; i <= end; i++) {
                        item = getItem(wheel, i);
                        text = Ne._.isPlainObject(item) ? item.display : item;
                        value = item && item.value !== undefined ? item.value : text;
                        css = item && item.cssClass !== undefined ? item.cssClass : '';
                        lbl = item && item.label !== undefined ? item.label : '';
                        selected = value !== undefined && value == tempWheelArray[index] && !wheel.multiple;
            
                        // TODO: don't generate items with no value (use margin or placeholder instead)
                        html += '<div role="option" aria-selected="' + (checked[value] ? true : false) +
                            '" class="ne-picker-item ' + css + ' ' +
                            (selected ? 'ne-picker-item-selected ' : '') +
                            (checked[value] ? 'ne-picker-item-selected' : '') +
                            (value === undefined ? ' ne-picker-item-ph' : '') +
                            (disabled[value] ? ' ne-picker-item-inv ne-picker-btn-d' : '') +
                            '" data-index="' + i +
                            '" data-val="' + value + '"' +
                            (lbl ? ' aria-label="' + lbl + '"' : '') +
                            (selected ? ' aria-selected="true"' : '') +
                            ' style="height:' + that.settings.height + 'px;line-height:' + that.settings.height + 'px;">' +
                            (text === undefined ? '' : text) +
                            '</div>';
                    }
            
                    return html;
                }
            
                function formatHeader(v) {
                    var t = that.settings.headerText;
                    return t ? (typeof t === 'function' ? t.call(el, v) : t.replace(/\{value\}/i, v)) : '';
                }
            
                function infinite(wheel, i, pos) {
                    var index = Math.round(-pos / that.settings.height) + wheel._offset,
                        diff = index - wheel._current,
                        first = wheel._first,
                        last = wheel._last;
            
                    if (diff) {
                        wheel._first += diff;
                        wheel._last += diff;
            
                        wheel._current = index;
            
                        // Generate items
                        setTimeout(function () {
                            if (diff > 0) {
                                wheel._$markup.append(generateItems(wheel, i, Math.max(last + 1, first + diff), last + diff));
                                Ne.dom('.ne-picker-item', wheel._$markup).slice(0, Math.min(diff, last - first + 1)).remove();
             
                            } else if (diff < 0) {
                                wheel._$markup.prepend(generateItems(wheel, i, first + diff, Math.min(first - 1, last + diff)));
                                Ne.dom('.ne-picker-item', wheel._$markup).slice(Math.max(diff, first - last - 1)).remove();
             
                            }
            
                            wheel._margin += diff * that.settings.height;
                            wheel._$markup.css('margin-top', wheel._margin + 'px');
                        }, 10);
                    }
                }
            
                function getValid(index, val, dir, dis) {
                    var counter,
                        wheel = wheels[index],
                        disabled = dis || wheel._disabled,
                        idx = getIndex(wheel, val),
                        v1 = val,
                        v2 = val,
                        dist1 = 0,
                        dist2 = 0;
            
                    if (val === undefined) {
                        val = getValue(wheel, idx);
                    }
            
                    // TODO: what if all items are invalid
                    if (disabled[val]) {
                        counter = 0;
                        while (idx - dist1 >= wheel.min && disabled[v1] && counter < 100) {
                            counter++;
                            dist1++;
                            v1 = getValue(wheel, idx - dist1);
                        }
            
                        counter = 0;
                        while (idx + dist2 < wheel.max && disabled[v2] && counter < 100) {
                            counter++;
                            dist2++;
                            v2 = getValue(wheel, idx + dist2);
                        }
            
                        // If we have direction (+/- or mouse wheel), the distance does not count
                        if (((dist2 < dist1 && dist2 && dir !== 2) || !dist1 || (idx - dist1 < 0) || dir == 1) && !disabled[v2]) {
                            val = v2;
                        } else {
                            val = v1;
                        }
                    }
            
                    return val;
                }
            
                function scrollToPos(time, index, dir, manual) {
                    var diff,
                        idx,
                        offset,
                        ret,
                        v,
                        isVisible = that._isVisible;
            
                    isValidating = true;
                    ret = that.settings.validate.call(el, {
                        values: tempWheelArray.slice(0),
                        index: index,
                        direction: dir
                    }, that) || {};
                    isValidating = false;
            
                    if (ret.valid) {
                        that._tempWheelArray = tempWheelArray = ret.valid.slice(0);
                    }
            
                    that.trigger('onValidated');
            
                    Ne._.each(wheels, function (i, wheel) {
                        if (isVisible) {
                            // Enable all items
                            wheel._$markup.find('.ne-picker-item').removeClass('ne-picker-item-inv ne-picker-btn-d');
                        }
                        wheel._disabled = {};
            
                        // Disable invalid items
                        if (ret.disabled && ret.disabled[i]) {
                            Ne._.each(ret.disabled[i], function (j, v) {
                                wheel._disabled[v] = true;
                                if (isVisible) {
                                    wheel._$markup.find('.ne-picker-item[data-val="' + v + '"]').addClass('ne-picker-item-inv ne-picker-btn-d');
                                }
                            });
                        }
            
                        // Get closest valid value
                        tempWheelArray[i] = wheel.multiple ? tempWheelArray[i] : getValid(i, tempWheelArray[i], dir);
            
                        if (isVisible) {
                            if (!wheel.multiple || index === undefined) {
                                wheel._$markup
                                    .find('.ne-picker-item-selected')
                                    .removeClass('ne-picker-item-selected')
                                    .removeAttr('aria-selected');
                            }
            
                            if (wheel.multiple) {
                                // Add selected styling to selected elements in case of multiselect
                                if (index === undefined) {
                                    for (v in that._tempSelected[i]) {
                                        wheel._$markup
                                            .find('.ne-picker-item[data-val="' + v + '"]')
                                            .addClass('ne-picker-item-selected')
                                            .attr('aria-selected', 'true');
                                    }
                                }
                            } else {
                                // Mark element as aria selected
                                wheel._$markup
                                    .find('.ne-picker-item[data-val="' + tempWheelArray[i] + '"]')
                                    .addClass('ne-picker-item-selected')
                                    .attr('aria-selected', 'true');
                            }
            
                            // Get index of valid value
                            idx = getIndex(wheel, tempWheelArray[i]);
            
                            diff = idx - wheel._index + wheel._batch;
            
                            if (Math.abs(diff) > 2 * batchSize + 1) {
                                offset = diff + (2 * batchSize + 1) * (diff > 0 ? -1 : 1);
                                wheel._offset += offset;
                                wheel._margin -= offset * that.settings.height;
                                wheel._refresh();
                            }
            
                            wheel._index = idx + wheel._batch;
            
                            // Scroll to valid value
                            wheel._scroller.scroll(-(idx - wheel._offset + wheel._batch) * that.settings.height, (index === i || index === undefined) ? time : 200);
                        }
                    });
            
                    // Get formatted value
                    that._tempValue = that.settings.formatValue(tempWheelArray, that);
            
                    
            
                    if (manual) {
                        that.trigger('onChange', {
                            valueText: that._tempValue
                        });
                    }
                }
            
                function setWheelValue(wheel, i, idx, time, dir) {
                    // Get the value at the given index
                    var value = getValue(wheel, idx);
            
                    if (value !== undefined) {
                        tempWheelArray[i] = value;
            
                        // In case of circular wheels calculate the offset of the current batch
                        wheel._batch = wheel._array ? Math.floor(idx / wheel._length) * wheel._length : 0;
            
                        setTimeout(function () {
                            scrollToPos(time, i, dir, true);
                        }, 10);
                    }
                }
            
                function setValue(fill, change, time, noscroll, temp) {
                    if (!noscroll) {
                        scrollToPos(time);
                    }
            
                    if (!temp) {
                        that._wheelArray = tempWheelArray.slice(0);
                        that._selected = Ne._.extend(true, {}, that._tempSelected);
                    }
            
                    if (fill) {
                        if ($elm.is('input')) {
                            $elm.val(that._hasValue ? that._tempValue : '');
                        }
            
                        that.trigger('onFill', {
                            valueText: that._hasValue ? that._tempValue : '',
                            change: change
                        });
            
                        if (change) {
                            that._preventChange = true;
                            $elm.trigger('change');
                        }
                    }
                }
            
                that.trigger = function (name, ev) {
                    var ret;
                    if (that.settings[name]) { // Call preset event
                        ret = that.settings[name].call(el, ev || {}, that);
                    }
                    return ret;
                };
            
                that.show = function () {
            
                    // Parse value from input
                    var v = $elm.val() || '',
                        l = 0;
            
                    if (v !== '') {
                        that._hasValue = true;
                    }
            
                    that._tempWheelArray = tempWheelArray = that._hasValue && that._wheelArray ?
                        that._wheelArray.slice(0) :
                        that.settings.parseValue.call(el, v, that) || [];
            
                    that._tempSelected = Ne._.extend(true, {}, that._selected);
            
                    Ne._.each(that.settings.wheels, function (i, wg) {
                        Ne._.each(wg, function (j, w) { // Wheels
                            wheels[l] = initWheel(w, l);
                            l++;
                        });
                    });
            
                    setValue();
            
                    if (that.trigger('onBeforeShow') === false) {
                        return false;
                    }
            
                    // Hide virtual keyboard
                    if (Ne.dom(document.activeElement).is('input,textarea')) {
                        document.activeElement.blur();
                    }
            
                    // Create wheels containers
                    var htmlstr_content = '',
                        l = 0;
            
                    Ne._.each(that.settings.wheels, function (i, wg) {
                        htmlstr_content += '<div class="ne-picker-whl-group-c">' +
                            '<div class="ne-picker-whl-group ne-picker-label-v">';
                        Ne._.each(wg, function (j, w) { // Wheels
                            that._tempSelected[l] = Ne._.extend({}, that._selected[l]);
                            wheels[l] = initWheel(w, l);
                            var lbl = w.label !== undefined ? w.label : j;
                            htmlstr_content += '<div class="ne-picker-whl-w">' +
                                '<div class="ne-picker-whl-o"></div>' +
                                '<div class="ne-picker-whl-l" style="height:' + that.settings.height + 'px;margin-top:-' + (that.settings.height / 2 + (that.settings.selectedLineBorder || 0)) + 'px;"></div>' +
                                '<div aria-label="' + lbl + '" data-index="' + l + '" class="ne-picker-whl"' + ' style="height:' + (that.settings.rows * that.settings.height) + 'px;">' +
                                '<div class="ne-picker-label">' + lbl + '</div>' + // Wheel label
                                '<div class="ne-picker-whl-c" style="height:' + that.settings.height + 'px;margin-top:-' + (that.settings.height / 2 + 1) + 'px;">' +
                                '<div class="ne-picker-whl-sc">' +
                                generateItems(w, l, w._first, w._last) +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                            l++;
                        });
                        htmlstr_content += '</div></div>';
                    });
                    var htmlstr_actionsheet =
                        '<div class="ne-actionsheet" ne-role="actionsheet">' +
                        '<div class="ne-mask"></div>' +
                        '<div class="ne-actionsheet-container">' +
                        '<div class="ne-picker ' + (that.settings.compClass || '') + '">' +
                        '<div class="ne-picker-toolbar ne-cell bg-light border-bottom">' +
                        '<div class="ne-cell-left"><button  class="ne-btn ne-btn-default ne-picker-cancelbtn  ne-picker-btn1">' + that.settings.cancelText + '</button></div>' +
                        '<div class="ne-cell-right"><button  class="ne-btn ne-btn-primary ne-picker-setbtn ne-picker-btn0">' + that.settings.setText + '</button></div>' +
                        '</div>' +
                        '<div class="ne-picker-container">' + htmlstr_content + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    if(that.settings.containerType=='popover'){
                        htmlstr_actionsheet =
                        '<div class="ne-popover ne-popover-picker" ne-role="popover">' +
                        '<div class="ne-mask" ne-tap="hide:popover"></div>' +
                        '<div class="ne-bubble bg-light"><div class="ne-bubble-content w15">' +
                        '<div class="ne-picker ' + (that.settings.compClass || '') + '">' +
                        '<div class="ne-picker-toolbar ne-cell bg-light border-bottom">' +
                        '<div class="ne-cell-left"><button  class="ne-btn ne-btn-default ne-picker-cancelbtn  ne-picker-btn1">' + that.settings.cancelText + '</button></div>' +
                        '<div class="ne-cell-right"><button  class="ne-btn ne-btn-primary ne-picker-setbtn ne-picker-btn0">' + that.settings.setText + '</button></div>' +
                        '</div>' +
                        '<div class="ne-picker-container">' + htmlstr_content + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    }
                    $markup = Ne.dom(htmlstr_actionsheet);
            
                    that._isVisible = true;
            
                    Ne.dom('.ne-picker-whl', $markup).each(function (i) {
                        var idx,
                            $wh = Ne.dom(this),
                            wheel = wheels[i];
            
                        wheel._$markup = Ne.dom('.ne-picker-whl-sc', this);
            
                        wheel._scroller = new picker.classes.ScrollView(this, {
                            mousewheel: that.settings.mousewheel,
                            moveElement: wheel._$markup,
                            initialPos: -(wheel._index - wheel._offset) * that.settings.height,
                            contSize: 0,
                            snap: that.settings.height,
                            minScroll: -((wheel.multiple ? Math.max(0, wheel.max - that.settings.rows + 1) : wheel.max) - wheel._offset) * that.settings.height,
                            maxScroll: -(wheel.min - wheel._offset) * that.settings.height,
                            maxSnapScroll: batchSize,
                            prevDef: true,
                            stopProp: true,
                            //timeUnit: 3,
                            //easing: 'cubic-bezier(0.190, 1.000, 0.220, 1.000)',
                            onStart: function (ev, inst) {
                                inst.settings.readonly = isReadOnly(i);
                            },
                            onGestureStart: function () {
                                $wh.addClass('ne-picker-whl-a ne-picker-whl-anim');
            
                                that.trigger('onWheelGestureStart', {
                                    index: i
                                });
                            },
                            onGestureEnd: function (ev) {
                                var dir = ev.direction == 90 ? 1 : 2,
                                    time = ev.duration,
                                    pos = ev.destinationY;
            
                                idx = Math.round(-pos / that.settings.height) + wheel._offset;
            
                                setWheelValue(wheel, i, idx, time, dir);
                            },
                            onAnimationStart: function () {
                                $wh.addClass('ne-picker-whl-anim');
                            },
                            onAnimationEnd: function () {
                                $wh.removeClass('ne-picker-whl-a ne-picker-whl-anim');
            
                                that.trigger('onWheelAnimationEnd', {
                                    index: i
                                });
                            },
                            onMove: function (ev) {
                                wheel._disabled[59] = true
                                infinite(wheel, i, ev.posY);
                            },
                            onBtnTap: function (ev) {
                                var $item = Ne.dom(ev.target),
                                    idx = +$item.attr('data-index');
            
                                // Select item on tap
                                if (toggleItem(i, $item)) {
                                    // Don't scroll, but trigger validation
                                    idx = wheel._current;
                                }
            
                                if (that.trigger('onItemTap', {
                                        target: $item[0],
                                        selected: $item.hasClass('ne-picker-itm-sel')
                                    }) !== false) {
                                    setWheelValue(wheel, i, idx, 200);
                                }
                            }
                        });
                    });
            
                    scrollToPos();
            
                    $markup[0].querySelector('.ne-picker-setbtn').onclick = function (ev) {
                        that._hasValue = true;
                        setValue(true, true, 0, true);
                        that.hide();
                    }
                    $markup[0].querySelector('.ne-picker-cancelbtn').onclick = function (ev) {
                        that.hide();
                    }
                    $markup[0].querySelector('.ne-mask').onclick = function (ev) {
                        that.hide();
                    }
            
                    // Show
                    // Enter / ESC  
                    $markup.appendTo(Ne.dom(that.settings.context));
                    Ne.acts($markup[0]).show({
                        sender:$elm[0]
                    });
                };
            
                that.hide = function () {
                    Ne.acts($markup[0]).hide();
                    setTimeout(function () {
                        $elm.off('.mbsc');
                        $markup.remove();
                        that = null;
                    }, 500);
                };
            
                that.setVal = function (val, fill, change, temp, time) {
                    that._hasValue = val !== null && val !== undefined;
                    that._tempWheelArray = tempWheelArray = Ne._.isArray(val) ? val.slice(0) : that.settings.parseValue.call(el, val, that) || [];
                    setValue(fill, change === undefined ? fill : change, time, false, temp);
                };
            
                that.getValidValue = getValid;
            
                that.setArrayVal = that.setVal;
            
                that.getArrayVal = function (temp) {
                    return temp ? that._tempWheelArray : that._wheelArray;
                };
            
                that.changeWheel = function (whls, time, manual) {
                    var i,
                        w;
            
                    Ne._.each(whls, function (key, wheel) {
                        w = wheelsMap[key];
                        i = w._nr;
                        // Check if wheel exists
                        if (w) {
                            Ne._.extend(w, wheel);
            
                            initWheel(w, i, true);
            
                            if (that._isVisible) {
                                w._$markup
                                    .html(generateItems(w, i, w._first, w._last))
                                    .css('margin-top', w._margin + 'px');
            
                                w._refresh(isValidating);
                            }
                        }
                    });
            
                    if (!isValidating) {
                        scrollToPos(time, undefined, undefined, manual);
                    }
                };
            
                that.init = function init() {
                    that.settings = {};
                    that._isVisible = false;
                    that._tempSelected = {};
                    that._selected = {};
            
                    // Create settings object
                    Ne._.extend(that.settings, _defaults, settings);
                    var __preset=settings.preset=='datetime'||settings.preset=='time'?'date':settings.preset;
                    __preset = picker.presets.scroller[__preset].call(el, that);
                    Ne._.extend(that.settings, __preset);
            
                    // Unbind all events (if re-init)
                    $elm.off('.mbsc');
            
                    $elm.on('mousedown.mbsc', function (ev) {
                        ev.preventDefault();
                    });
                }
            
                that.init();
            }
        }
    };


    function showDatePicker(target) {
        var __obj = {
            preset: target.getAttribute('data-type') || target.getAttribute('type')
        };
        if (target.getAttribute('data-invalid')) {
            __obj.invalid = JSON.parse(target.getAttribute('data-invalid'));
        }
        if (__obj.preset == 'date') {
            __obj.dateFormat = 'yy-mm-dd';
        }
        if (__obj.preset == 'datetime') {
            __obj.dateFormat = 'yy-mm-dd hh:ii:ss';
        }
        if (__obj.preset == 'month') {
            __obj.preset = 'date';
            __obj.dateFormat = 'yy-mm';
        }
        if (target.getAttribute('min')) {
            __obj.min = new Date(target.getAttribute('min'));
        }
        if (target.getAttribute('max')) {
            __obj.max = new Date(target.getAttribute('max'));
        }
        if(document.body.offsetWidth>800){
            __obj.containerType='popover';
        }
        var inst = new picker.classes.Scroller(target, __obj);
        inst.show();
        return inst;
    }

    function showSelectPicker(target) {
        var inst = new picker.classes.Scroller(target, {
            preset: 'select',
            label: target.getAttribute('aria-label') || '请选择'
        });

        inst.show();
        return inst;
    }

    //define
    Ne.component('picker', {
        props: {
            show: function () {
                if (this.tagName.toLowerCase() == 'select') {
                    return showSelectPicker(this);
                } else {
                    return showDatePicker(this);
                }
            }
        }
    });
})(Ne);
var $jscomp = $jscomp || {};
        $jscomp.scope = {};
        $jscomp.createTemplateTagFirstArg = function(b) {
            return b.raw = b
        };
        $jscomp.createTemplateTagFirstArgWithRaw = function(b, f) {
            b.raw = f;
            return b
        };
        $jscomp.ASSUME_ES5 = !1;
        $jscomp.ASSUME_NO_NATIVE_MAP = !1;
        $jscomp.ASSUME_NO_NATIVE_SET = !1;
        $jscomp.SIMPLE_FROUND_POLYFILL = !1;
        $jscomp.ISOLATE_POLYFILLS = !1;
        $jscomp.FORCE_POLYFILL_PROMISE = !1;
        $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
        $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(b, f, h) {
            if (b == Array.prototype || b == Object.prototype) return b;
            b[f] = h.value;
            return b
        };
        $jscomp.getGlobal = function(b) {
            b = ["object" == typeof globalThis && globalThis, b, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
            for (var f = 0; f < b.length; ++f) {
                var h = b[f];
                if (h && h.Math == Math) return h
            }
            throw Error("Cannot find global object");
        };
        $jscomp.global = $jscomp.getGlobal(this);
        $jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
        $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
        $jscomp.polyfills = {};
        $jscomp.propertyToPolyfillSymbol = {};
        $jscomp.POLYFILL_PREFIX = "$jscp$";
        var $jscomp$lookupPolyfilledValue = function(b, f) {
            var h = $jscomp.propertyToPolyfillSymbol[f];
            if (null == h) return b[f];
            h = b[h];
            return void 0 !== h ? h : b[f]
        };
        $jscomp.polyfill = function(b, f, h, c) {
            f && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(b, f, h, c) : $jscomp.polyfillUnisolated(b, f, h, c))
        };
        $jscomp.polyfillUnisolated = function(b, f, h, c) {
            h = $jscomp.global;
            b = b.split(".");
            for (c = 0; c < b.length - 1; c++) {
                var a = b[c];
                if (!(a in h)) return;
                h = h[a]
            }
            b = b[b.length - 1];
            c = h[b];
            f = f(c);
            f != c && null != f && $jscomp.defineProperty(h, b, {
                configurable: !0,
                writable: !0,
                value: f
            })
        };
        $jscomp.polyfillIsolated = function(b, f, h, c) {
            var a = b.split(".");
            b = 1 === a.length;
            c = a[0];
            c = !b && c in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
            for (var d = 0; d < a.length - 1; d++) {
                var e = a[d];
                if (!(e in c)) return;
                c = c[e]
            }
            a = a[a.length - 1];
            h = $jscomp.IS_SYMBOL_NATIVE && "es6" === h ? c[a] : null;
            f = f(h);
            null != f && (b ? $jscomp.defineProperty($jscomp.polyfills, a, {
                configurable: !0,
                writable: !0,
                value: f
            }) : f !== h && (void 0 === $jscomp.propertyToPolyfillSymbol[a] && ($jscomp.propertyToPolyfillSymbol[a] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(a) :
                $jscomp.POLYFILL_PREFIX + a), a = $jscomp.propertyToPolyfillSymbol[a], $jscomp.defineProperty(c, a, {
                configurable: !0,
                writable: !0,
                value: f
            })))
        };
        $jscomp.underscoreProtoCanBeSet = function() {
            var b = {
                    a: !0
                },
                f = {};
            try {
                return f.__proto__ = b, f.a
            } catch (h) {}
            return !1
        };
        $jscomp.setPrototypeOf = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(b, f) {
            b.__proto__ = f;
            if (b.__proto__ !== f) throw new TypeError(b + " is not extensible");
            return b
        } : null;
        $jscomp.arrayIteratorImpl = function(b) {
            var f = 0;
            return function() {
                return f < b.length ? {
                    done: !1,
                    value: b[f++]
                } : {
                    done: !0
                }
            }
        };
        $jscomp.arrayIterator = function(b) {
            return {
                next: $jscomp.arrayIteratorImpl(b)
            }
        };
        $jscomp.makeIterator = function(b) {
            var f = "undefined" != typeof Symbol && Symbol.iterator && b[Symbol.iterator];
            return f ? f.call(b) : $jscomp.arrayIterator(b)
        };
        $jscomp.generator = {};
        $jscomp.generator.ensureIteratorResultIsObject_ = function(b) {
            if (!(b instanceof Object)) throw new TypeError("Iterator result " + b + " is not an object");
        };
        $jscomp.generator.Context = function() {
            this.isRunning_ = !1;
            this.yieldAllIterator_ = null;
            this.yieldResult = void 0;
            this.nextAddress = 1;
            this.finallyAddress_ = this.catchAddress_ = 0;
            this.finallyContexts_ = this.abruptCompletion_ = null
        };
        $jscomp.generator.Context.prototype.start_ = function() {
            if (this.isRunning_) throw new TypeError("Generator is already running");
            this.isRunning_ = !0
        };
        $jscomp.generator.Context.prototype.stop_ = function() {
            this.isRunning_ = !1
        };
        $jscomp.generator.Context.prototype.jumpToErrorHandler_ = function() {
            this.nextAddress = this.catchAddress_ || this.finallyAddress_
        };
        $jscomp.generator.Context.prototype.next_ = function(b) {
            this.yieldResult = b
        };
        $jscomp.generator.Context.prototype.throw_ = function(b) {
            this.abruptCompletion_ = {
                exception: b,
                isException: !0
            };
            this.jumpToErrorHandler_()
        };
        $jscomp.generator.Context.prototype["return"] = function(b) {
            this.abruptCompletion_ = {
                "return": b
            };
            this.nextAddress = this.finallyAddress_
        };
        $jscomp.generator.Context.prototype.jumpThroughFinallyBlocks = function(b) {
            this.abruptCompletion_ = {
                jumpTo: b
            };
            this.nextAddress = this.finallyAddress_
        };
        $jscomp.generator.Context.prototype.yield = function(b, f) {
            this.nextAddress = f;
            return {
                value: b
            }
        };
        $jscomp.generator.Context.prototype.yieldAll = function(b, f) {
            var h = $jscomp.makeIterator(b),
                c = h.next();
            $jscomp.generator.ensureIteratorResultIsObject_(c);
            if (c.done) this.yieldResult = c.value, this.nextAddress = f;
            else return this.yieldAllIterator_ = h, this.yield(c.value, f)
        };
        $jscomp.generator.Context.prototype.jumpTo = function(b) {
            this.nextAddress = b
        };
        $jscomp.generator.Context.prototype.jumpToEnd = function() {
            this.nextAddress = 0
        };
        $jscomp.generator.Context.prototype.setCatchFinallyBlocks = function(b, f) {
            this.catchAddress_ = b;
            void 0 != f && (this.finallyAddress_ = f)
        };
        $jscomp.generator.Context.prototype.setFinallyBlock = function(b) {
            this.catchAddress_ = 0;
            this.finallyAddress_ = b || 0
        };
        $jscomp.generator.Context.prototype.leaveTryBlock = function(b, f) {
            this.nextAddress = b;
            this.catchAddress_ = f || 0
        };
        $jscomp.generator.Context.prototype.enterCatchBlock = function(b) {
            this.catchAddress_ = b || 0;
            b = this.abruptCompletion_.exception;
            this.abruptCompletion_ = null;
            return b
        };
        $jscomp.generator.Context.prototype.enterFinallyBlock = function(b, f, h) {
            h ? this.finallyContexts_[h] = this.abruptCompletion_ : this.finallyContexts_ = [this.abruptCompletion_];
            this.catchAddress_ = b || 0;
            this.finallyAddress_ = f || 0
        };
        $jscomp.generator.Context.prototype.leaveFinallyBlock = function(b, f) {
            var h = this.finallyContexts_.splice(f || 0)[0];
            if (h = this.abruptCompletion_ = this.abruptCompletion_ || h) {
                if (h.isException) return this.jumpToErrorHandler_();
                void 0 != h.jumpTo && this.finallyAddress_ < h.jumpTo ? (this.nextAddress = h.jumpTo, this.abruptCompletion_ = null) : this.nextAddress = this.finallyAddress_
            } else this.nextAddress = b
        };
        $jscomp.generator.Context.prototype.forIn = function(b) {
            return new $jscomp.generator.Context.PropertyIterator(b)
        };
        $jscomp.generator.Context.PropertyIterator = function(b) {
            this.object_ = b;
            this.properties_ = [];
            for (var f in b) this.properties_.push(f);
            this.properties_.reverse()
        };
        $jscomp.generator.Context.PropertyIterator.prototype.getNext = function() {
            for (; 0 < this.properties_.length;) {
                var b = this.properties_.pop();
                if (b in this.object_) return b
            }
            return null
        };
        $jscomp.generator.Engine_ = function(b) {
            this.context_ = new $jscomp.generator.Context;
            this.program_ = b
        };
        $jscomp.generator.Engine_.prototype.next_ = function(b) {
            this.context_.start_();
            if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_.next, b, this.context_.next_);
            this.context_.next_(b);
            return this.nextStep_()
        };
        $jscomp.generator.Engine_.prototype.return_ = function(b) {
            this.context_.start_();
            var f = this.context_.yieldAllIterator_;
            if (f) return this.yieldAllStep_("return" in f ? f["return"] : function(h) {
                return {
                    value: h,
                    done: !0
                }
            }, b, this.context_["return"]);
            this.context_["return"](b);
            return this.nextStep_()
        };
        $jscomp.generator.Engine_.prototype.throw_ = function(b) {
            this.context_.start_();
            if (this.context_.yieldAllIterator_) return this.yieldAllStep_(this.context_.yieldAllIterator_["throw"], b, this.context_.next_);
            this.context_.throw_(b);
            return this.nextStep_()
        };
        $jscomp.generator.Engine_.prototype.yieldAllStep_ = function(b, f, h) {
            try {
                var c = b.call(this.context_.yieldAllIterator_, f);
                $jscomp.generator.ensureIteratorResultIsObject_(c);
                if (!c.done) return this.context_.stop_(), c;
                var a = c.value
            } catch (d) {
                return this.context_.yieldAllIterator_ = null, this.context_.throw_(d), this.nextStep_()
            }
            this.context_.yieldAllIterator_ = null;
            h.call(this.context_, a);
            return this.nextStep_()
        };
        $jscomp.generator.Engine_.prototype.nextStep_ = function() {
            for (; this.context_.nextAddress;) try {
                var b = this.program_(this.context_);
                if (b) return this.context_.stop_(), {
                    value: b.value,
                    done: !1
                }
            } catch (f) {
                this.context_.yieldResult = void 0, this.context_.throw_(f)
            }
            this.context_.stop_();
            if (this.context_.abruptCompletion_) {
                b = this.context_.abruptCompletion_;
                this.context_.abruptCompletion_ = null;
                if (b.isException) throw b.exception;
                return {
                    value: b["return"],
                    done: !0
                }
            }
            return {
                value: void 0,
                done: !0
            }
        };
        $jscomp.generator.Generator_ = function(b) {
            this.next = function(f) {
                return b.next_(f)
            };
            this["throw"] = function(f) {
                return b.throw_(f)
            };
            this["return"] = function(f) {
                return b.return_(f)
            };
            this[Symbol.iterator] = function() {
                return this
            }
        };
        $jscomp.generator.createGenerator = function(b, f) {
            var h = new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(f));
            $jscomp.setPrototypeOf && b.prototype && $jscomp.setPrototypeOf(h, b.prototype);
            return h
        };
        $jscomp.asyncExecutePromiseGenerator = function(b) {
            function f(c) {
                return b.next(c)
            }

            function h(c) {
                return b["throw"](c)
            }
            return new Promise(function(c, a) {
                function d(e) {
                    e.done ? c(e.value) : Promise.resolve(e.value).then(f, h).then(d, a)
                }
                d(b.next())
            })
        };
        $jscomp.asyncExecutePromiseGeneratorFunction = function(b) {
            return $jscomp.asyncExecutePromiseGenerator(b())
        };
        $jscomp.asyncExecutePromiseGeneratorProgram = function(b) {
            return $jscomp.asyncExecutePromiseGenerator(new $jscomp.generator.Generator_(new $jscomp.generator.Engine_(b)))
        };
        $jscomp.initSymbol = function() {};
        $jscomp.polyfill("Symbol", function(b) {
            if (b) return b;
            var f = function(a, d) {
                this.$jscomp$symbol$id_ = a;
                $jscomp.defineProperty(this, "description", {
                    configurable: !0,
                    writable: !0,
                    value: d
                })
            };
            f.prototype.toString = function() {
                return this.$jscomp$symbol$id_
            };
            var h = 0,
                c = function(a) {
                    if (this instanceof c) throw new TypeError("Symbol is not a constructor");
                    return new f("jscomp_symbol_" + (a || "") + "_" + h++, a)
                };
            return c
        }, "es6", "es3");
        $jscomp.polyfill("Symbol.iterator", function(b) {
                if (b) return b;
                b = Symbol("Symbol.iterator");
                for (var f = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), h = 0; h < f.length; h++) {
                    var c = $jscomp.global[f[h]];
                    "function" === typeof c && "function" != typeof c.prototype[b] && $jscomp.defineProperty(c.prototype, b, {
                        configurable: !0,
                        writable: !0,
                        value: function() {
                            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
                        }
                    })
                }
                return b
            }, "es6",
            "es3");
        $jscomp.iteratorPrototype = function(b) {
            b = {
                next: b
            };
            b[Symbol.iterator] = function() {
                return this
            };
            return b
        };
        $jscomp.polyfill("Promise", function(b) {
            function f() {
                this.batch_ = null
            }

            function h(e) {
                return e instanceof a ? e : new a(function(g, k) {
                    g(e)
                })
            }
            if (b && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return b;
            f.prototype.asyncExecute = function(e) {
                if (null == this.batch_) {
                    this.batch_ = [];
                    var g = this;
                    this.asyncExecuteFunction(function() {
                        g.executeBatch_()
                    })
                }
                this.batch_.push(e)
            };
            var c = $jscomp.global.setTimeout;
            f.prototype.asyncExecuteFunction = function(e) {
                c(e, 0)
            };
            f.prototype.executeBatch_ = function() {
                for (; this.batch_ && this.batch_.length;) {
                    var e = this.batch_;
                    this.batch_ = [];
                    for (var g = 0; g < e.length; ++g) {
                        var k = e[g];
                        e[g] = null;
                        try {
                            k()
                        } catch (l) {
                            this.asyncThrow_(l)
                        }
                    }
                }
                this.batch_ = null
            };
            f.prototype.asyncThrow_ = function(e) {
                this.asyncExecuteFunction(function() {
                    throw e;
                })
            };
            var a = function(e) {
                this.state_ = 0;
                this.result_ = void 0;
                this.onSettledCallbacks_ = [];
                this.isRejectionHandled_ = !1;
                var g = this.createResolveAndReject_();
                try {
                    e(g.resolve, g.reject)
                } catch (k) {
                    g.reject(k)
                }
            };
            a.prototype.createResolveAndReject_ = function() {
                function e(l) {
                    return function(n) {
                        k || (k = !0, l.call(g, n))
                    }
                }
                var g = this,
                    k = !1;
                return {
                    resolve: e(this.resolveTo_),
                    reject: e(this.reject_)
                }
            };
            a.prototype.resolveTo_ = function(e) {
                if (e === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
                else if (e instanceof a) this.settleSameAsPromise_(e);
                else {
                    a: switch (typeof e) {
                        case "object":
                            var g = null != e;
                            break a;
                        case "function":
                            g = !0;
                            break a;
                        default:
                            g = !1
                    }
                    g ? this.resolveToNonPromiseObj_(e) : this.fulfill_(e)
                }
            };
            a.prototype.resolveToNonPromiseObj_ = function(e) {
                var g = void 0;
                try {
                    g = e.then
                } catch (k) {
                    this.reject_(k);
                    return
                }
                "function" == typeof g ? this.settleSameAsThenable_(g, e) : this.fulfill_(e)
            };
            a.prototype.reject_ = function(e) {
                this.settle_(2, e)
            };
            a.prototype.fulfill_ = function(e) {
                this.settle_(1, e)
            };
            a.prototype.settle_ = function(e, g) {
                if (0 != this.state_) throw Error("Cannot settle(" + e + ", " + g + "): Promise already settled in state" + this.state_);
                this.state_ = e;
                this.result_ = g;
                2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
                this.executeOnSettledCallbacks_()
            };
            a.prototype.scheduleUnhandledRejectionCheck_ = function() {
                var e = this;
                c(function() {
                    if (e.notifyUnhandledRejection_()) {
                        var g = $jscomp.global.console;
                        "undefined" !== typeof g && g.error(e.result_)
                    }
                }, 1)
            };
            a.prototype.notifyUnhandledRejection_ = function() {
                if (this.isRejectionHandled_) return !1;
                var e = $jscomp.global.CustomEvent,
                    g = $jscomp.global.Event,
                    k = $jscomp.global.dispatchEvent;
                if ("undefined" === typeof k) return !0;
                "function" === typeof e ? e = new e("unhandledrejection", {
                        cancelable: !0
                    }) :
                    "function" === typeof g ? e = new g("unhandledrejection", {
                        cancelable: !0
                    }) : (e = $jscomp.global.document.createEvent("CustomEvent"), e.initCustomEvent("unhandledrejection", !1, !0, e));
                e.promise = this;
                e.reason = this.result_;
                return k(e)
            };
            a.prototype.executeOnSettledCallbacks_ = function() {
                if (null != this.onSettledCallbacks_) {
                    for (var e = 0; e < this.onSettledCallbacks_.length; ++e) d.asyncExecute(this.onSettledCallbacks_[e]);
                    this.onSettledCallbacks_ = null
                }
            };
            var d = new f;
            a.prototype.settleSameAsPromise_ = function(e) {
                var g = this.createResolveAndReject_();
                e.callWhenSettled_(g.resolve, g.reject)
            };
            a.prototype.settleSameAsThenable_ = function(e, g) {
                var k = this.createResolveAndReject_();
                try {
                    e.call(g, k.resolve, k.reject)
                } catch (l) {
                    k.reject(l)
                }
            };
            a.prototype.then = function(e, g) {
                function k(q, r) {
                    return "function" == typeof q ? function(p) {
                        try {
                            l(q(p))
                        } catch (t) {
                            n(t)
                        }
                    } : r
                }
                var l, n, m = new a(function(q, r) {
                    l = q;
                    n = r
                });
                this.callWhenSettled_(k(e, l), k(g, n));
                return m
            };
            a.prototype["catch"] = function(e) {
                return this.then(void 0, e)
            };
            a.prototype.callWhenSettled_ = function(e, g) {
                function k() {
                    switch (l.state_) {
                        case 1:
                            e(l.result_);
                            break;
                        case 2:
                            g(l.result_);
                            break;
                        default:
                            throw Error("Unexpected state: " + l.state_);
                    }
                }
                var l = this;
                null == this.onSettledCallbacks_ ? d.asyncExecute(k) : this.onSettledCallbacks_.push(k);
                this.isRejectionHandled_ = !0
            };
            a.resolve = h;
            a.reject = function(e) {
                return new a(function(g, k) {
                    k(e)
                })
            };
            a.race = function(e) {
                return new a(function(g, k) {
                    for (var l = $jscomp.makeIterator(e), n = l.next(); !n.done; n = l.next()) h(n.value).callWhenSettled_(g, k)
                })
            };
            a.all = function(e) {
                var g = $jscomp.makeIterator(e),
                    k = g.next();
                return k.done ? h([]) : new a(function(l,
                    n) {
                    function m(p) {
                        return function(t) {
                            q[p] = t;
                            r--;
                            0 == r && l(q)
                        }
                    }
                    var q = [],
                        r = 0;
                    do q.push(void 0), r++, h(k.value).callWhenSettled_(m(q.length - 1), n), k = g.next(); while (!k.done)
                })
            };
            return a
        }, "es6", "es3");
        $jscomp.iteratorFromArray = function(b, f) {
            b instanceof String && (b += "");
            var h = 0,
                c = !1,
                a = {
                    next: function() {
                        if (!c && h < b.length) {
                            var d = h++;
                            return {
                                value: f(d, b[d]),
                                done: !1
                            }
                        }
                        c = !0;
                        return {
                            done: !0,
                            value: void 0
                        }
                    }
                };
            a[Symbol.iterator] = function() {
                return a
            };
            return a
        };
        $jscomp.polyfill("Array.prototype.keys", function(b) {
            return b ? b : function() {
                return $jscomp.iteratorFromArray(this, function(f) {
                    return f
                })
            }
        }, "es6", "es3");
        $jscomp.checkStringArgs = function(b, f, h) {
            if (null == b) throw new TypeError("The 'this' value for String.prototype." + h + " must not be null or undefined");
            if (f instanceof RegExp) throw new TypeError("First argument to String.prototype." + h + " must not be a regular expression");
            return b + ""
        };
        $jscomp.polyfill("String.prototype.startsWith", function(b) {
            return b ? b : function(f, h) {
                var c = $jscomp.checkStringArgs(this, f, "startsWith");
                f += "";
                for (var a = c.length, d = f.length, e = Math.max(0, Math.min(h | 0, c.length)), g = 0; g < d && e < a;)
                    if (c[e++] != f[g++]) return !1;
                return g >= d
            }
        }, "es6", "es3");
        $jscomp.polyfill("String.prototype.repeat", function(b) {
            return b ? b : function(f) {
                var h = $jscomp.checkStringArgs(this, null, "repeat");
                if (0 > f || 1342177279 < f) throw new RangeError("Invalid count value");
                f |= 0;
                for (var c = ""; f;)
                    if (f & 1 && (c += h), f >>>= 1) h += h;
                return c
            }
        }, "es6", "es3");
        $jscomp.stringPadding = function(b, f) {
            var h = void 0 !== b ? String(b) : " ";
            return 0 < f && h ? h.repeat(Math.ceil(f / h.length)).substring(0, f) : ""
        };
        $jscomp.polyfill("String.prototype.padStart", function(b) {
            return b ? b : function(f, h) {
                var c = $jscomp.checkStringArgs(this, null, "padStart");
                return $jscomp.stringPadding(h, f - c.length) + c
            }
        }, "es8", "es3");
        $jscomp.polyfill("Array.prototype.fill", function(b) {
            return b ? b : function(f, h, c) {
                var a = this.length || 0;
                0 > h && (h = Math.max(0, a + h));
                if (null == c || c > a) c = a;
                c = Number(c);
                0 > c && (c = Math.max(0, a + c));
                for (h = Number(h || 0); h < c; h++) this[h] = f;
                return this
            }
        }, "es6", "es3");
        $jscomp.typedArrayFill = function(b) {
            return b ? b : Array.prototype.fill
        };
        $jscomp.polyfill("Int8Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        $jscomp.polyfill("Uint8Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        $jscomp.polyfill("Uint8ClampedArray.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        $jscomp.polyfill("Int16Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        $jscomp.polyfill("Uint16Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        $jscomp.polyfill("Int32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        $jscomp.polyfill("Uint32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        $jscomp.polyfill("Float32Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        $jscomp.polyfill("Float64Array.prototype.fill", $jscomp.typedArrayFill, "es6", "es5");
        (function(b) {
            function f(a) {
                this.globals = {
                    transactionID: "",
                    sentry: !0,
                    mixpanel: !0,
                    sentryLoaded: !1,
                    attempts: JSON.parse(localStorage.getItem("attempts")) || {},
                    totalAttempts: parseInt(localStorage.getItem("totalAttempts")) || 0,
                    logoImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAC0FBMVEUAAAArp78mpb0forsforsforsforslpL0go7wkpL0jpL0forsgo7wforsforsforsforuPy9sforsho7wforsforsforsdobsforsio7wforsppr4forseorsdobsforsio7wforsforsforsforsforseorsmpb4fortcu86l0+J2xtYforsfortDsMYcobseorsforub0N8eorsforsforu+3Okforsforsforsfort0wtQforsforvL4e0forsforsforsfort7xNZovdAfortauMxWt8s9rcS62+ie0eB6xNZovdBIssjq7PYforsforvE3uu02eYforvf6PPS5O/Q4+6w1+Wt1uSp1eMbobqJydofort5x9cdors8rcTq7PYYn7nl6/Tg6fPb5/HH3+y/3eq22eeWzt5cu85tv9Jcus5StcoYn7nh6fPb5/IYn7nI4OwforsXn7mGyNmAxtdgus5eus5RtMqDy9rs7vbl6/TV5fAWn7kWnrlcu86o1OORzNx0xdVcu85euc5cu852xtZrwtPn6/UWn7kVnrkYn7l2xtaDxtgYn7kfort/ytl2xtYVnrlcu85cu85aus2n2uSGzdqn2uTt7fYforvu7vf////w7/fT0+f68vrV1ejS0ubs7Pbn5/Ph4fDX1+nj4/Aaobr08PkWn7nf3+4Yn7nc3Oz38fkdorvy7/jz7/jd3e0Tnrj28Pn48frZ2erq6vX88/tHsseVz95BsMY9rsTp6fR6xdZYuc1OtMktqMBzwdQ5rMQ0qsIopr4kpb3e6PLa5/HN4u1ku88QnLfr7Pbl5fLX5fHS5O/B3uq42+ir1uSCyNn5/f7z+vzm6/TP4+7D4uyf2OKg0uGN0N2IzNtcu872/P3v+Pr28fnj6vTX7vPg6/PU5fDK4eyp2+Wn1OOb0N+Iydrp9vjh8/bm7fXQ7PHH6O5ovtGv1+WER/aUAAAAmXRSTlMAAxT1Yew1BggbF/sL/vnGjIs7Aei6hU4pDvES0sp+MB/WrZd3c0cQ2bqknWdZLiSrn5hWUc7CwKabeWhe5dK2sZGPcldLSEQnvp1tWzX44d7Lti3r2tayrquIg21kRCP18u3t4svGuZKJYUtA++/o4dDCpn52UU48Dvrx39Cv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"
                };
                this.init(a)
            }

            function h() {
                function a() {
                    this.docCaptureTitle = "Capture ID Card";
                    this.docCaptureDescription = "";
                    this.docCaptureBottomDescription = "capture";
                    this.docCaptureReviewTopTitle = "Review your photo";
                    this.docReviewDescription = "";
                    this.docCaptureReviewBottomDescription = "Please Review if the document is visible";
                    this.docUploadReviewTitle = "Review your document";
                    this.docUploadReviewDescription = "";
                    this.docUploadReviewBottomDescription = "Please Review if the document is visible";
                    this.docUploadReviewBottomDescriptionPreviewUnsupported = "";
                    this.docUploadReviewBottomDescriptionDocumentUnsupported = " Document Unsupported. Please upload a valid image or pdf";
                    this.docUploadReviewBottomDescriptionDocumentSizeExceeded = " Document size cannot be greater than 6MB ";
                    this.docUploadReviewReuploadButtonText = "Reupload Document";
                    this.docUploadReviewSubmitButtonText = "Use this Document";
                    this.docInstructionsTitle = "ID Capture Tips";
                    this.docInstructions1 = "Hold your ID within the box";
                    this.docInstructions2 =
                        "Do not place outside";
                    this.docInstructions3 = "Avoid glare from lights";
                    this.docInstructionsProceed = "Capture ID";
                    this.docChoiceScreenTitle = "Please choose an option to provide your ID document for verification";
                    this.docChoiceScreenUploadButtonText = "Upload document from device";
                    this.docChoiceScreenCaptureButtonText = "Capture document photo";
                    this.docRetakeScreenTitle = "Retake photo";
                    this.docRetakeScreenDescription = "";
                    this.docRetakeScreenButtonText = "Retake ID Card Photo"
                }
                this.chooseDocumentCaptureOption = !1;
                this.configType = "OCR";
                this.handleRetries = !1;
                this.popupId = "HV_Document_popup_" + computeRandomString(10);
                this.endpoint = "";
                this.params = {};
                this.headers = {};
                this.documentType = "CARD";
                this.apiCall = !1;
                this.proxyEndpoint = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/ocr";
                this.mode = "document";
                this.ratio = .625;
                this.width = 640;
                this.shouldShowDocReviewScreen = this.shouldShowInstructionPage = this.mirrorMode = !1;
                this.Document = {
                 
                    Card: "CARD",
                    Passport: "PASSPORT",
                    A4: "A4",
                    Other: "OTHER"
                };
                this.DocumentSide = {
                    FRONT: "FRONT",
                    BACK: "BACK"
                };
                this.actualDocumentSide = "FRONT";
                this.showFlashButton = !1;
                this.addPadding = !0;
                this.showReviewPage = !1;
                this.shouldShowFullScreenViewController = !0;
                this.navVC = this.captureButtonEnabledImage = null;
                this.shouldDismissVCAutomatically = !0;
                this.docTextConfig = new a;
                this.docUIConfig = new function() {
                    this.imageSubmitBtnText = "Continue";
                    this.docChoiceScreenCaptureButtonIcon = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/camera.png";
                    this.docChoiceScreenUploadButtonIcon = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/upload.png";
                    this.tick = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/tick.png";
                    this.cross = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/cross.png";
                    this.image = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/doc1.png";
                    this.image1 = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/doc2.png";
                    this.image2 = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/doc3.png";
                    this.exclamation = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/exclamation.png"
                };
                a.prototype.setDocCaptureTitle = function(d) {
                    this.docCaptureTitle = d
                };
                a.prototype.setDocCaptureDescription = function(d) {
                    this.docCaptureDescription = d
                };
                a.prototype.setDocCaptureBottomDescription = function(d) {
                    this.docCaptureBottomDescription = d
                };
                a.prototype.setDocCaptureReviewTitle = function(d) {
                    this.docCaptureReviewTopTitle = d
                };
                a.prototype.setDocReviewDescription = function(d) {
                    this.docReviewDescription = d
                };
                a.prototype.setDocReviewBottomDescription = function(d) {
                    this.docCaptureReviewBottomDescription = d
                };
                a.prototype.setDocInstructionsTitle =
                    function(d) {
                        this.docInstructionsTitle = d
                    };
                a.prototype.setDocInstructions1 = function(d) {
                    this.docInstructions1 = d
                };
                a.prototype.setDocInstructions2 = function(d) {
                    this.docInstructions2 = d
                };
                a.prototype.setDocInstructions3 = function(d) {
                    this.docInstructions3 = d
                };
                a.prototype.setDocInstructionsProceed = function(d) {
                    this.docInstructionsProceed = d
                };
                a.prototype.setDocChoiceScreenTitle = function(d) {
                    this.docChoiceScreenTitle = d
                };
                a.prototype.setDocChoiceScreenUploadButtonText = function(d) {
                    this.docChoiceScreenUploadButtonText =
                        d
                };
                a.prototype.setDocChoiceScreenCaptureButtonText = function(d) {
                    this.docChoiceScreenCaptureButtonText = d
                };
                a.prototype.setDocUploadReviewTitle = function(d) {
                    this.docUploadReviewTitle = d
                };
                a.prototype.setDocUploadReviewDescription = function(d) {
                    this.docUploadReviewDescription = d
                };
                a.prototype.setDocUploadReviewBottomDescription = function(d) {
                    this.docUploadReviewBottomDescription = d
                };
                a.prototype.setDocUploadReviewBottomDescriptionPreviewUnsupported = function(d) {
                    this.docUploadReviewBottomDescriptionPreviewUnsupported =
                        d
                };
                a.prototype.setDocUploadReviewBottomDescriptionDocumentUnsupported = function(d) {
                    this.docUploadReviewBottomDescriptionDocumentUnsupported = d
                };
                a.prototype.setDocUploadReviewBottomDescriptionDocumentSizeExceeded = function(d) {
                    this.docUploadReviewBottomDescriptionDocumentSizeExceeded = d
                };
                a.prototype.setDocUploadReviewReuploadButtonText = function(d) {
                    this.docUploadReviewReuploadButtonText = d
                };
                a.prototype.setDocUploadReviewSubmitButtonText = function(d) {
                    this.docUploadReviewSubmitButtonText = d
                };
                a.prototype.setDocRetakeScreenTitle =
                    function(d) {
                        this.docRetakeScreenTitle = d
                    };
                a.prototype.setDocRetakeScreenDescription = function(d) {
                    this.docRetakeScreenDescription = d
                };
                a.prototype.setDocRetakeScreenButtonText = function(d) {
                    this.docRetakeScreenButtonText = d
                }
            }

            function c() {
                function a() {
                   this.faceCaptureTitle = "Capture Selfie";
                    this.faceCaptureDescription = "";
                    this.faceCaptureBottomDescription = "Make sure your face is inside the circle and is fully visible";
                    this.faceCaptureReviewTitle = "Review Your Photo";
                    this.faceCaptureReviewDescription = "";
                    this.faceCaptureReviewBottomDescription =
                        "Please Review if your face is fully visible";
                    this.faceNotDetectedDescription = "Please place your face inside the circle";
                    this.faceTooBigDescription = "Please Move away from the camera";
                    this.faceDetectedDescription = "Capture Now";
                    this.faceInstructionsTitle = "Selfie Tips";
                    this.faceInstructionsTop1 = "Good Lighting on your face";
                    this.faceInstructionsTop2 = "Look directly into the webcam";
                    this.faceInstructionsBrightLight = "Bright Light";
                    this.faceInstructionsNoGlasses = "No Glasses";
                    this.faceInstructionsNoHat = "No Hat";
                    this.faceInstructionsProceed = "Take Selfie";
                    this.faceRetakeScreenTitle = "Retake Photo";
                    this.faceRetakeScreenDescription = "";
                    this.faceRetakeScreenButtonText = "Retake Selfie"
                }
                this.configType = "FACE";
                this.handleRetries = !1;
                this.livenessThreshold = .8;
                this.lowerLivenessReviewThreshold = .3;
                this.upperLivenessReviewThreshold = .85;
                this.popupId = "HV_Face_popup_" + computeRandomString(10);
                this.endpoint = "";
                this.mode = "selfie";
                this.mirrorMode = !0;
                this.params = {
                    validateFaceSize: "no"
                };
                this.headers = {};
                this.documentType =
                    "CARD";
                this.apiCall = !0;
                this.proxyEndpoint = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/liveness";
                this.ratio = 1;
                this.width = 1800;
                this.shouldShowInstructionPage = !1;
                this.Vietnam = {
                    url: "https://apac-faceid.hyperverge.co/v2/photo/liveness"
                };
                this.India = {
                    url: "https://ind-face-prod.hyperverge.co/v1/photo/liveness"
                };
                this.LivenessMode = {
                    none: !1,
                    textureLiveness: !0
                };
                this.shouldEnablePadding = this.shouldReturnFullImageUri = !1;
                this.bottomPadding = this.topPadding = this.rightPadding = this.leftPadding = 0;
                this.livenessEndpoint =
                    "";
                this.shouldShowCameraSwitch = this.shouldUseBackCamera = !1;
                this.faceCaptureCircleSuccessColor = "green";
                this.faceCaptureCircleFailureColor = "red";
                this.navVC = this.captureButtonDisabledImage = this.captureButtonEnabledImage = null;
                this.shouldRejectFaceNotStraight = !0;
                this.faceTextConfig = new a;
                this.faceUIConfig = new function() {
                    this.imageSubmitBtnText = "Continue";
                    this.selfie = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/selfie-webcam.png";
                    this.tick = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/tick.png";
                    this.bulb = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/bulb.png";
                    this.glasses = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/glasses.png";
                    this.hat = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/hat.png";
                    this.exclamation = "https://hv-camera-web-sg.s3-ap-southeast-1.amazonaws.com/images/exclamation.png"
                };
                a.prototype.setFaceCaptureTitle = function(d) {
                    this.faceCaptureTitle = d
                };
                a.prototype.setFaceCaptureDescription = function(d) {
                    this.faceCaptureDescription =
                        d
                };
                a.prototype.setFaceCaptureBottomDescription = function(d) {
                    this.faceCaptureBottomDescription = d
                };
                a.prototype.setFaceCaptureReviewTitle = function(d) {
                    this.faceCaptureReviewTitle = d
                };
                a.prototype.setFaceCaptureReviewDescription = function(d) {
                    this.faceCaptureReviewDescription = d
                };
                a.prototype.setFaceCaptureReviewBottomDescription = function(d) {
                    this.faceCaptureReviewBottomDescription = d
                };
                a.prototype.setFaceNotDetectedDescription = function(d) {
                    this.faceNotDetectedDescription = d
                };
                a.prototype.setFaceTooBigDescription =
                    function(d) {
                        this.faceTooBigDescription = d
                    };
                a.prototype.setFaceDetectedDescription = function(d) {
                    this.faceDetectedDescription = d
                };
                a.prototype.setFaceInstructionsTitle = function(d) {
                    this.faceInstructionsTitle = d
                };
                a.prototype.setFaceInstructionsTop1 = function(d) {
                    this.faceInstructionsTop1 = d
                };
                a.prototype.setFaceInstructionsTop2 = function(d) {
                    this.faceInstructionsTop2 = d
                };
                a.prototype.setFaceInstructionsBrightLight = function(d) {
                    this.faceInstructionsBrightLight = d
                };
                a.prototype.setFaceInstructionsNoGlasses = function(d) {
                    this.faceInstructionsNoGlasses =
                        d
                };
                a.prototype.setFaceInstructionsNoHat = function(d) {
                    this.faceInstructionsNoHat = d
                };
                a.prototype.setFaceInstructionsProceed = function(d) {
                    this.faceInstructionsProceed = d
                };
                a.prototype.setFaceRetakeScreenTitle = function(d) {
                    this.faceRetakeScreenTitle = d
                };
                a.prototype.setFaceRetakeScreenDescription = function(d) {
                    this.faceRetakeScreenDescription = d
                };
                a.prototype.setFaceRetakeScreenButtonText = function(d) {
                    this.faceRetakeScreenButtonText = d
                }
            }
            loadCSS();
            loadDependencies();
            f.prototype.init = function(a) {
                var d = this;
                Object.keys(a).forEach(function(g) {
                    d.globals[g] =
                        a[g]
                });
                if (this.globals.sentry && !isHypervergeTesting()) {
                    var e = document.createElement("script");
                    e.type = "text/javascript";
                    e.src = "https://browser.sentry-cdn.com/5.24.2/bundle.tracing.min.js";
                    e.setAttribute("crossorigin", "anonymous");
                    document.head.appendChild(e);
                    e.addEventListener("readystatechange", function() {
                        d.sentryInit()
                    }, !1);
                    e.addEventListener("load", function() {
                        d.sentryInit()
                    }, !1)
                }
                this.globals.mixpanel && !isHypervergeTesting() && this.initiateMixpanel()
            };
            f.prototype.initiateMixpanel = function() {
                (function(a,
                    d) {
                    if (!d.__SV) {
                        var e, g;
                        b.mixpanel = d;
                        d._i = [];
                        d.init = function(n, m, q) {
                            function r(u, v) {
                                var w = v.split(".");
                                2 == w.length && (u = u[w[0]], v = w[1]);
                                u[v] = function() {
                                    u.push([v].concat(Array.prototype.slice.call(arguments, 0)))
                                }
                            }
                            var p = d;
                            "undefined" !== typeof q ? p = d[q] = [] : q = "mixpanel";
                            p.people = p.people || [];
                            p.toString = function(u) {
                                var v = "mixpanel";
                                "mixpanel" !== q && (v += "." + q);
                                u || (v += " (stub)");
                                return v
                            };
                            p.people.toString = function() {
                                return p.toString(1) + ".people (stub)"
                            };
                            e = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
                            for (g = 0; g < e.length; g++) r(p, e[g]);
                            var t = "set set_once union unset remove delete".split(" ");
                            p.get_group = function() {
                                function u(z) {
                                    v[z] = function() {
                                        call2_args = arguments;
                                        call2 = [z].concat(Array.prototype.slice.call(call2_args, 0));
                                        p.push([w, call2])
                                    }
                                }
                                for (var v = {}, w = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)), y = 0; y < t.length; y++) u(t[y]);
                                return v
                            };
                            d._i.push([n, m, q])
                        };
                        d.__SV = 1.2;
                        var k = a.createElement("script");
                        k.type = "text/javascript";
                        k.async = !0;
                        k.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ?
                            MIXPANEL_CUSTOM_LIB_URL : "file:" === a.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
                        var l = a.getElementsByTagName("script")[0];
                        l.parentNode.insertBefore(k, l)
                    }
                })(document, b.mixpanel || []);
                mixpanel.init("2e2b86aca136ef277fac607c86dc6b74", {
                    batch_requests: !0
                })
            };
            f.prototype.sentryInit = function() {
                Sentry.init({
                    dsn: "https://7b5d6f1363a4414b8119584ce645c090@o511669.ingest.sentry.io/5609250",
                    release: "hyperverge-web-sdk@2.0.0",
                    integrations: [new Sentry.Integrations.BrowserTracing],
                    tracesSampleRate: 0
                });
                this.globals.sentryLoaded = !0
            };
            f.prototype.startCameraScreen = function(a, d, e) {
                e.actualDocumentSide ? trackMixpanel(e.actualDocumentSide + " " + e.configType + " Capture Screen Opened", {}) : trackMixpanel(e.configType + " Capture Screen Opened", {});
                var g = e.docTextConfig,
                    k = e.faceTextConfig,
                    l = e.docUIConfig,
                    n = e.faceUIConfig,
                    m = {},
                    q = {};
                g ? m = g : k && (m = k);
                l ? q = l : n && (q = n);
                new hyperSnapSDKInit({
                    params: {
                        onSave: a,
                        mode: e.mode,
                        mirrorMode: e.mirrorMode,
                        ratio: e.ratio || 1,
                        width: e.width || 640,
                        documentType: e.documentType,
                        onError: d,
                        docCaptureTitle: m.docCaptureTitle,
                        docCaptureDescription: m.docCaptureDescription,
                        docReviewDescription: m.docReviewDescription,
                        faceCaptureReviewTopTitle: m.faceCaptureReviewTitle || m.docCaptureReviewTopTitle,
                        faceCaptureReviewTitle: m.faceCaptureReviewDescription || "",
                        faceCaptureDescription: m.faceCaptureDescription,
                        docCaptureBottomDescription: m.docCaptureBottomDescription || "",
                        faceCaptureBottomDescription: m.faceCaptureBottomDescription ||
                            "",
                        faceCaptureTitle: m.faceCaptureTitle,
                        sentry: !1,
                        docCaptureReviewBottomDescription: m.docCaptureReviewBottomDescription || "",
                        faceCaptureReviewBottomDescription: m.faceCaptureReviewBottomDescription || "",
                        faceNotDetectedDescription: m.faceNotDetectedDescription || "",
                        faceTooBigDescription: m.faceTooBigDescription || "",
                        faceDetectedDescription: m.faceDetectedDescription || "",
                        imageSubmitBtnText: q.imageSubmitBtnText || "Continue",
                        shouldShowDocReviewScreen: e.shouldShowDocReviewScreen || !1
                    }
                })
            };
            f.prototype.runOCR = function(a,
                d) {
                trackMixpanel(a.actualDocumentSide + " " + a.configType + " Instructions Screen enabled", {
                    enabled: a.shouldShowInstructionPage
                });
                a.shouldShowInstructionPage ? (trackMixpanel(a.actualDocumentSide + " " + a.configType + " Instructions Screen Launched", {}), this.makeInstructionScreenPopup(a, d)) : this.startCameraScreen(this.onSave(a, d), this.onError(d), a)
            };
            f.prototype.showUserChoiceScreen = function(a, d) {
                var e = this;
                trackMixpanel("User Choice Screen opened", {});
                var g = this.makepopup(a, d),
                    k = document.createElement("center"),
                    l = document.createElement("div"),
                    n = document.createElement("div"),
                    m = document.createElement("label"),
                    q = document.createElement("input"),
                    r = document.createElement("div"),
                    p = document.createElement("button"),
                    t = document.createElement("div"),
                    u = document.createElement("span");
                k.style.fontFamily = " 'Muli', sans-serif";
                l.innerHTML = a.docTextConfig.docChoiceScreenTitle;
                l.style.cssText = "padding-top:5%; color:black; font-size: 1.2em; max-width: 400px;";
                q.setAttribute("type", "file");
                q.setAttribute("id", "uploadedFile");
                q.setAttribute("accept", ".png, .jpg, .jpeg, .pdf");
                q.style.display = "none";
                m.setAttribute("for", "uploadedFile");
                m.setAttribute("class", "hv-upload-btn");
                m.innerHTML = "<img src=" + a.docUIConfig.docChoiceScreenUploadButtonIcon + ' style="height: 2.5vh; margin-right: 5px;"></img>' + a.docTextConfig.docChoiceScreenUploadButtonText;
                n.appendChild(m);
                n.appendChild(q);
                p.setAttribute("class", "btn");
                p.setAttribute("class", "hv-capture-btn");
                p.innerHTML = "<img src=" + a.docUIConfig.docChoiceScreenCaptureButtonIcon + ' style="height: 2.5vh; margin-right: 5px;"></img>';
              + a.docTextConfig.docChoiceScreenCaptureButtonText;
                r.appendChild(p);
                t.setAttribute("class", "hv-modal-footer");
                u.setAttribute("class", "footertext");
                u.innerHTML = " ";
                t.appendChild(u);
                k.appendChild(l);
                k.appendChild(n);
                k.appendChild(r);
                k.appendChild(t);
                g.appendChild(k);
                q.addEventListener("change", function() {
                    var v, w, y, z;
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(x) {
                        if (1 == x.nextAddress) return trackMixpanel("User File uploaded", {}), v = document.getElementById("uploadedFile").files[0],
                            document.getElementById(a.popupId).outerHTML = "", a.shouldShowDocReviewScreen ? (e.showUploadReviewScreen(a, d, v), x.jumpTo(0)) : x.yield(fileToBase64(v), 3);
                        w = x.yieldResult;
                        w instanceof Error ? (y = new HVError, y.errorCode = "014", y.errorMsg = "Invalid Document", d(y, null)) : (z = e.onSave(a, d), z(w, v));
                        x.jumpToEnd()
                    })
                });
                p.addEventListener("click", function() {
                    document.getElementById(a.popupId).outerHTML = "";
                    WebSDKObject.runOCR(a, d)
                })
            };
            f.prototype.showUploadReviewScreen = function(a, d, e) {
                var g = this;
                trackMixpanel("Upload Review Screen opened", {});
                var k = this.makepopup(a, d),
                    l = document.createElement("center"),
                    n = document.createElement("div"),
                    m = document.createElement("div"),
                    q = document.createElement("div"),
                    r = document.createElement("div"),
                    p = document.createElement("button"),
                    t = document.createElement("button"),
                    u = document.createElement("div");
                l.style.fontFamily = " 'Muli', sans-serif";
                n.innerHTML = a.docTextConfig.docUploadReviewTitle;
                m.innerHTML = a.docTextConfig.docUploadReviewDescription;
                q.innerHTML = a.docTextConfig.docUploadReviewBottomDescription;
                n.setAttribute("class", "hv-title");
                m.setAttribute("class", "hv-instructions");
                q.setAttribute("class", "hv-bottom-instructions");
                if (6 >= e.size / 1E6)
                    if ("application/pdf" === e.type) {
                        r = document.createElement("object");
                        var v = document.createElement("p");
                        v.innerHTML = "";
                        r.setAttribute("class", "hv-preview-iframe");
                        r.setAttribute("type", "application/pdf");
                        r.setAttribute("data", URL.createObjectURL(e));
                        r.addEventListener("error", function() {
                            l.removeChild(r);
                            q.innerHTML = "" === a.docTextConfig.docUploadReviewBottomDescriptionPreviewUnsupported ?
                                "You successfully uploaded " + e.name : a.docTextConfig.docUploadReviewBottomDescriptionPreviewUnsupported
                        });
                        r.appendChild(v)
                    } else e.type.startsWith("image") ? (r = document.createElement("img"), r.setAttribute("class", "hv-preview-img"), r.setAttribute("src", URL.createObjectURL(e))) : (q.innerHTML = a.docTextConfig.docUploadReviewBottomDescriptionDocumentUnsupported, t.style.display = "none");
                else q.innerHTML = a.docTextConfig.docUploadReviewBottomDescriptionDocumentSizeExceeded, t.style.display = "none";
                p.setAttribute("class",
                    "hypervergebtn hv-reupload-btn");
                t.setAttribute("class", "hypervergebtn hv-use-this-photo-btn");
                p.innerHTML = a.docTextConfig.docUploadReviewReuploadButtonText;
                t.innerHTML = a.docTextConfig.docUploadReviewSubmitButtonText;
                u.style.cssText = "bottom: 2em;position: absolute;width: 100%;margin-left: -1.5rem;";
                u.setAttribute("class", "hv-divforcover");
                u.appendChild(p);
                u.appendChild(t);
                l.appendChild(n);
                l.appendChild(m);
                l.appendChild(r);
                l.appendChild(q);
                l.appendChild(u);
                k.appendChild(l);
                p.addEventListener("click",
                    function() {
                        return $jscomp.asyncExecutePromiseGeneratorProgram(function(w) {
                            document.getElementById(a.popupId).outerHTML = "";
                            g.showUserChoiceScreen(a, d);
                            w.jumpToEnd()
                        })
                    });
                t.addEventListener("click", function() {
                    var w, y, z;
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(x) {
                        if (1 == x.nextAddress) return x.yield(fileToBase64(e), 2);
                        w = x.yieldResult;
                        w instanceof Error ? (document.getElementById(a.popupId).outerHTML = "", y = new HVError, y.errorCode = "014", y.errorMsg = "Invalid Document", d(y, null)) : (z = g.onSave(a,
                            d), document.getElementById(a.popupId).outerHTML = "", z(w, e));
                        x.jumpToEnd()
                    })
                })
            };
            f.prototype.showRetakeScreen = function(a, d, e) {
                trackMixpanel("Retake Screen opened", {});
                var g = a.docTextConfig,
                    k = a.faceTextConfig,
                    l = a.docUIConfig,
                    n = a.faceUIConfig,
                    m = {},
                    q = {};
                g ? (m = g, m.title = g.docRetakeScreenTitle, m.description = g.docRetakeScreenDescription, m.buttonText = g.docRetakeScreenButtonText) : k && (m = k, m.title = k.faceRetakeScreenTitle, m.description = k.faceRetakeScreenDescription, m.buttonText = k.faceRetakeScreenButtonText);
                l ? q =
                    l : n && (q = n);
                g = this.makepopup(a, d);
                var r = document.createElement("center");
                k = document.createElement("div");
                l = document.createElement("div");
                var p = document.createElement("div"),
                    t = document.createElement("div");
                n = document.createElement("button");
                var u = document.createElement("div");
                r.style.fontFamily = " 'Muli', sans-serif";
                k.innerHTML = m.title;
                l.innerHTML = m.description;
                p.innerHTML = "<img src=" + q.exclamation + ' style="height: 2em;margin-right: 0.5em; margin-bottom: 0.2em;"></img>' + a.retakeMsg;
                k.setAttribute("class",
                    "hv-title");
                l.setAttribute("class", "hv-instructions");
                p.setAttribute("class", "hv-bottom-instructions");
                p.setAttribute("id", "hv-retake-bottom-instructions");
                "application/pdf" === e.type ? (t = document.createElement("object"), q = document.createElement("p"), q.innerHTML = "", t.setAttribute("class", "hv-preview-iframe"), t.setAttribute("type", "application/pdf"), t.setAttribute("data", URL.createObjectURL(e)), t.addEventListener("error", function() {
                    r.removeChild(t);
                    p.innerHTML = "" === m.docUploadReviewBottomDescriptionPreviewUnsupported ?
                        "You successfully uploaded " + e.name : m.docUploadReviewBottomDescriptionPreviewUnsupported
                }), t.appendChild(q)) : e.type.startsWith("image") ? (t = document.createElement("img"), t.setAttribute("class", "hv-preview-img"), t.setAttribute("src", URL.createObjectURL(e))) : p.innerHTML = m.docUploadReviewBottomDescriptionDocumentUnsupported;
                n.setAttribute("class", "hypervergebtn hv-retake-screen-btn");
                n.innerHTML = m.buttonText;
                u.style.cssText = "bottom: 2em;position: absolute;width: 100%;margin-left: -1.5rem;";
                u.setAttribute("class",
                    "hv-divforcover");
                u.appendChild(n);
                r.appendChild(k);
                r.appendChild(l);
                r.appendChild(t);
                r.appendChild(p);
                r.appendChild(u);
                g.appendChild(r);
                n.addEventListener("click", function() {
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(v) {
                        document.getElementById(a.popupId).outerHTML = "";
                        "OCR" === a.configType ? HVDocsModule.start(a, d) : "FACE" === a.configType && HVFaceModule.start(a, d);
                        v.jumpToEnd()
                    })
                })
            };
            f.prototype.showQR = function(a) {
                trackMixpanel("QR Screen opened", {});
                new QRious({
                    element: document.getElementById("qr-code"),
                    size: 300,
                    value: a
                })
            };
            f.prototype.runFace = function(a, d) {
                trackMixpanel(a.configType + " Instructions Screen enabled", {
                    enabled: a.shouldShowInstructionPage
                });
                a.shouldShowInstructionPage ? (trackMixpanel(a.configType + " Instructions Screen Launched", {}), this.makeInstructionScreenPopup(a, d)) : this.startCameraScreen(this.onSave(a, d), this.onError(d), a)
            };
            f.prototype.onSave = function(a, d) {
                var e = this,
                    g = a.proxyEndpoint,
                    k = a.endpoint;
                trackMixpanel("Endpoint ", {
                    actualEndpoint: k
                });
                var l = a.params || {},
                    n = a.headers || {};
                a.actualDocumentSide &&
                    (l.expectedDocumentSide = a.actualDocumentSide.toLowerCase());
                n.authorization = this.globals.jwtToken;
                n.transactionID = this.globals.transactionID;
                var m = getBrowser();
                m.name && (n.browser = m.name);
                m.version && (n.browserVersion = m.version);
                n.device = getDevice();
                n.userAgent = b.navigator.userAgent;
                n.madeFrom = SDK_CONFIGURATIONS().PRODUCT_NAME;
                n.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION;
                return function(q, r) {
                    var p, t, u, v, w, y, z;
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(x) {
                        switch (x.nextAddress) {
                            case 1:
                                e.globals.totalAttempts +=
                                    1;
                                p = getAttemptsKey(k, a);
                                e.globals.attempts[p] = e.globals.attempts[p] ? e.globals.attempts[p] + 1 : 1;
                                localStorage.setItem("attempts", JSON.stringify(e.globals.attempts));
                                localStorage.setItem("totalAttempts", e.globals.totalAttempts);
                                l.totalAttempts = e.globals.totalAttempts;
                                l.attempts = e.globals.attempts[p];
                                startLoader();
                                a.actualDocumentSide ? trackMixpanel(a.actualDocumentSide + " " + a.configType + " Capture Successful", {
                                    attempts: l.attempts,
                                    totalAttempts: l.totalAttempts,
                                    actualEndpoint: k
                                }) : trackMixpanel(a.configType +
                                    " Capture Successful", {
                                        attempts: l.attempts,
                                        totalAttempts: l.totalAttempts,
                                        actualEndpoint: k
                                    });
                                x.setCatchFinallyBlocks(2);
                                t = null;
                                u = new FormData;
                                u.append("headers", JSON.stringify(n));
                                u.append("params", JSON.stringify(l));
                                u.append("actualEndpoint", k);
                                r && "application/pdf" === r.type ? u.append("pdf", r) : u.append("image", r);
                                if (!a.apiCall) {
                                    x.jumpTo(4);
                                    break
                                }
                                return x.yield(fetch(g, {
                                    method: "POST",
                                    body: u
                                }), 5);
                            case 5:
                                t = x.yieldResult;
                            case 4:
                                return x.yield(responseHandler(q, t, a, e.globals.attempts[p]), 6);
                            case 6:
                                v = x.yieldResult;
                                w = v.errorObj;
                                y = v.responseObj;
                                a.actualDocumentSide ? trackMixpanel(a.actualDocumentSide + " " + a.configType + " API Response Received", {
                                    errorObj: w,
                                    attempts: l.attempts
                                }) : trackMixpanel(a.configType + " API Response Received", {
                                    errorObj: w,
                                    attempts: l.attempts
                                });
                                x.leaveTryBlock(3);
                                break;
                            case 2:
                                return x.enterCatchBlock(), x.yield(responseHandler(null, null), 7);
                            case 7:
                                z = x.yieldResult, w = z.errorObj, y = z.responseObj, a.actualDocumentSide ? trackMixpanel(a.actualDocumentSide + " " + a.configType + " API Call Failed", {
                                    errorObj: w,
                                    attempts: l.attempts,
                                    totalAttempts: l.totalAttempts
                                }) : trackMixpanel(a.configType + " API Call Failed", {
                                    errorObj: w,
                                    attempts: l.attempts,
                                    totalAttempts: l.totalAttempts
                                });
                            case 3:
                                removeLoader();
                                if (a.handleRetries && isRetake(y)) a.retakeMsg = y.response.result.summary.retakeMessage, e.showRetakeScreen(a, d, r);
                                else return x["return"](d(w, y));
                                x.jumpToEnd()
                        }
                    })
                }
            };
            f.prototype.onError = function(a) {
                return function(d) {
                    var e;
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(g) {
                        e = new HVError;
                        err = d.split(":")[1].trim();
                        e.errorCode = err.slice(0,
                            3);
                        e.errorMsg = err.slice(3).trim();
                        trackMixpanel("Camera SDK Error", {
                            errorObj: e
                        });
                        a(e, null);
                        g.jumpToEnd()
                    })
                }
            };
            f.prototype.makepopup = function(a, d) {
                var e = document.createElement("div"),
                    g = document.createElement("span");
                this.popup = document.createElement("div");
                g.innerHTML = "&times;";
                this.popup.setAttribute("class", "hv-modal hv-show-modal");
                this.popup.setAttribute("id", a.popupId);
                e.setAttribute("class", "hv-modal-content");
                g.setAttribute("class", "hv-close-button");
                e.appendChild(g);
                this.popup.appendChild(e);
                document.body.appendChild(this.popup);
                g.addEventListener("click", function() {
                    document.getElementById(a.popupId).outerHTML = "";
                    if (d) {
                        var k = new HVError;
                        k.errorCode = "013";
                        k.errorMsg = "Operation Cancelled By User";
                        d(k, null);
                        trackMixpanel("Drop offs", {
                            configType: a.configType
                        })
                    }
                });
                return e
            };
            f.prototype.makeInstructionScreenPopup = function(a, d) {
                var e = this.makepopup(a, d),
                    g = document.createElement("div");
                e.appendChild(g);
                "OCR" == a.configType ? this.attachOCRInstructions(g, a, d) : this.attachFaceInstructions(g, a, d)
            };
            f.prototype.attachOCRInstructions = function(a, d, e) {
                var g = this,
                    k = document.createElement("center"),
                    l = document.createElement("div"),
                    n = document.createElement("div"),
                    m = document.createElement("button"),
                    q = document.createElement("div"),
                    r = document.createElement("div"),
                    p = document.createElement("div"),
                    t = document.createElement("div"),
                    u = document.createElement("div"),
                    v = document.createElement("img"),
                    w = document.createElement("img"),
                    y = document.createElement("img"),
                    z = document.createElement("div"),
                    x = document.createElement("div"),
                    A = document.createElement("div"),
                    D = document.createElement("img"),
                    C = document.createElement("img");
                crossImg2 = document.createElement("img");
                span = document.createElement("span");
                k.style.fontFamily = " 'Muli', sans-serif";
                l.style.cssText = "bottom: 1.5em;position: absolute;width: 100%;margin-left: -1.5rem;";
                n.innerHTML = d.docTextConfig.docInstructionsTitle;
                n.setAttribute("class", "hv-title");
                var B = d.docUIConfig;
                t.setAttribute("class", "hv-instruction-small-div-right");
                u.setAttribute("class", " ");
                v.src = B.image;
                v.setAttribute("class", "hv-instruction-img-left");
               w.src = B.image1;
                w.setAttribute("class", "hv-instruction-img-left");
                y.src = B.image2;
               y.setAttribute("class", "hv-instruction-img-left");
                D.src = B.tick;
               D.setAttribute("class", "hv-instruction-tick");
               C.src = B.cross;
                C.setAttribute("class", "hv-instruction-tick");
                crossImg2.src = B.cross;
             crossImg2.setAttribute("class", "hv-instruction-tick");
                z.setAttribute("class", "hv-instruction-doc-text");
                z.innerText = d.docTextConfig.docInstructions1;
                x.setAttribute("class", "hv-instruction-doc-text");
               x.innerText = d.docTextConfig.docInstructions2;
                A.setAttribute("class", "hv-instruction-doc-text");
                A.innerText = d.docTextConfig.docInstructions3;
                p.appendChild(v);
                p.appendChild(D);
                p.appendChild(z);
                t.appendChild(x);
                t.appendChild(C);
                t.appendChild(w);
                u.appendChild(y);
                u.appendChild(crossImg2);
                u.appendChild(A);
                r.appendChild(p);
                r.appendChild(t);
                r.appendChild(u);
                m.setAttribute("class",
                    "btn");
                m.setAttribute("class", "hv-proceed-btn");
                m.innerText = d.docTextConfig.docInstructionsProceed;
                q.setAttribute("class", "hv-modal-footer");
                span.setAttribute("class", "footertext");
                span.innerHTML = " ";
                l.appendChild(m);
                q.appendChild(span);
                k.appendChild(n);
                k.appendChild(r);
                k.appendChild(l);
                k.appendChild(q);
                a.appendChild(k);
                m.addEventListener("click", function() {
                    g.closeIntructionScreen(d, e)
                }, !1)
            };
            f.prototype.attachFaceInstructions = function(a, d, e) {
                var g = this,
                    k = d.faceUIConfig,
                    l = document.createElement("center"),
                    n = document.createElement("div"),
                    m = document.createElement("div"),
                    q = document.createElement("button"),
                    r = document.createElement("div"),
                    p = document.createElement("div"),
                    t = document.createElement("div"),
                    u = document.createElement("div"),
                    v = document.createElement("div"),
                    w = document.createElement("div"),
                    y = document.createElement("div"),
                    z = document.createElement("div"),
                    x = document.createElement("div"),
                    A = document.createElement("div"),
                    D = document.createElement("div"),
                    C = document.createElement("img"),
                    B = document.createElement("img"),
                    E = document.createElement("img"),
                    F = document.createElement("img"),
                    G = document.createElement("img"),
                    H = document.createElement("img"),
                    I = document.createElement("p"),
                    J = document.createElement("p"),
                    K = document.createElement("p"),
                    L = document.createElement("span");
                l.style.fontFamily = " 'Muli', sans-serif";
                n.style.cssText = "bottom: 1.5em;position: absolute;width: 100%;margin-left: -1.5rem;";
                m.innerHTML = d.faceTextConfig.faceInstructionsTitle;
                m.setAttribute("class", "hv-title");
                t.setAttribute("class", "hv-instruction-small-div-face-text");
                u.setAttribute("class", "hv-instruction-small-div-face-text");
               v.setAttribute("class", "hv-instruction-selfie");
               w.setAttribute("class", "hv-instruction-props");
               C.src = k.tick;
                C.setAttribute("class", "hv-instruction-tick");
               B.src = k.tick;
               B.setAttribute("class", "hv-instruction-tick");
              E.src = k.selfie;
               E.setAttribute("class", "hv-selfie-img");
               F.src = k.bulb;
               F.setAttribute("class", "hv-instruction-props-img");
               G.src = k.glasses;
               G.setAttribute("class", "hv-instruction-props-img");
               H.src = k.hat;
               H.setAttribute("class", "hv-instruction-props-img");
               I.innerText = d.faceTextConfig.faceInstructionsBrightLight;
               I.setAttribute("class", "hv-instruction-props-text");
                J.innerText = d.faceTextConfig.faceInstructionsNoGlasses;
                J.setAttribute("class", "hv-instruction-props-text");
                K.innerText = d.faceTextConfig.faceInstructionsNoHat;
               K.setAttribute("class", "hv-instruction-props-text");
                A.innerText = d.faceTextConfig.faceInstructionsTop1;
                D.innerText = d.faceTextConfig.faceInstructionsTop2;
                t.appendChild(C);
                t.appendChild(A);
                u.appendChild(B);
                u.appendChild(D);
                v.appendChild(E);
                y.appendChild(F);
                y.appendChild(I);
                z.appendChild(G);
                z.appendChild(J);
                x.appendChild(H);
                x.appendChild(K);
                w.appendChild(y);
                w.appendChild(z);
                w.appendChild(x);
                p.appendChild(t);
                p.appendChild(u);
                p.appendChild(v);
                p.appendChild(w);
                q.setAttribute("class", "btn");
                q.setAttribute("class", "hv-proceed-btn");
                q.innerText = d.faceTextConfig.faceInstructionsProceed;
                r.setAttribute("class", "hv-modal-footer");
                L.setAttribute("class", "footertext");
               L.innerHTML = " ";
                n.appendChild(q);
                r.appendChild(L);
                l.appendChild(m);
                l.appendChild(p);
                l.appendChild(n);
                l.appendChild(r);
                a.appendChild(l);
                q.addEventListener("click", function() {
                    g.closeIntructionScreen(d, e)
                }, !1)
            };
            f.prototype.closeIntructionScreen = function(a, d) {
                document.getElementById(a.popupId).outerHTML = "";
                this.startCameraScreen(this.onSave(a, d), this.onError(d), a)
            };
            f.prototype.makeQrPopup = function(a, d) {
                var e = this.makepopup(a, d),
                    g = document.createElement("center"),
                    k = document.createElement("div"),
                    l = document.createElement("div"),
                    n = document.createElement("div"),
                    m = document.createElement("canvas"),
                    q = document.createElement("div"),
                    r = document.createElement("span");
                g.style.fontFamily = " 'Muli', sans-serif";
                isInternetExplorer() ? k.innerHTML = a.browserNotSupportedTitle : k.innerHTML = a.qrScreenTitle;
                k.setAttribute("class", "hv-title");
                n.innerHTML = a.qrScreenDescription;
                n.style.cssText = "padding-top:5%; color:black;";
                m.setAttribute("id", "qr-code");
                q.innerHTML = a.qrScreenBottomDescription;
                q.style.cssText = "padding-top:5%; color:black;";
                l.setAttribute("class",
                    "hv-modal-footer");
               r.setAttribute("class", "footertext");
               r.innerHTML = " ";
                l.appendChild(r);
                g.appendChild(k);
                g.appendChild(n);
                g.appendChild(m);
                g.appendChild(q);
                g.appendChild(l);
                e.appendChild(g)
            };
            f.prototype.generateTransactionId = function(a) {
                for (var d = "", e = 0; e < a; e++) d += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
                return d
            };
            h.prototype.setOCRDetails = function(a, d, e, g) {
                this.apiCall = this.handleRetries = !0;
                this.endpoint = a;
                this.actualDocumentSide =
                    d;
                e && (this.params = e);
                g && (this.headers = g)
            };
            h.prototype.setShouldShowInstructionPage = function(a) {
                this.shouldShowInstructionPage = a
            };
            h.prototype.setShouldShowDocReviewScreen = function(a) {
                this.shouldShowDocReviewScreen = a
            };
            h.prototype.setChooseDocumentCaptureOption = function(a) {
                this.chooseDocumentCaptureOption = a
            };
            h.prototype.setDocumentType = function(a) {
                this.documentType = a
            };
            h.prototype.setShouldHandleRetries = function(a) {
                this.handleRetries = a
            };
            c.prototype.setShouldShowInstructionPage = function(a) {
                this.shouldShowInstructionPage =
                    a
            };
            c.prototype.setLivenessAPIParameters = function(a) {
                var d = this;
                Object.keys(a).forEach(function(e) {
                    d.params[e] = a[e]
                })
            };
            c.prototype.setLivenessAPIHeaders = function(a) {
                this.headers = a
            };
            c.prototype.setLivenessMode = function(a) {
                this.apiCall = a
            };
            c.prototype.setLivenessEndpoint = function(a) {
                this.endpoint = a
            };
            c.prototype.setLivenessThreshold = function(a) {
                this.livenessThreshold = a
            };
            c.prototype.setShouldHandleRetries = function(a) {
                this.handleRetries = a
            };
            "function" === typeof define && define.amd ? (define("WebSDK", function() {
                    return f
                }),
                define("HVDocConfig", function() {
                    return h
                }), define("HVFaceConfig", function() {
                    return c
                })) : "object" === typeof module && module.exports ? module.exports = {
                WebSDK: f,
                HVDocConfig: h,
                HVFaceConfig: c
            } : (b.WebSDK = f, b.HVDocConfig = h, b.HVFaceConfig = c)
        })(window);
        var WebSDKObject = "";

        function isInitialized(b) {
            var f = new HVError;
            f.errorCode = 400;
            return "" === WebSDKObject ? (f.errorMsg = "SDK not initialized. Please call the 'HyperSnapSDK.init(jwtToken, Region)' method", b(f, null), !1) : "" === WebSDKObject.globals.transactionID ? (f.errorMsg = "User Session not created. Please call the 'HyperSnapSDK.startUserSession()' method", b(f, null), !1) : !0
        }
        var firebaseConfig = {
            apiKey: "AIzaSyC1SWP-8rT1fc2sfnvAAsNr2gVbldca_bE",
            authDomain: "websdk-c9a29.firebaseapp.com",
            databaseURL: "https://websdk-c9a29-default-rtdb.firebaseio.com",
            projectId: "websdk-c9a29",
            storageBucket: "websdk-c9a29.appspot.com",
            messagingSenderId: "951410820299",
            appId: "1:951410820299:web:161aaefaa71efcb9d3474e",
            measurementId: "G-CR2ZMKP4KL"
        };

        function responseHandler(b, f, h, c) {
            h = void 0 === h ? null : h;
            c = void 0 === c ? 1 : c;
            var a, d, e;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(g) {
                if (1 == g.nextAddress) return a = null, d = new HVResponse, null == b && null == f ? (a = new HVError, a.errorCode = 500, a.errorMsg = "Something went Wrong", g["return"]({
                    errorObj: a,
                    responseObj: null
                })) : f ? g.yield(f.json(), 3) : g.jumpTo(2);
                2 != g.nextAddress && (e = g.yieldResult, f.ok ? (h && null != h.livenessThreshold && e.result && e.result["liveness-score"] && (e.result["liveness-score"] < h.livenessThreshold ?
                    e.result.live = "no" : e.result["liveness-score"] > h.livenessThreshold && (e.result.live = "yes"), e.result["to-be-reviewed"] = e.result["liveness-score"] >= h.lowerLivenessReviewThreshold && e.result["liveness-score"] <= h.upperLivenessReviewThreshold ? "yes" : "no"), d.response = e.data, d.headers = e.headers) : e && e.result && e.result.summary ? (d.response = e, d.headers = e.headers, d.response.headers && delete d.response.headers) : (a = new HVError, a.errorCode = f.status || 500, a.errorMsg = e.error || "Internal Server Error"));
                null != b && (d.imgBase64 =
                    b);
                d.attemptsCount = c;
                return g["return"]({
                    errorObj: a,
                    responseObj: d
                })
            })
        }

        function isRetake(b) {
            return b && b.response.result && b.response.result.summary && (b.action = b.response.result.summary.action, "retake" === b.response.result.summary.action) ? !0 : !1
        }

        function getAttemptsKey(b, f) {
            var h = b.split("/");
            h = h[h.length - 1];
            f && f.actualDocumentSide && (h += "_" + f.actualDocumentSide);
            return h
        }

        function dec2hex(b) {
            return b.toString(16).padStart(2, "0")
        }

        function computeRandomString(b) {
            for (var f = "", h = 0; h < b; h++) f += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62 * Math.random()));
            return f
        }

        function detectDesktopOrPhoneMirrorMode() {
            var b = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
                f = -1 < navigator.userAgent.toLowerCase().indexOf("android");
            return !(b || f)
        }

        function encryptData(b, f) {
            var h = JSON.stringify(b);
            return CryptoJS.AES.encrypt(h, f).toString()
        }

        function decryptCipher(b, f) {
            return CryptoJS.AES.decrypt(b, f).toString(CryptoJS.enc.Utf8)
        }

        function getBrowser() {
            var b = navigator.userAgent,
                f = b.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(f[1])) {
                var h = /\brv[ :]+(\d+)/g.exec(b) || [];
                return {
                    name: "IE",
                    version: h[1] || ""
                }
            }
            if ("Chrome" === f[1] && (h = b.match(/\bOPR|Edge\/(\d+)/), null != h)) return {
                name: "Opera",
                version: h[1]
            };
            f = f[2] ? [f[1], f[2]] : [navigator.appName, navigator.appVersion, "-?"];
            null != (h = b.match(/version\/(\d+)/i)) && f.splice(1, 1, h[1]);
            return {
                name: f[0],
                version: f[1]
            }
        }
        var getDevice = function() {
                var b = "Unknown",
                    f = {
                        "Generic Linux": /Linux/i,
                        Android: /Android/i,
                        BlackBerry: /BlackBerry/i,
                        Bluebird: /EF500/i,
                        "Chrome OS": /CrOS/i,
                        Datalogic: /DL-AXIS/i,
                        Honeywell: /CT50/i,
                        iPad: /iPad/i,
                        iPhone: /iPhone/i,
                        iPod: /iPod/i,
                        macOS: /Macintosh/i,
                        Windows: /IEMobile|Windows/i,
                        Zebra: /TC70|TC55/i
                    };
                Object.keys(f).map(function(h) {
                    return navigator.userAgent.match(f[h]) && (b = h)
                });
                return b
            },
            scriptsLoaded = 0;

        function areScriptsLoaded() {
            return 5 === scriptsLoaded
        }

        function loadExternalScript(b) {
            var f = document.createElement("script");
            f.type = "text/javascript";
            f.src = b;
            document.head.appendChild(f);
            return f
        }

        function loadCSS() {
            var b = document.createElement("style");
            b.innerHTML = "\n  * {\n    box-sizing: border-box;\n  }\n  .hv-modal {\n    position: fixed;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    background-color: rgba(0, 0, 0, 0.5);\n    opacity: 0;\n    visibility: hidden;\n    transform: scale(1.1);\n    z-index:99999999999 !important;\n    transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;\n  }\n  .hv-proceed-btn { padding: 5px; width:15em; max-width:220px;height:3.3em;margin-right: 10px;margin-top: 10px;background-color: rgb(31,162,187);border-color: #6c757d;display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid transparent;padding: .375rem .75rem;line-height: 1.5rem;border-radius: .25rem;transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; margin-bottom:2%;}\n  .hv-capture-btn {\n    height: auto;\n    width: 90vw;\n    max-width: 400px;\n    font-size: 2.3vh;\n    padding: 2vh;\n    margin-top: 10px;\n    border: 1px solid #ccc;\n    border-radius: 10px;\n    background-color: rgb(31,162,187);\n  }\n  .hv-upload-btn { \n    border: 1px solid #ccc;\n    display: inline-block;\n    padding: 6px 12px;\n    cursor: pointer;\n    margin-top: 25vh;\n    color: black;\n    background-color: #EFEFEF;\n    padding: 2vh;\n    border-radius: 10px;\n    height: auto;\n    width: 90vw;\n    max-width: 400px;\n    font-size: 2.3vh;\n    background-color: rgb(31,162,187);\n    margin-bottom: 0.5rem;\n  }\n  .hv-preview-iframe {\n    height : 42vh;\n  }\n  .hv-preview-img {\n    height: 35vh;\n    width: 100%;\n    max-width: 450px;\n    max-height: 400px;\n  }\n  .hv-bottom-instructions {\n    font-size: 1.2em;\n    margin-top: 0.5em;\n    color: black;\n    margin-top: 2.3em;\n  }\n  #hv-retake-bottom-instructions {\n    color: #E2574C;\n  }\n  .hv-modal-content {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    background-color: white;\n    padding: 1rem 1.5rem;\n    width:700px;\n    height: calc(100% - 3em);\n    overflow: hidden;\n  }\n   .hv-close-button {\n    float: left;\n    width: 1.5rem;\n    line-height: 1.5rem;\n    text-align: center;\n    cursor: pointer;\n    border-radius: 0.25rem;\n    background-color: white;\n    font-size: 30px;\n    margin-top: 0.3em;\n    font-weight: 600;\n  }\n  .hv-center-img {\n    height: 75vh;\n    width:100%;\n    max-width: 450px;\n  }\n  @media only screen and (min-device-width: 320px) and (max-device-width: 480px){\n     .hv-instructions {\n      margin-bottom: 1em !important;\n    }\n  }\n  @media (min-width:320px) and (max-width:1025px)\n  {\n    .hv-modal-content {\n      width: 100%;\n      height: 100%; \n    } \n    .hv-instruction-props {\n      margin-top : 10%;\n    }\n  }\n  @media (min-width:1025px)\n  {\n    .hv-modal-content {\n      width: 50%;\n      height: calc(100% - 3em); \n      border-radius: 10px;\n    }\n  }\n  .hv-close-button:hover {\n    background-color: darkgray;\n  }\n  .hv-show-modal {\n    opacity: 1;\n    visibility: visible;\n    transform: scale(1);\n    transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;\n  }\n  .hv-title {\n    font-weight: 600;\n    font-size: 1.4em;\n    margin-bottom: 0.1em;\n    color: black;\n    margin-right: 1.5em;\n  }\n  .hv-instructions {\n    font-size: 1em;\n    margin-bottom: 0.5em;\n    min-height: 3em;\n    color: black;\n  }\n  .hv-modal-footer {\n    position: absolute;\n    bottom: 0;\n    width: 100%;\n    height: 1em;\n    margin: 0.25rem 0 0.75rem -1.5rem;\n  }\n  .footertext {\n    font-size: 0.7em;\n    line-height: 1em;\n    color: black;\n  }\n  .footerimage {\n    height: 1.5em;\n    margin-bottom: -0.4em;\n  }\n  .hv-btnposition{\n    height: 4.8em;\n  }\n  .hypervergebtn \n  {\n    font-size: 2.3vh;\n    overflow: hidden;\n    height: 9vh;\n    width: 45%;\n    max-width: 25vh;\n    margin-right: 0.4em;\n    margin-top: 2em;\n    line-height: 0;\n    color: #fff;\n    background-color: rgb(31,162,187);\n    border-color: #6c757d;\n    display: inline-block;\n    font-weight: 400;\n    text-align: center;\n    white-space: nowrap;\n    vertical-align: middle;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n    user-select: none;\n    border: 1px solid transparent;\n    line-height: 1.5rem;\n    border-radius: .25rem;\n    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;\n  }\n  .hv-reupload-btn{background-color: white;color: rgb(31, 162, 187);border: 1px solid rgb(31, 162, 187);}\n  .hv-retake-screen-btn {\n    background-color: white;\n    color: rgb(31, 162, 187);\n    border: 1px solid rgb(31, 162, 187);\n    width: 90%;\n    max-width: 40vh;\n  } \n  .hv-retake-btn{ background-color: white;color: rgb(31, 162, 187);border: 1px solid rgb(31, 162, 187);}\n  .hv-use-this-photo-btn{ line-height:0;}";
            document.getElementsByTagName("head")[0].appendChild(b)
        }

        function loadDependencies() {
            if (isInternetExplorer()) {
                var b = document.createElement("script");
                b.src = "https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.0.0/polyfill.min.js";
                document.head.appendChild(b);
                var f = document.createElement("script");
                f.src = "https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js";
                document.head.appendChild(f);
                b.onload = function() {
                    loadQRDependencies()
                }
            } else loadQRDependencies()
        }

        function loadQRDependencies() {
            loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js").onload = function() {
                scriptsLoaded += 1
            };
            loadExternalScript("https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js").onload = function() {
                loadExternalScript("https://www.gstatic.com/firebasejs/8.2.7/firebase-database.js").onload = function() {
                    scriptsLoaded += 1
                };
                scriptsLoaded += 1;
                loadExternalScript("https://www.gstatic.com/firebasejs/8.2.7/firebase-auth.js").onload = function() {
                    scriptsLoaded +=
                        1
                }
            };
            loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js").onload = function() {
                scriptsLoaded += 1
            }
        }

        function isHypervergeTesting() {
            return "http://localhost:9876/context.html" === window.location.href || "http://localhost:9878/context.html" === window.location.href
        }

        function setupSocketServer(b, f, h) {
            trackMixpanel("Setting up firebase", {});
            firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);
            getFirebaseToken().then(function(c) {
                firebase.auth().signInWithCustomToken(c).then(function(a) {
                    var d = firebase.database(),
                        e = a.user.uid;
                    a = WebSDKObject.globals;
                    a = {
                        jwtToken: a.jwtToken,
                        regionName: a.regionName,
                        configs: f,
                        transactionID: a.transactionID
                    };
                    var g = computeRandomString(40);
                    a = encryptData(a, g);
                    d.ref(e).set({
                        data: a,
                        isStarted: !0
                    });
                    d.ref().child(e).on("value",
                        function(k) {
                            if (k = k.val())
                                if (k.results && (k = {
                                        results: JSON.parse(decryptCipher(k.results, g))
                                    }), !k.isStarted) {
                                    var l = document.getElementById("HV_QR_POPUP");
                                    l && (l.outerHTML = "");
                                    b(k);
                                    d.ref(e).remove()
                                }
                        });
                    h(c, g)
                })["catch"](function() {
                    var a = new HVError;
                    a.errorCode = "503";
                    a.errorMsg = "External Service error";
                    b(a, null);
                    trackMixpanel("External Service error", {})
                })
            })["catch"](function() {
                var c = new HVError;
                c.errorCode = "401";
                c.errorMsg = "Missing/Invalid Credentials";
                b(c, null);
                trackMixpanel("Firebase Missing/Invalid Credentials error", {})
            })
        }

        function getDataFromFirebase(b, f, h) {
            var c, a, d, e;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(g) {
                switch (g.nextAddress) {
                    case 1:
                        return g.setCatchFinallyBlocks(2), firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig), g.yield(firebase.auth().signInWithCustomToken(b), 4);
                    case 4:
                        return c = g.yieldResult, a = firebase.database(), d = c.user.uid, g.yield(a.ref(d), 5);
                    case 5:
                        e = g.yieldResult;
                        e.on("value", function(k) {
                            if (k.val() && k.val().data) try {
                                var l = decryptCipher(k.val().data, f);
                                h(l,
                                    d)
                            } catch (n) {
                                removeLoader(), showPopupMsg("Looks like this link is no longer valid")
                            }
                        });
                        g.leaveTryBlock(0);
                        break;
                    case 2:
                        g.enterCatchBlock(), removeLoader(), showPopupMsg("Looks like this link is no longer valid"), g.jumpToEnd()
                }
            })
        }

        function SDK_CONFIGURATIONS(b) {
            b = "https://hypersnapweb.hyperverge.co";
            "snap.hyperverge.co" === window.location.host && (b = "https://snap.hyperverge.co");
            return {
                SERVER_URL: b,
                PRODUCT_NAME: "WebSDK",
                SDK_VERSION: "3.3.1"
            }
        }

        function showPopupMsg(b) {
            b = void 0 === b ? "Processing" : b;
            var f = document.createElement("div"),
                h = document.createElement("style"),
                c = document.createElement("div"),
                a = document.createElement("div");
            h.innerHTML = "\n  .hv-small-popup-modal-content {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    width: auto;\n    height: auto;\n    border-radius: 0.3rem;\n    overflow: hidden;\n    text-align: center;\n    background-color: #FFF;\n    box-shadow: 0px 1px 4px 1px #77777730;\n    padding : 25px;\n  }\n  .hv-small-popup-msg {\n    color: black;\n  }\n  .hv-loader-box{\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n  };   \n  ";
            document.getElementsByTagName("head")[0].appendChild(h);
            a.setAttribute("class", "hv-small-popup-msg");
            a.innerHTML = b;
            c.setAttribute("class", "hv-loader-box");
            f.setAttribute("id", "HV_loader_popup");
            f.setAttribute("class", "hv-small-popup-modal-content");
            f.innerText = b;
            c.appendChild(a);
            document.body.appendChild(f)
        }

        function startLoader(b) {
            b = void 0 === b ? "Processing" : b;
            var f = document.createElement("div"),
                h = document.createElement("style"),
                c = document.createElement("div"),
                a = document.createElement("div"),
                d = document.createElement("div");
            h.innerHTML = ".loader {\n    border: 3px solid #f3f3f3;\n    border-top: 3px solid #555;\n    border-radius: 50%;\n    width: 20px;\n    height: 20px;\n    animation: spin 1s linear infinite;\n    float:left;\n  }\n  @keyframes spin {\n    0% { transform: rotate(0deg); }\n    100% { transform: rotate(360deg); }\n  }\n  .hv-loading-modal-content {\n    position: fixed;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    width: 15em;\n    height: 3em;\n    border-radius: 0.3rem;\n    overflow: hidden;\n    text-align: center;\n    background-color: #FFF;\n    box-shadow: 0px 1px 4px 1px #77777730;\n  }\n  .hv-loader-msg {\n    float:right;\n    padding-left: 10px;\n    color: black;\n  }\n  .hv-loader-box{\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n  };   \n  ";
            document.getElementsByTagName("head")[0].appendChild(h);
            a.setAttribute("class", "loader");
            d.setAttribute("class", "hv-loader-msg");
            d.innerHTML = b;
            c.setAttribute("class", "hv-loader-box");
            f.setAttribute("id", "HV_loader_popup");
            f.setAttribute("class", "hv-loading-modal-content");
            c.appendChild(a);
            c.appendChild(d);
            f.appendChild(c);
            document.body.appendChild(f)
        }

        function removeLoader() {
            document.getElementById("HV_loader_popup") && (document.getElementById("HV_loader_popup").outerHTML = "")
        }

        function trackMixpanel(b, f) {
            try {
                f && f.errorObj && (f.errorCode = f.errorObj.errorCode, f.errorMsg = f.errorObj.errorMsg), WebSDKObject && WebSDKObject.globals && (f.transactionID = WebSDKObject.globals.transactionID), f.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION, "errorObj" in f && delete f.errorObj, !isHypervergeTesting() && WebSDKObject && WebSDKObject.globals && WebSDKObject.globals.mixpanel && mixpanel.track(b, f)
            } catch (h) {
                console.log(h)
            }
        }

        function isInternetExplorer() {
            return /MSIE|Trident/.test(window.navigator.userAgent)
        }

        function isVivoOrMiBrowser() {
            var b = window.navigator.userAgent;
            return b.match(/MiuiBrowser/i) || !!b.match(/VivoBrowser/i)
        }

        function getFirebaseToken() {
            var b, f, h;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(c) {
                switch (c.nextAddress) {
                    case 1:
                        b = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/firebaseToken";
                        if (!isInternetExplorer()) {
                            c.jumpTo(2);
                            break
                        }
                        return c.yield(fetch(b, {
                            method: "POST"
                        }), 3);
                    case 3:
                    case 2:
                        return c.yield(fetch(b, {
                            method: "POST",
                            headers: {
                                authorization: WebSDKObject.globals.jwtToken
                            }
                        }), 4);
                    case 4:
                        return f = c.yieldResult, c.yield(f.json(), 5);
                    case 5:
                        return h = c.yieldResult, c["return"](h.customToken)
                }
            })
        }

        function HVError(b) {
            b = void 0 === b ? {
                errorCode: 500,
                errorMsg: "Unknown error has occured"
            } : b;
            this.errorCode = b.errorCode;
            this.errorMsg = b.errorMsg
        }
        HVError.prototype.getErrorCode = function() {
            return this.errorCode
        };
        HVError.prototype.getErrorMessage = function() {
            return this.errorMsg
        };

        function HVResponse(b) {
            b = void 0 === b ? {
                response: "",
                headers: "",
                imgBase64: "",
                attemptsCount: 1
            } : b;
            this.response = b.response;
            this.headers = b.headers;
            this.imgBase64 = b.imgBase64;
            this.action = "";
            this.attemptsCount = b.attemptsCount
        }
        HVResponse.prototype.getApiResult = function() {
            return this.response
        };
        HVResponse.prototype.getApiHeaders = function() {
            return this.headers
        };
        HVResponse.prototype.getImageBase64 = function() {
            return this.imgBase64
        };
        HVResponse.prototype.getAction = function() {
            return this.action
        };
        HVResponse.prototype.getAttemptsCount = function() {
            return this.attemptsCount
        };

        function HVKycLink() {
            this.link = ""
        }
        HVKycLink.prototype.getKycLink = function() {
            return this.link
        };

        function HVExifData() {
            this.ipAddress = this.userAgent = this.device = this.browserVersion = this.browser = this.longitude = this.latitude = this.datetime = ""
        }
        HVExifData.prototype.getDatetime = function() {
            return this.datetime
        };
        HVExifData.prototype.getLatitude = function() {
            return this.latitude
        };
        HVExifData.prototype.getLongitude = function() {
            return this.longitude
        };
        HVExifData.prototype.getBrowser = function() {
            return this.browser
        };
        HVExifData.prototype.getBrowserVersion = function() {
            return this.browserVersion
        };
        HVExifData.prototype.getDevice = function() {
            return this.device
        };
        HVExifData.prototype.getUserAgent = function() {
            return this.userAgent
        };
        HVExifData.prototype.getIpAddress = function() {
            return this.ipAddress
        };

        function geolocationNotSupported(b) {
            b({
                coords: {
                    latitude: "Geolocation is not supported by this browser",
                    longitude: "Geolocation is not supported by this browser"
                }
            })
        }

        function getLocation(b) {
            navigator.geolocation ? navigator.geolocation.getCurrentPosition(b, b, {
                timeout: 1E4
            }) : geolocationNotSupported(b)
        }

        function getIpJsonip() {
            var b, f;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(h) {
                switch (h.nextAddress) {
                    case 1:
                        return h.setCatchFinallyBlocks(2), h.yield(fetch("https://jsonip.com/", {
                            method: "GET"
                        }), 4);
                    case 4:
                        return b = h.yieldResult, h.yield(b.json(), 5);
                    case 5:
                        return f = h.yieldResult, h["return"](f.ip);
                    case 2:
                        return h.enterCatchBlock(), h["return"]("Problem in fetching Ip")
                }
            })
        }

        function getIpCloudflare() {
            var b, f, h, c;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
                switch (a.nextAddress) {
                    case 1:
                        return a.setCatchFinallyBlocks(2), a.yield(fetch("https://www.cloudflare.com/cdn-cgi/trace", {
                            method: "GET"
                        }), 4);
                    case 4:
                        return b = a.yieldResult, a.yield(b.text(), 5);
                    case 5:
                        return f = a.yieldResult, h = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, c = f.match(h)[0], a["return"](c);
                    case 2:
                        return a.enterCatchBlock(), a["return"]("Problem in fetching Ip")
                }
            })
        }

        function getIpIpify() {
            var b, f;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(h) {
                switch (h.nextAddress) {
                    case 1:
                        return h.setCatchFinallyBlocks(2), h.yield(fetch("https://api.ipify.org/?format=json", {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }), 4);
                    case 4:
                        return b = h.yieldResult, h.yield(b.json(), 5);
                    case 5:
                        return f = h.yieldResult, h["return"](f.ip);
                    case 2:
                        return h.enterCatchBlock(), h["return"]("Problem in fetching Ip")
                }
            })
        }

        function processConfig(b, f) {
            "OCR" === b.configType ? HVDocsModule.start(b, f) : "FACE" === b.configType && HVFaceModule.start(b, f)
        }
        var toBase64 = function(b) {
            return new Promise(function(f, h) {
                var c = new FileReader;
                c.readAsDataURL(b);
                c.onload = function() {
                    return f(c.result)
                };
                c.onerror = function(a) {
                    return h(a)
                }
            })
        };

        function fileToBase64(b) {
            var f;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(h) {
                if (1 == h.nextAddress) return h.yield(toBase64(b)["catch"](function(c) {
                    return Error(c)
                }), 2);
                f = h.yieldResult;
                return h["return"](f)
            })
        }

        function sendResultsBack(b, f, h, c, a) {
            var d, e, g;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(k) {
                if (1 == k.nextAddress) return d = firebase.database(), e = encryptData(f, h), k.yield(d.ref(b).set({
                    results: e
                }), 2);
                g = !1;
                f.forEach(function(l) {
                    l.hvError && l.hvError.errorCode ? g = !0 : l.hvResponse && l.hvResponse.response && l.hvResponse.response.status && "failure" === l.hvResponse.response.status && (g = !0)
                });
                trackMixpanel("Completed QR flow", {
                    isError: g
                });
                g ? location.replace(c) : location.replace(a);
                k.jumpToEnd()
            })
        }
        var dataReceived = !1;

        function isDataReceived() {
            dataReceived || (removeLoader(), showPopupMsg("Looks like this link is no longer valid"))
        }

        function startKycProcess(b) {
            var f, h, c;
            return $jscomp.asyncExecutePromiseGeneratorProgram(function(a) {
                f = new URL(window.location.href);
                h = f.searchParams.get("token");
                c = f.searchParams.get("key");
                b.token = h;
                b.key = c;
                setTimeout(isDataReceived, 15E3);
                getDataFromFirebase(h, c, function(d, e) {
                    b.tokenId = e;
                    dataReceived = !0;
                    var g = JSON.parse(d),
                        k = g.transactionID,
                        l = g.configs;
                    HyperSnapSDK.init(g.jwtToken, g.regionName);
                    HyperSnapSDK.startUserSession(k);
                    trackMixpanel("Using QR flow", {});
                    b.totalConfigs = l.length;
                    b.configs =
                        l;
                    removeLoader();
                    processConfig(b.configs[b.configNumber], b.callback)
                });
                a.jumpToEnd()
            })
        }

        function getKycUrl(b, f, h) {
            isInternetExplorer() ? f = b + "?token=" + f + "&key=" + h : (b = new URL(b), b.searchParams.append("token", f), b.searchParams.append("key", h), f = b.href);
            trackMixpanel("KYC URL Generated", {});
            return f
        }
        var HyperSnapParams = {
                Region: {
                    India: "India",
                    AsiaPacific: "Vietnam"
                }
            },
            HVCamModule = {
                results: [],
                totalConfigs: 0,
                data: "",
                token: "",
                tokenId: "",
                configNumber: 0,
                configs: "",
                baseUrl: SDK_CONFIGURATIONS().SERVER_URL + "/qr",
                redirectPageUrl: SDK_CONFIGURATIONS().SERVER_URL + "/thankYou",
                redirectErrorPageUrl: SDK_CONFIGURATIONS().SERVER_URL + "/error",
                key: "",
                detectWebcam: function() {
                    var b, f;
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(h) {
                        if (1 == h.nextAddress) {
                            b = navigator.mediaDevices;
                            if (!b || !b.enumerateDevices) return h["return"](!1);
                            f = !0;
                            return h.yield(b.enumerateDevices().then(function(c) {
                                f = c.some(function(a) {
                                    return "videoinput" === a.kind
                                })
                            }), 2)
                        }
                        return h["return"](f)
                    })
                },
                start: function(b, f) {
                    isInitialized(b) && (areScriptsLoaded() ? setupSocketServer(b, f, function(h, c) {
                        var a = getKycUrl(HVCamModule.baseUrl, h, c),
                            d = new HVKycLink;
                        d.link = a;
                        b(null, d)
                    }) : setTimeout(HVCamModule.start, 40, b, f))
                },
                process: function() {
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(b) {
                        startLoader("Loading");
                        areScriptsLoaded() ? startKycProcess(HVCamModule) :
                            setTimeout(HVCamModule.process, 40);
                        b.jumpToEnd()
                    })
                },
                callback: function(b, f) {
                    HVCamModule.results.push({
                        hvError: b,
                        hvResponse: f
                    });
                    HVCamModule.configNumber += 1;
                    if (HVCamModule.totalConfigs === HVCamModule.configNumber) {
                        var h = HVCamModule;
                        sendResultsBack(h.tokenId, h.results, h.key, h.redirectErrorPageUrl, h.redirectPageUrl);
                        startLoader()
                    } else processConfig(HVCamModule.configs[HVCamModule.configNumber], HVCamModule.callback)
                },
                setRedirectPageUrl: function(b) {
                    HVCamModule.redirectPageUrl = b
                },
                setErrorRedirectPageUrl: function(b) {
                    HVCamModule.redirectErrorPageUrl =
                        b
                },
                setBaseUrl: function(b) {
                    HVCamModule.baseUrl = b
                }
            },
            HVBrowserModule = {
                isInternetExplorer: function() {
                    return isInternetExplorer()
                }
            },
            HyperSnapSDK = {
                init: function(b, f) {
                    "" === WebSDKObject ? WebSDKObject = new WebSDK({
                        jwtToken: b,
                        regionName: f
                    }) : (WebSDKObject.globals.jwtToken = b, WebSDKObject.globals.regionName = f);
                    trackMixpanel("SDK initialized", {});
                    trackMixpanel("Region", {
                        regionName: f
                    })
                },
                startUserSession: function(b) {
                    b || (b = WebSDKObject.generateTransactionId(20));
                    WebSDKObject.globals.transactionID = b;
                    WebSDKObject.globals.mixpanel &&
                        (mixpanel.track("User Session - Started", {}), mixpanel.identify(b))
                },
                endUserSession: function() {
                    WebSDKObject.globals.transactionID = ""
                },
                extractExifData: function(b) {
                    var f = new HVExifData,
                        h = getBrowser();
                    h.name && (f.browser = h.name);
                    h.version && (f.browserVersion = h.version);
                    f.device = getDevice();
                    f.userAgent = window.navigator.userAgent;
                    f.datetime = (new Date).toLocaleString();
                    sendData = function() {
                        "" != f.latitude && "" != f.longitude && "" != f.ipAddress && b(f)
                    };
                    ipFunctions = [getIpIpify, getIpCloudflare, getIpJsonip];
                    getClientIp =
                        function() {
                            var c, a, d;
                            return $jscomp.asyncExecutePromiseGeneratorProgram(function(e) {
                                switch (e.nextAddress) {
                                    case 1:
                                        c = "Problem in fetching ip", a = 0;
                                    case 2:
                                        if (!(a < ipFunctions.length)) {
                                            e.jumpTo(4);
                                            break
                                        }
                                        d = !1;
                                        return e.yield(ipFunctions[a](), 5);
                                    case 5:
                                        (c = e.yieldResult) && c.match(/^\d/) && (d = !0);
                                        trackMixpanel(ipFunctions[a].name, {
                                            worked: d
                                        });
                                        if (d) {
                                            e.jumpTo(4);
                                            break
                                        }
                                        a++;
                                        e.jumpTo(2);
                                        break;
                                    case 4:
                                        f.ipAddress = c, sendData(), e.jumpToEnd()
                                }
                            })
                        };
                    getPosition = function(c) {
                        c.coords ? (f.latitude = c.coords.latitude, f.longitude =
                            c.coords.longitude) : (f.latitude = "User denied Geolocation", f.longitude = "User denied Geolocation");
                        sendData()
                    };
                    getClientIp();
                    getLocation(getPosition)
                }
            },
            HVFaceModule = {
                start: function(b, f) {
                    isInitialized(f) && ("" === b.endpoint && (b.endpoint = b[WebSDKObject.globals.regionName].url), WebSDKObject.runFace(b, f))
                }
            },
            HVDocsModule = {
                start: function(b, f) {
                    isInitialized(f) && (b.chooseDocumentCaptureOption ? WebSDKObject.showUserChoiceScreen(b, f) : WebSDKObject.runOCR(b, f), trackMixpanel("Show User Choice Screen", {
                        show: b.chooseDocumentCaptureOption
                    }))
                }
            },
            HVQRModule = {
                self: this,
                results: [],
                totalConfigs: 0,
                data: "",
                token: "",
                tokenId: "",
                configNumber: 0,
                configs: "",
                baseUrl: SDK_CONFIGURATIONS().SERVER_URL + "/qr",
                redirectPageUrl: SDK_CONFIGURATIONS().SERVER_URL + "/thankYou",
                redirectErrorPageUrl: SDK_CONFIGURATIONS().SERVER_URL + "/error",
                key: "",
                popupId: "HV_QR_POPUP",
                browserNotSupportedTitle: "Browser not supported",
                qrScreenTitle: "Whoops ! Looks like there is no camera on this device",
                qrScreenDescription: " Please Scan this QR code and complete your KYC on another device with camera",
                qrScreenBottomDescription: "You will be continuing the process here once you complete the KYC on your other device. Please don't close this window",
                browserNotSupportedText: "This Web Browser is not supported. Please open this link in Chrome/Firefox for Windows or Safari for MacOS",
                start: function(b, f, h) {
                    h = void 0 === h ? !1 : h;
                    isInitialized(b) && (areScriptsLoaded() ? setupSocketServer(b, f, function(c, a) {
                        var d = getKycUrl(HVQRModule.baseUrl, c, a);
                        if (h) {
                            var e = new HVKycLink;
                            e.link = d;
                            b(null, e)
                        }
                        WebSDKObject.makeQrPopup({
                            popupId: HVQRModule.popupId,
                            configType: "QR",
                            qrScreenTitle: HVQRModule.qrScreenTitle,
                            qrScreenDescription: HVQRModule.qrScreenDescription,
                            qrScreenBottomDescription: HVQRModule.qrScreenBottomDescription,
                            browserNotSupportedTitle: HVQRModule.browserNotSupportedTitle
                        }, b);
                        WebSDKObject.showQR(d)
                    }) : setTimeout(HVQRModule.start, 40, b, f, h))
                },
                process: function() {
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(b) {
                        isInternetExplorer() || isVivoOrMiBrowser() ? showPopupMsg(HVQRModule.browserNotSupportedText) : (startLoader("Loading"), areScriptsLoaded() ?
                            startKycProcess(HVQRModule) : setTimeout(HVQRModule.process, 40));
                        b.jumpToEnd()
                    })
                },
                callback: function(b, f) {
                    HVQRModule.results.push({
                        hvError: b,
                        hvResponse: f
                    });
                    HVQRModule.configNumber += 1;
                    if (HVQRModule.totalConfigs === HVQRModule.configNumber) {
                        var h = HVQRModule;
                        sendResultsBack(h.tokenId, h.results, h.key, h.redirectErrorPageUrl, h.redirectPageUrl);
                        startLoader()
                    } else processConfig(HVQRModule.configs[HVQRModule.configNumber], HVQRModule.callback)
                },
                setRedirectPageUrl: function(b) {
                    HVQRModule.redirectPageUrl = b
                },
                setErrorRedirectPageUrl: function(b) {
                    HVQRModule.redirectErrorPageUrl =
                        b
                },
                setQRUrl: function(b) {
                    HVQRModule.baseUrl = b
                },
                setQRScreenTitle: function(b) {
                    HVQRModule.qrScreenTitle = b
                },
                setQRScreenDescription: function(b) {
                    HVQRModule.qrScreenDescription = b
                },
                setQRScreenBottomDescription: function(b) {
                    HVQRModule.qrScreenBottomDescription = b
                },
                setBrowserNotSupportedTitle: function(b) {
                    HVQRModule.browserNotSupportedTitle = b
                }
            },
            HVNetworkHelper = {
                Vietnam: {
                    url: "https://apac-faceid.hyperverge.co/v1/photo/verifyPair"
                },
                India: {
                    url: "https://ind-face-prod.hyperverge.co/v1/photo/verifyPair"
                },
                makeFaceMatchCall: function(b,
                    f, h, c, a) {
                    var d = this,
                        e, g, k, l, n, m, q, r;
                    return $jscomp.asyncExecutePromiseGeneratorProgram(function(p) {
                        switch (p.nextAddress) {
                            case 1:
                                if (!isInitialized(a)) return p["return"]();
                                e = SDK_CONFIGURATIONS().SERVER_URL + "/api/proxy/faceMatch";
                                g = d[WebSDKObject.globals.regionName].url;
                                c.authorization = WebSDKObject.globals.jwtToken;
                                c.transactionID = WebSDKObject.globals.transactionID;
                                k = getBrowser();
                                k.name && (c.browser = k.name);
                                k.version && (c.browserVersion = k.version);
                                c.device = getDevice();
                                c.userAgent = window.navigator.userAgent;
                                c.madeFrom = SDK_CONFIGURATIONS().PRODUCT_NAME;
                                c.sdkVersion = SDK_CONFIGURATIONS().SDK_VERSION;
                                p.setCatchFinallyBlocks(2);
                                return p.yield(fetch(e, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        selfie: b,
                                        actualEndpoint: g,
                                        id: f,
                                        params: h,
                                        headers: c
                                    })
                                }), 4);
                            case 4:
                                return l = p.yieldResult, p.yield(responseHandler(null, l), 5);
                            case 5:
                                return n = p.yieldResult, m = n.errorObj, q = n.responseObj, trackMixpanel("Face Match API Response - Received", {
                                    errorObj: m
                                }), p["return"](a(m, q));
                            case 2:
                                return p.enterCatchBlock(),
                                    p.yield(responseHandler(null, null), 6);
                            case 6:
                                return r = p.yieldResult, m = r.errorObj, q = r.responseObj, trackMixpanel("Face Match API Call - Failed", {
                                    errorObj: m
                                }), p["return"](a(m, q))
                        }
                    })
                }
            };
        (function(b) {
            function f(c) {
                this.globals = {
                    iOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !b.MSStream,
                    isFirefox: "undefined" !== typeof InstallTrigger,
                    isAndroid: -1 < navigator.userAgent.toLowerCase().indexOf("android"),
                    protocol: location.protocol.match(/https/i) ? "https" : "http",
                    detectionThreshold: 15,
                    swfURL: "",
                    loaded: !1,
                    live: !1,
                    userMedia: !0,
                    recordedBlobs: [],
                    flip_horiz: "selfie" === c.mode,
                    sentryLoaded: 0,
                    cssText: ".hv-modal {\n        position: fixed;\n        left: 0;\n        top: 0;\n        width: 100%;\n        height: 100%;\n        background-color: rgba(0, 0, 0, 0.5);\n        opacity: 0;\n        visibility: hidden;\n        transform: scale(1.1);\n        z-index:99999999999 !important;\n        transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;\n      }\n      .hypervergebtn { height: 9vh;width: 45%; max-width: 25vh;margin-right: 0.4em;margin-top: 2em;line-height:0; color: #fff;background-color: rgb(31,162,187);border-color: #6c757d;display: inline-block;font-weight: 400;text-align: center;white-space: nowrap;vertical-align: middle;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;border: 1px solid transparent;padding: .375rem .75rem;line-height: 1.5rem;border-radius: .25rem;transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; }\n      .hv-btnposition{\n        height: 4.8em;\n      }\n      .hv-modal-content {\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n        background-color: white;\n        padding: 1rem 1.5rem;\n        width:700px;\n        height: calc(100% - 3em);\n        overflow: hidden;\n      }\n      .hv-close-button {\n        float: left;\n        width: 1.5rem;\n        line-height: 1.5rem;\n        text-align: center;\n        cursor: pointer;\n        border-radius: 0.25rem;\n        background-color: white;\n        font-size: 30px;\n        margin-top: 0.3em;\n        font-weight: 600;\n      }\n      @media only screen and (min-device-width: 320px) and (max-device-width: 480px){  \n        .hv-instructions {\n          \n          margin-bottom: 1em !important;\n        }\n      }\n      @media (min-width:320px) and (max-width:1025px)\n      {\n        .hv-modal-content {\n          width: 100%;\n          height: 100%; \n        }\n      }\n      @media (min-width:1025px)\n      {\n        .hv-modal-content {\n          width: 50%;\n          height: calc(100% - 3em); \n          border-radius: 10px;\n        }\n      }\n      .hv-close-button:hover {\n        background-color: darkgray;\n      }\n      .hv-show-modal {\n        opacity: 1;\n        visibility: visible;\n        transform: scale(1);\n        transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;\n      }\n      .hv-title {\n        font-weight: 600;\n        font-size: 1.4em;\n        margin-bottom: 0.1em;\n        color: black;\n        margin-right: 1.5em;\n      }\n      .hv-instructions {\n        font-size: 1em;\n        margin-bottom: 0.5em;\n        min-height: 3em;\n        color: black;\n      }\n      .hv-bottom-instructions {\n        font-size: 1.2em;\n        margin-top: 0.5em;\n        color: black;\n        margin-top: 2.3em;\n      }\n      .hv-modal-footer {\n        position: absolute;\n        bottom: 0;\n        width: 100%;\n        height: 1em;\n        margin: 0.25rem 0 0.75rem -1.5rem;\n      }\n      .footertext {\n        font-size: 0.7em;\n        line-height: 1em;\n        color: black;\n      }\n      .footerimage {\n        height: 1.5em;\n        margin-bottom: -0.4em;\n      }\n      .hv-retake-btn{ background-color: white;color: rgb(31, 162, 187);border: 1px solid rgb(31, 162, 187);}\n      .hv-use-this-photo-btn{ line-height:0;}\n      ",
                    oldCameraLogoImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAC0FBMVEUAAAArp78mpb0forsforsforsforslpL0go7wkpL0jpL0forsgo7wforsforsforsforuPy9sforsho7wforsforsforsdobsforsio7wforsppr4forseorsdobsforsio7wforsforsforsforsforseorsmpb4fortcu86l0+J2xtYforsfortDsMYcobseorsforub0N8eorsforsforu+3Okforsforsforsfort0wtQforsforvL4e0forsforsforsfort7xNZovdAfortauMxWt8s9rcS62+ie0eB6xNZovdBIssjq7PYforsforvE3uu02eYforvf6PPS5O/Q4+6w1+Wt1uSp1eMbobqJydofort5x9cdors8rcTq7PYYn7nl6/Tg6fPb5/HH3+y/3eq22eeWzt5cu85tv9Jcus5StcoYn7nh6fPb5/IYn7nI4OwforsXn7mGyNmAxtdgus5eus5RtMqDy9rs7vbl6/TV5fAWn7kWnrlcu86o1OORzNx0xdVcu85euc5cu852xtZrwtPn6/UWn7kVnrkYn7l2xtaDxtgYn7kfort/ytl2xtYVnrlcu85cu85aus2n2uSGzdqn2uTt7fYforvu7vf////w7/fT0+f68vrV1ejS0ubs7Pbn5/Ph4fDX1+nj4/Aaobr08PkWn7nf3+4Yn7nc3Oz38fkdorvy7/jz7/jd3e0Tnrj28Pn48frZ2erq6vX88/tHsseVz95BsMY9rsTp6fR6xdZYuc1OtMktqMBzwdQ5rMQ0qsIopr4kpb3e6PLa5/HN4u1ku88QnLfr7Pbl5fLX5fHS5O/B3uq42+ir1uSCyNn5/f7z+vzm6/TP4+7D4uyf2OKg0uGN0N2IzNtcu872/P3v+Pr28fnj6vTX7vPg6/PU5fDK4eyp2+Wn1OOb0N+Iydrp9vjh8/bm7fXQ7PHH6O5ovtGv1+WER/aUAAAAmXRSTlMAAxT1Yew1BggbF/sL/vnGjIs7Aei6hU4pDvES0sp+MB/WrZd3c0cQ2bqknWdZLiSrn5hWUc7CwKabeWhe5dK2sZGPcldLSEQnvp1tWzX44d7Lti3r2tayrquIg21kRCP18u3t4svGuZKJYUtA++/o4dDCpn52UU48Dvrx39Cv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",
                    logoImg: "data:image/png;base64,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",
                    disabledCaptureImg: "data:image/png;base64,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",
                    blankImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUUxOEI4NEY4MjYwMTFFQThCNzFDMEExRjQxNzY2MTAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUUxOEI4NTA4MjYwMTFFQThCNzFDMEExRjQxNzY2MTAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBRTE4Qjg0RDgyNjAxMUVBOEI3MUMwQTFGNDE3NjYxMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBRTE4Qjg0RTgyNjAxMUVBOEI3MUMwQTFGNDE3NjYxMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph+tdMcAAByiSURBVHja7F0JfFTV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",
                    recordImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0M0M0JDRkU4MjYwMTFFQUE4OUZCRDYyMUY3QjhGRTUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0M0M0JDRkY4MjYwMTFFQUE4OUZCRDYyMUY3QjhGRTUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDQzQzQkNGQzgyNjAxMUVBQTg5RkJENjIxRjdCOEZFNSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDQzQzQkNGRDgyNjAxMUVBQTg5RkJENjIxRjdCOEZFNSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtZFQL8AACWkSURBVHja7F0HfFRV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",
                    isSetdocCaptureReviewBottomDescription: !1
                };
                this.obj_merge(this, this.globals);
                this.documents = {
                    CARD: {
                        ratio: .625,
                        width: 640
                    },
                    PASSPORT: {
                        ratio: .67,
                        width: 640
                    },
                    A4: {
                        ratio: 1.4,
                        width: 640
                    },
                    OTHER: {
                        ratio: 1,
                        width: 640
                    }
                };
                this.params = {
                    mode: "document",
                    capture: "image",
                    documentType: "CARD",
                    width: 640,
                    ratio: 1,
                    imageName: "image.jpeg",
                    imageFormat: "jpeg",
                    jpegQuality: 100,
                    mirrorMode: !1,
                    docCaptureDescription: "Make sure your document is without any glare and is fully inside",
                    docCaptureBottomDescription: "Make sure your document is without any glare and is fully inside",
                    docReviewDescription: "Is your document fully visible, glare free and not blurred?",
                    docCaptureReviewBottomDescription: "Please Review if the document is visible",
                    docCaptureTitle: "Capture ID Card",
                    faceCaptureReviewTopTitle: "Review Your Photo",
                    retakeBtnText: "Retake Photo",
                    imageSubmitBtnText: "Use this Photo",
                    iosPlaceholderText: " ",
                    faceCaptureDescription: "Make sure your face is inside the circle and is fully visible",
                    faceCaptureBottomDescription: "Make sure your face is inside the circle and is fully visible",
                    faceCaptureReviewTitle: "Is your face fully visible, and not blurred?",
                    faceCaptureReviewBottomDescription: "Please Review if your face is fully visible",
                    faceCaptureTitle: "Capture Selfie",
                    faceNotDetectedDescription: "Please place your face inside the circle",
                    faceTooBigDescription: "Please Move away from the camera",
                    faceDetectedDescription: "Capture Now",
                    videoLength: 5E3,
                    audio: !0,
                    videoName: "video.mp4",
                    onSave: function() {},
                    onError: "",
                    debug: !1,
                    sentry: !0,
                    shouldShowDocReviewScreen: !1
                };
                this.unsupported = {
                    firefox_android: 1
                };
                this.obj_merge(this.params, c);
                this.hooks = {
                    load: null,
                    live: null,
                    uploadcomplete: null,
                    uploadprogress: null,
                    error: function(a) {
                        throw Error(a);
                    }
                };
                this.init()
            }
            var h = document.createElement("link");
            h.setAttribute("rel", "stylesheet");
            h.setAttribute("type", "text/css");
            h.setAttribute("href", "https://fonts.googleapis.com/css?family=Muli:400,500,600,600i,700,700i,800,900&display=swap");
            document.head.appendChild(h);
            f.prototype.init = function() {
                var c = this;
                "function" == typeof this.params.onError && (this.hooks.error = this.params.onError);
                if ("https:" != document.location.protocol && "localhost" !== location.hostname && "127.0.0.1" !== location.hostname) return this.dispatch("error", "HypervergeSDK.js Error: 001 Https required for accessing camera");
                if (document.querySelector("meta[name='viewport']")) this.custommeta = !1;
                else {
                    var a = document.createElement("meta");
                    a.name = "viewport";
                    a.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
                    document.head.appendChild(a);
                    this.custommeta = !0
                }
                this.globals.recordedBlobs = [];
                if ("document" ==
                    this.params.mode)
                    if (this.documents[this.params.documentType]) this.params.ratio = this.documents[this.params.documentType].ratio, this.params.width = this.documents[this.params.documentType].width, this.params.width * this.params.ratio > b.screen.availHeight && (this.params.width = b.screen.availHeight / this.params.ratio);
                    else return this.dispatch("error", "HypervergeSDK.js Error: 002 Wrong document type added");
                else this.params.docCaptureTitle = this.params.faceCaptureTitle, this.params.docCaptureDescription = this.params.faceCaptureDescription,
                    this.params.docCaptureBottomDescription = this.params.faceCaptureBottomDescription, this.params.docReviewDescription = this.params.faceCaptureReviewTitle, this.params.docCaptureReviewBottomDescription = this.params.faceCaptureReviewBottomDescription, this.consecutiveDetections = 0;
                this.mediaDevices = navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? navigator.mediaDevices : navigator.mozGetUserMedia || navigator.webkitGetUserMedia ? {
                    getUserMedia: function(e) {
                        return new Promise(function(g, k) {
                            (navigator.mozGetUserMedia ||
                                navigator.webkitGetUserMedia).call(navigator, e, g, k)
                        })
                    }
                } : null;
                b.URL = b.URL || b.webkitURL || b.mozURL || b.msURL;
                this.userMedia = this.userMedia && !!this.mediaDevices && !!b.URL;
                navigator.userAgent.match(/Firefox\D+(\d+)/) && 21 > parseInt(RegExp.$1, 10) && (this.userMedia = null);
                var d = this;
                this.userMedia && b.addEventListener("beforeunload", function(e) {
                    d.reset()
                });
                this.starting = 0;
                this.params.sentry && (a = document.createElement("script"), a.type = "text/javascript", a.src = "https://browser.sentry-cdn.com/5.24.2/bundle.tracing.min.js",
                    a.setAttribute("crossorigin", "anonymous"), document.head.appendChild(a), a.addEventListener("readystatechange", function() {
                        c.sentryInit()
                    }, !1), a.addEventListener("load", function() {
                        c.sentryInit()
                    }, !1))
            };
            f.prototype.attach = function(c) {
                var a = this;
                "string" == typeof c && (c = document.getElementById(c) || document.querySelector(c));
                if (!c) return this.dispatch("error", "HypervergeSDK.js Error: 003 Could not locate DOM element to attach to.");
                c.innerHTML = "";
                var d = document.createElement("center"),
                    e = document.createElement("div"),
                    g = document.createElement("div"),
                    k = document.createElement("button"),
                    l = document.createElement("button"),
                    n = document.createElement("a"),
                    m = document.createElement("a"),
                    q = document.createElement("a"),
                    r = document.createElement("img"),
                    p = document.createElement("img"),
                    t = document.createElement("div"),
                    u = document.createElement("span");
                this.peg = document.createElement("div");
                this.cameraholder = document.createElement("div");
                this.cameraLoadingText = document.createElement("div");
                this.divcapturetitle = document.createElement("div");
                this.divcapturelabel = document.createElement("div");
                this.divcapturelabelbottom = document.createElement("div");
                this.capturebtn = n;
                this.captureDisabledbtn = m;
                this.reviewbtn = g;
                this.videorecordbtn = q;
                this.videotimer = document.createElement("span");
                this.videorecimg = document.createElement("img");
                d.style.fontFamily = " 'Muli', sans-serif";
                this.divcapturetitle.setAttribute("class", "hv-title");
                this.divcapturelabel.setAttribute("class", "hv-instructions");
                this.divcapturelabelbottom.setAttribute("class", "hv-bottom-instructions");
                this.cameraholder.setAttribute("id", "hv-cameraholder");
                e.style.cssText = "bottom: 2em;position: absolute;width: 100%;margin-left: -1.5rem;";
                g.style.display = "none";
                g.style.width = "100%";
                g.setAttribute("class", "hv-btnposition");
                k.setAttribute("class", "hypervergebtn hv-retake-btn");
                l.setAttribute("class", "hypervergebtn hv-use-this-photo-btn");
                e.setAttribute("class", "hv-divforcover");
                this.cameraLoadingText.style.cssText = "text-align:center";
                this.cameraLoadingText.setAttribute("id", "hv-cameraLoadingText");
                r.src = this.globals.logoImg;
                p.src = this.globals.disabledCaptureImg;
                r.setAttribute("class", "hv-btnposition");
                r.style.width = "auto";
                p.setAttribute("class", "hv-btnposition");
                p.style.width = "auto";
                this.videorecimg.src = this.globals.recordImg;
                this.videorecimg.style.width = "auto";
                this.videotimer.style.cssText = "position: fixed;left: 50%;transform: translate(-50%);font-size: 3em;color:#34a9c0";
                this.videorecimg.setAttribute("class", "hv-btnposition");
                t.setAttribute("class", "hv-modal-footer");
                u.setAttribute("class",
                    "footertext");
                this.cameraLoadingText.innerHTML = "Loading Camera....Please wait";
                this.divcapturetitle.innerHTML = this.params.docCaptureTitle;
                this.divcapturelabel.innerHTML = this.params.docCaptureDescription;
                this.divcapturelabelbottom.innerHTML = this.params.docCaptureBottomDescription;
                k.innerHTML = this.params.retakeBtnText;
                l.innerHTML = this.params.imageSubmitBtnText;
                u.innerHTML = " ";
                this.capturebtn.style.cursor = "pointer";
                this.capturebtn.setAttribute("id", "hv-camera-capture-button move");
                
                k.addEventListener("click",
                    function() {
                        a.unfreeze();
                        d.appendChild(t)
                    }, !1);
                l.addEventListener("click", function() {
                    a.takePhoto()
                }, !1);
                n.addEventListener("click", function() {
                    "selfie" == a.params.mode ? a.takePhoto() : a.params.shouldShowDocReviewScreen ? (a.freeze(), d.removeChild(t)) : a.takePhoto()
                }, !1);
                this.stopRecordingFunc = function() {
                    a.startRecording()
                };
                q.addEventListener("click", this.stopRecordingFunc, !1);
                c.appendChild(d);
                d.appendChild(this.divcapturetitle);
                d.appendChild(this.divcapturelabel);
                d.appendChild(this.cameraholder);
                d.appendChild(this.divcapturelabelbottom);
                g.appendChild(k);
                g.appendChild(l);
                e.appendChild(g);
                "video" == this.params.capture ? (q.appendChild(this.videorecimg), q.appendChild(this.videotimer), e.appendChild(q)) : (n.appendChild(r), e.appendChild(n));
                d.appendChild(e);
                t.appendChild(u);
                d.appendChild(t);
                this.cameraholder.appendChild(this.peg);
                this.cameraholder.appendChild(this.cameraLoadingText);
                if (this.userMedia) c = document.createElement("video"), c.style.objectFit = "cover", c.style.objectPosition = "50% 50%", c.style.borderRadius = "0.4em", this.iOS ? (c.setAttribute("autoplay",
                    ""), c.setAttribute("muted", ""), c.setAttribute("playsinline", "")) : c.setAttribute("autoplay", "autoplay"), c.muted = !0, c.style.width = "" + this.params.width + "px", c.style.height = "" + this.params.width * this.params.ratio + "px", this.cameraholder.style.overflow = "hidden", this.video = c, this.capturebtn.style.display = "none", m.appendChild(p), e.appendChild(m), "selfie" == this.params.mode ? (this.videomask = document.createElement("div"), this.videomask.style.cssText = ";border-radius: " + Math.round(this.params.width / 2) + "px; overflow: hidden; -webkit-mask-image: -webkit-radial-gradient(circle, white 100%, black 100%); ",
                    this.videomask.style.borderWidth = "0.5em", this.videomask.style.borderStyle = "solid", this.videomask.style.borderColor = "red", this.videomask.appendChild(c), this.cameraholder.appendChild(this.videomask), this.captureDisabledbtn.style.display = "") : this.cameraholder.appendChild(c), this.getStream(), this.container = this.cameraholder;
                else return this.dispatch("error", "HypervergeSDK.js Error: 004 No interface found")
            };
            f.prototype.isVivoOrMiBrowser = function() {
                var c = b.navigator.userAgent;
                return c.match(/MiuiBrowser/i) ||
                    !!c.match(/VivoBrowser/i)
            };
            f.prototype.isRedmiNote8 = function() {
                return b.navigator.userAgent.match(/Redmi Note 8/i) ? !0 : !1
            };
            f.prototype.triggerNativeCameraConditions = function() {
                return this.isVivoOrMiBrowser() && !this.isRedmiNote8() ? !0 : !1
            };
            f.prototype.toBase64 = function(c, a) {
                var d = new FileReader;
                d.readAsDataURL(c);
                d.onload = function() {
                    a(d.result)
                };
                d.onerror = function(e) {
                    return a(e)
                }
            };
            f.prototype.triggerNativeCamera = function() {
                var c = document.createElement("input"),
                    a = this;
                c.setAttribute("type", "file");
                c.setAttribute("accept",
                    "image/*");
                "selfie" === this.params.mode ? c.setAttribute("capture", "user") : c.setAttribute("capture", "environment");
                c.onchange = function() {
                    a.toBase64(c.files[0], a.params.onSave)
                };
                c.click()
            };
            f.prototype.makepopup = function() {
                var c = this;
                if (!this.mediaDevices || this.triggerNativeCameraConditions()) return this.triggerNativeCamera();
                var a = document.createElement("div"),
                    d = document.createElement("style"),
                    e = document.createElement("span"),
                    g = document.createElement("div");
                this.popup = document.createElement("div");
                this.popup.setAttribute("class",
                    "hv-modal hv-show-modal");
                a.setAttribute("class", "hv-modal-content");
                e.setAttribute("class", "hv-close-button");
                e.innerHTML = "&times;";
                e.addEventListener("click", function() {
                    document.body.removeChild(c.popup);
                    c.reset();
                    c.dispatch("error", "HypervergeSDK.js Error: 013 Operation Cancelled By User")
                });
                document.getElementsByTagName("head")[0].appendChild(d);
                a.appendChild(e);
                a.appendChild(g);
                this.attach(g);
                this.popup.appendChild(a);
                document.body.appendChild(this.popup);
                a = document.getElementsByClassName("hv-modal-content")[0].offsetHeight -
                    document.getElementsByClassName("hv-title")[0].offsetHeight - document.getElementsByClassName("hv-instructions")[0].offsetHeight - document.getElementsByClassName("hv-bottom-instructions")[0].offsetHeight - 10;
                d = document.getElementsByClassName("hv-modal-content")[0].offsetWidth;
                d < this.params.width && (this.params.width = .85 * d, this.video.style.height = "" + this.params.width * this.params.ratio + "px", this.video.style.width = "" + this.params.width + "px", d = document.getElementsByClassName("hv-divforcover")[0].offsetHeight,
                    e = document.getElementsByClassName("hv-modal-footer")[0].offsetHeight, "document" == this.params.mode && (d = a - d - e - this.params.width * this.params.ratio, 0 < d && (this.cameraholder.style.marginTop = "" + d / 3 + "px")), "selfie" == this.params.mode && (this.videomask.style.borderRadius = Math.floor(this.params.width / 2) + "px", this.videomask.style.height = this.video.style.height, this.videomask.style.width = this.video.style.width));
                this.params.width * this.params.ratio * 1.6 > a && (this.params.width = a / (1.6 * this.params.ratio), this.video.style.height =
                    "" + this.params.width * this.params.ratio + "px", this.video.style.width = "" + this.params.width + "px", "selfie" == this.params.mode && (this.videomask.style.borderRadius = Math.floor(this.params.width / 2) + "px", this.videomask.style.height = this.video.style.height, this.videomask.style.width = this.video.style.width), document.body.appendChild(this.popup))
            };
            f.prototype.reset = function() {
                clearInterval(this.detectinterval);
                if (this.userMedia) {
                    try {
                        this.stream.getTracks().forEach(function(c) {
                            c.stop()
                        })
                    } catch (c) {}
                    delete this.stream;
                    delete this.video
                }
                this.container && (this.container.innerHTML = "", delete this.container);
                this.live = this.loaded = !1;
                this.custommeta && document.querySelector("meta[name='viewport']").remove()
            };
            f.prototype.set = function() {
                if (1 == arguments.length)
                    for (var c in arguments[0]) this.params[c] = arguments[0][c];
                else this.params[arguments[0]] = arguments[1]
            };
            f.prototype.on = function(c, a) {
                c = c.replace(/^on/i, "").toLowerCase();
                if ("undefined" == typeof this.hooks[c]) throw "Event type not supported: " + c;
                this.hooks[c] = a
            };
            f.prototype.dispatch =
                function() {
                    var c = this,
                        a = arguments[0].replace(/^on/i, "").toLowerCase(),
                        d = Array.prototype.slice.call(arguments, 1);
                    if ("error" === a && this.params.sentry)
                        if (this.globals.sentryLoaded) Sentry.captureException(Error(d));
                        else {
                            setTimeout(function() {
                                c.dispatch(a, d)
                            }, 1E3);
                            return
                        } return this.hooks[a] ? ("function" == typeof this.hooks[a] ? this.hooks[a].apply(this, d) : "array" == typeof this.hooks[a] ? this.hooks[a][0][this.hooks[a][1]].apply(this.hooks[a][0], d) : b[this.hooks[a]] && b[this.hooks[a]].apply(b, d), !0) : !1
                };
            f.prototype.freeze =
                function() {
                    var c = this,
                        a = this.params;
                    this.preview_active && this.unfreeze();
                    a.mirrorMode || this.unflip();
                    var d = this.video.videoWidth,
                        e = this.video.videoHeight,
                        g = document.createElement("canvas");
                    g.width = d;
                    g.height = e;
                    d = g.getContext("2d");
                    this.preview_canvas = g;
                    this.preview_context = d;
                    this.capturebtn.style.display = "none";
                    this.captureDisabledbtn.style.display = "none";
                    this.reviewbtn.style.display = "block";
                    this.videorecordbtn.style.display = "none";
                    this.divcapturetitle.innerHTML = this.params.faceCaptureReviewTopTitle;
                    this.divcapturelabel.innerHTML = this.params.docReviewDescription;
                    this.globals.isSetdocCaptureReviewBottomDescription = !0;
                    this.divcapturelabelbottom.innerHTML = this.params.docCaptureReviewBottomDescription;
                    "video" == this.params.capture ? (a.mirrorMode || this.flip(), this.superBuffer = new Blob(this.recordedBlobs, {
                            type: "video/mp4"
                        }), this.previewvideo = document.createElement("video"), this.previewvideo.width = "16em", this.previewvideo.height = "16em", this.previewvideo.style.objectFit =
                        "cover", this.previewvideo.style.objectPosition = "50% 50%", this.previewvideo.style.borderRadius = "50%", this.previewvideo.src = b.URL.createObjectURL(this.superBuffer), this.container.insertBefore(this.previewvideo, c.peg), this.previewvideo.play(), this.previewvideo.loop = !0, this.container.style.overflow = "hidden", this.video.style.display = "none", "selfie" == this.params.mode && (this.videomask.style.display = "none", this.videomask.style.height = this.video.style.height, this.videomask.style.width = this.video.style.width),
                        this.preview_active = !0) : (this.tempimg = document.createElement("img"), this.tempimg.width = c.params.width, this.tempimg.height = c.params.width * c.params.ratio, this.tempimg.style.objectFit = "cover", this.tempimg.style.objectPosition = "50% 50%", this.tempimg.style.borderRadius = "0.4em", this.snap(function() {
                        g.style.position = "relative";
                        g.style.left = "" + c.container.scrollLeft + "px";
                        g.style.top = "" + c.container.scrollTop + "px";
                        c.tempimg.src = g.toDataURL("image/" + a.imageFormat, a.jpegQuality / 100);
                        c.container.insertBefore(c.tempimg,
                            c.peg);
                        c.container.style.overflow = "hidden";
                        c.video.style.display = "none";
                        "selfie" == c.params.mode && (c.videomask.style.display = "none");
                        c.preview_active = !0;
                        if (c.userMedia) try {
                            this.stream.getTracks().forEach(function(k) {
                                k.stop()
                            })
                        } catch (k) {}
                    }, g))
                };
            f.prototype.unfreeze = function() {
                this.preview_active && (this.video.style.display = "block", "selfie" == this.params.mode && (this.videomask.style.display = ""), "video" == this.params.capture ? (this.container.removeChild(this.previewvideo), this.videorecordbtn.style.display =
                        "") : (this.container.removeChild(this.tempimg), delete this.preview_context, delete this.preview_canvas, this.capturebtn.style.display = "", this.captureDisabledbtn.style.display = "none"), this.divcapturetitle.innerHTML = this.params.docCaptureTitle, this.divcapturelabel.innerHTML = this.params.docCaptureDescription, this.divcapturelabelbottom.innerHTML = this.params.docCaptureBottomDescription, this.preview_active = this.globals.isSetdocCaptureReviewBottomDescription = !1, this.reviewbtn.style.display = "none", "document" ==
                    this.params.mode && this.globals.iOS || this.flip())
            };
            f.prototype.flip = function() {
                if (this.globals.flip_horiz) {
                    var c = this.container.style;
                    c.webkitTransform = "scaleX(-1)";
                    c.mozTransform = "scaleX(-1)";
                    c.msTransform = "scaleX(-1)";
                    c.oTransform = "scaleX(-1)";
                    c.transform = "scaleX(-1)";
                    c.filter = "FlipH";
                    c.msFilter = "FlipH"
                }
            };
            f.prototype.unflip = function() {
                var c = this.container.style;
                c.webkitTransform = "scaleX(1)";
                c.mozTransform = "scaleX(1)";
                c.msTransform = "scaleX(1)";
                c.oTransform = "scaleX(1)";
                c.transform = "scaleX(1)";
                c.filter =
                    "";
                c.msFilter = ""
            };
            f.prototype.savePreview = function(c, a) {
                var d = this.params,
                    e = this.preview_canvas,
                    g = this.preview_context,
                    k = this;
                a && a.getContext("2d").drawImage(e, 0, 0);
                var l = e.toDataURL("image/" + d.imageFormat, d.jpegQuality / 100);
                if (d.mirrorMode && "document" != this.params.mode) {
                    var n = new Image;
                    n.src = l;
                    n.onload = function() {
                        var m = document.createElement("canvas");
                        m.height = k.video.videoHeight;
                        m.width = k.video.videoWidth;
                        var q = m.getContext("2d");
                        q.translate(k.video.videoWidth, 0);
                        q.scale(-1, 1);
                        q.drawImage(n, 0, 0);
                        q.setTransform(1, 0, 0, 1, 0, 0);
                        l = m.toDataURL("image/" + d.imageFormat, d.jpegQuality / 100);
                        c(a ? null : l, e, g)
                    }
                } else c(a ? null : l, e, g)
            };
            f.prototype.snap = function(c, a) {
                var d = this.params;
                if (!this.loaded) return this.dispatch("error", " HypervergeSDK.js Error: 007 Webcam is not loaded yet");
                if (!c) return this.dispatch("error", "HypervergeSDK.js Error: 008 Please provide a callback function or canvas to snap()");
                if (this.preview_active) return this.savePreview(c, a), null;
                var e = document.createElement("canvas");
                e.width = this.video.videoWidth;
                e.height = this.video.videoHeight;
                var g = e.getContext("2d");
                !this.globals.flip_horiz || "document" == this.params.mode && this.globals.iOS || (g.translate(this.video.videoWidth, 0), g.scale(-1, 1));
                this.params.mirrorMode && "document" == this.params.mode && (g.translate(this.video.videoWidth, 0), g.scale(-1, 1));
                var k = function() {
                    this.src && this.width && this.height && g.drawImage(this, 0, 0, this.video.videoWidth, this.video.videoHeight);
                    a && a.getContext("2d").drawImage(e, 0, 0);
                    c(a ? null : e.toDataURL("image/" + d.imageFormat, d.jpegQuality /
                        100), e, g)
                };
                if (this.userMedia) {
                    g.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
                    var l = document.createElement("canvas");
                    l.width = this.video.videoWidth;
                    l.height = this.video.videoHeight;
                    var n = l.getContext("2d");
                    n.drawImage(e, 0, 0, this.video.videoWidth, this.video.videoHeight);
                    g = n;
                    e = l;
                    k()
                } else return this.dispatch("error", "HypervergeSDK.js Error: 009 Usermedia not found");
                return null
            };
            f.prototype.guid = function() {
                function c() {
                    return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1)
                }
                return [c() + c(), c(), c(), c(), c() + c() + c()].join("_")
            };
            f.prototype.obj_merge = function(c, a) {
                for (var d in a) c[d] = a[d]
            };
            f.prototype.b64ToUint6 = function(c) {
                return 64 < c && 91 > c ? c - 65 : 96 < c && 123 > c ? c - 71 : 47 < c && 58 > c ? c + 4 : 43 === c ? 62 : 47 === c ? 63 : 0
            };
            f.prototype.base64DecToArr = function(c, a) {
                for (var d = c.replace(/[^A-Za-z0-9\+\/]/g, ""), e = d.length, g = a ? Math.ceil((3 * e + 1 >> 2) / a) * a : 3 * e + 1 >> 2, k = new Uint8Array(g), l, n = 0, m = 0, q = 0; q < e; q++)
                    if (l = q & 3, n |= this.b64ToUint6(d.charCodeAt(q)) << 18 - 6 * l, 3 === l || 1 === e - q) {
                        for (l = 0; 3 > l && m < g; l++, m++) k[m] =
                            n >>> (16 >>> l & 24) & 255;
                        n = 0
                    } return k
            };
            f.prototype.upload = function(c, a, d) {
                if (d) this.on("uploadComplete", d);
                if ("video" == this.params.capture) {
                    d = "videoSrc";
                    var e = this.params.videoName
                } else {
                    d = "imageSrc";
                    e = this.params.imageName;
                    var g = "";
                    if (c.match(/^data:image\/(\w+)/)) g = RegExp.$1;
                    else throw "Cannot locate image format in Data URI";
                    c = c.replace(/^data:image\/\w+;base64,/, "");
                    c = new Blob([this.base64DecToArr(c)], {
                        type: "image/" + g
                    })
                }
                var k = new XMLHttpRequest;
                k.open("POST", a, !0);
                var l = this;
                k.upload && k.upload.addEventListener &&
                    k.upload.addEventListener("progress", function(m) {
                        m.lengthComputable && l.dispatch("uploadProgress", m.loaded / m.total, m)
                    }, !1);
                var n = this;
                k.onload = function() {
                    n.dispatch("uploadComplete", k.status, k.responseText, k.statusText)
                };
                a = new FormData;
                a.append(d, c, e);
                k.send(a)
            };
            f.prototype.takePhoto = function() {
                var c = this;
                if ("video" == this.params.capture) {
                    if ("function" === typeof this.params.onSave) this.params.onSave(b.URL.createObjectURL(this.superBuffer), this.superBuffer);
                    this.params.uploadURL ? this.upload(this.superBuffer,
                        this.params.uploadURL,
                        function(a, d) {}) : localStorage.setItem(this.params.videoName, this.superBuffer);
                    this.reset();
                    document.body.removeChild(this.popup)
                } else this.snap(function(a) {
                    if ("function" === typeof c.params.onSave) {
                        var d = "";
                        if (a.match(/^data:image\/(\w+)/)) d = RegExp.$1;
                        else throw "Cannot locate image format in Data URI";
                        var e = a.replace(/^data:image\/\w+;base64,/, "");
                        d = new Blob([c.base64DecToArr(e)], {
                            type: "image/" + d
                        });
                        c.params.onSave(a, d)
                    }
                    c.params.uploadURL && c.upload(a, c.params.uploadURL, function(g,
                        k) {});
                    c.reset();
                    document.body.removeChild(c.popup)
                })
            };
            f.prototype.getStream = function(c) {
                var a = this,
                    d = "selfie" == this.params.mode ? "user" : "environment",
                    e = this;
                this.starting = 1;
                this.mediaDevices && this.mediaDevices.enumerateDevices().then(function(g) {
                    return g.filter(function(k) {
                        return "videoinput" == k.kind
                    })
                }).then(function(g) {
                    if (a.params.debug) return a.dispatch("error", JSON.stringify(g));
                    a.allIds = g;
                    c ? a.deviceId = c : (a.deviceId = g[0].deviceId, 1 < g.length && "environment" == d && (a.globals.flip_horiz = !1, a.deviceId =
                        g[g.length - 1].deviceId));
                    g = !1;
                    "video" == a.params.capture && (g = a.params.audio);
                    var k = "selfie" == a.params.mode ? {
                        min_width: a.params.width,
                        min_height: a.params.width * a.params.ratio,
                        facingMode: d
                    } : {
                        width: {
                            ideal: 2048
                        },
                        height: {
                            ideal: 1536
                        },
                        facingMode: d
                    };
                    "" == a.deviceId || a.globals.isFirefox || (k.deviceId = {
                        exact: a.deviceId
                    });
                    a.mediaDevices.getUserMedia({
                        audio: g,
                        video: k
                    }).then(function(l) {
                        e.starting = 0;
                        "srcObject" in e.video ? e.video.srcObject = l : e.video.src = b.URL.createObjectURL(l);
                        e.stream = l;
                        e.loaded = !0;
                        e.live = !0;
                        e.dispatch("load");
                        e.dispatch("live");
                        setTimeout(function() {
                            e.video && 640 < e.video.videoWidth && (e.params.jpegQuality = 95);
                            "document" == e.params.mode && (e.captureDisabledbtn.style.display = "none", e.capturebtn.style.display = "")
                        }, 1E3);
                        e.globals && e.globals.flip_horiz && e.flip();
                        "selfie" == e.params.mode ? e.detectFace() : "document" == e.params.mode && e.globals.iOS && (l = e.container.style, l.webkitTransform = "scaleX(1)", l.mozTransform = "scaleX(1)", l.msTransform = "scaleX(1)", l.oTransform = "scaleX(1)", l.transform = "scaleX(1)", l.filter = "", l.msFilter =
                            "");
                        document.getElementById("hv-cameraLoadingText").outerHTML = ""
                    })["catch"](function(l) {
                        this.starting = 0;
                        e.params.enable_flash && e.detectFlash() ? setTimeout(function() {
                            e.params.force_flash = 1;
                            e.attach(cameraholder)
                        }, 1) : (document.body.removeChild(document.getElementsByClassName("hv-modal")[0]), e.dispatch("error", "HypervergeSDK.js Error: 010 Please allow camera permissions to continue"))
                    })
                })
            };
            f.prototype.resizePopup = function() {
                if (document.getElementsByClassName("hv-modal-content")[0] && document.getElementsByClassName("hv-title")[0] &&
                    document.getElementsByClassName("hv-instructions")[0] && document.getElementsByClassName("hv-modal-content")[0]) {
                    var c = document.getElementsByClassName("hv-modal-content")[0].offsetHeight - document.getElementsByClassName("hv-title")[0].offsetHeight - document.getElementsByClassName("hv-instructions")[0].offsetHeight,
                        a = document.getElementsByClassName("hv-modal-content")[0].offsetWidth;
                    a < this.params.width && (this.params.width = .85 * a, this.video.style.height = this.params.width * this.params.ratio, this.video.style.width =
                        this.params.width, "selfie" == this.params.mode && (this.videomask.style.borderRadius = Math.floor(this.params.width / 2) + "px", this.videomask.style.height = this.video.style.height, this.videomask.style.width = this.video.style.width));
                    this.params.width * this.params.ratio * 1.6 > c && (this.params.width = c / (1.4 * this.params.ratio), this.video.style.height = this.params.width * this.params.ratio, this.video.style.width = this.params.width, "selfie" == this.params.mode && (this.videomask.style.borderRadius = Math.floor(this.params.width /
                        2) + "px", this.videomask.style.height = this.video.style.height, this.videomask.style.width = this.video.style.width), document.body.appendChild(this.popup))
                }
            };
            f.prototype.switchCamera = function() {
                var c = this;
                if (this.allIds)
                    if ("" != this.allIds[0].label) {
                        var a = this.allIds.length;
                        if (this.userMedia) try {
                            this.stream.getTracks().forEach(function(e) {
                                e.stop()
                            }), this.video.pause(), this.video.src = "", this.video.srcObject = ""
                        } catch (e) {}
                        var d = 0;
                        this.allIds.forEach(function(e, g) {
                            c.deviceId == e.deviceId && (d = g + 1 >= a ? 0 : g + 1, "" !=
                                c.allIds[d].label && -1 === c.allIds[d].label.toLowerCase().indexOf("back") ? (c.globals.flip_horiz = !0, c.cameraholder.style.transform = "scaleX(-1)") : (c.globals.flip_horiz = !1, c.cameraholder.style.transform = ""), 0 == c.starting && c.getStream(c.allIds[d].deviceId))
                        })
                    } else navigator.mediaDevices.enumerateDevices().then(function(e) {
                        return e.filter(function(g) {
                            return "videoinput" == g.kind
                        })
                    }).then(function(e) {
                        c.allIds = e;
                        c.switchCamera()
                    });
                else return this.dispatch("error", "HypervergeSDK.js Error: 011 Failed to get DeviceIDS")
            };
            f.prototype.startRecording = function() {
                var c = this,
                    a = {
                        mimeType: "video/webm"
                    },
                    d = this.stream;
                this.recordedBlobs = [];
                try {
                    mediaRecorder = new MediaRecorder(d, a)
                } catch (e) {
                    try {
                        a = {
                            mimeType: "video/webm,codecs=vp9"
                        }, mediaRecorder = new MediaRecorder(d, a)
                    } catch (g) {
                        try {
                            mediaRecorder = new MediaRecorder(d, "video/vp8")
                        } catch (k) {
                            try {
                                mediaRecorder = new MediaRecorder(d, "video/webm,codecs=h264")
                            } catch (l) {
                                return this.dispatch("error", "HypervergeSDK.js Error: 012 Exception while creating MediaRecorder:")
                            }
                        }
                    }
                }
                mediaRecorder.onstop =
                    function(e) {
                        c.freeze();
                        clearInterval(c.timerFunc);
                        c.videotimer.innerHTML = "";
                        c.videorecimg.src = c.globals.recordImg;
                        c.videorecordbtn.addEventListener("click", c.stopRecordingFunc, !1)
                    };
                mediaRecorder.ondataavailable = function(e) {
                    e.data && 0 < e.data.size && c.recordedBlobs.push(e.data)
                };
                mediaRecorder.start(100);
                this.mediaRecorder = mediaRecorder;
                setTimeout(function() {
                    c.stopRecording()
                }, this.params.videoLength);
                this.timeleft = this.params.videoLength;
                this.videotimer.innerHTML = this.timeleft / 1E3;
                this.videorecimg.src =
                    this.globals.blankImg;
                this.videorecordbtn.removeEventListener("click", this.stopRecordingFunc, !1);
                this.timerFunc = setInterval(function() {
                    c.timeleft -= 1E3;
                    c.videotimer.innerHTML = c.timeleft / 1E3
                }, 1E3)
            };
            f.prototype.stopRecording = function() {
                this.mediaRecorder.stop()
            };
            f.prototype.getObjectFitSize = function(c, a, d, e, g) {
                var k = e / g,
                    l = a / d;
                (c ? k > l : k < l) ? (c = a, l = c / k, e = g / l) : (l = d, c = l * k, e /= c);
                return {
                    width: c,
                    height: l,
                    x: (c - a) * e / 2,
                    y: (l - d) * e / 2,
                    ratio: e
                }
            };
            f.prototype.unpack_cascade = function(c) {
                var a = new DataView(new ArrayBuffer(4)),
                    d = 8;
                a.setUint8(0, c[d + 0]);
                a.setUint8(1, c[d + 1]);
                a.setUint8(2, c[d + 2]);
                a.setUint8(3, c[d + 3]);
                var e = a.getInt32(0, !0);
                d += 4;
                a.setUint8(0, c[d + 0]);
                a.setUint8(1, c[d + 1]);
                a.setUint8(2, c[d + 2]);
                a.setUint8(3, c[d + 3]);
                var g = a.getInt32(0, !0);
                d += 4;
                for (var k = [], l = [], n = [], m = 0; m < g; ++m) {
                    Array.prototype.push.apply(k, [0, 0, 0, 0]);
                    Array.prototype.push.apply(k, c.slice(d, d + 4 * Math.pow(2, e) - 4));
                    d = d + 4 * Math.pow(2, e) - 4;
                    for (var q = 0; q < Math.pow(2, e); ++q) a.setUint8(0, c[d + 0]), a.setUint8(1, c[d + 1]), a.setUint8(2, c[d + 2]), a.setUint8(3, c[d + 3]),
                        l.push(a.getFloat32(0, !0)), d += 4;
                    a.setUint8(0, c[d + 0]);
                    a.setUint8(1, c[d + 1]);
                    a.setUint8(2, c[d + 2]);
                    a.setUint8(3, c[d + 3]);
                    n.push(a.getFloat32(0, !0));
                    d += 4
                }
                var r = new Int8Array(k),
                    p = new Float32Array(l),
                    t = new Float32Array(n);
                return function(u, v, w, y, z) {
                    u *= 256;
                    v *= 256;
                    for (var x = 0, A = 0, D = Math.pow(2, e) >> 0, C = 0; C < g; ++C) {
                        idx = 1;
                        for (var B = 0; B < e; ++B) idx = 2 * idx + (y[(u + r[x + 4 * idx + 0] * w >> 8) * z + (v + r[x + 4 * idx + 1] * w >> 8)] <= y[(u + r[x + 4 * idx + 2] * w >> 8) * z + (v + r[x + 4 * idx + 3] * w >> 8)]);
                        A += p[D * C + idx - D];
                        if (A <= t[C]) return -1;
                        x += 4 * D
                    }
                    return A - t[g - 1]
                }
            };
            f.prototype.run_cascade = function(c, a, d) {
                var e = c.pixels,
                    g = c.nrows,
                    k = c.ncols;
                c = c.ldim;
                var l = d.shiftfactor,
                    n = d.maxsize,
                    m = d.scalefactor;
                d = d.minsize;
                for (var q = []; d <= n;) {
                    for (var r = Math.max(l * d, 1) >> 0, p = d / 2 + 1 >> 0, t = p; t <= g - p; t += r)
                        for (var u = p; u <= k - p; u += r) {
                            var v = a(t, u, d, e, c);
                            0 < v && q.push([t, u, d, v])
                        }
                    d *= m
                }
                return q
            };
            f.prototype.cluster_detections = function(c, a) {
                function d(t, u) {
                    var v = t[0],
                        w = t[1],
                        y = t[2],
                        z = u[0],
                        x = u[1],
                        A = u[2];
                    v = Math.max(0, Math.min(v + y / 2, z + A / 2) - Math.max(v - y / 2, z - A / 2));
                    w = Math.max(0, Math.min(w + y / 2, x + A / 2) -
                        Math.max(w - y / 2, x - A / 2));
                    return v * w / (y * y + A * A - v * w)
                }
                c = c.sort(function(t, u) {
                    return u[3] - t[3]
                });
                for (var e = Array(c.length).fill(0), g = [], k = 0; k < c.length; ++k)
                    if (0 == e[k]) {
                        for (var l = 0, n = 0, m = 0, q = 0, r = 0, p = k; p < c.length; ++p) d(c[k], c[p]) > a && (e[p] = 1, l += c[p][0], n += c[p][1], m += c[p][2], q += c[p][3], r += 1);
                        g.push([l / r, n / r, m / r, q])
                    } return g
            };
            f.prototype.instantiate_detection_memory = function(c) {
                for (var a = 0, d = [], e = 0; e < c; ++e) d.push([]);
                return function(g) {
                    d[a] = g;
                    a = (a + 1) % d.length;
                    g = [];
                    for (i = 0; i < d.length; ++i) g = g.concat(d[i]);
                    return g
                }
            };
            f.prototype.detectFace = function() {
                self = this;
                var c = this.instantiate_detection_memory(15),
                    a = function(d, e, g, k, l) {
                        return -1
                    };
                fetch("https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder").then(function(d) {
                    d.arrayBuffer().then(function(e) {
                        e = new Int8Array(e);
                        a = self.unpack_cascade(e);
                        var g = self.video;
                        e = document.createElement("canvas");
                        e.width = parseInt(g.style.width);
                        e.height = parseInt(g.style.height);
                        var k = e.getContext("2d");
                        self.detectinterval =
                            setInterval(function() {
                                g = self.video;
                                var l = parseInt(g.style.width),
                                    n = parseInt(g.style.height),
                                    m = self.getObjectFitSize(!1, l, n, parseInt(g.videoWidth), parseInt(g.videoHeight));
                                k.drawImage(g, m.x, m.y, l * m.ratio, n * m.ratio, 0, 0, l, n);
                                m = k.getImageData(0, 0, l, n).data;
                                for (var q = new Uint8Array(n * l), r = 0; r < n; ++r)
                                    for (var p = 0; p < l; ++p) q[r * l + p] = (2 * m[4 * r * l + 4 * p] + 7 * m[4 * r * l + 4 * p + 1] + 1 * m[4 * r * l + 4 * p + 2]) / 10;
                                image = {
                                    pixels: q,
                                    nrows: n,
                                    ncols: l,
                                    ldim: l
                                };
                                params = {
                                    shiftfactor: .1,
                                    minsize: Math.round(.25 * l),
                                    maxsize: Math.round(.6 * l),
                                    scalefactor: 1.1
                                };
                                self.globals.isSetdocCaptureReviewBottomDescription || (self.divcapturelabelbottom.innerHTML = self.params.faceNotDetectedDescription);
                                dets = self.run_cascade(image, a, params);
                                dets = c(dets);
                                dets = self.cluster_detections(dets, .2);
                                n = [];
                                for (i = 0; i < dets.length; ++i)
                                    if (!(5 > dets[i][3] || dets[i][2] < Math.round(.35 * l)))
                                        if (dets[i][2] > Math.round(.5 * l)) self.globals.isSetdocCaptureReviewBottomDescription || (self.divcapturelabelbottom.innerHTML = self.params.faceTooBigDescription);
                                        else if (0 === n.length) n.push(dets[i][1]);
                                else if (m =
                                    dets[i][1], !(.2 >= parseFloat(Math.abs(1 - n[n.length - 1] / m).toFixed(2)))) {
                                    n.push(m);
                                    break
                                }
                                1 == n.length ? self.consecutiveDetections >= self.globals.detectionThreshold ? (self.videomask.style.borderColor = "green", "video" === self.params.capture ? self.videorecordbtn.style.display = "" : (self.capturebtn.style.display = "", self.captureDisabledbtn.style.display = "none"), self.globals.isSetdocCaptureReviewBottomDescription || (self.divcapturelabelbottom.innerHTML = self.params.faceDetectedDescription)) : self.consecutiveDetections++ :
                                    0 == self.consecutiveDetections ? (self.videomask.style.borderColor = "red", "video" === self.params.capture ? self.videorecordbtn.style.display = "none" : (self.capturebtn.style.display = "none", self.captureDisabledbtn.style.display = "")) : self.consecutiveDetections--;
                                self.preview_active && ("video" === self.params.capture ? self.videorecordbtn.style.display = "none" : (self.capturebtn.style.display = "none", self.captureDisabledbtn.style.display = "none"))
                            }, 16)
                    })
                })
            };
            f.prototype.sentryInit = function() {
                Sentry.init({
                    dsn: "https://5a7d05dd490e4a86920a890c92282957@o450637.ingest.sentry.io/5435291",
                    release: "hyperverge-web-sdk@2.0.0",
                    integrations: [new Sentry.Integrations.BrowserTracing],
                    tracesSampleRate: 1
                });
                this.globals.sentryLoaded = 1
            };
            "function" === typeof define && define.amd ? define(function() {
                return f
            }) : "object" === typeof module && module.exports ? module.exports = f : b.Hyperverge = f
        })(window);
        var hyperSnapSDKInit = function(b) {
            var f = this;
            this.hyperverge = new Hyperverge(b.params);
            this.hyperverge.makepopup();
            window.onresize = function() {
                f.hyperverge.resizePopup()
            };
            return this.hyperverge
        };    
                                           
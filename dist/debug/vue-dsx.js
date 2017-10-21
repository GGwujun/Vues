/*!
 * vue-dsx v1.0.0
 * (c) 2017-2017 dsx
 * Released under the ISC License.
 * https://github.com/GGwujun/mdn#readme
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Vues = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Observer = function () {
    function Observer(data) {
        classCallCheck(this, Observer);

        this.data = data;
        this.walk(data);
    }

    createClass(Observer, [{
        key: 'walk',
        value: function walk(data) {
            var me = this;
            Object.keys(data).forEach(function (key) {
                me.convert(key, data[key]);
            });
        }
    }, {
        key: 'convert',
        value: function convert(key, val) {
            this.defineReactive(this.data, key, val);
        }
    }, {
        key: 'defineReactive',
        value: function defineReactive(data, key, val) {
            var dep = new Dep();
            var childObj = observe(val);

            Object.defineProperty(data, key, {
                enumerable: true, // 可枚举
                configurable: false, // 不能再define
                get: function get$$1() {
                    if (Dep.target) {
                        dep.depend();
                    }
                    return val;
                },
                set: function set$$1(newVal) {
                    if (newVal === val) {
                        return;
                    }
                    val = newVal;
                    // 新的值是object的话，进行监听
                    childObj = observe(newVal);
                    // 通知订阅者
                    dep.notify();
                }
            });
        }
    }]);
    return Observer;
}();

function observe(value, vm) {
    if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
        return;
    }
    return new Observer(value);
}

var uid$1 = 0;

var Dep = function () {
    function Dep() {
        classCallCheck(this, Dep);

        this.id = uid$1++;
        this.subs = [];
    }

    createClass(Dep, [{
        key: 'addSub',
        value: function addSub(sub) {
            this.subs.push(sub);
        }
    }, {
        key: 'depend',
        value: function depend() {
            Dep.target.addDep(this);
        }
    }, {
        key: 'removeSub',
        value: function removeSub(sub) {
            var index = this.subs.indexOf(sub);
            if (index != -1) {
                this.subs.splice(index, 1);
            }
        }
    }, {
        key: 'notify',
        value: function notify() {
            this.subs.forEach(function (sub) {
                sub.update();
            });
        }
    }]);
    return Dep;
}();

Dep.target = null;

function _proxyData(vm, key, setter, getter) {
    var me = vm;
    Object.defineProperty(me, key, {
        configurable: false,
        enumerable: true,
        get: function proxyGetter() {
            return me._data[key];
        },
        set: function proxySetter(newVal) {
            me._data[key] = newVal;
        }
    });
}

function _initComputed(vm) {
    var me = vm;
    var computed = me.$options.computed;
    if ((typeof computed === 'undefined' ? 'undefined' : _typeof(computed)) === 'object') {
        Object.keys(computed).forEach(function (key) {
            Object.defineProperty(me, key, {
                get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                set: function set$$1() {}
            });
        });
    }
}

function initState(vm) {
    var $opt = vm.$options;
    var $data = $opt.data;

    Object.keys($data).forEach(function (key) {
        _proxyData(vm, key);
    });

    _initComputed(vm);

    if ($data) {
        observe($data, vm);
    } else {
        observe(vm._data = {}, true /* asRootData */);
    }
}

var Watcher = function () {
    function Watcher(vm, expOrFn, cb) {
        classCallCheck(this, Watcher);

        this.cb = cb;
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.depIds = {};

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = this.parseGetter(expOrFn);
        }

        this.value = this.get();
    }

    createClass(Watcher, [{
        key: 'update',
        value: function update() {
            this.run();
        }
    }, {
        key: 'run',
        value: function run() {
            var value = this.get();
            var oldVal = this.value;
            if (value !== oldVal) {
                this.value = value;
                this.cb.call(this.vm, value, oldVal);
            }
        }
    }, {
        key: 'addDep',
        value: function addDep(dep) {
            // 1. 每次调用run()的时候会触发相应属性的getter
            // getter里面会触发dep.depend()，继而触发这里的addDep
            // 2. 假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性，仅仅是改变了其值而已
            // 则不需要将当前watcher添加到该属性的dep里
            // 3. 假如相应属性是新的属性，则将当前watcher添加到新属性的dep里
            // 如通过 vm.child = {name: 'a'} 改变了 child.name 的值，child.name 就是个新属性
            // 则需要将当前watcher(child.name)加入到新的 child.name 的dep里
            // 因为此时 child.name 是个新值，之前的 setter、dep 都已经失效，如果不把 watcher 加入到新的 child.name 的dep中
            // 通过 child.name = xxx 赋值的时候，对应的 watcher 就收不到通知，等于失效了
            // 4. 每个子属性的watcher在添加到子属性的dep的同时，也会添加到父属性的dep
            // 监听子属性的同时监听父属性的变更，这样，父属性改变时，子属性的watcher也能收到通知进行update
            // 这一步是在 this.get() --> this.getVMVal() 里面完成，forEach时会从父级开始取值，间接调用了它的getter
            // 触发了addDep(), 在整个forEach过程，当前wacher都会加入到每个父级过程属性的dep
            // 例如：当前watcher的是'child.child.name', 那么child, child.child, child.child.name这三个属性的dep都会加入当前watcher
            if (!this.depIds.hasOwnProperty(dep.id)) {
                dep.addSub(this);
                this.depIds[dep.id] = dep;
            }
        }
    }, {
        key: 'get',
        value: function get$$1() {
            Dep.target = this;
            var value = this.getter.call(this.vm, this.vm);
            Dep.target = null;
            return value;
        }
    }, {
        key: 'parseGetter',
        value: function parseGetter(exp) {
            if (/[^\w.$]/.test(exp)) return;

            var exps = exp.split('.');

            return function (obj) {
                for (var i = 0, len = exps.length; i < len; i++) {
                    if (!obj) return;
                    obj = obj[exps[i]];
                }
                return obj;
            };
        }
    }]);
    return Watcher;
}();

var updater = {
    textUpdater: function textUpdater(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater: function htmlUpdater(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater: function classUpdater(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },

    modelUpdater: function modelUpdater(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};

// 指令处理集合
var compileUtil = {
    text: function text(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },

    html: function html(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    model: function model(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function (e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    class: function _class(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    bind: function bind(node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater'];

        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        new Watcher(vm, exp, function (value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    // 事件处理
    eventHandler: function eventHandler(node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    _getVMVal: function _getVMVal(vm, exp) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function (k) {
            val = val[k];
        });
        return val;
    },

    _setVMVal: function _setVMVal(vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function (k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};

var Compile = function () {
    function Compile(el, vm) {
        classCallCheck(this, Compile);

        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.init();
            this.$el.appendChild(this.$fragment);
        }
    }

    createClass(Compile, [{
        key: 'node2Fragment',
        value: function node2Fragment(el) {
            var fragment = document.createDocumentFragment(),
                child;

            // 将原生节点拷贝到fragment
            while (child = el.firstChild) {
                fragment.appendChild(child);
            }

            return fragment;
        }
    }, {
        key: 'init',
        value: function init() {
            this.compileElement(this.$fragment);
        }
    }, {
        key: 'compileElement',
        value: function compileElement(el) {
            var childNodes = el.childNodes,
                me = this;

            [].slice.call(childNodes).forEach(function (node) {
                var text = node.textContent;
                var reg = /\{\{(.*)\}\}/;

                if (me.isElementNode(node)) {
                    me.compile(node);
                } else if (me.isTextNode(node) && reg.test(text)) {
                    me.compileText(node, RegExp.$1);
                }

                if (node.childNodes && node.childNodes.length) {
                    me.compileElement(node);
                }
            });
        }
    }, {
        key: 'compile',
        value: function compile(node) {
            var nodeAttrs = node.attributes,
                me = this;

            [].slice.call(nodeAttrs).forEach(function (attr) {
                var attrName = attr.name;
                if (me.isDirective(attrName)) {
                    var exp = attr.value;
                    var dir = attrName.substring(2);
                    // 事件指令
                    if (me.isEventDirective(dir)) {
                        compileUtil.eventHandler(node, me.$vm, exp, dir);
                        // 普通指令
                    } else {
                        compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                    }

                    node.removeAttribute(attrName);
                }
            });
        }
    }, {
        key: 'compileText',
        value: function compileText(node, exp) {
            compileUtil.text(node, this.$vm, exp);
        }
    }, {
        key: 'isDirective',
        value: function isDirective(attr) {
            return attr.indexOf('v-') == 0;
        }
    }, {
        key: 'isEventDirective',
        value: function isEventDirective(dir) {
            return dir.indexOf('on') === 0;
        }
    }, {
        key: 'isElementNode',
        value: function isElementNode(node) {
            return node.nodeType == 1;
        }
    }, {
        key: 'isTextNode',
        value: function isTextNode(node) {
            return node.nodeType == 3;
        }
    }]);
    return Compile;
}();

var uid = 0;

function initMixin(Vues) {
    Object.assign(Vues.prototype, {
        _init: function _init(options) {
            var vm = this;
            vm._uid = uid++;
            vm._isMVVM = true;
            vm.$options = options || {};
            vm._data = this.$options.data;
            initState(vm);
            this.$compile = new Compile(this.$options.el || document.body, this);
        }
    });
}

// import { lifecycleMixin } from './lifecycle'
var Vues$1 = function () {
  function Vues(options) {
    classCallCheck(this, Vues);

    this._init(options);
  }

  createClass(Vues, [{
    key: '$watch',
    value: function $watch(key, cb, options) {
      new Watcher(this, key, cb);
    }
  }]);
  return Vues;
}();

initMixin(Vues$1);

Vues$1.version = '0.0.1';

return Vues$1;

})));

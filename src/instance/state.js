import { observe } from '../observe/index'

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
};

function _initComputed(vm) {
    var me = vm;
    var computed = me.$options.computed;
    if (typeof computed === 'object') {
        Object.keys(computed).forEach(function (key) {
            Object.defineProperty(me, key, {
                get: typeof computed[key] === 'function' ?
                    computed[key] : computed[key].get,
                set: function () { }
            });
        });
    }
}


/**
 * 
 * @param {*object} vm  Vues实例对象 
 */
export function initState(vm) {
    const $data = vm.$options.data;
    const computed = vm.$options.computed;
    //将vm.data.dsx代理为vm.dsx
    Object.keys($data).forEach(function (key) {
        _proxyData(vm, key);
    });
    if (computed)
        _initComputed(vm);

    if ($data) {
        observe($data, vm);
    } else {
        observe(vm._data = {}, true /* asRootData */);
    }
}
import { initState } from './state'
import Compile from '../compiler/index'


export function initMixin(Vues) {
    Object.assign(Vues.prototype, {
        _init(options) {
            this.$options = options || {};
            this._data = this.$options.data;
            initState(this);
            this.$compile = new Compile(this.$options.el || document.body, this)
        }
    });
}
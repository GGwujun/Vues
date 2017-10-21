import { initMixin } from './init'
import { warn } from '../utils/debug'


class Vues {
  constructor(options) {
    if (!(this instanceof Vues)) {
      warn('Vues is a constructor and should be called with the `new` keyword')
    }
    this._init(options)
  }
}

initMixin(Vues)
export default Vues

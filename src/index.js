export default function Ioku () {
  if (!(this instanceof Ioku)) {
    return new Ioku()
  }
  this.catch = function (props, children, key) {
    throw new Error(`Attempted to render unknown component ${key}.`)
  }
  Object.defineProperty(this, '_components', { value: {} })
  this.on = this.on.bind(this)
  this.ui = this.ui.bind(this)
  this.use = this.use.bind(this)
}

Ioku.prototype = {
  on: function (key, render) {
    if (this._components[key]) {
      throw new Error('Component ' + key + 'has already been registered.')
    }
    this._components[key] = render
  },
  ui: function (key, props, children) {
    if (typeof key !== 'string') key = key.key
    return this._components[key]
      ? this._components[key](props, children, arguments[0])
      : this.catch(props, children, arguments[0])
  },
  use: function (plugin, opts) {
    plugin({ on: this.on, ui: this.ui, use: this.use }, opts)
  }
}
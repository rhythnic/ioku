export class Ioku {
  private _components: Object
  public catch: (props: any, children: any, key: any) => any

  public constructor() {
    this._components = {}
    this.catch = (props: any, children: any, key: any): void => {
      if (typeof key !== 'string') key = key.key
      throw new Error(`Attempted to render unknown component ${key}.`)
    }
    this.on = this.on.bind(this)
    this.ui = this.ui.bind(this)
    this.use = this.use.bind(this)
  }

  public ui (key: any, props: any, children: any): any {
    if (typeof key !== 'string') key = key.key
    return key in this._components
      ? this._components[key](props, children, arguments[0])
      : this.catch(props, children, arguments[0])
  }

  public on (key: string, render: (props: any, children: any, key: any) => any): void {
    if (key in this._components) {
      throw new Error(`Component ${key} has already been registered`)
    }
    this._components[key] = render
  }

  public use (plugin: (iokuInstance: any, options: Object) => void, options: Object): void {
    plugin(this, options)
  }
}
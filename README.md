# Ioku
A small library for decoupling view components.

## The problem

In component-based frontend architectures, components import other components and use
them in the render function. This is problematic for a few reasons.  It creates a tight
coupling between your app's domain-specific (custom) components and your UI library.
If you want to change your UI library, you need to rewrite all of your components.
UI library component names can be long, causing your render functions to be cluttered
with long component names. If you want to use a button, you shouldn't have to use the
lengthy component name for a button. You should be able to simply write "button" or
"modal". In addition to writing lengthy component names, a lot of time can be spent
writing imports for the components.

## The solution

The solution to these problems is to decouple UI components with a layer of
indirection. UI components can tell Ioku what they want, and it's Ioku's
job to resolve the request.

## About Ioku

The initial release of Ioku is at version 0 because I have no idea how this is going to go.
I wouldn't even consider it a release, it's just a starting point.
I expect the API will change a lot as new use cases become apparent. Ioku is compatible
with any framework who's render function matches the shape of React's createElement method.
This includes React, Vue, Mithril, and others. Ioku is currently very small, so a fork would
be easy, if you want better support for another framework.  As Ioku ages, it will become
clearer how to support more component frameworks.

## Example usage in React

**Make Plugin**
```
import { createElement } from 'react'
import Button from '@material-ui/core/Button'

const h = component => (...args) => createElement(component, ...args)

export default function UiLibrary (ioku, options) {
  ioku.on('button', h(Button))
}
```

**Setup Ioku**
```
import Ioku from 'ioku'
import UiLibrary from './ui-library'
import { createElement } from 'react'

const ioku = Ioku()
ioku.use(UiLibrary)

// All usages of ioku.ui that haven't been registered end up in "catch"
// It's useful for rendering things like 'div' or 'p'
// If not set, catch will throw an error
ioku.catch = createElement

export default ioku
```

**Use Ioku**
```
import ioku from './ioku'
const { ui } = ioku

export default function MyComponent (props) {
  return ui(
    'div',
    ui('button', { onClick: props.doSomething }, 'Click here!')
  )
}
```

## No JSX support

Ioku doesn't have JSX support (yet). If people start to use Ioku, hopefully support for JSX will follow.

## Docs

### Ioku.on
Ioku keeps a dictionary (JS object) of keys and render functions.
Registering a component is very similar to how you would register an event callback.

```
ioku.on(key: string, renderFunction: (props: any, children: any, opts: any) => any): void

// example
ioku.on('button', (props, children, options) => {
  // options might be a string or an object
  // the "key" property of a string is undefined, so this works
  switch(options.key) {
    case 'fab': return createElement(FabButton, props, children)
    default: return createElement(Button, props, children)
  }
}
```

### Ioku.ui
To use a registered component, use the "ui" method.  You can pass the key as a string.
You can also pass a config object as the key, but it must have a "key" property.

```
ioku.ui(key: any, props: any, children: any): any

// example
ioku.ui('button', { onClick: clickHandler }, 'Click Here!')
ioku.ui({ key: 'button', type: 'fab' }, { onClick: clickHandler }, 'Click Here!')
```

### Ioku.use (Plugins)
A plugin is a function that receives an Ioku instance and options passed by the user.

```
function MyPlugin (ioku: Object, opts: any): void {}

// use plugin
ioku.use(MyPlugin)
ioku.use(MyPlugin, { theme: { primary: 'blue' } })
```

## Credits

Ioku was inspired by [Seneca.js](http://senecajs.org/).
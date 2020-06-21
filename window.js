// window custom element module

let display = null
let X = null

const innerStyle = `
#container {
  width: 100%;
  height: 100%;
}
`
const outerStyle = `
x-window {
  display: block;
  flex-grow: 0;
  margin: 20px;
  transition: all 100ms linear;
}
x-window[wid] {
  flex-grow: 1;
}
`

class Window extends HTMLElement {
  #shadow = null
  #container = null
  #wid = null
  #resizeObserver = null
  #inTransition = false

  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    const container = document.createElement('div')
    const styleElement = document.createElement('style')
    styleElement.textContent = innerStyle
    container.id = 'container'
    shadow.appendChild(container)
    shadow.appendChild(styleElement)
    this.#shadow = shadow
    this.#container = container
    this.#resizeObserver = new ResizeObserver(() => this.sync())
    this.#resizeObserver.observe(this)
    this.addEventListener('transitionend', () => {
      if(!this.#wid) this.remove()
    })
    //this.addEventListener('transitionstart', () => {
    //})
  }
  sync() {
    if(!this.isConnected || this.#wid == null) return
    let {x,y,width,height} = this.getBoundingClientRect()
    width = Math.max(1, width)
    height = Math.max(1, height)
    X.ConfigureWindow(this.#wid, {x, y, width, height})
    X.MapWindow(this.#wid)
  }
  connectedCallback() {
    this.sync()
  }
  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'wid':
        this.#wid = newValue
        this.sync()
        break
      case 'focused':
        if(newValue == false) break
        X.SetInputFocus(this.#wid, 1)
        break
    }
  }
  static get observedAttributes() { return ['wid', 'focused'] }
}

module.exports.init = disp => { 
  display = disp
  X = display.client
  window.customElements.define('x-window', Window)
  const defaultStyle = document.createElement('style')
  defaultStyle.textContent = outerStyle
  document.body.appendChild(defaultStyle)
}

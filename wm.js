const electron = require('electron')
const X11 = require('./X11.js')
const child_process = require('child_process')
const xwindow = require('./window.js')

const wm = {
  browserWindow: null,
  windows: {},
}
const stats = { numEvents: 0 }

function mapWindow(wid) {
  if(wid in wm.windows) return
  const eventMask = X.eventMask.EnterWindow | X.eventMask.KeyPress
  X.ChangeWindowAttributes(wid, {eventMask})
  const elem = document.createElement('x-window')
  wm.windows[wid] = elem
  document.body.appendChild(elem)
  requestAnimationFrame(() => { elem.setAttribute('wid', wid) })
}

function unmapWindow(wid) {
  if(!(wid in wm.windows)) return
  wm.windows[wid].removeAttribute('wid')
}

function setFocus(wid) {
  wm.windows[wid].setAttribute('focused', true)
}

function launchTerminal() {
  child_process.spawn('urxvt')
}

window.addEventListener('load', async () => {
  const browserWindow = electron.remote.getCurrentWindow()
  wm.browserWindow = browserWindow.getNativeWindowHandle().readUInt32LE()
  window.display = await X11.createClient()
  window.X = display.client
  const root = display.screen[0].root
  const rootWindow = await X.QueryTree(root)
  X.ResizeWindow(wm.browserWindow, display.screen[0].pixel_width, display.screen[0].pixel_height)
  X.ChangeWindowAttributes(wm.browserWindow, {eventMask: X.eventMask.KeyPress})
  child_process.spawn('xrdb', [`${process.env.HOME}/.Xresources`])
  xwindow.init(display)

  // Initialise windows
  await Promise.all(rootWindow.children.map(async x => {
    if(x == wm.browserWindow) return
    const attrs = await X.GetWindowAttributes(x)
    if(attrs.mapState != 2) return
    mapWindow(x)
  }))

  // Key bindings
  window.addEventListener('keydown', ev => {
    switch(ev.key) {
    case 'F1':
      browserWindow.toggleDevTools()
      break
    case 'Escape':
      if(ev.ctrlKey) launchTerminal()
      break
    }
  })

  // Event handlers
  const eventMask = X.eventMask.SubstructureRedirect
                  | X.eventMask.SubstructureNotify
                  | X.eventMask.Exposure
                  | X.eventMask.KeyPress
  X.ChangeWindowAttributes(root, { eventMask })
  X.on('event', ev => {
    stats.numEvents += 1
    switch(ev.name) {
      case 'MapRequest':
        mapWindow(ev.wid)
        break
      case 'UnmapNotify':
        unmapWindow(ev.wid)
        break
      case 'EnterNotify':
        setFocus(ev.wid)
        break
      default:
        console.log(ev)
    }
  })
})

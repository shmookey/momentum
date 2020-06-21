const electron = require('electron')
const X = require('./X11.js')

electron.app.whenReady().then(async () => {
  const display = await X.createClient()
  const win = new electron.BrowserWindow({
    fullscreen: true,
    width: display.screen[0].pixel_width,
    height: display.screen[0].pixel_height,
    skipTaskbar: true,
    title: 'momentum',
    frame: false,
    acceptFirstMouse: true,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      backgroundThrottling: false,
      enableRemoteModule: true,
    }
  })
  win.loadFile('index.html')
})


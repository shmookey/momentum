const x11 = require('x11')

function promisify(f, self) {
  return (...args) => new Promise((resolve, reject) => {
    f.call(self, ...args, (err, val) => err ? reject(err) : resolve(val))
  })
}

async function createClient(opts) {
  const display = await promisify(x11.createClient, this)(opts)
  const X = display.client
  X.GetGeometry = promisify(X.GetGeometry, X)
  X.GetWindowAttributes = promisify(X.GetWindowAttributes, X)
  X.QueryTree = promisify(X.QueryTree, X)
  X.ResizeWindow = promisify(X.ResizeWindow, X)
  //X.ChangeWindowAttributes = promisify(X.ChangeWindowAttributes, X)
  return display
}

module.exports = {...x11, createClient}


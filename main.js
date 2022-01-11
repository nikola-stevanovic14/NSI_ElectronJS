const { app, BrowserWindow } = require('electron')
const path = require('path')
const {initConnectionPool, getTestData} = require('./dbService')

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      },
      nodeIntegration: true
    })
  
    win.loadFile('views/index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

initConnectionPool()
getTestData()
.then((data) => {
  data.forEach(element => {
    console.log(element);
    console.log('aaa');
  });
})
.catch((err) => {
  console.error(err);
})


 
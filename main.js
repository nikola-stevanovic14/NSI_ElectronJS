const { app, BrowserWindow, ipcMain, Tray } = require('electron')
const path = require('path')
const {initConnectionPool, getTestData, login} = require('./dbService')
const {seedUsers} = require('./seeders')

let loginWin
let mainWindow
let tray

const createLoginWindow = () => {
    loginWin = new BrowserWindow({
      width: 800,
      height: 700,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    loginWin.loadFile('views/login.html')
    //loginWin.webContents.openDevTools()
}

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('views/index.html')
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createLoginWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
      })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

initConnectionPool()

//seedUsers();

ipcMain.on('login-event', (event, arg) => {
  let user = {};
  user.username = arg.username;
  user.password = arg.password;
  login(user)
  .then((userData) => {
    if (userData){
      createMainWindow()
      tray = new Tray('./resources/images/chess.png')
      tray.setToolTip('Chess app')
      tray.displayBalloon({title: '', content: 'Successful login!'})
      tray.on('click', () =>{
        if(mainWindow){
          mainWindow.isVisible()?mainWindow.hide():mainWindow.show()
        }
      })
      setTimeout(() => {tray.removeBalloon()},5000);
      loginWin.close()
    }
    else{
      event.returnValue = false;
    }
  })
  .catch((err) => {
    console.error(err);
  })
})
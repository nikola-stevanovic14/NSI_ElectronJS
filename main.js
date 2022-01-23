const { app, BrowserWindow, ipcMain , Tray, Notification, Menu  } = require('electron')
const path = require('path')
const {initConnectionPool, getTestData, login, getTournamentTypes, addNewTournament} = require('./dbService')
const {seedUsers} = require('./seeders')
const {getTournaments, getRankings} = require('./dbService')

let loginWin
let mainWindow
let tray
let screenWidth, screenHeight

app.setName('Chess app')

const createLoginWindow = () => {
    loginWin = new BrowserWindow({
      width: 800,
      height: 700,
      icon: './resources/images/chess.png',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    loginWin.loadFile('views/login.html')
    //loginWin.webContents.openDevTools()
    setEmptyAppMenu()
}

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: Math.round(0.85 * screenWidth),
    height: Math.round(0.85 * screenHeight),
    icon: './resources/images/chess.png',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('views/index.html')
  mainWindow.webContents.openDevTools()
  setAppMenu()
}

app.whenReady().then(() => {
  const { screen } = require('electron')
  const primaryDisplay = screen.getPrimaryDisplay()
  screenWidth = primaryDisplay.workAreaSize.width
  screenHeight = primaryDisplay.workAreaSize.height
  createLoginWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
      })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if(tray) tray.destroy()
    app.quit()
  }
})

initConnectionPool()

//seedUsers();

function setEmptyAppMenu(){
  const menu = Menu.buildFromTemplate([])
  Menu.setApplicationMenu(menu)
}

function setAppMenu(){
  const template = [
    {
      label: app.name,
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Home page',
      click: async () => {
        mainWindow.loadFile('views/index.html')
      }
    },
    {
      label: 'Add tournament',
      click: async () => {
        mainWindow.loadFile('views/addTournament.html')
      }
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

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

ipcMain.on('addTournamentToDB-event', (event, arg) => {
  addNewTournament(arg)
  .then((success) => {
    if (success){
      const notf = new Notification({
        title: 'Notification',
        body: 'Tournament created!'
      })
      notf.show()
      setTimeout(() => {notf.close()},4000);
      event.returnValue = true;
    }
    else{
      event.returnValue = false;
    }
  })
  .catch((err) => {
    console.error(err);
  })
})

ipcMain.on('getTournamentTypes-event', (event, arg) => {
  getTournamentTypes()
  .then((tournamentTypes) => {
    if (tournamentTypes){
      let select2ModelTypes = tournamentTypes.map(x => {
        let model = {};
        model.id = x.Id;
        model.text = x.PairingSystem
        return model;
      });
      event.returnValue = select2ModelTypes;
    }
    else{
      event.returnValue = null;
    }
  })
  .catch((err) => {
    console.error(err);
  })
})
ipcMain.on('get-tournaments', (event, arg) => {
  getTournaments()
  .then((tournaments) => {
    event.returnValue = tournaments
  })
  .catch((err) => {
    console.error(err);
  })
})

ipcMain.on('get-rankings', (event, arg) => {
  const tournamentId = arg;
  getRankings(tournamentId)
  .then((rankings) => {
    mainWindow.loadFile('views/rankings.html')
    mainWindow.webContents.on('did-finish-load', () => {
      mainWindow.webContents.send('recieve-rankings', {result: rankings})
    })
  })
  .catch((err) => {
    console.error(err);
  })
})
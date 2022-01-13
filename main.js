const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const {initConnectionPool, getTestData, register, login} = require('./dbService')
const bcrypt = require('bcrypt');

const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      },
      nodeIntegration: true
    })
  
    win.loadFile('views/login.html')
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

function seedUsers() {
  let user1 = {}, user2 = {};
  user1.username = 'Nikola';
  user1.password = 'Test.123';

  user2.username = 'Lazar';
  user2.password = 'Test.123';

  bcrypt.hash(user1.password, 10, function(err, hash) {
    // Store hash in your password DB.
    user1.passwordHash = hash;
    register(user1);
  });
  bcrypt.hash(user2.password, 10, function(err, hash) {
    // Store hash in your password DB.
    user2.passwordHash = hash;
    register(user2);
  });
}

//seedUsers();

ipcMain.on('login-event', (event, arg) => {
  console.log(arg); // prints "ping"
  

  let user = {};
  user.username = arg.username;
  user.passwordHash = arg.passwordHash;
  const userData = login(user);
  
  if (userData){
    event.success = true;
    //event.returnValue = 'pong';
  }
  else{
    event.success = false;
  }
})
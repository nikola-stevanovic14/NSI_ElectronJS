const {
  contextBridge,
  ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
        // whitelist async channels
        let validChannels = ["get-rankings", 'addTournamentToDB-event', 'start-tournament'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    sendSync: (channel, data) => {
        // whitelist sync channels
        let validChannels = ["login-event", "get-tournaments", 'getTournamentTypes-event', "finish-round"];
        if (validChannels.includes(channel)) {
            return ipcRenderer.sendSync(channel, data);
        }
    },
    receive: (channel, func) => {
      let validChannels = ["recieve-rankings", "start-tournament-data", "round-data"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => {func(...args)});
      }
    }
  }
);
const { app, BrowserWindow } = require("electron");

var win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height:600,
    webPreferences: {
      nodeIntegration: true,
      // devTools: false,
    },
  })

  win.loadFile("src/index.html");
  
  win.webContents.openDevTools();
}

app.whenReady().then(()=> {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit()
// })
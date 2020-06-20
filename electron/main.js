const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const url = require('url');



const { channels } = require('../src/shared/constants');
const { setUpStreams } = require('./streams.js');
// const { autoUpdater } = require('electron-updater');
// const log = require('electron-log');
// const Store = require('electron-store');
// const store = new Store();

// autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = "info";
let mainWindow;

function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
    });
    mainWindow = new BrowserWindow({
        width: 1280, height: 720,
        webPreferences: { webviewTag: true, preload: path.join(__dirname, 'preload.js') }
    });
    !(process.env.ELECTRON_START_URL) && Menu.setApplicationMenu(null);
    mainWindow.loadURL(startUrl);
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    setUpStreams(mainWindow);
}

// app.setAppLogsPath();
app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});


// ipcMain.on("JWT_SET", (event,value)=>{
//     store.set("JWT", value);
//     log.info("JWT set to " + value);
// });

// ipcMain.on("JWT_DELETE", (event)=>{
//     store.delete("JWT");
//     log.info("JWT set to deleted");
// });

// ipcMain.on("update_start", ()=>{
//     autoUpdater.checkForUpdatesAndNotify();
//     mainWindow.webContents.send('update_starting_process');
//     log.info("starting updater");
// })

// autoUpdater.on('checking-for-update', () => {
//     // log.info("CHECKING");
//     mainWindow.webContents.send('update_checking');
// });

// autoUpdater.on('update-not-available', (info) => {
//     // log.info("NO");
//     mainWindow.webContents.send('update_not_available');
// });

// autoUpdater.on('update-available', () => {
//     // log.info("YES");
//     mainWindow.webContents.send('update_available');
// });

// autoUpdater.on('update-downloaded', () => {
//     // log.info("DOWNLAODED");
//     mainWindow.webContents.send('update_downloaded');
// });

// autoUpdater.on('error', (err) => {
//     // log.info(err);
//     mainWindow.webContents.send('update_error',err);
// });

// ipcMain.on('restart_app', () => {
//     // log.info("BYEBYE");
//     autoUpdater.quitAndInstall();
// });

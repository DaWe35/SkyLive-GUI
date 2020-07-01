const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const url = require('url');


const { channels } = require('../src/shared/constants.js');
const { setUpStreams } = require('./streams.js');
const { setUpUpdates } = require('./updates.js');
const fs = require('fs');

const HOME_DIRECTORY = path.join(app.getPath('home'), '.SkyLive');

let mainWindow;

function createWindow() {
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '../index.html'),
        protocol: 'file:',
        slashes: true,
    });
    mainWindow = new BrowserWindow({
        width: 1000, height: 570,
        webPreferences: { webviewTag: true, preload: path.join(__dirname, 'preload.js') }
    });
    !(process.env.ELECTRON_START_URL) && Menu.setApplicationMenu(null);
    mainWindow.loadURL(startUrl);
    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    setUpStreams(mainWindow);
    setUpUpdates(mainWindow);
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

ipcMain.on(channels.OPEN_BROWSER, ({ url }) => {
    shell.openExternal(url);
});

ipcMain.on(channels.USER_WORKING_DIRECTORY, (event) => {
    fs.promises.access(HOME_DIRECTORY, fs.constants.F_OK)
        .catch(() => fs.promises.mkdir(HOME_DIRECTORY))
        .finally(event.sender.send(channels.USER_WORKING_DIRECTORY, HOME_DIRECTORY));
});

ipcMain.on(channels.CLOSE_WINDOW, (event)=>{
    mainWindow.close();
})
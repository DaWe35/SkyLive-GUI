const { ipcMain, app} = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
// const Store = require('electron-store');
// const store = new Store();

const {channels} = require('./../src/shared/constants.js');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

let updateStatus = {status: 'unknown'};

function setUpUpdates(mainWindow) {
    ipcMain.on(channels.UPDATE_START, (event) => {
        autoUpdater.checkForUpdatesAndNotify();
        updateStatus.status = 'started';
        event.sender.send(channels.UPDATE_START);
        log.info("starting updater");
    })

    autoUpdater.on('checking-for-update', () => {
        // log.info("CHECKING");
        updateStatus.status = 'checking';
        mainWindow.webContents.send(channels.UPDATE_CHECKING);
    });

    autoUpdater.on('update-not-available', (info) => {
        // log.info("NO");
        updateStatus.status = 'not available';
        mainWindow.webContents.send(channels.UPDATE_NOT_AVAILABLE);
    });

    autoUpdater.on('update-available', () => {
        // log.info("YES");
        updateStatus.status = 'downloading';
        mainWindow.webContents.send(channels.UPDATE_DOWNLOADING);
    });

    autoUpdater.on('update-downloaded', () => {
        // log.info("DOWNLAODED");
        updateStatus.status = 'downloaded';
        mainWindow.webContents.send(channels.UPDATE_DOWNLOADED);
    });

    autoUpdater.on('error', (err) => {
        // log.info(err);
        updateStatus.status = 'error';
        updateStatus.error = err;
        mainWindow.webContents.send(channels.UPDATE_ERROR, err);
    });

    autoUpdater.on('download-progress', (progress, bytesPerSecond, percent, total, transferred)=>{
        updateStatus = {...updateStatus, progress, bytesPerSecond, percent, total, transferred};
        log.info(updateStatus);
    })

    ipcMain.on(channels.UPDATE_STATUS, (event) => {
        event.sender.send(updateStatus);
    })

    ipcMain.on(channels.APP_INFO, (event)=> {
        event.sender.send(channels.APP_INFO, app.getVersion());
    })

    ipcMain.on(channels.RESTART_APP, () => {
        // log.info("BYEBYE");
        autoUpdater.quitAndInstall();
    });

    

}

module.exports = {setUpUpdates};
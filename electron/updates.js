const { ipcMain, app } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
// const Store = require('electron-store');
// const store = new Store();

const { channels, updateStates } = require('./../src/shared/constants.js');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = "info";

let updateStatus = { status: 'unknown' };


function setUpUpdates(mainWindow) {

    function setUpdateStatus(newStatus) {
        updateStatus = newStatus;
        mainWindow.webContents.send(channels.UPDATE_STATUS, updateStatus);
    }

    ipcMain.on(channels.UPDATE_START, (event) => {
        autoUpdater.checkForUpdatesAndNotify();
        setUpdateStatus({ status: updateStates.STARTED });
        event.sender.send(channels.UPDATE_START);
        log.info("starting updater");
    })

    autoUpdater.on('checking-for-update', () => {
        // log.info("CHECKING");
        setUpdateStatus({ status: updateStates.CHECKING });
        mainWindow.webContents.send(channels.UPDATE_CHECKING);
    });

    autoUpdater.on('update-not-available', (info) => {
        // log.info("NO");
        setUpdateStatus({ status: updateStates.NOT_AVAILABLE });
        mainWindow.webContents.send(channels.UPDATE_NOT_AVAILABLE);
    });

    autoUpdater.on('update-available', () => {
        // log.info("YES");
        setUpdateStatus({ status: updateStates.DOWNLOADING });
        mainWindow.webContents.send(channels.UPDATE_DOWNLOADING);
    });

    autoUpdater.on('update-downloaded', () => {
        // log.info("DOWNLAODED");
        setUpdateStatus({ status: updateStates.DOWNLOADED });
        mainWindow.webContents.send(channels.UPDATE_DOWNLOADED);
    });

    autoUpdater.on('error', (err) => {
        // log.info(err);
        setUpdateStatus({ status: updateStates.ERROR });
        updateStatus.error = err;
        mainWindow.webContents.send(channels.UPDATE_ERROR, err);
    });

    autoUpdater.on('download-progress', (progress, bytesPerSecond, percent, total, transferred) => {
        setUpdateStatus({ status: updateStates.DOWNLOADING, progress, bytesPerSecond, percent, total, transferred });
        log.info(updateStatus);
    })

    ipcMain.on(channels.APP_INFO, (event) => {
        event.sender.send(channels.APP_INFO, app.getVersion());
    })

    ipcMain.on(channels.RESTART_APP, () => {
        // log.info("BYEBYE");
        autoUpdater.quitAndInstall();
    });



}

module.exports = { setUpUpdates };
const { ipcMain, app } = require("electron");
const path = require('path');
const log = require('electron-log');

let isProd = process.env.ELECTRON_START_URL ? false : true;

const { channels } = require('./../src/shared/constants.js');
const commands = require('../commands.js');
const fs = require("fs");
let streams = {};

const platformBinaries = {
    reUpload: {
        linux: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'download_upload'),
        win32: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'download_upload.exe')
    }
}
    

function setUpReUpload(mainWindow) {

    function attachIO(stream, token, key) {
        console.log("START SETUP IO")
        stream.stdout.on('data', (data) => {
            // console.log("Key:" + key + " data:" + data + " TOKEN: " + token);
            mainWindow.webContents.send(channels.STREAM_STD_OUT, { token: token, output: String(data).trim(), processKey: (key ? key : false) });
            // console.log(`stdout: ${String(data).trim()}`);
        });

        stream.stderr.on('data', (data) => {
            mainWindow.webContents.send(channels.STREAM_STD_OUT, { token: token, output: String(data).trim(), processKey: (key ? key : false) });
            // console.error(`stderr: ${data} sup\n sup`);
        });

        stream.on('close', (code) => {
            mainWindow.webContents.send(channels.STREAM_STD_OUT, { token: token, output: "EXITING WITH CODE: " + String(code).trim(), processKey: (key ? key : false) });
            // console.log(`child process exited with code ${code}`);
        });
        console.log("END SETUP IO")

    }
    
    async function createReUpload(bins, args) {
        if (Object.keys(bins).length === 0 || typeof bins === 'string') {
            if (process.platform === 'linux') await checkLinuxExecutePermissions(bins);
            streams[token] = spawn(bins, args);
            attachIO(streams[token], token);
        } else {
            streams[token] = { __MULTI__: true };
            Object.keys(bins).forEach(async (key) => {
                if (!args[key]) throw new Error("Appropriate keys not found in commands.js");
                if (process.platform === 'linux') await checkLinuxExecutePermissions(bins[key]);
                streams[token][key] = spawn(bins[key], args[key]);
                attachIO(streams[token][key], token, key);
            })
        }
    }

    ipcMain.on(channels.CREATE_REUPLOAD, async (event, { url }) => {
        await createReUpload(platformBinaries.reUpload[process.platform], commands.getReUploadArguments(url));
    });
    mainWindow.on('close', (e) => {
        if (Object.keys(streams).length > 0) {
            e.preventDefault();
            mainWindow.webContents.send(channels.CONFIRM_EXIT);
        }
    })
}

async function checkLinuxExecutePermissions(bin) {
    return fs.promises.access(bin, fs.constants.X_OK).catch(err=>{
        if(err.code === 'EACCES') {
            log.info(bin + " has no execute perms, chmodding to 774.");
            return fs.promises.chmod(bin, 0o774);
        }
    })
}

module.exports = { setUpReUpload };

const { ipcMain, app } = require("electron");
const axios = require('axios');
const { spawn } = require('cross-spawn');
const kill = require('tree-kill')
const path = require('path');
const log = require('electron-log');

let isProd = process.env.ELECTRON_START_URL ? false : true;

const { channels } = require('./../src/shared/constants.js');
const commands = require('../commands.js');
const fs = require("fs");
let streams = {};

const platformBinaries = {
    rtmp: {
        linux: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'sampleScript'),
        win32: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'sampleScript.exe')
    },
    hls: {
        linux: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'stream_hls'),
        win32: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'stream_hls.exe')

    },
    // In order to open multiple binaries, define an object with keys corresponding to names (arrays work too, provided ordering is maintained. However objects with semantic keys are recommended)
    // Note: these names are used in signalling as well as in fetching arguments
    // Not specifying correct keys will have unexpected results
    // [NOTE: DO NOT USE '__MULTI__' as key]
    restream: {
        linux: { uploader: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'stream_hls'), downloader: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'stream_downloader') },
        win32: { uploader: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'stream_hls.exe'), downloader: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'stream_downloader.exe') }
    },
    reUpload: {
        linux: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'download_upload'),
        win32: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'download_upload.exe')
    }
}

function setUpStreams(mainWindow) {

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

    async function createStreams(bins, args, token) {
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

    function killStream(token) {
        if (streams[token].__MULTI__) {
            Object.keys(streams[token]).forEach(key => {
                if (key === '__MULTI__') return;
                kill(streams[token][key].pid);
            })
        } else {
            kill(streams[token].pid);
        }
        delete streams[token];
    }

    ipcMain.on(channels.CREATE_RTMP_STREAM, async (event, { token }) => {
        await createStreams(platformBinaries.rtmp[process.platform], commands.getRtmpStreamArguments(token), token);
    });

    ipcMain.on(channels.CREATE_HLS_STREAM, async (event, { token, dir, keepFiles }) => {
        await createStreams(platformBinaries.hls[process.platform], commands.getHlsStreamArguments(token, dir, keepFiles), token);
    });

    ipcMain.on(channels.CREATE_RESTREAM, async (event, { token, url, keepFiles }) => {
        await createStreams(platformBinaries.restream[process.platform], commands.getRestreamArguments(token, url, keepFiles), token);
    });

    ipcMain.on(channels.APP_INFO, (event) => {
        event.sender.send(channels.APP_INFO, app.getVersion());
    });

    ipcMain.on(channels.CLOSE_STREAM, (event, { token }) => killStream(token));

    ipcMain.on(channels.CLOSE_ALL_STREAMS, (event) => {
        Object.keys(streams).forEach(token => {
            killStream(token);
        })
    })

    ipcMain.on(channels.STREAM_DATA, (event, { token }) => {
        axios.get('https://skylive.coolhd.hu/api/stream_data', { params: { token } })
            .then(res => {
                event.sender.send(channels.STREAM_DATA, { err: false, res: { token, data: res.data } });
            })
            .catch(err => event.sender.send(channels.STREAM_DATA, { err: err }))
    })


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

module.exports = { setUpStreams };
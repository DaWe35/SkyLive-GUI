const { ipcMain, app } = require("electron");
const axios = require('axios');
const { spawn } = require('cross-spawn');
const kill = require('tree-kill')
const path = require('path');

let isProd = process.env.ELECTRON_START_URL ? false : true;

const { channels } = require('./../src/shared/constants.js');
const commands = require('../commands.js');
let streams = {};

const platformBinaries = {
    rtmp: {
        linux: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'sampleScript'),
        win32: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'stream_hls.exe')
    },
    hls: {
        linux: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'sampleScript'),
        win32: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'stream_hls.exe')

    },
    // In order to open multiple binaries, define an object with keys corresponding to names (arrays work too, provided ordering is maintained. However objects with semantic keys are recommended)
    // Note: these names are used in signalling as well as in fetching arguments
    // Not specifying correct keys will have unexpected results
    // [NOTE: DO NOT USE '__MULTI__' as key]
    restream: {
        linux: { uploader: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'sampleScript'), downloader: path.join(isProd ? process.resourcesPath : '', 'bin', 'linux', 'sampleScript') },
        win32: { uploader: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'stream_hls.exe'), downloader: path.join(isProd ? process.resourcesPath : '', 'bin', 'windows', 'stream_downloader.exe') }
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

    function createStreams(bins, args, token) {
        if (Object.keys(bins).length === 0 || typeof bins === 'string') {
            streams[token] = spawn(bins, args);
            attachIO(streams[token], token);
        } else {
            streams[token] = {__MULTI__: true};
            Object.keys(bins).forEach(key => {
                if (!args[key]) throw new Error("Appropriate keys not found in commands.js");

                streams[token][key] = spawn(bins[key], args[key]);
                attachIO(streams[token][key], token, key);
            })
        }
    }

    ipcMain.on(channels.CREATE_RTMP_STREAM, (event, { token }) => {
        createStreams(platformBinaries.rtmp[process.platform], commands.getRtmpStreamArguments(token), token);
    });

    ipcMain.on(channels.CREATE_HLS_STREAM, (event, { token, dir }) => {
        createStreams(platformBinaries.hls[process.platform], commands.getHlsStreamArguments(token, dir), token);
    });

    ipcMain.on(channels.CREATE_RESTREAM, (event, { token, url }) => {
        createStreams(platformBinaries.restream[process.platform], commands.getRestreamArguments(token, url), token);
    });

    ipcMain.on(channels.APP_INFO, (event) => {
        event.sender.send(channels.APP_INFO, app.getVersion());
    });

    ipcMain.on(channels.CLOSE_STREAM, (event, { token }) => {
        if (streams[token].__MULTI__) {
            Object.keys(streams[token]).forEach(key=>{
                if (key === '__MULTI__') return;
                kill(streams[token][key].pid);
            })
        } else {
            kill(streams[token].pid);
        }
        delete streams[token];
    });

    ipcMain.on(channels.STREAM_DATA, (event, { token }) => {
        axios.get('https://skylive.coolhd.hu/api/stream_data', { params: { token } })
            .then(res => {
                event.sender.send(channels.STREAM_DATA, { err: false, res: { token, data: res.data } });
            })
            .catch(err => event.sender.send(channels.STREAM_DATA, { err: err }))
    })
}

module.exports = { setUpStreams };
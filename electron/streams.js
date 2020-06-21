const { ipcMain, app } = require("electron");
const axios = require('axios');
const { spawn } = require('cross-spawn');
const kill = require('tree-kill')

const { channels } = require('./../src/shared/constants.js');
const commands = require('../commands.js');

let streams = {};

const platformBinaries = {
    'win32': 'bin/windows/sampleScript.exe',
    'linux': 'bin/linux/sampleScript'
}

function setUpStreams(mainWindow) {

    function attachIO(stream, token) {
        stream.stdout.on('data', (data) => {
            mainWindow.webContents.send(channels.STREAM_STD_OUT, { token: token, output: String(data).trim() });
            // console.log(`stdout: ${String(data).trim()}`);
        });

        stream.stderr.on('data', (data) => {
            mainWindow.webContents.send(channels.STREAM_STD_OUT, { token: token, output: String(data).trim() });
            // console.error(`stderr: ${data} sup\n sup`);
        });

        stream.on('close', (code) => {
            mainWindow.webContents.send(channels.STREAM_STD_OUT, { token: token, output: "EXITING WITH CODE: " + String(code).trim() });
            // console.log(`child process exited with code ${code}`);
        });
    }

    ipcMain.on(channels.CREATE_RTMP_STREAM, (event, { token }) => {
        // //console.log(command);
        // //console.log("TOKEN: ", token)
        console.log(process.cwd());

        streams[token] = spawn(platformBinaries[process.platform], commands.getRtmpStreamArguments(token));
        attachIO(streams[token], token);
    });

    ipcMain.on(channels.CREATE_HLS_STREAM, (event, { token, dir }) => {
        // //console.log(command);
        // //console.log("TOKEN: ", token)

        streams[token] = spawn(platformBinaries[process.platform], commands.getHlsStreamArguments(token, dir));
        attachIO(streams[token], token);

    });

    ipcMain.on(channels.CREATE_RESTREAM, (event, { token, url }) => {
        // //console.log(command);
        // //console.log("TOKEN: ", token)

        streams[token] = spawn(platformBinaries[process.platform], commands.getRestreamArguments(token, url));
        attachIO(streams[token], token);

    });

    ipcMain.on(channels.APP_INFO, (event) => {
        // mainWindow.webContents.send('update_error',{whoa:"damnm"});
        event.sender.send(channels.APP_INFO, app.getVersion());
    });

    ipcMain.on(channels.CLOSE_STREAM, (event, { token }) => {
        kill(streams[token].pid);
        delete streams[token];
    });

    ipcMain.on(channels.STREAM_DATA, (event, { token }) => {
        axios.get('https://skylive.coolhd.hu/api/stream_data', { params: { token } })
            .then(res => {
                // //console.log(res);
                event.sender.send(channels.STREAM_DATA, { err: false, res: { token, data: res.data } });
            })
            .catch(err => event.sender.send(channels.STREAM_DATA, { err: err }))
    })
}

module.exports = { setUpStreams };
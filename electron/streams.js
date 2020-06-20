const { ipcMain, app } = require("electron");
const axios = require('axios');

const { channels } = require('./../src/shared/constants.js');

let streams = {};

function dumbRepeater(window,token, n) {
    // //console.log(token);
    window.webContents.send(channels.STREAM_STD_OUT,{token:token, output:(String(streams[token].iteration++) +": Sample generated output")});
}

function setUpStreams(mainWindow) {


    ipcMain.on(channels.CREATE_STREAM, (event, { token, command }) => {
        // //console.log(command);
        // //console.log("TOKEN: ", token)
        streams[token] = {}
        streams[token].iteration = 1;
        streams[token].repeater = setInterval(()=>dumbRepeater(mainWindow, token, 1), 1000);
    });
    ipcMain.on(channels.APP_INFO, (event) => {
        // mainWindow.webContents.send('update_error',{whoa:"damnm"});
        event.sender.send(channels.APP_INFO, app.getVersion());
    });



    ipcMain.on(channels.CLOSE_STREAM, (event, { token }) => {
        clearInterval(streams[token].repeater);
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

module.exports = {setUpStreams};
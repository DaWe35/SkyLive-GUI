const { ipcRenderer, remote } = require('electron');
const { dialog } = require('electron').remote;

window.dialog = dialog;
window.ipcRenderer = ipcRenderer;
window.currentWindow = remote.getCurrentWindow();
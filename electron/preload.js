const { ipcRenderer, remote, shell } = require('electron');
const { dialog } = require('electron').remote;

window.dialog = dialog;
window.ipcRenderer = ipcRenderer;
window.currentWindow = remote.getCurrentWindow();
window.shell = shell;
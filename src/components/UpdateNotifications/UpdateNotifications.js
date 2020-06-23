import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import {channels} from './../../shared/constants.js';

const { ipcRenderer } = window;

export default function UpdateNotifications() {
    React.useEffect(()=>ipcRenderer.send("update_start"), []);

    return <>
        <BasicNotifierOnIpcSignal signal={channels.UPDATE_STARTING} message={"Starting the updater..."}/>
        <BasicNotifierOnIpcSignal signal={channels.UPDATE_CHECKING} message={"Checking for updates..."}/>
        <BasicNotifierOnIpcSignal signal={channels.UPDATE_ERROR} message={"Updater failed. Check logs for more info."}/>
        <BasicNotifierOnIpcSignal signal={channels.UPDATE_NOT_AVAILABLE} message={"Already on later version."}/>
        <BasicNotifierOnIpcSignal signal={channels.UPDATE_DOWNLOADING} message={"Downloading update. Check info for details."}/>
        <UpdateDownloaded/>
    </>
}


function BasicNotifierOnIpcSignal(signal, message) {
    const [open, setOpen] = React.useState(false);

    ipcRenderer.on(signal, (event, err) => {
        // alert(JSON.stringify(err));
        ipcRenderer.removeAllListeners(signal);
        setOpen(true);
    });


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
                action={
                    <>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
                }
            />
        </div>
    );
}

function UpdateDownloaded() {
    const [open, setOpen] = React.useState(false);

    ipcRenderer.on(channels.UPDATE_DOWNLOADED, () => {
        // alert("downloaded");

        ipcRenderer.removeAllListeners(channels.UPDATE_DOWNLOADED);
        setOpen(true);
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleRestart = (e, reason) => {
        ipcRenderer.send(channels.RESTART_APP);
    }

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Update Downloaded. It will be installed on next app restart. Restart app now?"
                action={
                    <>
                        <Button color="secondary" size="small" onClick={handleRestart}>
                            RESTART
                        </Button>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </>
                }
            />
        </div>
    );
}
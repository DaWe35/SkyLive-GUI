import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const { ipcRenderer } = window;

export default function UpdateNotifications() {
    React.useEffect(()=>ipcRenderer.send("update_start"), []);

    return <>
        <UpdateDownloading />
        <UpdateDownloaded />
        <UpdateNotAvailable />
        <UpdateChecking />
        <UpdateError />
        <UpdateStartingProcess/>
    </>
}


function UpdateStartingProcess() {
    const [open, setOpen] = React.useState(false);

    ipcRenderer.on('update_starting_process', (event, err) => {
        // alert(JSON.stringify(err));
        ipcRenderer.removeAllListeners('update_starting_process');
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
                message={"Starting updater..."}
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

function UpdateError() {
    const [{ open, error }, setState] = React.useState({ open: false, error: null });

    ipcRenderer.on('update_error', (event, err) => {
        // alert(JSON.stringify(err));
        ipcRenderer.removeAllListeners('update_error');
        setState({ open: true, error: err });
    });


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setState({ open: false, error: error });
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
                message={"Update Error: " + error}
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

function UpdateChecking() {
    const [open, setOpen] = React.useState(false);

    ipcRenderer.on('update_checking', () => {
        // alert("checking");
        ipcRenderer.removeAllListeners('update_checking');
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
                message="Checing for updates..."
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

function UpdateNotAvailable() {
    const [open, setOpen] = React.useState(false);

    ipcRenderer.on('update_not_available', () => {
        // alert("not");
        ipcRenderer.removeAllListeners('update_not_available');
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
                message="App is already up-to-date"
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

function UpdateDownloading() {
    const [open, setOpen] = React.useState(false);


    ipcRenderer.on('update_available', () => {
        // alert("downloading");

        ipcRenderer.removeAllListeners('update_available');
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
                message="A new update is available. Downloading now..."
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

    ipcRenderer.on('update_downloaded', () => {
        // alert("downloaded");

        ipcRenderer.removeAllListeners('update_downloaded');
        setOpen(true);
    });

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleRestart = (e, reason) => {
        ipcRenderer.send('restart_app');
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
                message="Update Downloaded. It will be installed on restart. Restart now?"
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
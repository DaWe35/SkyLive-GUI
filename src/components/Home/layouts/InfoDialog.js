import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent, DialogActions, Typography, LinearProgress } from '@material-ui/core';
import { GitHub, FeedbackOutlined } from '@material-ui/icons';

import { channels, updateStates } from './../../../shared/constants.js';

const { ipcRenderer, shell } = window;

const getUpdateDescriptionText = (updateState) => {
    switch (updateState) {
        case updateStates.STARTED:
            return "Started the updates service";
        case updateStates.CHECKING:
            return "Currently checking...";
        case updateStates.ERROR:
            return "Update failed. Check logs for details";
        case updateStates.DOWNLOADED:
            return "Update successful. Pending app restart";
        case updateStates.DOWNLOADING:
            return "Update downloading";
        default:
            return "";
    }
}

export default function InfoDialog({ open, handleClose }) {
    const [updateStatus, setUpdateStatus] = useState({});
    const [version, setVersion] = useState();


    useEffect(() => {
        const listener = (event, status) => {
            setUpdateStatus(status);
            console.log(status);
        }
        ipcRenderer.on(channels.UPDATE_STATUS, listener);
        return () => ipcRenderer.removeListener(channels.STREAM_STD_OUT, listener);
    }, [])

    useEffect(() => {
        ipcRenderer.send(channels.APP_INFO);
        ipcRenderer.on(channels.APP_INFO, (event, receivedVersion) => {
            ipcRenderer.removeAllListeners(channels.APP_INFO);
            setVersion(receivedVersion);
        })
    }, [])

    return (
        <Dialog maxWidth="sm" fullWidth onClose={handleClose} open={open}>
            <DialogContent>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <img style={{ maxWidth: "100%" }} src={process.env.PUBLIC_URL + '/logo-1.svg'} alt='logo' />
                    </div>
                    <div style={{ flex: 2, margin: 20, marginBottom: 0, justifyContent: "center", alignItems: "center" }}>
                        <Typography gutterBottom>
                            Some about text could go here.
                        </Typography>
                        <Typography gutterBottom>
                            Some more text could go here.
                        </Typography>
                        <Typography gutterBottom>
                            And more about text could go here too.
                        </Typography>
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop:20, paddingBottom:20}}>
                            <Typography variant="subtitle2" >
                                UPDATE STATUS:
                            </Typography>
                            <Typography color="primary">
                                {getUpdateDescriptionText(updateStatus.status)}
                            </Typography>
                        </div>
                        {updateStatus.status === updateStates.DOWNLOADING &&
                            <LinearProgress variant="determinate" value={updateStatus.percentage} />
                        }
                        <div style={{ width: "100%", display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                            <Button startIcon={<GitHub />} onClick={() => shell.openExternal("https://github.com/DaWe35/SkyLive-GUI")}>
                                GitHub
                            </Button>

                            <Button startIcon={<FeedbackOutlined />} onClick={() => shell.openExternal("https://coolhd.hu/contact/")}>
                                Feedback
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Typography >
                    v{version}
                </Typography>
                <Button autoFocus onClick={handleClose} color="primary">
                    Exit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
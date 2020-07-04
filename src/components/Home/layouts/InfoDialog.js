import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogActions, Typography, LinearProgress } from '@material-ui/core';
import { GitHub, PlayArrow } from '@material-ui/icons';
import Button from './../../../atoms/button.js';


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
        case updateStates.NOT_AVAILABLE:
            return "On latest release"
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
    const [userWorkingDirectory, setUserWorkingDirectory] = useState("");


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

    useEffect(()=> {
        ipcRenderer.send(channels.USER_WORKING_DIRECTORY);
        const listener = (event, dir) => {
            setUserWorkingDirectory(dir);
        }
        ipcRenderer.on(channels.USER_WORKING_DIRECTORY, listener);

        return ()=>ipcRenderer.removeListener(channels.USER_WORKING_DIRECTORY, listener);
    }, []);

    const showInDirectory = () => {
        shell.openExternal('file://'+userWorkingDirectory) // ~/.SkyLive is the working directory path.
    }

    return (
        <Dialog maxWidth="sm" fullWidth onClose={handleClose} open={open}>
            <DialogContent>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                        <img style={{ maxWidth: "100%" }} src={process.env.PUBLIC_URL + '/skylive.png'} alt='logo' />
                    </div>
                    <div style={{ flex: 2, margin: 20, marginBottom: 0, justifyContent: "center", alignItems: "center" }}>
                        <Typography gutterBottom>
                            SkyLive-GUI is a wrapper for the command line SkyLive. It provides non custodial streaming, so you can broadcast live videos without a centralized server.
                            <Button onClick={ showInDirectory } style={{ padding: "5px", minWidth: 0 }}>
                                Open working directory
                            </Button>
                        </Typography>
                        <Typography style={{ fontStyle: "italic" }} gutterBottom>
                            Made by 
                            <Button onClick={() => shell.openExternal("https://github.com/d4mr")} style={{ padding: "5px", minWidth: 0, fontStyle: "italic" }}>
                                d4mr
                            </Button>
                             & 
                            <Button onClick={() => shell.openExternal("https://github.com/DaWe35")} style={{ padding: "5px", minWidth: 0, fontStyle: "italic" }}>
                                DaWe
                            </Button>
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

                            <Button startIcon={<PlayArrow />} onClick={() => shell.openExternal("https://skylive.coolhd.hu")}>
                                Watch SkyLive
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
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
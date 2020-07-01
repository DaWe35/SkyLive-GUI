import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import Button from '../../../atoms/button.js';
import { useStreams } from '../../../providers/streams-context';
import { channels } from '../../../shared/constants.js'

const { ipcRenderer } = window;

export default function ConfirmExitDialog() {
    const [visible, setVisible] = useState(false);

    const Streams = useStreams();
    const handleCancelled = () => {
        setVisible(false);
    }

    const handleConfirmed = () => {
        setVisible(false);
        ipcRenderer.send(channels.CLOSE_ALL_STREAMS);
        ipcRenderer.send(channels.CLOSE_WINDOW);
    }

    useEffect(() => {
        const listener = () => { setVisible(true) };
        ipcRenderer.on(channels.CONFIRM_EXIT, listener);
        return () => ipcRenderer.removeListener(channels.CONFIRM_EXIT, listener);
    }, []);

    return <Dialog
        open={visible}
    >
        <DialogTitle>{"Force Quit Application?"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure want to kill all running streams, and close the application?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancelled}>
                No
            </Button>
            <Button onClick={handleConfirmed} color="primary" autoFocus>
                Yes
            </Button>
        </DialogActions>
    </Dialog>
}
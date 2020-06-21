import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from '@material-ui/core';
import { useStreams } from '../../../providers/streams-context';

export default function CloseStreamDialog({token, handleDialogClosed}) {
    const Streams = useStreams();
    const handleCancelled = () => {
        handleDialogClosed();
    }

    const handleConfirmed = () => {
        handleDialogClosed();
        Streams.closeStream(token);
    }

    return <Dialog
        open={token?true:false}
        onClose={handleCancelled}
    >
        <DialogTitle>{"Close Stream?"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Are you sure want to close stream: {Streams.allStreams[token]?Streams.allStreams[token].title:""}
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
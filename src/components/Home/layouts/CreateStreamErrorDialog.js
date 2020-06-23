import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import Button from './../../../atoms/button.js';


export default function CreateStreamErrorDialog({ data, handleDialogClosed }) {

    const handleCancelled = () => {
        handleDialogClosed();
    }
    return <Dialog
        open={data ? true : false}
        onClose={handleCancelled}
    >
        <DialogTitle>{"Error Creating Stream"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {data.toString()}
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={handleCancelled}>
                Okay
            </Button>
        </DialogActions>
    </Dialog>
}
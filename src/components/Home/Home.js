import React, { useState} from 'react';
import 'typeface-roboto';
import Sidebar from './layouts/Sidebar';
import StreamRTMP from './layouts/StreamRTMP';
import StreamHLS from './layouts/StreamHLS';
import Restream from './layouts/Restream';
import CreatedStream from './layouts/CreatedStream';

import CloseStreamDialog from './layouts/CloseStreamDialog';
import CreateStreamErrorDialog from './layouts/CreateStreamErrorDialog';
import InfoDialog from './layouts/InfoDialog';


import { makeStyles } from '@material-ui/core/styles';
import { IconButton, CssBaseline, Paper } from '@material-ui/core';


import { Route, HashRouter as Router, Redirect, Switch } from 'react-router-dom';
import { InfoOutlined } from '@material-ui/icons';
// import { SettingsOutlined } from '@material-ui/icons';
import { StreamsProvider } from '../../providers/streams-context';

// import { channels } from '../../shared/constants.js';
// const { ipcRenderer } = window;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        height: '100%',
        flexGrow: 1,
        paddingLeft: 240,
        flexDirection: 'column',
        overflow: 'hidden'
    }
}));

export default function Home() {
    const classes = useStyles();

    const [closeStreamDialogToken, setCloseStreamDialogToken] = useState(false);
    const [createStreamErrorDialog, setCreateStreamErrorDialog] = useState(false);
    const [infoDialogOpen, setInfoDialogOpen] = useState(false);


    const closeStreamAttempted = (token) => { setCloseStreamDialogToken(token) };

    // useEffect(() => ipcRenderer.on(channels.UPDATE_START, () => alert("DUMMY")), []);

    return <StreamsProvider>
        <CssBaseline />
        <CloseStreamDialog token={closeStreamDialogToken} handleDialogClosed={() => setCloseStreamDialogToken(null)} />
        <InfoDialog open={infoDialogOpen} handleClose={() => setInfoDialogOpen(false)} />
        <CreateStreamErrorDialog data={createStreamErrorDialog} handleDialogClosed={() => setCreateStreamErrorDialog(false)} />
        <Router>
            <Sidebar handleCloseStream={(token) => closeStreamAttempted(token)} />
            <div className={classes.root}>
                <Paper style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <IconButton onClick={() => setInfoDialogOpen(true)}>
                        <InfoOutlined />
                    </IconButton>
                    {/* <IconButton>
                        <SettingsOutlined />
                    </IconButton> */}
                </Paper>
                <Switch>
                    <Route path="/stream_rtmp" exact render={(props) => <StreamRTMP {...props} handleError={(err) => setCreateStreamErrorDialog(err)} />} />
                    <Route path="/stream_hls" exact render={(props) => <StreamHLS {...props} handleError={(err) => setCreateStreamErrorDialog(err)} />} />
                    <Route path="/restream" exact render={(props) => <Restream {...props} handleError={(err) => setCreateStreamErrorDialog(err)} />} />
                    <Route path="/stream/:token" exact render={(props) => <CreatedStream {...props} handleCloseStream={(token) => closeStreamAttempted(token)} />} />
                    <Route path="/" render={() => <Redirect to="/stream_rtmp" />} />
                </Switch>
            </div>

        </Router>
    </StreamsProvider>
}
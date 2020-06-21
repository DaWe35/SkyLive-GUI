import React, { useState } from 'react';
import { Button, Typography, Container} from '@material-ui/core';
import { AirplayOutlined, PlaylistPlayOutlined, FolderOutlined } from '@material-ui/icons';

import FlavouredInput from '../gadgets/FlavouredInput.js'
import { useStreams } from '../../../providers/streams-context.js';
import Loader from '../gadgets/Loader.js';

const { dialog, currentWindow } = window;


export default function StreamHLS({ handleError }) {
    const Streams = useStreams();
    const [streamToken, setStreamToken] = useState("");
    const [recordingFolder, setRecordingFolder] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false)

    const handleCreateStream = (e) => {
        e.preventDefault();
        let currentErrors = {};
        let hasErrors = false;
        if (!streamToken) {
            currentErrors.token = "Cannot be empty";
            hasErrors = true;
        }

        if (!recordingFolder) {
            currentErrors.dir = "Cannot be empty";
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(currentErrors);
            return;
        }

        setErrors(false);
        setLoading(true);
        Streams.createHlsStream(streamToken, recordingFolder).catch(handleError).finally(() => setLoading(false));
    }

    const showDirectoryDialogBox = () => {
        setRecordingFolder(dialog.showOpenDialogSync(currentWindow, { properties: ['openDirectory'] }));
    }


    return <>
        <Loader open={loading}/>
        <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <PlaylistPlayOutlined /> <Typography variant="h6" style={{ paddingLeft: 10 }}>Stream (HLS)</Typography>
            </div>
            <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" style={{ flex: 1 }}>Some description text</Typography>

                <form style={{ display: 'flex', flexDirection: 'column', flex: 9 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-around' }}>
                        <FlavouredInput value={streamToken} onChange={setStreamToken} error={errors ? errors.token : false} label="Stream Token" tooltip="Whatever you want" />
                        <FlavouredInput value={recordingFolder} onChange={setRecordingFolder} error={errors ? errors.dir : false} label="Recording Folder" tooltip="Whatever you want"
                            endAdornment={{
                                icon: FolderOutlined,
                                onClick: showDirectoryDialogBox
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 30, width: '100%', flex: 1 }}>
                        <Button type="submit" color='primary' onClick={handleCreateStream} startIcon={<AirplayOutlined />} variant="contained" size="large">Start Stream</Button>
                    </div>
                </form>
            </Container>
        </Container>
    </>
}
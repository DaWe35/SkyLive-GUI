import React, { useState } from 'react';
import { Button, Typography, Container } from '@material-ui/core';
import { AirplayOutlined, LowPriorityOutlined } from '@material-ui/icons';
import FlavouredInput from '../gadgets/FlavouredInput';
import { useStreams } from '../../../providers/streams-context';
import Loader from '../gadgets/Loader';




export default function Restream({ handleError }) {
    // const classes = useStyles();

    const Streams = useStreams();
    const [streamToken, setStreamToken] = useState("");
    const [streamURL, setStreamURL] = useState("");
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

        if (!streamURL) {
            currentErrors.url = "Cannot be empty";
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(currentErrors);
            return;
        }

        setErrors(false);
        setLoading(true);
        Streams.createRestream(streamToken, streamURL).catch(handleError).finally(()=>setLoading(false));
    }

    return <>
        <Loader open={loading} />
        <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <LowPriorityOutlined /> <Typography variant="h6" style={{ paddingLeft: 10 }}>Restream</Typography>
            </div>
            <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" style={{ flex: 1 }}>Restream a livestream from YouTube or Twitch to SkyLive</Typography>

                <form style={{ display: 'flex', flexDirection: 'column', flex: 9 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flex: 1 }}>
                        <FlavouredInput value={streamToken} onChange={setStreamToken} error={errors ? errors.token : false} label="Stream Token" tooltip="Whatever you want" />
                        <FlavouredInput value={streamURL} onChange={setStreamURL} error={errors ? errors.url : false} label="Stream URL" tooltip="Whatever you want" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 30, width: '100%', flex: 1 }}>
                        <Button type="submit" color='primary' onClick={handleCreateStream} startIcon={<AirplayOutlined />} variant="outlined" size="large">Start Restreaming</Button>
                    </div>
                </form>
            </Container>
        </Container>
    </>
}
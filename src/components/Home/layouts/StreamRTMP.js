import React, { useState } from 'react';
import { Button, Typography, Container, Avatar, TextField, Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AirplayOutlined, SlowMotionVideoOutlined, InfoOutlined } from '@material-ui/icons';
import { deepPurple, purple, blueGrey, red, grey } from '@material-ui/core/colors';
import FlavouredInput from '../gadgets/FlavouredInput';
import { useStreams } from '../../../providers/streams-context';
import Loader from '../gadgets/Loader';




export default function StreamRTMP({ handleError }) {
    // const classes = useStyles();
    const Streams = useStreams();
    const [streamToken, setStreamToken] = useState("");
    const [errors, setErrors] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreateStream = (e) => {
        e.preventDefault();
        if (!streamToken) {
            setErrors({ token: "Cannot be empty" });
            return;
        } else {
            setErrors(false);
        }
        setLoading(true);
        Streams.createRtmpStream(streamToken).catch(handleError).finally(() => setLoading(false));
    }



    return <>
        <Loader open={loading} />
        <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <SlowMotionVideoOutlined /> <Typography variant="h6" style={{ paddingLeft: 10 }}>Stream (RTMP)</Typography>
            </div>
            <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" style={{ flex: 1 }}>Some description text</Typography>
                <form style={{ display: 'flex', flexDirection: 'column', flex: 9 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-around' }}>
                        <FlavouredInput value={streamToken} error={errors ? errors.token : false} onChange={setStreamToken} label="Stream Token" tooltip="Whatever you want" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 30, width: '100%', flex: 2 }}>
                        <Button type="submit" color='primary' onClick={handleCreateStream} startIcon={<AirplayOutlined />} variant="contained" size="large">Start Stream</Button>
                    </div>
                </form>
            </Container>
        </Container>
    </>
}
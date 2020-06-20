import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Avatar, TextField, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { deepPurple, purple, blueGrey, red, grey } from '@material-ui/core/colors';
import { AirplayOutlined, PlaylistPlayOutlined, FolderOutlined, InfoOutlined, StopOutlined, StopRounded, StopScreenShareOutlined, OpenInBrowserOutlined } from '@material-ui/icons';

import Console from '../gadgets/Console.js';
import { useStreams } from '../../../providers/streams-context.js';
import { Redirect } from 'react-router-dom';

const { shell } = window;


export default function CreatedStream({ match, handleCloseStream }) {
    const Streams = useStreams();
    const token = match.params.token;
    const [output, setOutput] = useState("");
    const [streamOpen, setStreamOpen] = useState(true);

    const handleBrowserOpen = (token) => {
        shell.openExternal('https://skylive.coolhd.hu/player?s=' + Streams.allStreams[token].streamid);
    }

    useEffect(() => {
        if (!Streams.allStreams[token]) return;
        Streams.allStreams[token].output && setOutput(Streams.allStreams[token].output.join('\n'));
    }, [Streams.allStreams[token], token, Streams]);

    

    return (!Streams.allStreams[token])
        ? <Redirect to="/" />
        : <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 20, minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <PlaylistPlayOutlined /> <Typography variant="h6" style={{ paddingLeft: 10 }}>{Streams.allStreams[token].title}
                </Typography>
            </div>
            <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <Typography variant="body1" style={{ flex: 1 }}>{Streams.allStreams[token] ? Streams.allStreams[token].description : ""}</Typography>

                <form style={{ display: 'flex', flexDirection: 'column', flex: 9, minHeight: 0 }}>
                    <Console style={{ flex: 4 }} text={output} label={"Console"} tooltip={"Output"}/>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-end', marginBottom: 30, width: '100%', flex: 1 }}>
                        <Button color='primary' onClick={()=> handleBrowserOpen(token)} startIcon={<OpenInBrowserOutlined />} variant="contained">Open In Browser</Button>
                        <Button color='secondary' onClick={() => handleCloseStream(token)} startIcon={<StopScreenShareOutlined />} variant="contained">Stop Stream</Button>
                    </div>
                </form>
            </Container>
        </Container>
}
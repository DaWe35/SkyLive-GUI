import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, AppBar, Tabs, Tab } from '@material-ui/core';
import { AirplayOutlined, PlaylistPlayOutlined, FolderOutlined, StopScreenShareOutlined, OpenInBrowserOutlined } from '@material-ui/icons';

import Console from '../gadgets/Console.js';
import { useStreams } from '../../../providers/streams-context.js';
import { Redirect } from 'react-router-dom';

const { shell } = window;


export default function CreatedStream({ match, handleCloseStream }) {

    const [tabNumber, setTabNumber] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setTabNumber(newValue);
    };

    const Streams = useStreams();
    const token = match.params.token;
    const [output, setOutput] = useState();

    const handleBrowserOpen = (token) => {
        shell.openExternal('https://skylive.coolhd.hu/player?s=' + Streams.allStreams[token].streamid);
    }

    useEffect(() => {
        if (!Streams.allStreams[token]) return;
        console.log(Streams.allStreams[token].output);
        Streams.allStreams[token].output && setOutput(Streams.allStreams[token].output);
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

                <div style={{ display: 'flex', flexDirection: 'column', flex: 9, minHeight: 0 }}>

                    {output && output.__MULTI__ &&
                        //Object.keys
                        <AppBar position="static">
                            <Tabs value={tabNumber} onChange={handleTabChange}>

                                {Object.keys(output).filter(key => key !== '__MULTI__').map((ouputChannel, index) =>
                                    <Tab label={Object.keys(output).filter(key => key !== '__MULTI__')[index]} />
                                )}
                            </Tabs>
                        </AppBar>

                    }

                    {(output && output.__MULTI__)
                        ? <Console noTitle style={{ flex: 4 }} text={output[Object.keys(output).filter(key => key !== '__MULTI__')[tabNumber]].join('\n')} label={"Console"} tooltip={"Output"} />
                        : <Console noTitle style={{ flex: 4 }} text={output ? output.join('\n') : ""} label={"Console"} tooltip={"Output"} />
                    }

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-end', marginBottom: 30, width: '100%', flex: 1 }}>
                        <Button color='primary' onClick={() => handleBrowserOpen(token)} startIcon={<OpenInBrowserOutlined />} variant="contained">Open In Browser</Button>
                        <Button color='secondary' onClick={() => handleCloseStream(token)} startIcon={<StopScreenShareOutlined />} variant="contained">Stop Stream</Button>
                    </div>
                </div>
            </Container>
        </Container>
}
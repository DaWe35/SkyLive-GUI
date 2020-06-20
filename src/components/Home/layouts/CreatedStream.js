import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Avatar, TextField, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { deepPurple, purple, blueGrey, red, grey } from '@material-ui/core/colors';
import { AirplayOutlined, PlaylistPlayOutlined, FolderOutlined, InfoOutlined, StopOutlined, StopRounded, StopScreenShareOutlined, OpenInBrowserOutlined } from '@material-ui/icons';

import FlavouredInput from '../gadgets/FlavouredInput.js'
import Console from '../gadgets/Console.js';
import { useStreams } from '../../../providers/streams-context.js';
import { Redirect } from 'react-router-dom';

const { dialog, currentWindow } = window;

const text = `❯ sudo apt 
[sudo] password for d4mr:
Hit:1 http://in.archive.ubuntu.com/ubuntu focal 
Get:2 http://in.archive.ubuntu.com/ubuntu focal-updates InRelease [107 kB]
Hit:3 https://dl.winehq.org/wine-builds/ubuntu focal InRelease
Hit:4 http://ppa.launchpad.net/kdenlive/kdenlive-stable/ubuntu focal InRelease
Get:5 http://in.archive.ubuntu.com/ubuntu focal-backports InRelease [98.3 kB]
Hit:6 http://packages.microsoft.com/repos/vscode stable InRelease
Hit:7 http://repository.spotify.com stable InRelease
Get:8 http://security.ubuntu.com/ubuntu focal-security InRelease [107 kB]
Get:9 http://in.archive.ubuntu.com/ubuntu focal-updates/main amd64 Packages [197 kB]
Get:10 http://in.archive.ubuntu.com/ubuntu focal-updates/main i386 Packages [102 kB]
Get:11 http://in.archive.ubuntu.com/ubuntu focal-updates/main Translation-en [78.3 kB]
Get:12 http://in.archive.ubuntu.com/ubuntu focal-updates/main amd64 DEP-11 Metadata [105 kB]
Hit:13 http://ppa.launchpad.net/obsproject/obs-studio/ubuntu focal InRelease
Get:14 http://in.archive.ubuntu.com/ubuntu focal-updates/main DEP-11 48x48 Icons [23.1 kB]
Get:15 http://security.ubuntu.com/ubuntu focal-security/main amd64 DEP-11 Metadata [21.2 kB]
Hit:16 http://ppa.launchpad.net/persepolis/ppa/ubuntu focal InRelease
Get:17 http://in.archive.ubuntu.com/ubuntu focal-updates/universe amd64 Packages [111 kB]
Hit:18 http://ppa.launchpad.net/qbittorrent-team/qbittorrent-stable/ubuntu focal InRelease
Hit:19 http://ppa.launchpad.net/webupd8team/haguichi/ubuntu focal InRelease
Get:20 http://security.ubuntu.com/ubuntu focal-security/universe amd64 DEP-11 Metadata [31.5 kB]
Hit:21 http://archive.canonical.com/ubuntu eoan InRelease
Get:22 http://in.archive.ubuntu.com/ubuntu focal-updates/universe i386 Packages [60.9 kB
Get:23 http://in.archive.ubuntu.com/ubuntu focal-updates/universe Translation-en [52.3 kB
Get:24 http://in.archive.ubuntu.com/ubuntu focal-updates/universe amd64 DEP-11 Metadata [151 kB
Get:25 http://in.archive.ubuntu.com/ubuntu focal-updates/universe DEP-11 48x48 Icons [76.5 kB]
Get:26 http://in.archive.ubuntu.com/ubuntu focal-updates/universe DEP-11 64x64 Icons [121 kB]
Get:27 http://in.archive.ubuntu.com/ubuntu focal-updates/universe DEP-11 128x128 Icons [300 kB]
Get:28 http://in.archive.ubuntu.com/ubuntu focal-updates/universe amd64 c-n-f Metadata [4,112 B]
Get:29 http://in.archive.ubuntu.com/ubuntu focal-backports/universe amd64 DEP-11 Metadata [532 B]
Fetched 1,749 kB in 10s (170 kB/s)
Reading package lists... Done
Building dependency tree       
Reading state information... Done
12 packages can be upgraded. Run 'apt list --upgradable' to see them.

`

export default function CreatedStream({ match, handleCloseStream }) {
    const Streams = useStreams();
    const token = match.params.token;
    const [output, setOutput] = useState("");
    const [streamOpen, setStreamOpen] = useState(true);

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
                        <Button color='primary' startIcon={<OpenInBrowserOutlined />} variant="contained">Open In Browser</Button>
                        <Button color='secondary' onClick={() => handleCloseStream(token)} startIcon={<StopScreenShareOutlined />} variant="contained">Stop Stream</Button>
                    </div>
                </form>
            </Container>
        </Container>
}
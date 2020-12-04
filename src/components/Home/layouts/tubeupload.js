//
import React, { useState, useEffect } from 'react';
import { Typography, Container} from '@material-ui/core';

//Grabs third party stuff
import FlavouredInput from '../gadgets/FlavouredInput.js'
import Loader from '../gadgets/Loader.js';
import Button from './../../../atoms/button.js';
import { CloudUpload, AirplayOutlined } from '@material-ui/icons';
import { useStreams } from '../../../providers/streams-context';


// Defines window
const { dialog, currentWindow, shell, ipcRenderer } = window;


export default function TubeUpload({ history, handleError }) {
    const [videoUrl, setVideoUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(false)
    
    // Define some functions
    // This one does the magic and calls python
    const reuploadVideo = (e) => {
        const Streams = useStreams();
        e.preventDefault();
        let currentErrors = {};
        let hasErrors = false;
        // console.log(videoUrl)
        if (!videoUrl) {
            currentErrors.url = "Cannot be empty";
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(currentErrors);
            return;
        }

        setErrors(false);
        setLoading(true);
        Streams.beginReUpload(videoUrl).then(()=>console.log("downloading...")).catch(handleError).finally(()=>setLoading(false));
    }
    return <>
        <Loader open={loading}/>
        {/* Creates the container */}
        <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column', paddingTop: 20 }}>
            {/* Creates header div */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <CloudUpload /> <Typography variant="h6" style={{ paddingLeft: 10 }}>TubeUpload</Typography>
            </div>
            {/* Handles input of link and upload */}
            <Container maxWidth='lg' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1" style={{ flex: 1 }}>
                    Reupload videos to Skynet
                    <FlavouredInput value={videoUrl} onChange={setVideoUrl} error={errors ? errors.token : false} label="Video URL" tooltip="Paste in video link(without time stamp) and it'll automatically upload it to skynet!." />
                </Typography>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginBottom: 30, width: '100%', flex: 1 }}>
                    <Button type="submit" color='primary' onClick={reuploadVideo} startIcon={<AirplayOutlined />} variant="outlined" size="large">Re-upload Video</Button>
                </div>
            </Container>
        </Container>
    </>
}
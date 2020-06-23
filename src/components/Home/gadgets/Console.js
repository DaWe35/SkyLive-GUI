import React, { useRef, useEffect } from 'react';
import { makeStyles, useTheme, IconButton, Tooltip, Typography } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    greenHighlight: {
        borderWidth: '1px',
        borderColor: theme.palette.primary.main,
        borderStyle: 'solid',
        '&::selection': {
            backgroundColor: theme.palette.primary.light
        }
    },
    customScroll: {
        '&::-webkit-scrollbar': {
            width: '10px'
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: theme.palette.background.default,
        },
        '&::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.light,
            outline: '1px solid slategrey'
        },
        '&::-webkit-scrollbar-corner': {
            backgroundColor: theme.palette.background.default
        }
    }
}));


export default function Console({ label, tooltip, text, style, noTitle, hidden }) {
    const consoleRef = useRef(null)
    const theme = useTheme();
    const classes = useStyles(theme);

    useEffect(() => {
        // console.log("running as ", consoleRef.elem, consoleRef.scrollTop, consoleRef.current.scrollIntoView);
        // if (!consoleRef.scrollTop) return;
        consoleRef.current.scrollIntoView();
    }//ref.current.offsetTop)
        , [text])
    return <>
        {!noTitle && <Typography variant="subtitle2" style={{ display: 'flex', alignItems: 'center' }}>
            {label}
            <Tooltip title={tooltip} style={{ marginLeft: 20 }}>
                <IconButton aria-label="delete" size="small">
                    <InfoOutlined fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </Typography>}
        <div style={{ ...style, display: hidden === undefined ? 'flex' : (hidden ? 'none' : 'flex'), flexDirection: 'column', justifyContent: 'space-around', minHeight: 0, overflow: 'hidden' }}>
            <pre className={`${classes.greenHighlight} ${classes.customScroll}`} style={{ backgroundColor: 'black', overflow: 'scroll', height: "100%", minHeight: 0, padding: 10, margin: 0 }}>{text}
                <div ref={consoleRef} />
            </pre>
        </div>
    </>
}
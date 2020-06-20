import React from 'react';
import { makeStyles, useTheme, IconButton, Tooltip, Typography } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    greenHighlight: {
        '&::selection': {
            backgroundColor: theme.palette.primary.light
        }
    }
}));

export default function Console({ label, tooltip, text, style }) {
    const theme = useTheme();
    const classes = useStyles(theme);

    return <>
        <Typography variant="subtitle2" style={{ display: 'flex', alignItems: 'center' }}>
            {label}
            <Tooltip title={tooltip} style={{ marginLeft: 20 }}>
                <IconButton aria-label="delete" size="small">
                    <InfoOutlined fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </Typography>
        <div style={{ ...style, display: 'flex', flexDirection: 'column', backgroundColor: 'black', justifyContent: 'space-around', overflow: 'scroll', minHeight: 0, padding: 15 }}>
            <pre className={classes.greenHighlight} style={{ height: "100%", minHeight: 0, padding: 0, margin: 0 }}>{text}</pre>
        </div>
    </>
}
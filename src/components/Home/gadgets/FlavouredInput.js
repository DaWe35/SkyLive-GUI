import React from 'react';
import { Typography, Tooltip, IconButton, TextField, InputAdornment, makeStyles, useTheme } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    greenHighlight: {
        '&::selection': {
            backgroundColor: theme.palette.primary.light
        }
    }
}));

export default function FlavouredInput({ value, onChange, label, tooltip, error, endAdornment }) {
    const theme = useTheme();
    const classes = useStyles(theme);

    return <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" style={{ display: 'flex', alignItems: 'center' }}>
            {label}
            <Tooltip title={tooltip} style={{ marginLeft: 20 }}>
                <IconButton aria-label="delete" size="small">
                    <InfoOutlined fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </Typography>
        <TextField variant="outlined"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error ? true : false}
            helperText={error ? error : null}
            inputProps={{
                spellCheck: false,
                className: classes.greenHighlight
            }}
            InputProps={{
            endAdornment: !endAdornment ? null :
                <InputAdornment position="end">
                    <IconButton onClick={() => endAdornment.onClick()}>
                        <endAdornment.icon />
                    </IconButton>
                </InputAdornment>
        }}
        />
    </div>
}

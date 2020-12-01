import React, { useState, useEffect } from 'react';
import 'typeface-roboto';
import clsx from 'clsx';

import { withRouter } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Toolbar, ListSubheader, IconButton, ListItemSecondaryAction, Tooltip } from '@material-ui/core';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { PlaylistPlayOutlined, /* SlowMotionVideoOutlined, */ LowPriorityOutlined, CloseOutlined, CloudUpload } from '@material-ui/icons';
import { useStreams } from '../../../providers/streams-context';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    toolbar: {
        paddingTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    overrideLink: {
        '& a': {
            '&:link, &:visited, &:hover, &:active ': {
                color: 'white',
                textDecoration: 'none',
            }
        }
    },
    navArea: {
        height: '100%',
    },
    navList: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    logo: {
        maxWidth: '100%'
    },
    icon: {
        color: theme.palette.text.primary,
    },

    closeIcon: {
        color: theme.palette.text.secondary,
        '&:mouseover': {
            color: theme.palette.text.primary
        }
    }
}));

const homeTabs = [
/*     {
        title: 'Stream (RTMP)',
        to: '/stream_rtmp',
        icon: SlowMotionVideoOutlined
    }, */
    {
        title: 'Stream (HLS)',
        to: '/stream_hls',
        icon: PlaylistPlayOutlined
    },
    {
        title: 'Restream',
        to: '/restream',
        icon: LowPriorityOutlined
    },
    {
        title: 'tubeUpload',
        to: '/tube_upload',
        icon: CloudUpload
    },
]

// const openStreamTabs = [
//     {
//         title: 'Stream 1',
//         to: '/stream/1',
//         icon: SlowMotionVideoOutlined
//     },
//     {
//         title: 'Stream 2',
//         to: '/stream/2',
//         icon: PlaylistPlayOutlined
//     }
// ]


function Sidebar({ history, handleCloseStream }) {
    const Streams = useStreams();
    const classes = useStyles();

    const [openStreamTabs, setOpenStreamTabs] = useState([]);


    const handleClickClose = (event, token) => {
        event.stopPropagation();
        // //console.log(token);
        handleCloseStream(token);
    }

    useEffect(() => {
        // //console.log(Streams.allStreams);
        setOpenStreamTabs(Object.keys(Streams.allStreams)
            .reduce((streamsAccumulator, token) => {
                streamsAccumulator.push({ title: Streams.allStreams[token].title, to: ('/stream/' + token), icon: PlaylistPlayOutlined, token });
                return streamsAccumulator;
            }, []))
    }, [Streams.allStreams])

    return <>

        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <Toolbar className={classes.toolbar}>
                <img src={process.env.PUBLIC_URL + '/skylive.png'} alt='logo' className={classes.logo} />
            </Toolbar>
            <div className={classes.navArea}>
                <List className={clsx(classes.navList, classes.overrideLink)}
                    subheader={
                        <ListSubheader>
                            New Stream
                    </ListSubheader>
                    }
                >
                    {homeTabs.map((tab, index) => (
                        <ListItem button onClick={() => history.push(tab.to)} selected={window.location.href.split('#')[1] === tab.to ? true : false}>
                            <ListItemIcon><tab.icon className={classes.icon}/></ListItemIcon>
                            <ListItemText primary={tab.title} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List className={clsx(classes.navList, classes.overrideLink)}
                    subheader={
                        <ListSubheader>
                            On Air
                    </ListSubheader>
                    }
                >
                    {openStreamTabs.map((tab, index) => (
                        <ListItem button onClick={() => history.push('/stream/' + tab.token)} selected={window.location.href.split('#')[1] === tab.to ? true : false}>
                            <ListItemIcon><tab.icon className={classes.icon} /></ListItemIcon>
                            <Tooltip title={tab.title}>
                                <ListItemText primary={tab.title} primaryTypographyProps={{ style: { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflowX: 'hidden' } }} />
                            </Tooltip>
                            <ListItemSecondaryAction><IconButton size="small" aria-label="close" onClick={(event) => handleClickClose(event, tab.token)}><CloseOutlined className={classes.closeIcon} fontSize="inherit" /></IconButton></ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer >
    </>
}

export default withRouter(Sidebar);
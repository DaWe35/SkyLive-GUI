import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch} from 'react-router-dom';

import UpdateNotifications from './components/UpdateNotifications/UpdateNotifications.js';
import Home from './components/Home/Home.js'
import { ThemeProvider } from '@material-ui/core';
import theme from './theme.js';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <UpdateNotifications/>
        <Router>
            {/* <UpdateNotifications /> */}
            <Switch>
                <Route path="/" render={(props) => <Home />} />
            </Switch>
        </Router>
    </ThemeProvider>,
    document.getElementById('root')
);
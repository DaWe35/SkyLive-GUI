import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home/Home.js'
import { ThemeProvider } from '@material-ui/core';
import theme from './theme.js';
// import UpdateNotifications from './components/UpdateNotifications/UpdateNotifications.js';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <Router>
            {/* <UpdateNotifications /> */}
            <Switch>
                <Route path="/" render={(props) => <Home />} />
            </Switch>
        </Router>
    </ThemeProvider>,
    document.getElementById('root')
);
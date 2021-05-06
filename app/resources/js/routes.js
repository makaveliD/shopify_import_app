import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

/**
 * Import all page components here
 */
import App from './app';


/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
    <Router>
    <Route path="/" component={App}>
    </Route>
    </Router>
);

import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import Layout from './layout';
import Main from './main';
import Backup from './backup';

export default (
  <Router history={ browserHistory }>
    <Route component={ Layout }>
      <Route path="/" component={ Main } />
      <Route path="/backup" component={ Backup } />
    </Route>
  </Router>
);

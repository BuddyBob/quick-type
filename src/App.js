import React, { Component } from 'react';
import { Route, HashRouter as Switch } from 'react-router-dom';

import { AuthProvider } from './components/context/AuthContext';
import ForgotPassword from './components/Register/ForgotPassword'
import Home from './Home';
import Info from './components/Pages/UserInfo/Info';
import Leaderboard from './components/Pages/LeaderBoard/Leaderboard'
import Login from './components/Register/Login'
import { HashRouter as Router } from 'react-router-dom';
import Settings from './components/Pages/UserSettings/Settings';
import Signup from './components/Register/Signup';
import Stats from './components/Pages/UserStats/Stats';

class QuickType extends Component {
  render() {
    return (
      <div className="app" basename='/index.html'>
        <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/settings" component={Settings}/>
            <Route exact path="/info" component={Info}/>
            <Route exact path="/signup" component={Signup}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/forgot-password" component={ForgotPassword}/>
            <Route exact path="/stats" component={Stats}/>
            <Route exact path="/leader-board" component={Leaderboard}/>
          </Switch>
        </AuthProvider>
        </Router>
      </div>
    );
  }
}
export default QuickType;
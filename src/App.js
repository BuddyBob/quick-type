import React, { Component } from 'react';
import { AuthProvider } from './components/context/AuthContext';
import { HashRouter as Router } from 'react-router-dom';
import { HashRouter as Switch, Route } from 'react-router-dom';
import Home from './Home';
import Info from './components/Pages/UserInfo/Info';
import Stats from './components/Pages/UserStats/Stats';
import Settings from './components/Pages/UserSettings/Settings';
import Login from './components/Register/Login'
import Signup from './components/Register/Signup';
import ForgotPassword from './components/Register/ForgotPassword'

class App extends Component {
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
          </Switch>
        </AuthProvider>
        </Router>
      </div>
    );
  }
}
export default App;

import Home from './Home';
import Info from './components/Pages/Info';
import Settings from './components/Pages/Settings';
import Login from './components/Register/Login'
import Signup from './components/Register/Signup';
import React, { Component } from 'react';
import { AuthProvider } from './components/context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { BrowserRouter as Switch, Route } from 'react-router-dom';

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
            <Route exact path="/forgot-password" component={Login}/>
          </Switch>
        </AuthProvider>
        </Router>
      </div>
    );
  }
}
export default App;
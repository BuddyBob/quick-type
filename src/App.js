import React, { Component } from 'react';
import Home from './Home';
import Settings from './Settings';
import Info from './Info'
import Signup from './components/Register/Signup';
import { AuthProvider } from './components/context/AuthContext'
import { BrowserRouter as Router } from 'react-router-dom'
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
          </Switch>
        </AuthProvider>
        </Router>
      </div>
    );
  }
}
export default App;
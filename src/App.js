/* eslint-disable import/first */
import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from './components/context/AuthContext';
import ForgotPassword from './components/Register/ForgotPassword';
import Home from './Home';
import Info from './components/Pages/UserInfo/Info';
import Leaderboard from './components/Pages/LeaderBoard/Leaderboard';
import Login from './components/Register/Login';
import React from 'react';
import Settings from './components/Pages/UserSettings/Settings';
import Signup from './components/Register/Signup';
import Stats from './components/Pages/UserStats/Stats';

class QuickType extends React.Component {
  render() {
    return (
      <div className="app" basename="/index.html">
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/info" element={<Info />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route exact path="/stats" element={<Stats />} />
            <Route exact path="/leader-board" element={<Leaderboard />} />
          </Routes>
        </AuthProvider>
      </div>
    );
  }
}

export default QuickType;
/* eslint-disable import/first */
import QuickType from './App';
import React from 'react';
import ReactDOM from "react-dom/client";
import { HashRouter as Router } from 'react-router-dom';
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<Router>
    < QuickType />
</Router>
);
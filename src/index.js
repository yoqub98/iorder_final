import React from 'react';
import ReactDOM from 'react-dom/client';


import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import RouterApp from './RouterApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <RouterApp />

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

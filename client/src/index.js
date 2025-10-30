import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
//import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

// App in strict mode
// deleted because it rendered components twice
// which caused problem with executing onSubmit twice
  /*<React.StrictMode>
    <App />
  </React.StrictMode>
  */

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

      <App />
      
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

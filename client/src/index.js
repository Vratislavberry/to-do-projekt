import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
//import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import global_cz from "./translations/czech/global.json";
import global_en from "./translations/english/global.json";

i18next.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: "cz", // default language
  fallbackLng: "en", // use if lng is not available
  ns: ["global"],
  defaultNS: "global",
  resources: {
    en: { global: global_en },
    cz: { global: global_cz },
  },
});

// App in strict mode
// deleted because it rendered components twice
// which caused problem with executing onSubmit twice
/*<React.StrictMode>
    <App />
  </React.StrictMode>
  */

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

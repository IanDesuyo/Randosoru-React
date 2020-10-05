import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";
import "./i18n";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
});

ReactDOM.render(
  <React.StrictMode>
    {/* <Sentry.ErrorBoundary showDialog> */}
    <App />
    {/* </Sentry.ErrorBoundary> */}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

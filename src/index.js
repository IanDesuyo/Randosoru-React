import React, { Suspense, Fragment } from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";
import "./i18n";
import * as Sentry from "@sentry/react";
import { version as app_version } from "../package.json";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: "randosoru-react@" + app_version,
  whitelistUrls: [/guild\.randosoru\.me/],
});

ReactDOM.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary showDialog>
    <Suspense fallback={<Fragment />}>
      <App />
    </Suspense>
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

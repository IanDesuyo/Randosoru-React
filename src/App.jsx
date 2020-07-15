import React, { Fragment, Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Analytics from "react-router-ga";

const Index = lazy(() => import("./Views/Index"));
const Login = lazy(() => import("./Views/Login"));
const DiscordOauthRedirect = lazy(() => import("./Views/DiscordOauthRedirect"));
const LineOauthRedirect = lazy(() => import("./Views/LineOauthRedirect"));
const UserProfile = lazy(() => import("./Views/UserProfile"));
const FormRecord = lazy(() => import("./Views/FormRecord"));

function App() {
  return (
    <BrowserRouter>
      <Analytics id="UA-170804064-1">
        <Suspense fallback={<Fragment />}>
          <Switch>
            <Route exact path="/" component={HomeLayout} />
            <Route path="/login" component={AuthLayout} />
            <Route path={["/users", "/user"]} component={UserLayout} />
            <Route path={["/forms", "/form"]} component={FormLayout} />
          </Switch>
        </Suspense>
      </Analytics>
    </BrowserRouter>
  );
}

function HomeLayout() {
  return (
    <Fragment>
      <Navbar position="sticky" />
      <Suspense fallback={<Fragment />}>
        <Index />
      </Suspense>
    </Fragment>
  );
}

function AuthLayout() {
  return (
    <Switch>
      <Route exact path="/login/oauth/discord" component={DiscordOauthRedirect} />
      <Route exact path="/login/oauth/line" component={LineOauthRedirect} />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}

function UserLayout() {
  return (
    <Fragment>
      <Navbar position="sticky" />
      <Suspense fallback={<Fragment />}>
        <Switch>
          <Route exact path="/users/:id" component={UserProfile} />
          <Redirect exact from="/user/:id" to="/users/:id" />
          <Redirect exact from="/users" to="/users/me" />
          <Redirect exact from="/user" to="/users/me" />
        </Switch>
      </Suspense>
    </Fragment>
  );
}

function FormLayout() {
  return (
    <Fragment>
      <Navbar position="static" />
      <Suspense fallback={<Fragment />}>
        <Switch>
          <Route exact path="/forms/:id/week/:week" component={FormRecord} />
          <Redirect exact from="/form/:id/week/:week" to="/forms/:id/week/:week" />
          <Redirect exact from="/forms/:id" to="/forms/:id/week/1" />
        </Switch>
      </Suspense>
    </Fragment>
  );
}

export default App;

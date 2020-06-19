import React, { Fragment, Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./Components/Navbar";

const Index = lazy(() => import("./Views/Index"));
const Login = lazy(() => import("./Views/Login"));
const DiscordOauthRedirect = lazy(() => import("./Views/DiscordOauthRedirect"));
const LineOauthRedirect = lazy(() => import("./Views/LineOauthRedirect"));
const UserProfile = lazy(() => import("./Views/UserProfile"));
const GuildRecord = lazy(() => import("./Views/GuildRecord"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fragment />}>
        <Switch>
          <Route exact path="/" component={HomeLayout} />
          <Route path="/login" component={AuthLayout} />
          <Route path={["/users", "/user"]} component={UserLayout} />
          <Route path="/guilds/:id" component={GuildLayout} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

function HomeLayout() {
  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<Fragment />}>
        <Index />
      </Suspense>
    </Fragment>
  );
}

function AuthLayout() {
  return (
    <Switch>
      <Route
        exact
        path="/login/oauth/discord"
        component={DiscordOauthRedirect}
      />
      <Route
        exact
        path="/login/oauth/line"
        component={LineOauthRedirect}
      />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}

function UserLayout() {
  return (
    <Fragment>
      <Navbar />
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

function GuildLayout() {
  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<Fragment />}>
        <Switch>
          <Route exact path="/guilds/:month/:week/:id" component={GuildRecord} />
          <Redirect exact from="/guild/:month/:week/:id" to="/guilds/:month/:week/:id" />
          <Redirect exact from="/guilds" to={"/guilds/" + new Date().getFullYear + new Date().getMonth+1 + "/" + 1 + "/:id"} />
        </Switch>
      </Suspense>
    </Fragment>
  );
}

export default App;

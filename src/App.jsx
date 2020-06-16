import React, { Fragment, Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Loader from "./Views/Loader";

const Index = lazy(() => import("./Views/Index"));
const Login = lazy(() => import("./Views/Login"));
const DiscordOauthRedirect = lazy(() => import("./Views/DiscordOauthRedirect"));
const UserProfile = lazy(() => import("./Views/UserProfile"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Fragment />}>
        <Switch>
          <Route path="/" exact>
            <Navbar />
            <Suspense fallback={<Fragment />}>
              <Index />
            </Suspense>
          </Route>
          <Route path="/login" component={AuthLayout} />
          <Route path={["/users", "/user"]}>
            <Navbar />
            <Suspense fallback={<Fragment />}>
              <UserLayout />
            </Suspense>
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
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
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}

function UserLayout() {
  return (
    <Switch>
      <Route exact path="/users/:id" component={UserProfile} />
      <Redirect exact from="/user/:id" to="/users/:id" />
      <Redirect exact from="/users" to="/users/me" />
      <Redirect exact from="/user" to="/users/me" />
    </Switch>
  );
}

export default App;

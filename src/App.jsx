import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import TopBar from "./Components/Navbar";
import Footer from "./Components/Footer"
import Home from "./Views/Home"
import UserProfile from "./Views/UserProfile"
import Login from "./Views/Login";
import Logout from "./Views/Logout";
import {OauthRedirect} from "./Views/OauthRedirect"

export default function App() {
  return (
    <BrowserRouter>
      <TopBar />
      <Switch>
        <Route path="/about" component={About} />
        <Route path={["/users", "/user", "/profile"]} component={UserLayout} />
        <Route path={["/guilds", "/guild"]} component={GuildLayout} />
        <Route path="/login" component={AuthLayout} />
        <Route path="/logout" component={Logout} />
        <Route exact path="/" component={Home} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

function UserLayout() {
  return (
    <Switch>
      <Route exact path="/users/:id" component={UserProfile}/>
      <Redirect exact from="/user/:id" to="/users/:id"/>
      <Redirect exact from="/users" to="/users/me"/>
      <Redirect exact from="/user" to="/users/me"/>
    </Switch>
  );
}

function GuildLayout() {
  return (
    <Switch>
      <Route exact path="/guilds/:id" component={UserProfile}/>
      <Redirect exact from="/guild/:id" to="/guilds/:id"/>
      <Redirect exact from="/guild" to="/guilds/"/>
    </Switch>
  );
}

function AuthLayout() {
  return (
    <Switch>
      <Route exact path="/login/oauth/discord" component={OauthRedirect.discord} />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}

function About() {
  return <h2>About</h2>;
}

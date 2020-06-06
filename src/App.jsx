import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer"
import Home from "./Views/Home"
import Login from "./Views/Login";
import Logout from "./Views/Logout";
import {OauthRedirect} from "./Views/OauthRedirect"

export default function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route exact path="/login/oauth/discord" component={OauthRedirect.discord} />
      <Route exact path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Footer />
    </Router>
  );
}


function About() {
  return <h2>About</h2>;
}

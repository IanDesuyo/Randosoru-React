import React from "react";
import { Link, Redirect } from "react-router-dom";
import { authenticationService } from "../Services/Auth/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faLine } from "@fortawesome/free-brands-svg-icons";
import "./Login.css";

export default function Login(props) {
  if (authenticationService.currentUserValue) {
    return (<Redirect to="/" />)
  }
  return (
    <div className="container mt-5">
      <h1>Login with</h1>
      <div className="flex mt-4">
        <Link
          to="route"
          target="_parent"
          onClick={(e) => {
            e.preventDefault();
            authenticationService.login_discord();
          }}
        >
          <FontAwesomeIcon icon={faDiscord} size="6x" />
        </Link>

        <FontAwesomeIcon icon={faLine} size="6x" color="#82c91e" />
      </div>
    </div>
  );
}


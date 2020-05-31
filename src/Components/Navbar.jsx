import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { authenticationService } from "../Services/Auth/AuthService";

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        {t("NavBrand")}
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav mr-auto">
          <NavLink
            exact
            to="/"
            className="nav-item nav-link"
            activeClassName="nav-item nav-link active"
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className="nav-item nav-link"
            activeClassName="nav-item nav-link active"
          >
            About
          </NavLink>
        </div>
        <div className="navbar-nav">
          {authenticationService.currentUserValue ? (
            <NavLink to="/logout"  className="nav-item nav-link">Logout</NavLink>
          ) : (
            <NavLink to="/login"  className="nav-item nav-link">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

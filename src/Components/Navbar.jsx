import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { AuthService } from "../Services/Auth/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    AuthService.currentUser.subscribe((x) => setCurrentUser(x));
  });

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top ">
      <Link to="/" className="navbar-brand">
        {t("Brand")}
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
            {t("NavBar.Home")}
          </NavLink>
          <NavLink
            to="/about"
            className="nav-item nav-link"
            activeClassName="nav-item nav-link active"
          >
            {t("NavBar.About")}
          </NavLink>
        </div>
        <div className="navbar-nav">
          <li className="nav-item dropdown mr-3">
            <a
              href="/#"
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faGlobe} />
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a
                className="dropdown-item"
                href="/#"
                onClick={() => changeLanguage("zh-TW")}
              >
                繁體中文
              </a>
              <a
                className="dropdown-item"
                href="/#"
                onClick={() => changeLanguage("ja")}
              >
                日本語
              </a>
              <a
                className="dropdown-item"
                href="/#"
                onClick={() => changeLanguage("en")}
              >
                English
              </a>
            </div>
          </li>
          {currentUser ? (
            <NavLink to="/logout" className="nav-item nav-link">
              {t("NavBar.Logout")}
            </NavLink>
          ) : (
            <NavLink to="/login" className="nav-item nav-link">
              {t("NavBar.Login")}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

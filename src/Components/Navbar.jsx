import React from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthService } from "../Services/Auth/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { withTranslation } from "react-i18next";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

class LegacyTopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  }

  componentWillMount() {
    AuthService.currentUser.subscribe((x) => this.setState({ user: x }));
  }

  render() {
    const { t, i18n } = this.props;
    return (
      <Navbar
        bg="dark"
        expand="lg"
        sticky="top"
        variant="dark"
        collapseOnSelect
      >
        <Link to="/" className="navbar-brand">
          {t("Brand")}
        </Link>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <NavLink
              exact
              to="/"
              className="nav-item nav-link"
              eventKey="1"
            >
              {t("NavBar.Home")}
            </NavLink>
            <NavLink
              to="/about"
              className="nav-item nav-link"
              eventKey="2"
            >
              {t("NavBar.About")}
            </NavLink>
            {this.state.user ? (
              <NavLink
                to="/users/me"
                className="nav-item nav-link"
                eventKey="3"
              >
                {t("NavBar.MyProfile")}
              </NavLink>
            ) : (
              <> </>
            )}
          </Nav>
          <Nav>
            <NavDropdown
              title={<FontAwesomeIcon icon={faGlobe} />}
              id="collasible-nav-dropdown"
              className="mr-4"
            >
              <NavDropdown.Item onClick={() => i18n.changeLanguage("zh-TW")}>
                繁體中文
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => i18n.changeLanguage("ja")}>
                日本語
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => i18n.changeLanguage("en")}>
                English
              </NavDropdown.Item>
            </NavDropdown>
            {this.state.user ? (
              <NavLink
                to="/logout"
                className="nav-item nav-link"
                eventKey="4"
              >
                {t("NavBar.Logout")}
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                className="nav-item nav-link"
                eventKey="5"
              >
                {t("NavBar.Login")}
              </NavLink>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const TopBar = withTranslation()(LegacyTopBar);
export default TopBar;

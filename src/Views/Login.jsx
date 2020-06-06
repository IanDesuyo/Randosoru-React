import React from "react";
import { Link, Redirect } from "react-router-dom";
import { AuthService } from "../Services/Auth/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faLine } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

export default function Login(props) {
  const { t } = useTranslation();

  if (AuthService.currentUserValue) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container mt-5">
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>開發中!</strong> 暫不支持Line登入
      </div>
      <div className="card text-center rounded">
        <div className="card-body">
          <h4 className="card-title">{t("Login.Title")}</h4>
          <div className="d-flex flex-column justify-content-center">
            <Link
              to="redirect"
              onClick={(e) => {
                e.preventDefault();
                AuthService.login_discord();
              }}
            >
              <FontAwesomeIcon icon={faDiscord} size="6x" color="#7289DA" />
            </Link>
            <Link
              to="redirect"
              className="mt-4"
              onClick={(e) => {
                e.preventDefault();
                AuthService.login_discord();
              }}
            >
              <FontAwesomeIcon icon={faLine} size="6x" color="#00C300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

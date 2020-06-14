import React from "react";
import "./Home.css";

import { useTranslation } from "react-i18next";

export default function Login(props) {
  const { t } = useTranslation();

  return (
    <>
      <div className="home-bg">
        <div className="container">
          <div className="jumbotron">
            <h1 className="display-4">Hello, world!</h1>
            <p className="lead">ここはランドソルギルド管理協会です！</p>
            <hr className="my-4" />
            <button className="btn btn-primary" type="button" disabled>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Now Building...
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

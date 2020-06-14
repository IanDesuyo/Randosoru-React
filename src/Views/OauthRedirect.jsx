import React from "react";
import axios from "axios";
import Loader from "../Loader";

export const OauthRedirect = {
  discord,
};

function discord() {
  let querys = new URLSearchParams(window.location.search);
  if (querys.get("code")) {
    axios
      .post("/api/oauth/discord?code=" + querys.get("code"))
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.removeItem("me");
        window.close();
      })
      .catch((error) => {
        console.error(error);
        window.close();
      });
    return <Loader />;
  } else {
    return (
      <div className="container mt-3">
        <div className="alert alert-danger" role="alert">
          ERROR! Please try again (ﾟДﾟ*)ﾉ 
        </div>
      </div>
    );
  }
}

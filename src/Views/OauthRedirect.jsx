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
        window.close();
      })
      .catch((error) => {
        console.error(error);
        window.close();
      });
    return <Loader />;
  } else {
    return (
      <>
        <div className="container text-center text-danger">ERROR</div>
      </>
    );
  }
}

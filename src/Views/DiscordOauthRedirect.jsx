import React from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import MuiAlert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { useEffect } from "react";
import { useState } from "react";

export default function Discord() {
  const [error, setError] = useState(null);

  const fetchToken = () => {
    localStorage.removeItem("me");
    localStorage.removeItem("login_status");
    let querys = new URLSearchParams(window.location.search);
    if (querys.get("code")) {
      axios
        .post("/api/oauth/discord?code=" + querys.get("code"))
        .then(res => {
          localStorage.setItem("token", res.data.token);
          window.close();
        })
        .catch(error => {
          localStorage.setItem("login_status", error.response.data.detail);
          setError(error.response.data.detail);
          localStorage.removeItem("token");
          window.close();
        });
    } else {
      setError("ERROR! Please try again (ﾟДﾟ*)ﾉ");
    }
  };

  useEffect(() => {
    document.title = "Redirecting...";
    fetchToken();
  });

  return (
    <div>
      {!error ? <LinearProgress /> : <></>}
      <Container>
        <Box mt={3}>
          <MuiAlert elevation={6} variant="filled" severity={!error ? "info" : "error"}>
            {error || "Redirecting..."}
          </MuiAlert>
        </Box>
      </Container>
    </div>
  );
}

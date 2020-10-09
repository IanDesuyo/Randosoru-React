import React from "react";
import Axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import MuiAlert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../Services/Auth";
import ErrorHandler from "../Services/ErrorHandler";

export default function Discord() {
  const { setToken } = useAuth();
  const [error, setError] = useState(null);

  const fetchToken = () => {
    document.title = "Redirecting...";
    localStorage.removeItem("me");
    localStorage.removeItem("loginStatus");
    let querys = new URLSearchParams(window.location.search);
    if (querys.get("code")) {
      Axios.post("/api/oauth/line?code=" + querys.get("code"))
        .then(res => {
          setToken(res.data.token);
          window.close();
        })
        .catch(error => {
          ErrorHandler(error);
          localStorage.setItem("loginStatus", error.response.data.detail);
          setError(error.response.data.detail);
          localStorage.removeItem("token");
          window.close();
        });
    } else {
      setError("ERROR! Please try again (ﾟДﾟ*)ﾉ");
    }
  };

  useEffect(fetchToken, []);

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

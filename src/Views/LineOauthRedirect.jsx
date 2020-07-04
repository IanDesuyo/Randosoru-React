import React from "react";
import axios from "axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import MuiAlert from "@material-ui/lab/Alert";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";

export default function discord() {
  document.title = "Redirecting...";
  let querys = new URLSearchParams(window.location.search);
  if (querys.get("code")) {
    axios
      .post("/api/oauth/line?code=" + querys.get("code"))
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.removeItem("me");
        localStorage.removeItem("login_status");
        window.close();
      })
      .catch((error) => {
        localStorage.setItem("login_status", error.response.data.detail);
        localStorage.removeItem("me");
        localStorage.removeItem("token");
        window.close();
      });
    return (
      <div>
        <LinearProgress />
        <Container>
          <Box mt={3}>
            <MuiAlert elevation={6} variant="filled" severity="info">
              Redirecting...
            </MuiAlert>
          </Box>
        </Container>
      </div>
    );
  } else {
    return (
      <Container>
        <Box mt={3}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            ERROR! Please try again (ﾟДﾟ*)ﾉ
          </MuiAlert>
        </Box>
      </Container>
    );
  }
}
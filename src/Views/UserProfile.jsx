import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Container from "@material-ui/core/Container";
import MuiAlert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Grid } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuth } from "../Services/Auth";
import ErrorHandler from "../Services/ErrorHandler";

const useStyles = makeStyles(theme => ({
  avatarBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

export default function UserProfile() {
  const { id } = useParams();
  const classes = useStyles();
  const { t } = useTranslation();
  const { token } = useAuth();
  const [status, setStatus] = useState();
  const [data, setData] = useState();

  const fetchUser = () => {
    document.title = t("Profile") + " - " + t("Brand");
    if (id !== "me" && (id.length < 6 || id.length > 10)) {
      return setStatus(400);
    } else if (id === "me" && !token) {
      return setStatus(401);
    }

    Axios.get(
      "/api/profile/users/" + id,
      token
        ? {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        : null
    )
      .then(res => {
        setData(res.data);
        setStatus(200);
        document.title = res.data.name + " - " + t("Brand");
      })
      .catch(error => {
        ErrorHandler(error);
        setStatus(error.response.status);
      });
  };

  useEffect(fetchUser, [id]);

  if (!status) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (status === 200) {
    return (
      <Container>
        <Box mt={3} className={classes.avatarBox}>
          <Avatar src={data.avatar} className={classes.avatar} />
          <Typography component="h1" gutterBottom variant="h5">
            {data.name}
          </Typography>
        </Box>
        <Divider />
        <Grid>
          <Typography gutterBottom variant="body1">
            {"ID: " + data.id}
          </Typography>
        </Grid>
        <Grid>
          <Typography gutterBottom variant="body1">
            {t("UID") + ": " + (data.uid || t("UID_Null"))}
          </Typography>
        </Grid>
        <Grid>
          <Typography gutterBottom variant="body1">
            {t("JoinedGuild") + ": " + (data.guild ? data.guild.name : t("Guild_Null"))}
          </Typography>
        </Grid>
        <Grid>
          <Typography gutterBottom variant="body1">
            {t("CreatedAt") + ": " + new Date(data.created_at * 1000).toLocaleString()}
          </Typography>
        </Grid>
      </Container>
    );
  }
  let error;
  switch (status) {
    case 400:
      error = t("Alerts.UserNotFound");
      break;
    case 401:
      error = t("Alerts.NotLogin");
      break;
    case 403:
      error = t("Alerts.ProfileNoPerms");
      break;
    case 404:
      error = t("Alerts.UserNotFound");
      break;
    default:
      error = t("Alerts.Error");
  }
  return (
    <Container>
      <Box mt={3}>
        <MuiAlert elevation={6} variant="filled" severity="error">
          {error}
        </MuiAlert>
      </Box>
    </Container>
  );
}

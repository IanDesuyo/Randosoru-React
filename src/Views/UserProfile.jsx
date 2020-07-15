import React, { useState } from "react";
import AuthService from "../Services/AuthService";
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
import { useEffect } from "react";

const useStyles = makeStyles(theme => ({
  avatar_box: {
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
  const { t } = useTranslation();
  let { id } = useParams();
  const classes = useStyles();
  const [status, setStatus] = useState(0);
  const [data, setData] = useState(null);

  const getUser = () => {
    if (id !== "me" && (id.length < 6 || id.length > 10)) {
      return setStatus(400);
    } else if (id === "me" && !AuthService.currentUserValue) {
      return setStatus(4011);
    }
    Axios.get(
      "/api/profile/users/" + id,
      id === "me"
        ? {
            headers: {
              Authorization: "Bearer " + AuthService.currentUserValue,
            },
          }
        : null
    )
      .then(res => {
        setData(res.data);
        setStatus(200);
      })
      .catch(error => {
        AuthService.errorHandler(error);
        setStatus(error.response.status);
      });
  };

  useEffect(() => {
    getUser();
  }, [id]);

  if (status === 0) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (status === 200) {
    return (
      <Container>
        <Box mt={3} className={classes.avatar_box}>
          <Avatar src={data.avatar} className={classes.avatar} />
          <Typography component="h1" gutterBottom variant="h5">
            {data.name}
          </Typography>
        </Box>
        <Divider />
        <Grid>
          <Typography gutterBottom variant="body1">
            {t("UID")}
            {": "}
            {data.uid ? data.uid : t("UID_Null")}
          </Typography>
        </Grid>
        <Grid>
          <Typography gutterBottom variant="body1">
            {t("JoinedGuild")}
            {": "}
            {data.guild ? data.guild.name : t("Guild_Null")}
          </Typography>
        </Grid>
        <Grid>
          <Typography gutterBottom variant="body1">
            {t("CreatedAt")}
            {": "}
            {new Date(data.created_at * 1000).toLocaleString()}
          </Typography>
        </Grid>
      </Container>
    );
  }
  let errorMsg;
  switch (status) {
    case 400:
      errorMsg = t("Alerts.UserNotFound");
      break;
    case 4011:
      errorMsg = t("Alerts.NotLogin");
      break;
    case 403:
      errorMsg = t("Alerts.ProfileNoPerms");
      break;
    case 404:
      errorMsg = t("Alerts.UserNotFound");
      break;
    default:
      errorMsg = t("Alerts.Error");
  }
  return (
    <Container>
      <Box mt={3}>
        <MuiAlert elevation={6} variant="filled" severity="error">
          {errorMsg}
        </MuiAlert>
      </Box>
    </Container>
  );
}

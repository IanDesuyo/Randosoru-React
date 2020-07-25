import React from "react";
import { Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthService from "../Services/AuthService";
import toastr from "toastr";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import SvgIcon from "@material-ui/core/SvgIcon";
import LockOutlinedIcon from "@material-ui/icons/LockOpenOutlined";
import MuiAlert from "@material-ui/lab/Alert";
import { useState } from "react";
import { useEffect } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(/static/images/randosoru.png)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  login_icon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  discord_btn: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(4),
    backgroundColor: "#7289DA",
    "&:hover": {
      backgroundColor: "#2C2F33",
    },
    color: "#FFFFFF",
  },
  line_btn: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(8),
    backgroundColor: "#00B900",
    "&:hover": {
      backgroundColor: "#2C2F33",
    },
    color: "#FFFFFF",
  },
  btn_icon: {
    paddingRight: theme.spacing(2),
  },
  error_msg: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
}));

export default function Login(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [errmsg] = useState(localStorage.getItem("login_status"));

  useEffect(() => {
    localStorage.removeItem("login_status");
  });

  if (AuthService.currentUserValue) {
    return <Redirect to="/" />;
  }

  return (
    <Grid container component="main" className={classes.root}>
      <Grid item xs={false} sm={4} md={8} className={classes.image} />
      <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.login_icon}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("Login")}
          </Typography>
          <Box mt={3}>
            <Button
              variant="contained"
              className={classes.discord_btn}
              onClick={() => {
                AuthService.login_discord();
                toastr.info(t("Redirecting"), "", {
                  closeButton: true,
                  positionClass: "toast-bottom-right",
                });
              }}
            >
              <SvgIcon viewBox="0 0 245 240" className={classes.btn_icon} fontSize="large">
                <path
                  className="st0"
                  d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zM140.9 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"
                />
                <path
                  className="st0"
                  d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.1-10.5 28.1-10.5l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s13.7-.3 28.1 10.5c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"
                />
              </SvgIcon>
              Signin with Discord
            </Button>
          </Box>
          <Box mt={2}>
            <Button
              variant="contained"
              className={classes.line_btn}
              onClick={() => {
                AuthService.login_line();
                toastr.info(t("Redirecting"), "", {
                  closeButton: true,
                  positionClass: "toast-bottom-right",
                });
              }}
            >
              <SvgIcon viewBox="0 0 448 512" className={classes.btn_icon} fontSize="large">
                <path
                  fill="currentColor"
                  d="M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z"
                ></path>
              </SvgIcon>
              Signin with Line
            </Button>
          </Box>
          {errmsg ? (
            <Box mt={4}>
              <MuiAlert
                elevation={6}
                variant="filled"
                severity="error"
                className={classes.error_msg}
              >
                {errmsg}
              </MuiAlert>
            </Box>
          ) : (
            <></>
          )}
          <Box mt={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              Copyright © randosoru.me {new Date().getFullYear()}.
            </Typography>
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}

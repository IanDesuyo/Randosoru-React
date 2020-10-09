import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Axios from "axios";
import { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import MuiAlert from "@material-ui/lab/Alert";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import { Toolbar } from "@material-ui/core";
import ErrorHandler from "../Services/ErrorHandler";

export default function FormConfig() {
  let { id } = useParams();
  const { t } = useTranslation();
  const [status, setStatus] = useState();
  const [formDetail, setFormDetail] = useState();
  const [currentBoss, setCurrentBoss] = useState(0);

  const fetchFormDetails = () => {
    if (id.length !== 32) {
      setStatus(401);
      return;
    }
    Axios.get("/api/forms/" + id)
      .then(res => {
        setFormDetail(res.data);
        setStatus(200);
        document.title = `${res.data.title} - ${t("Title")}`;
        return;
      })
      .catch(error => {
        ErrorHandler(error);
        setStatus(error.response.status);
      });
  };

  const handleBossChange = (event, newValue) => {
    setCurrentBoss(newValue);
  };

  useEffect(fetchFormDetails, [id]);

  if (!status) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (status === 200) {
    return (
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Typography>
              {formDetail.title + (formDetail.description ? ` - ${formDetail.description}` : "")}
            </Typography>
          </Toolbar>
          <Tabs value={currentBoss} onChange={handleBossChange} variant="fullWidth">
            <Tab label="通用" />
            <Tab label="一王" />
            <Tab label="二王" />
            <Tab label="三王" />
            <Tab label="四王" />
            <Tab label="五王" />
          </Tabs>
          {JSON.stringify(formDetail[currentBoss - 1])}
        </AppBar>
      </div>
    );
  } else {
    let error;
    switch (status) {
      case 404:
        error = t("Alerts.FormNotFound");
        break;
      case 401:
        error = t("Alerts.FormBadID");
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
}

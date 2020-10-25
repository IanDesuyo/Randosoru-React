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
import webSocket from "socket.io-client";
import RecordTable from "../Components/RecordTable";
import { Toolbar } from "@material-ui/core";
import ErrorHandler from "../Services/ErrorHandler";

export default function FormRecord() {
  let { id, week } = useParams();
  const { t } = useTranslation();
  const [viewMode] = useState(0);
  const [status, setStatus] = useState();
  const [formDetail, setFormDetail] = useState();
  const [ws, setWs] = useState();

  const fetchFormDetails = () => {
    if (id.length !== 32) {
      setStatus(4001);
      return;
    }
    let weekValue = parseInt(week);
    if (isNaN(weekValue) || weekValue < 1 || weekValue > 200) {
      setStatus(4002);
      return;
    }
    setStatus(null);
    Axios.get("/api/forms/" + id)
      .then(res => {
        setFormDetail(res.data);
        setStatus(200);
        document.title = `${res.data.title} - ${t("Brand")}`;
        return;
      })
      .catch(error => {
        ErrorHandler(error);
        setStatus(error.response.status);
      });
  };

  useEffect(() => {
    fetchFormDetails();
    let socket = webSocket("/", { transports: ["websocket"] });

    socket.emit("track", { form_id: id });
    setWs(socket);

    return () => {
      socket.disconnect();
    };
  }, [id, viewMode]);

  if (!status) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (status === 200) {
    return (
      <div>
        {viewMode === 0 ? <FormView0 formDetail={formDetail} week={week} socket={ws} /> : <></>}
      </div>
    );
  } else {
    let error;
    switch (status) {
      case 404:
        error = t("Alerts.FormNotFound");
        break;
      case 4001:
        error = t("Alerts.FormBadID");
        break;
      case 4002:
        error = t("Alerts.FormBadWeek");
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

const FormView0 = props => {
  const { formDetail, week, socket } = props;
  const [currentBoss, setCurrentBoss] = useState(0);

  const handleBossChange = (event, newValue) => {
    setCurrentBoss(newValue);
  };

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <Typography>
            {formDetail.title + (formDetail.description ? ` - ${formDetail.description}` : "")}
          </Typography>
        </Toolbar>
        <Tabs value={currentBoss} onChange={handleBossChange} variant="fullWidth">
          <Tab label="一王" />
          <Tab label="二王" />
          <Tab label="三王" />
          <Tab label="四王" />
          <Tab label="五王" />
        </Tabs>
      </AppBar>
      <RecordTable formDetail={formDetail} week={week} boss={currentBoss + 1} socket={socket} />
    </div>
  );
};

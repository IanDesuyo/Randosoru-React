import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import RecordTable from "../Components/RecordTable";
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function BossTabs() {
  const classes = useStyles();
  let { week, id } = useParams();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState("Loading...");
  const [status, setStatus] = useState(0);
  const [month, setMonth] = useState();
  const [bossHPData, setBossHPData] = useState();

  const fetchFormData = () => {
    if (id.length !== 32) {
      setStatus(4001);
      return;
    }
    if (isNaN(parseInt(week))) {
      setStatus(4002);
      return;
    }
    Axios.get("/api/forms/" + id)
      .then((res) => {
        setTitle(res.data.title);
        setMonth(res.data.month);
        fetchBossHPData();
      })
      .catch((error) => {
        setStatus(error.response.status);
      });
  };

  const fetchBossHPData = () => {
    Axios.get("/static/boss.json")
      .then((res) => {
        setBossHPData(res.data);
        setStatus(200);
      })
      .catch((error) => {
        setStatus(error.response.status);
      });
  };

  useEffect(() => {
    fetchFormData();
  }, [id]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (status === 0) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (status === 200) {
    return (
      <div className={classes.root}>
        <AppBar position="sticky">
          <Tabs value={value} onChange={handleChange} variant="fullWidth">
            <Tab label="一王" />
            <Tab label="二王" />
            <Tab label="三王" />
            <Tab label="四王" />
            <Tab label="五王" />
          </Tabs>
        </AppBar>
        <RecordTable
          boss={value + 1}
          month={month}
          title={title}
          week={week}
          form_id={id}
          bossHPData={bossHPData}
        />
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

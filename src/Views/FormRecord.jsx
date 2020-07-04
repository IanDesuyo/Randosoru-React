import React from "react";
import PropTypes from "prop-types";
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

function TabPanel(props) {
  const { value, index, title, month, week, form_id } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <RecordTable
          open={value === index}
          boss={index + 1}
          month={month}
          title={title}
          week={week}
          form_id={form_id}
        />
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

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
  } else if (status === 404) {
    return (
      <Container>
        <Box mt={3}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {t("Alerts.FormNotFound")}
          </MuiAlert>
        </Box>
      </Container>
    );
  } else if (status === 4001) {
    return (
      <Container>
        <Box mt={3}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {t("Alerts.FormBadID")}
          </MuiAlert>
        </Box>
      </Container>
    );
  } else if (status === 4002) {
    return (
      <Container>
        <Box mt={3}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {t("Alerts.FormBadWeek")}
          </MuiAlert>
        </Box>
      </Container>
    );
  } else if (status !== 200) {
    return (
      <Container>
        <Box mt={3}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {t("Alerts.Error")}
          </MuiAlert>
        </Box>
      </Container>
    );
  }
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
      <TabPanel
        value={value}
        index={0}
        month={month}
        week={week}
        form_id={id}
        title={title}
      />
      <TabPanel
        value={value}
        index={1}
        month={month}
        week={week}
        form_id={id}
        title={title}
      />
      <TabPanel
        value={value}
        index={2}
        month={month}
        week={week}
        form_id={id}
        title={title}
      />
      <TabPanel
        value={value}
        index={3}
        month={month}
        week={week}
        form_id={id}
        title={title}
      />
      <TabPanel
        value={value}
        index={4}
        month={month}
        week={week}
        form_id={id}
        title={title}
      />
    </div>
  );
}

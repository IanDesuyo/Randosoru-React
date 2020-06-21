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
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState("Loading...");
  const [month, setMonth] = useState();

  const fetchFormData = () => {
    if (id === undefined) {
      return;
    }
    Axios.get("/api/forms/" + id)
      .then((res) => {
        setTitle(res.data.title);
        setMonth(res.data.month);
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  };

  useEffect(() => {
    fetchFormData();
    return () => {};
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
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

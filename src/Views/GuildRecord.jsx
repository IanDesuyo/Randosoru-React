import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import RecordTable from "../Components/RecordTable";
import { useParams } from "react-router-dom";

function TabPanel(props) {
  const { value, index, month, week, guild_id } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <RecordTable
          open={value === index}
          boss={index + 1}
          month={month}
          week={week}
          guild_id={guild_id}
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
  let { month, week, id } = useParams();
  const [value, setValue] = React.useState(0);

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
        guild_id={id}
      />
      <TabPanel
        value={value}
        index={1}
        month={month}
        week={week}
        guild_id={id}
      />
      <TabPanel
        value={value}
        index={2}
        month={month}
        week={week}
        guild_id={id}
      />
      <TabPanel
        value={value}
        index={3}
        month={month}
        week={week}
        guild_id={id}
      />
      <TabPanel
        value={value}
        index={4}
        month={month}
        week={week}
        guild_id={id}
      />
    </div>
  );
}

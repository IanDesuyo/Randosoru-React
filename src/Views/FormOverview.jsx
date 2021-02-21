import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import RecordRow from "../Components/RecordRow";
import PropTypes from "prop-types";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    padding: theme.spacing(2),
  },
  panel: {
    padding: theme.spacing(1),
  },
  watchList: {
    display: "flex",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const FormOverview = () => {
  const classes = useStyles();
  const { id } = useParams();
  const [status, detail, loading] = useOverview(id);
  const weeks = useMemo(() => Object.keys(status), [status]);
  const [enableWeeks, addEnable, disableWeeks, addDisable] = useWatchList(weeks);

  useEffect(() => {
    let { title } = detail;
    if (title) {
      window.document.title = title;
    }
  }, [detail]);

  if (loading) return <Typography variant="h5">群組資料獲取中</Typography>;

  return (
    <Grid container>
      <Grid container item className={classes.panel}>
        <Paper className={classes.root}>
          <Typography variant="h4">觀察清單</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            可自由選擇想觀察的周次，最多觀察 5 個周次
          </Typography>
          <WatchAccordion
            title={"未觀察"}
            deleteIcon={<AddCircleIcon />}
            weeks={disableWeeks}
            handleClick={addEnable}
          />
          <WatchAccordion title={"觀察中"} weeks={enableWeeks} handleClick={addDisable} />
        </Paper>
      </Grid>
      <Grid container item>
        <RecordRow boss={detail.boss} watchWeeks={enableWeeks} />
      </Grid>
    </Grid>
  );
};

function useOverview(formId) {
  const [formDetail, setDetail] = useState({});
  const [formStatus, setStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFormStatus(formId), fetchFormDetail(formId)])
      .then(res => {
        const [status, detail] = res;
        setDetail(detail);
        setStatus(status);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [formId]);

  return [formStatus, formDetail, loading];
}

function useWatchList(weeks) {
  const [enableWeeks, setEnable] = useState([]);
  const [disableWeeks, setDisable] = useState(weeks);
  const storageKey = "watchWeeks";
  const storageWeeks = JSON.parse(window.localStorage.getItem(storageKey) || "[]")
    .slice(0, 5)
    .sort();

  useEffect(() => {
    setEnable(storageWeeks);
    setDisable(weeks.filter(week => storageWeeks.indexOf(week) === -1));
  }, [weeks]);

  const handleAddEnable = week => {
    if (enableWeeks.length >= 5) return;
    let watchWeeks = [...enableWeeks, week].sort();
    setEnable(watchWeeks);
    setDisable(oldData => oldData.filter(oldWeek => oldWeek !== week).sort());
    window.localStorage.setItem(storageKey, JSON.stringify(watchWeeks));
  };

  const handleAddDisable = week => {
    let watchWeeks = enableWeeks.filter(oldWeek => oldWeek !== week).sort();
    setDisable(oldData => [...oldData, week].sort());
    setEnable(watchWeeks);
    window.localStorage.setItem(storageKey, JSON.stringify(watchWeeks));
  };

  return [enableWeeks, handleAddEnable, disableWeeks, handleAddDisable];
}

function fetchFormStatus(formId) {
  return Axios.get(`/api/forms/${formId}/status`).then(res => res.data);
}

function fetchFormDetail(formId) {
  return Axios.get(`/api/forms/${formId}`).then(res => res.data);
}

const WatchAccordion = props => {
  const classes = useStyles();
  const { weeks, title, handleClick, deleteIcon } = props;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.watchList}>
        <Grid container spacing={1}>
          {weeks.map(week => (
            <Grid item key={week}>
              <Chip
                variant="outlined"
                size="small"
                label={week}
                deleteIcon={deleteIcon}
                onDelete={() => handleClick(week)}
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

WatchAccordion.propTypes = {
  weeks: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  deleteIcon: PropTypes.node,
};

export default FormOverview;

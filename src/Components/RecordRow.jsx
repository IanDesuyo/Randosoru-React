import React, { useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/styles/makeStyles";
import { useParams } from "react-router-dom";
import Axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
}));

const RecordRow = () => {
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    Axios.get(`/api/forms/${id}/week/1`)
      .then(res => res.data)
      .then(console.log);
  });

  return (
    <Grid container className={classes.root}>
      <Grid container item>
        <Grid item>1周</Grid>
      </Grid>
    </Grid>
  );
};

export default RecordRow;

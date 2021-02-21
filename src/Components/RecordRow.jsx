import React, { useEffect, useState, useMemo } from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import makeStyles from "@material-ui/styles/makeStyles";
import { useParams } from "react-router-dom";
import Axios from "axios";
import PropTypes from "prop-types";
import Fade from "@material-ui/core/Fade";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import { Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  container: {
    display: "flex",
  },
  fadeArea: {
    padding: theme.spacing(1),
  },
  chips: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

/**
 * 獲取給定的周次陣列，進行記錄抓取，不重複抓已有的紀錄
 * @param {Array<Number>} weeks 周次陣列
 */
function useRecords(weeks) {
  const [records, setRecord] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    let oldRecords = { ...records };
    setLoading(true);
    Promise.all(
      weeks.map(week => {
        if (records[week]) return Promise.resolve();
        return fetchWeekRecord(id, week).then(res => {
          oldRecords[week] = res;
        });
      })
    )
      .then(() => {
        Object.keys(oldRecords)
          .filter(week => weeks.indexOf(week) === -1)
          .forEach(delWeek => delete oldRecords[delWeek]);

        setRecord(oldRecords);
      })
      .finally(() => setLoading(false));
  }, [weeks, id]);

  return [records, loading];
}

function fetchWeekRecord(id, week) {
  return Axios.get(`/api/forms/${id}/week/${week}`).then(res => res.data);
}

const RecordRow = props => {
  const { boss, watchWeeks } = props;
  const classes = useStyles();
  const [rowRecords, loading] = useRecords(watchWeeks);
  /**
   * 根據頭目做整理，將記錄分類
   */
  const bossRecords = useMemo(() => {
    let record = Array.from({ length: 5 }).map((_, index) => ({
      boss: { ...boss[index] },
      records: [],
    }));
    Object.keys(rowRecords)
      .sort()
      .forEach(week => {
        rowRecords[week].forEach(rec => {
          record[rec.boss - 1].records.push({ week, ...rec });
        });
      });
    return record;
  }, [rowRecords]);

  if (loading) return <Typography variant="h5">讀取中</Typography>;

  return (
    <Grid container className={classes.root}>
      <Grid container item>
        <Grid item>
          <Typography variant="h4">監控台</Typography>
        </Grid>
      </Grid>
      <Grid container item className={classes.root}>
        {bossRecords.map(record => (
          <BossRow
            weeks={watchWeeks}
            key={record.boss.boss}
            bossImage={record.boss.image}
            records={record.records}
          />
        ))}
      </Grid>
    </Grid>
  );
};

RecordRow.propTypes = {
  boss: PropTypes.array.isRequired,
  watchWeeks: PropTypes.array.isRequired,
};

const BossRow = props => {
  const [clicked, setClick] = useState(true);
  const { bossImage, records, weeks } = props;
  const classes = useStyles();

  return (
    <Grid container item>
      <Grid item>
        <FormControlLabel
          control={
            <IconButton onClick={() => setClick(!clicked)}>
              <Badge badgeContent={records.length} color="primary">
                <Avatar alt="test" src={bossImage} />
              </Badge>
            </IconButton>
          }
        />
      </Grid>
      <Fade in={clicked}>
        <Grid container item className={classes.fadeArea} spacing={1}>
          {weeks.map(week => (
            <Grid container item alignItems="center" spacing={1} key={week}>
              <Grid item>
                <Avatar>{week}</Avatar>
              </Grid>
              {records
                .filter(record => record.week === week)
                .map(record => (
                  <Grid item key={record.id}>
                    <RecordChips record={record} />
                  </Grid>
                ))}
            </Grid>
          ))}
        </Grid>
      </Fade>
    </Grid>
  );
};

BossRow.propTypes = {
  bossImage: PropTypes.string.isRequired,
  records: PropTypes.array.isRequired,
};

const RecordChips = props => {
  const classes = useStyles();
  const { record } = props;
  const { user, status } = record;
  const { t } = useTranslation();
  return (
    <Tooltip title={t(`Record.StatusType.${status}`)}>
      <Chip className={classes.chips} avatar={<Avatar src={user.avatar} />} label={user.name} />
    </Tooltip>
  );
};

export default RecordRow;

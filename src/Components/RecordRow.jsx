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
import webSocket from "socket.io-client";
import toastr from "toastr";

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
  s11: {
    backgroundColor: theme.palette.type === "dark" ? "#002047" : "#7cb6ff",
  },
  s21: {
    backgroundColor: theme.palette.type === "dark" ? "#33422c" : "#99e699",
  },
  s22: {
    backgroundColor: theme.palette.type === "dark" ? "#33422c" : "#99e699",
  },
  s23: {
    backgroundColor: theme.palette.type === "dark" ? "#ff473f" : "#FFD9D7",
  },
  s24: {
    backgroundColor: theme.palette.type === "dark" ? "#d9b100" : "#ffe066",
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
  const { t } = useTranslation();
  const [, setWs] = useState();

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

  const handleReceive = data => {
    if (data.data) {
      try {
        data.data.week = data.data.week.toString();
      } catch (err) {
        console.log(err);
      }
      let week = data.data.week;
      if (data.type === "RecUP") {
        if (data.data.status === 99) {
          setRecord(prev => {
            if (!prev[week]) return prev;
            let newRecords = prev[week].filter(row => row.id !== data.data.id);
            return {
              ...prev,
              [week]: newRecords,
            };
          });
        } else {
          setRecord(prev => {
            if (!prev[week]) return prev;
            let newRecords = prev[week].filter(row => row.id !== data.data.id);
            return {
              ...prev,
              [week]: [...newRecords, data.data].sort((a, b) => a.id - b.id),
            };
          });
        }
        toastr.success(
          t("Socket.RecUPMsg", {
            name: data.data.user.name,
            week: data.data.week,
            boss: data.data.boss,
            type: t("Record.StatusType." + data.data.status),
          }),
          t("Socket.RecUP"),
          {
            closeButton: true,
            positionClass: "toast-bottom-center",
          }
        );
      } else if (data.type === "RecNEW") {
        setRecord(prev => {
          if (!prev[week]) return prev;
          let newRecords = prev[data.data.week];
          return {
            ...prev,
            [data.data.week]: [...newRecords, data.data],
          };
        });
        toastr.success(
          t("Socket.RecNEWMsg", {
            name: data.data.user.name,
            week: data.data.week,
            boss: data.data.boss,
            type: t("Record.StatusType." + data.data.status),
          }),
          t("Socket.RecNEW"),
          {
            closeButton: true,
            positionClass: "toast-bottom-center",
          }
        );
      }
    }
  };
  const handleSocketError = (error, reason, socket) => {
    if (error) {
      toastr.error(t("Socket.ReConnecting"), t("Socket.ConnectError"), {
        closeButton: true,
        positionClass: "toast-bottom-center",
      });
    }
    if (reason) {
      console.log(reason);
      toastr.error(t("Socket.ReConnecting"), t("Socket.TransportError"), {
        closeButton: true,
        positionClass: "toast-bottom-center",
      });
      socket.connect();
    }
  };
  useEffect(() => {
    let socket = webSocket("/", { transports: ["websocket"] });
    socket.on("connect", () => socket.emit("track", { form_id: id }));
    socket.on("FormTracker", handleReceive);
    socket.on("connect_error", error => handleSocketError(error, null, socket));
    socket.on("disconnect", reason => handleSocketError(null, reason, socket));
    setWs(socket);

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [id]);

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
            bossName={record.boss.name}
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
  const { bossImage, bossName, records, weeks } = props;
  const classes = useStyles();

  return (
    <Grid container item>
      <Grid item>
        <FormControlLabel
          control={
            <Grid container alignItems="center">
              <Grid item>
                <IconButton onClick={() => setClick(!clicked)}>
                  <Badge badgeContent={records.length} color="primary">
                    <Avatar alt="test" src={bossImage} />
                  </Badge>
                </IconButton>
              </Grid>
              <Grid item>
                <Typography>{bossName}</Typography>
              </Grid>
            </Grid>
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
  bossName: PropTypes.string.isRequired,
  records: PropTypes.array.isRequired,
};

const RecordChips = props => {
  const classes = useStyles();
  const { record } = props;
  const { user, status } = record;
  const { t } = useTranslation();
  return (
    <Tooltip title={t(`Record.StatusType.${status}`)}>
      <Chip
        className={`${classes.chips} ${classes["s" + status] || ""}`}
        avatar={<Avatar src={user.avatar} />}
        label={user.name}
      />
    </Tooltip>
  );
};

export default RecordRow;

import React, { useEffect, useState, forwardRef, useMemo } from "react";
import MaterialTable from "material-table";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import RecordDialog from "./RecordDialog";
import RecordDetails from "./RecordDetails";
import Axios from "axios";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import StarIcon from "@material-ui/icons/Star";
import LinearProgress from "@material-ui/core/LinearProgress";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import ExportCsv from "../Services/ExportCsv";
import { MTableToolbar } from "material-table";
import { useAuth } from "../Services/Auth";
import { useFav } from "../Services/Favorite";
import ErrorHandler from "../Services/ErrorHandler";
import toastr from "toastr";

const tableIcons = {
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
};

const useStyles = makeStyles(theme => ({
  username: {
    marginLeft: theme.spacing(1),
    display: "flex",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  fab: {
    margin: "0px",
    top: "auto",
    right: "20px",
    bottom: "20px",
    left: "auto",
    position: "fixed",
  },
  bossImgBox: {
    paddingTop: theme.spacing(2),
  },
  bossImg: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  damageBar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    borderRadius: 5,
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#F04337",
  },
})(LinearProgress);

export default function RecordTable(props) {
  const { formDetail, week, boss, socket } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { token } = useAuth();
  const { isFav, setFav, removeFav, setCurrentForm } = useFav();
  const [isLoading, setLoading] = useState(true);
  const [recordDialogData, setRecordDialog] = useState(null);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [recordDetailsOpen, setRecordDetailsOpen] = useState(false);
  const [rowData, setRowData] = useState();

  const userID = useMemo(() => {
    try {
      let user = JSON.parse(atob(token.split(".")[1]));
      return user.id;
    } catch (e) {
      return null;
    }
  }, [token]);

  const handleRecordDialogOpen = (event, rowData) => {
    if (rowData) {
      setRecordDialog(rowData);
      if (userID === rowData.user.id) {
        setRecordDialogOpen(true);
      } else {
        setRecordDetailsOpen(true);
      }
    } else {
      setRecordDialogOpen(true);
    }
  };

  const handleRecordDetailsClose = () => {
    setRecordDetailsOpen(false);
    setTimeout(() => {
      setRecordDialog(null);
    }, 200);
  };

  const handleRecordDialogClose = value => {
    if (!value) {
      setRecordDialogOpen(false);
      setTimeout(() => {
        setRecordDialog(null);
      }, 200);
    } else {
      setLoading(true);
      Axios.post(
        `/api/forms/${formDetail.id}/week/${week}/boss/${boss}`,
        { ...value, month: formDetail.month },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then(() => {
          setLoading(false);
        })
        .catch(error => {
          ErrorHandler(error);
          setLoading(false);
        });
      setRecordDialogOpen(false);
      setTimeout(() => {
        setRecordDialog(null);
      }, 200);
    }
  };

  const fetchData = () => {
    setLoading(true);
    Axios.get(`/api/forms/${formDetail.id}/week/${week}/boss/${boss}`)
      .then(res => {
        setRowData(res.data);
        setLoading(false);
      })
      .catch(error => {
        ErrorHandler(error);
        setLoading(false);
      });
  };

  const backgroundColor = rowData => {
    let dark = theme.palette.type === "dark" ? true : false;
    let color;
    switch (rowData.status) {
      case 11:
        color = dark ? "#002047" : "#7cb6ff";
        break;
      case 21:
      case 22:
        color = dark ? "#33422c" : "#99e699";
        break;
      case 23:
        color = dark ? "#ff473f" : "#FFD9D7";
        break;
      case 24:
        color = dark ? "#d9b100" : "#ffe066";
        break;
      default:
        color = dark ? "#424242" : "#FFF";
    }
    return {
      backgroundColor: color,
    };
  };

  const { totalDamage, hpPercent, bossHp } = useMemo(() => {
    let totalDamage = 0;
    let hpPercent = 0;
    let bossHp = 0;
    if (rowData && rowData.length !== 0) {
      totalDamage = rowData.map(row => row.damage).reduce((pre, curr) => pre + curr);
    }
    if (!totalDamage) {
      totalDamage = 0;
    }

    let stage = 0;
    if (week >= 35) {
      stage = 3;
    } else if (week >= 11) {
      stage = 2;
    } else if (week >= 4) {
      stage = 1;
    }

    bossHp = formDetail.boss[boss - 1].hp[stage];
    hpPercent = ((bossHp - totalDamage) / bossHp) * 100;
    if (hpPercent < 0) {
      hpPercent = 0;
    }
    return { totalDamage, hpPercent, bossHp };
  }, [rowData]);

  const FormTracker = data => {
    switch (data.type) {
      case "RecUP":
        if (data.data.week === parseInt(week) && data.data.boss === parseInt(boss)) {
          if (data.data.status === 99) {
            setRowData(prev => prev.filter(row => row.id !== data.data.id));
          } else {
            setRowData(prev => [...prev.filter(row => row.id !== data.data.id), data.data]);
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
        }
        break;
      case "RecNEW":
        if (data.data.week === parseInt(week) && data.data.boss === parseInt(boss)) {
          setRowData(prev => [...prev, data.data]);
        }
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
        break;
      case "System":
        toastr.warning(data.message, t("Socket.System"), {
          closeButton: true,
          positionClass: "toast-bottom-center",
        });
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    setCurrentForm({ id: formDetail.id, week: parseInt(week), title: formDetail.title });
    if (isFav(formDetail.id)) {
      setFav(formDetail.title, formDetail.id, parseInt(week));
    }
    fetchData();
    if (socket) {
      socket.on("FormTracker", FormTracker);
    }
    return () => {
      setCurrentForm(null);
      socket.removeAllListeners("FormTracker");
    };
  }, [formDetail, week, boss, socket]);

  const mtable = useMemo(() => {
    return (
      <MaterialTable
        icons={tableIcons}
        title={t("Record.TitleFormat", {
          title: formDetail.boss[boss - 1].name,
          week: week,
        })}
        columns={[
          {
            title: "ID",
            field: "id",
            type: "numeric",
            defaultSort: "asc",
            hidden: true,
            export: false,
          },
          {
            title: t("Name"),
            field: "user.name",
            render: rowData => (
              <Grid container>
                <Avatar src={rowData.user.avatar} alt="Avatar" />
                {userID === rowData.user.id ? (
                  <Typography variant="h6" className={classes.username}>
                    * You
                  </Typography>
                ) : (
                  <Typography variant="body1" className={classes.username}>
                    {rowData.user.name}
                  </Typography>
                )}
              </Grid>
            ),
          },
          {
            title: t("Record.Comment"),
            field: "comment",
            emptyValue: t("Null"),
          },
          {
            title: t("Record.Damage"),
            field: "damage",
            hidden: document.body.clientWidth <= 1000,
            emptyValue: t("Record.Null"),
          },
          {
            title: t("Record.Status"),
            field: "status",
            lookup: {
              1: t("Record.StatusType.1"),
              2: t("Record.StatusType.2"),
              3: t("Record.StatusType.3"),
              11: t("Record.StatusType.11"),
              12: t("Record.StatusType.12"),
              13: t("Record.StatusType.13"),
              21: t("Record.StatusType.21"),
              22: t("Record.StatusType.22"),
              23: t("Record.StatusType.23"),
              24: t("Record.StatusType.24"),
              99: t("Record.StatusType.99"),
            },
          },
          {
            title: t("Record.LastModified"),
            field: "last_modified",
            type: "datetime",
            hidden: document.body.clientWidth <= 1000,
            render: rowData => <p>{new Date(rowData.last_modified * 1000).toLocaleString()}</p>,
          },
        ]}
        data={rowData}
        options={{
          search: false,
          exportButton: { csv: true },
          exportAllData: true,
          paging: false,
          exportCsv: (columnList, initialData) => {
            ExportCsv(
              columnList,
              initialData,
              t("Record.TitleFormat", {
                title: formDetail.title,
                week: week,
              }),
              t
            );
          },
          rowStyle: backgroundColor,
        }}
        onRowClick={handleRecordDialogOpen}
        localization={{
          body: {
            emptyDataSourceMessage: t("Record.NoRecord"),
          },
          toolbar: {
            exportTitle: t("Record.Export"),
            exportCSVName: t("Record.ExportCSV"),
          },
        }}
        components={{
          Toolbar: props => (
            <Grid container justify="center">
              <Grid
                item
                md={1}
                sm={2}
                xl={1}
                xs={false}
                align="center"
                className={classes.bossImgBox}
              >
                <Avatar
                  src={formDetail.boss[boss - 1].image}
                  variant="rounded"
                  className={classes.bossImg}
                />
              </Grid>
              <Grid item md={11} sm={10} xl={11} xs={12}>
                <MTableToolbar {...props} />
                <div className={classes.damageBar}>
                  <BorderLinearProgress variant="determinate" value={hpPercent} />
                  <p>{`${totalDamage} / ${bossHp} - ${Math.round(hpPercent)}%`}</p>
                </div>
              </Grid>
            </Grid>
          ),
        }}
        actions={[
          {
            icon: () => {
              return isFav(formDetail.id) ? <StarIcon /> : <StarBorderIcon />;
            },
            tooltip: t("Favorite"),
            onClick: () => {
              isFav(formDetail.id)
                ? removeFav(formDetail.title, formDetail.id)
                : setFav(formDetail.title, formDetail.id, parseInt(week));
            },
            isFreeAction: true,
          },
        ]}
      />
    );
  }, [rowData, isFav]);

  return (
    <>
      {mtable}
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {token ? (
        <Fab color="primary" className={classes.fab} onClick={handleRecordDialogOpen}>
          <AddIcon />
        </Fab>
      ) : (
        <></>
      )}
      <RecordDialog
        open={recordDialogOpen}
        onClose={handleRecordDialogClose}
        rowData={recordDialogData}
      />
      <RecordDetails
        open={recordDetailsOpen}
        onClose={handleRecordDetailsClose}
        rowData={recordDialogData}
      />
    </>
  );
}

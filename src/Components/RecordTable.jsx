import React from "react";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Typography, Grid, makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { AuthService } from "../Services/AuthService";
import RecordDialog from "./RecordDialog";
import Axios from "axios";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
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
}));

export default function RecordTable(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { open, month, week, boss, guild_id } = props;
  const [isLoading, setLoading] = useState(false);
  const [recordDialogData, setRecordDialog] = useState(null);
  const [inputBoxOpen, setInputBox] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [rowData, setRowData] = useState();

  const handleRecordDialogOpen = (event, rowData) => {
    console.log(rowData);
    setRecordDialog(rowData);
  };

  const handleRecordDialogClose = () => {
    setRecordDialog(null);
  };

  const fetchData = () => {
    setLoading(true);
    Axios.get(
      "/api/guilds/" + guild_id + "/records/" + month + "/" + week + "/" + boss
    )
      .then((res) => {
        setRowData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const getID = () => {
    try {
      let user = JSON.parse(atob(currentUser.split(".")[1]));
      return user.id;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const Authsubscribe = AuthService.currentUser.subscribe(setCurrentUser);
    fetchData();
    return () => {
      Authsubscribe.unsubscribe();
      setCurrentUser(null);
    };
  }, []);

  return (
    <>
      <MaterialTable
        icons={tableIcons}
        title={t("Record.TitleFormat", { month: month, week: week, boss: boss })}
        columns={[
          {
            title: "ID",
            field: "id",
            type: "numeric",
            defaultSort: "asc",
            hidden: true,
          },
          {
            title: t("Record.User.Name"),
            field: "user.name",
            render: (rowData) => (
              <Grid container>
                <Avatar src={rowData.user.avatar} />
                {getID() === rowData.user.id ? (
                  <Typography variant="h6" className={classes.username}>
                    * You
                  </Typography>
                ) : (
                  <>
                    <Typography variant="body1" className={classes.username}>
                      {rowData.user.name}
                    </Typography>
                  </>
                )}
              </Grid>
            ),
          },
          { title: t("Record.Comment"), field: "comment" },
          {
            title: t("Record.Damage"),
            field: "damage",
            hidden: true,
            emptyValue: t("Record.Null"),
            export: true,
          },
          {
            title: t("Record.Status"),
            field: "status",
            lookup: {
              1: t("Record.Formal"),
              2: t("Record.Reimburse"),
              3: t("Record.Kyaru"),
              11: t("Record.InBattle"),
              12: t("Record.Waiting"),
              13: t("Record.WaitingMention"),
              21: t("Record.Complete"),
              22: t("Record.Dead"),
              23: t("Record.NeedHelp"),
            },
          },
        ]}
        data={rowData}
        options={{ search: false, exportButton: true, exportAllData: true }}
        onRowClick={handleRecordDialogOpen}
      />
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Fab color="primary" className={classes.fab}>
        <AddIcon />
      </Fab>
    </>
  );
}

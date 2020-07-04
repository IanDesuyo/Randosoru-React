import React from "react";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Avatar, Typography, Grid, makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { AuthService } from "../Services/AuthService";
import { RecordDialog } from "./RecordDialog";
import { RecordDetails } from "./RecordDetails";
import Axios from "axios";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { FavoriteService } from "../Services/FavoriteService";

const tableIcons = {
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
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
  const { title, month, week, boss, form_id } = props;
  const [isLoading, setLoading] = useState(true);
  const [recordDialogData, setRecordDialog] = useState(null);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [recordDetailsOpen, setRecordDetailsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [rowData, setRowData] = useState();
  const [isFavorite, setFavorite] = useState(false);

  const handleRecordDialogOpen = (event, rowData) => {
    if (rowData) {
      setRecordDialog(rowData);
      if (getID() === rowData.user.id) {
        setRecordDialogOpen(true);
      } else {
        setRecordDetailsOpen(true);
      }
    } else {
      setRecordDialogOpen(true);
    }
  };

  const handleRecordDetailsClose = (value) => {
    setRecordDetailsOpen(false);
    setTimeout(() => {
      setRecordDialog(null);
    }, 200);
  };

  const handleRecordDialogClose = (value) => {
    if (!value) {
      setRecordDialogOpen(false);
      setTimeout(() => {
        setRecordDialog(null);
      }, 200);
    } else {
      setLoading(true);
      Axios.post(
        "/api/forms/" + form_id + "/week/" + week + "/boss/" + boss,
        { ...value, month: month },
        {
          headers: { Authorization: "Bearer " + AuthService.currentUserValue },
        }
      )
        .then((res) => {
          fetchData();
        })
        .catch((error) => {
          console.log(error.response);
          console.log(error);
        });
      setRecordDialogOpen(false);
      setTimeout(() => {
        setRecordDialog(null);
      }, 200);
    }
  };

  const fetchData = () => {
    setLoading(true);
    Axios.get("/api/forms/" + form_id + "/week/" + week + "/boss/" + boss)
      .then((res) => {
        setRowData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const checkFavorite = () => {
    if (FavoriteService.check(form_id)) {
      setFavorite(true);
      FavoriteService.set(form_id, week, title);
    }
  };

  const handleFavorite = () => {
    if (isFavorite) {
      FavoriteService.remove(form_id);
      setFavorite(false);
    } else {
      FavoriteService.set(form_id, week, title);
      setFavorite(true);
    }
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
    checkFavorite();
    return () => {
      Authsubscribe.unsubscribe();
      setCurrentUser(null);
    };
  }, [form_id, week]);
  
  return (
    <>
      <MaterialTable
        icons={tableIcons}
        title={t("Record.TitleFormat", {
          title: title,
          week: week,
        })}
        columns={[
          {
            title: "ID",
            field: "id",
            type: "numeric",
            defaultSort: "asc",
            hidden: true,
          },
          {
            title: t("Name"),
            field: "user.name",
            render: (rowData) => (
              <Grid container>
                <Avatar src={rowData.user.avatar} />
                {getID() === rowData.user.id ? (
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
          { title: t("Record.Comment"), field: "comment" },
          {
            title: t("Record.Damage"),
            field: "damage",
            export: true,
            hidden: true,
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
              99: t("Record.StatusType.99"),
            },
          },
        ]}
        data={rowData}
        options={{
          search: false,
          exportButton: true,
          exportAllData: true,
          paging: false,
          exportCsv: (columnList, initialData) => {
            const columns = columnList.filter(columnDef => {
              return columnDef.field && columnDef.export !== false ;
            }) ;

            const data = initialData.map(rowData => columns.map(columnDef => {
              if (columnDef.field === "user.name") return rowData.user.name ;
              if (columnDef.field === "status") return t(`Record.StatusType.${rowData[columnDef.field]}`) ;
              return columnDef.render ? columnDef.render(rowData) : rowData[columnDef.field] ;
            })) ;

            var csvAry = [] ;

            csvAry.push(columns.map(column => column.title)) ;
            csvAry = csvAry.concat(data) ;

            let csvContent = "data:text/csv;charset=utf-8,\ufeff" ;
            csvContent += '"' + csvAry.map(row => row.join('","')).join('"\n"') + '"' ;

            var uri = encodeURI(csvContent) ;
            var link = window.document.createElement("a") ;
            link.setAttribute("href", uri) ;
            link.setAttribute("download", t("Record.TitleFormat", {
              title: title,
              week: week,
            }) + '.csv') ;

            window.document.body.appendChild(link) ;
            link.click() ;
            link.remove() ;
          }
        }}
        onRowClick={handleRecordDialogOpen}
        localization={{
          body: {
            emptyDataSourceMessage: t("Record.NoRecord"),
          },
          toolbar: {
            exportTitle: t("Record.Export"),
            exportName: t("Record.ExportCSV"),
          },
        }}
        actions={[
          {
            icon: () => {
              return isFavorite ? <StarIcon /> : <StarBorderIcon />;
            },
            tooltip: "Filter",
            onClick: handleFavorite,
            isFreeAction: true,
          },
        ]}
      />
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {currentUser ? (
        <Fab
          color="primary"
          className={classes.fab}
          onClick={handleRecordDialogOpen}
        >
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

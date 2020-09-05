import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import LanguageIcon from "@material-ui/icons/Language";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import { Link, useHistory } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DialogContent from "@material-ui/core/DialogContent";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListIcon from "@material-ui/icons/List";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import BuildIcon from '@material-ui/icons/Build';
import SaveAlt from "@material-ui/icons/SaveAlt";
import { useEffect } from "react";
import FavoriteService from "../Services/FavoriteService";
import AuthService from "../Services/AuthService";
import ExportCsv from "../Services/ExportCsv";
import StarIcon from "@material-ui/icons/Star";
import LangDialog from "./LangDialog";
import Axios from "axios";
import FormConfigDialog from "./FormConfigDialog";

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  chooseWeekBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function LeftDrawer(props) {
  const { onClose, open } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [langDialogOpen, setLangDialog] = useState(false);
  const [chooseWeekOpen, setChooseWeekOpen] = useState(false);
  const [week, setWeek] = useState();
  const [form_id, setForm_id] = useState();
  const [favList, setFavList] = useState(null);
  const [favDrawer, setFavDrawer] = useState(false);
  const [exportCheck, setExportCheck] = useState(false);
  const [formConfigOpen, setFormConfigOpen] = useState(false);

  const openLangDialog = () => {
    onClose(false);
    setLangDialog(true);
  };

  const handleLangDialogClose = () => {
    setLangDialog(false);
  };

  const handleClose = () => {
    onClose(false);
  };

  const handleOpen = () => {
    onClose(true);
  };

  const openChooseWeek = () => {
    onClose(false);
    setChooseWeekOpen(true);
  };

  const handleChooseWeekClose = () => {
    setWeek(null);
    setForm_id(null);
    setChooseWeekOpen(false);
  };

  const handleFavDrawer = () => {
    setFavDrawer(!favDrawer);
  };

  const openExportCheck = () => {
    onClose(false);
    setExportCheck(true);
  };

  const handleExportCheckClose = () => {
    setExportCheck(false);
  };

  useEffect(() => {
    let url = window.location.pathname.split("/");
    if (url[1] === "forms" && url[3] === "week") {
      setForm_id(url[2]);
      setWeek(parseInt(url[4]));
    } else {
      setWeek(null);
      setForm_id(null);
    }
    const Favsubscribe = FavoriteService.favData.subscribe(setFavList);
    return () => {
      Favsubscribe.unsubscribe();
      setFavList(null);
    };
  }, [week]);

  return (
    <React.Fragment>
      <SwipeableDrawer anchor="left" open={open} onClose={handleClose} onOpen={handleOpen}>
        <List className={classes.list}>
          <ListItem button key="0" component={Link} to="/" onClick={handleClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t("Drawer.Home")} />
          </ListItem>
          <ListItem button key="1" onClick={() => setFormConfigOpen(true)}>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary={t("Drawer.FormConfig")} />
          </ListItem>
          {week ? (
            <ListItem button key="2" onClick={openChooseWeek}>
              <ListItemIcon>
                <CalendarViewDayIcon />
              </ListItemIcon>
              <ListItemText primary={t("Drawer.ChooseWeek")} />
            </ListItem>
          ) : (
            <></>
          )}
          {week && AuthService.currentUserValue ? (
            <ListItem button key="3" onClick={openExportCheck}>
              <ListItemIcon>
                <SaveAlt />
              </ListItemIcon>
              <ListItemText primary={t("Drawer.ExportAll")} />
            </ListItem>
          ) : (
            <></>
          )}
          <Divider />
          <FavList
            data={favList}
            onClick={handleClose}
            open={favDrawer}
            handleDrawer={handleFavDrawer}
          />
          <ListItem button key="99" onClick={openLangDialog}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary={t("Drawer.Language")} />
          </ListItem>
        </List>
      </SwipeableDrawer>
      <LangDialog open={langDialogOpen} onClose={handleLangDialogClose} />
      <ChooseWeek
        open={chooseWeekOpen}
        onClose={handleChooseWeekClose}
        week={week}
        form_id={form_id}
      />
      <ExportChecker open={exportCheck} form_id={form_id} onClose={handleExportCheckClose} />
      <FormConfigDialog open={formConfigOpen} onClose={() => setFormConfigOpen(false)} />
    </React.Fragment>
  );
}

function ChooseWeek(props) {
  const { onClose, open, form_id, week } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  let history = useHistory();

  const handleClose = () => {
    onClose(false);
  };

  const manualChoose = () => {
    let week_in;
    while (typeof week_in !== "number") {
      week_in = parseInt(prompt(t("Drawer.ChooseWeekPrompt")));
      if (week_in === null || isNaN(week_in)) {
        return;
      }
      if (week_in < 1 || week_in > 100) {
        week_in = null;
      }
    }
    history.push("/forms/" + form_id + "/week/" + week_in);
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm">
      <DialogTitle>{t("Drawer.ChooseWeek")}</DialogTitle>
      <DialogContent className={classes.chooseWeekBtn}>
        {t("Drawer.CurrentWeek")}: {week}
        <ButtonGroup color="primary">
          <Button
            component={Link}
            to={"/forms/" + form_id + "/week/" + 1}
            disabled={week <= 1}
            onClick={handleClose}
          >
            1
          </Button>
          <Button
            component={Link}
            to={"/forms/" + form_id + "/week/" + (week - 1)}
            disabled={week <= 1 || week > 100}
            onClick={handleClose}
          >
            {"<"}
          </Button>
          <Button onClick={manualChoose}>{t("Choose")}</Button>
          <Button
            component={Link}
            to={"/forms/" + form_id + "/week/" + (week + 1)}
            disabled={week < 1 || week >= 100}
            onClick={handleClose}
          >
            {">"}
          </Button>
          <Button
            component={Link}
            to={"/forms/" + form_id + "/week/" + 100}
            disabled={week >= 100}
            onClick={handleClose}
          >
            100
          </Button>
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
}

function FavList(props) {
  const { t } = useTranslation();
  const { data, onClick, open, handleDrawer } = props;
  const classes = useStyles();

  if (Object.keys(data).length === 0) {
    return <> </>;
  }
  return (
    <>
      <ListItem button onClick={handleDrawer}>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary={t("Drawer.Favorites")} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {Object.keys(data).map((key, index) => (
            <ListItem
              button
              key={key}
              component={Link}
              to={"/forms/" + key + "/week/" + data[key].week}
              onClick={onClick}
              className={classes.nested}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText
                primary={data[key].title}
                secondary={t("Drawer.LastWeek") + ": " + data[key].week}
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
}

function ExportChecker(props) {
  const { onClose, open, form_id } = props;
  const { t } = useTranslation();
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setLoading(false);
    onClose(false);
  };

  const handleAgree = () => {
    setLoading(true);
    Axios.get("/api/forms/" + form_id + "/all", {
      headers: { Authorization: "Bearer " + AuthService.currentUserValue },
    })
      .then(res => {
        ExportCsv(
          [
            { title: t("Record.Week"), field: "week" },
            { title: t("Record.Boss"), field: "boss" },
            { title: t("Name"), field: "user.name" },
            { title: t("Record.Comment"), field: "comment" },
            { title: t("Record.Damage"), field: "damage" },
            { title: t("Record.Status"), field: "status" },
            { title: t("Record.LastModified"), field: "last_modified" },
          ],
          res.data,
          form_id,
          t
        );
      })
      .catch(error => {
        AuthService.errorHandler(error);
      });
    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("Record.ExportCheckTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("Record.ExportCheckDescription")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isLoading}>
            {t("Disagree")}
          </Button>
          <Button
            onClick={handleAgree}
            color="primary"
            variant="contained"
            autoFocus
            disabled={isLoading}
          >
            {t("Agree")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

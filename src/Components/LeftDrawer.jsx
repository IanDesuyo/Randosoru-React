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
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DialogContent from "@material-ui/core/DialogContent";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import ListIcon from "@material-ui/icons/List";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import GitHubIcon from "@material-ui/icons/GitHub";
import SaveAlt from "@material-ui/icons/SaveAlt";
import StarIcon from "@material-ui/icons/Star";
import Typography from "@material-ui/core/Typography";
import { version as app_version } from "../../package.json";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useAuth } from "../Services/Auth";
import toastr from "toastr";
import LangDialog from "./LangDialog";
import { useFav } from "../Services/Favorite";
import ExportDialog from "./ExportDialog";

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  bottom: {
    width: 250,
    position: "fixed",
    bottom: 0,
    paddingBottom: 20,
  },
  appDetails: {
    paddingTop: 10,
    paddingLeft: 10,
  },
}));

export default function LeftDrawer(props) {
  const { onToggle, open, darkMode, setDarkMode } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const { token, setToken } = useAuth();
  const { currentForm } = useFav();
  const [langDialogOpen, setLangDialogOpen] = useState(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState(false);
  const [chooseWeekOpen, setChooseWeekOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleOpen = () => {
    onToggle();
  };
  const handleClose = () => {
    onToggle();
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const handleLogout = () => {
    setToken("");
    toastr.success(t("HasLogout"), "", {
      closeButton: true,
      positionClass: "toast-bottom-right",
    });
  };

  const handleLangDialogOpen = () => {
    setLangDialogOpen(true);
  };

  const handleLangDialogClose = () => {
    setLangDialogOpen(false);
  };

  const handleFavDrawer = () => {
    setFavDrawerOpen(!favDrawerOpen);
  };

  const openChooseWeek = () => {
    onToggle();
    setChooseWeekOpen(true);
  };

  const handleChooseWeekClose = () => {
    setChooseWeekOpen(false);
  };

  const handleExportDialogOpen = () => {
    onToggle();
    setExportDialogOpen(true);
  };

  const handleExportDialogClose = () => {
    setExportDialogOpen(false);
  };

  return (
    <React.Fragment>
      <SwipeableDrawer anchor="left" open={open} onClose={handleClose} onOpen={handleOpen}>
        <List className={classes.list}>
          {token ? (
            <ListItem button key="0" component={Link} to="/users/me" onClick={handleClose}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary={t("Profile")} />
            </ListItem>
          ) : (
            <ListItem
              button
              key="0"
              component={Link}
              to={`/login?next=${window.location.pathname}`}
              onClick={handleClose}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={t("Login")} />
            </ListItem>
          )}
          <ListItem button key="1" component={Link} to="/" onClick={handleClose}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t("Home")} />
          </ListItem>
          {currentForm ? (
            <ListItem button key="2" onClick={openChooseWeek}>
              <ListItemIcon>
                <CalendarViewDayIcon />
              </ListItemIcon>
              <ListItemText primary={t("ChooseWeek")} />
            </ListItem>
          ) : (
            <></>
          )}
          {currentForm && token ? (
            <ListItem button key="3" onClick={handleExportDialogOpen}>
              <ListItemIcon>
                <SaveAlt />
              </ListItemIcon>
              <ListItemText primary={t("ExportAll")} />
            </ListItem>
          ) : (
            <></>
          )}
          <Divider />
          <FavList onClick={handleClose} open={favDrawerOpen} handleDrawer={handleFavDrawer} />
          <div className={classes.bottom}>
            <ListItem button key="97" onClick={handleLangDialogOpen}>
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary={t("Language")} />
            </ListItem>
            <ListItem button key="98" onClick={toggleDarkMode}>
              <ListItemIcon>
                <Brightness4Icon />
              </ListItemIcon>
              <ListItemText primary={"Toggle Dark Mode"} />
            </ListItem>
            {token ? (
              <ListItem button key="99" onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary={t("Logout")} />
              </ListItem>
            ) : (
              <></>
            )}
            <Divider />
            <Typography className={classes.appDetails} variant="subtitle2">
              Version:{app_version}
              <br />
              <GitHubIcon fontSize="small" /> Randosoru-React
            </Typography>
          </div>
        </List>
      </SwipeableDrawer>
      <LangDialog open={langDialogOpen} onClose={handleLangDialogClose} />
      <ChooseWeek open={chooseWeekOpen} onClose={handleChooseWeekClose} />
      <ExportDialog open={exportDialogOpen} onClose={handleExportDialogClose} />
    </React.Fragment>
  );
}

function FavList(props) {
  const { t } = useTranslation();
  const { onClick, open, handleDrawer } = props;
  const classes = useStyles();
  const { fav } = useFav();

  if (fav.length === 0) {
    return <> </>;
  }

  return (
    <>
      <ListItem button onClick={handleDrawer}>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary={t("Favorites")} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {fav.map((value, index) => (
            <ListItem
              button
              key={index}
              component={Link}
              to={"/forms/" + value.id + "/week/" + value.week}
              onClick={onClick}
              className={classes.nested}
            >
              <ListItemIcon>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary={value.title} secondary={t("LastWeek") + ": " + value.week} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );
}

function ChooseWeek(props) {
  const { onClose, open } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  let history = useHistory();
  const { currentForm } = useFav();

  const handleClose = () => {
    onClose(false);
  };

  const manualChoose = () => {
    let week_in;
    while (typeof week_in !== "number") {
      week_in = parseInt(prompt(t("ChooseWeekPrompt")));
      if (week_in === null || isNaN(week_in)) {
        return;
      }
      if (week_in < 1 || week_in > 200) {
        week_in = null;
      }
    }
    history.push("/forms/" + currentForm.id + "/week/" + week_in);
    onClose(false);
  };

  if (!currentForm) {
    return <></>;
  }
  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm">
      <DialogTitle>{t("ChooseWeek")}</DialogTitle>
      <Typography align="center">
        {t("CurrentWeek")}: {currentForm.week}
      </Typography>
      <DialogContent className={classes.chooseWeekBtn}>
        <ButtonGroup>
          <Button
            component={Link}
            to={"/forms/" + currentForm.id + "/week/" + 1}
            disabled={currentForm.week <= 1}
            onClick={handleClose}
          >
            1
          </Button>
          <Button
            component={Link}
            to={"/forms/" + currentForm.id + "/week/" + (currentForm.week - 1)}
            disabled={currentForm.week <= 1 || currentForm.week > 200}
            onClick={handleClose}
          >
            {"<"}
          </Button>
          <Button onClick={manualChoose}>{t("Other")}</Button>
          <Button
            component={Link}
            to={"/forms/" + currentForm.id + "/week/" + (currentForm.week + 1)}
            disabled={currentForm.week < 1 || currentForm.week >= 200}
            onClick={handleClose}
          >
            {">"}
          </Button>
          <Button
            component={Link}
            to={"/forms/" + currentForm.id + "/week/" + 200}
            disabled={currentForm.week >= 200}
            onClick={handleClose}
          >
            200
          </Button>
        </ButtonGroup>
      </DialogContent>
    </Dialog>
  );
}

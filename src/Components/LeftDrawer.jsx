import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import LanguageIcon from "@material-ui/icons/Language";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DialogContent from "@material-ui/core/DialogContent";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
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
}));

export default function LeftDrawer(props) {
  const { onClose, open } = props;
  const { t } = useTranslation();
  const classes = useStyles();
  const [langDialogOpen, setLangDialog] = useState(false);
  const [chooseWeekOpen, setChooseWeekOpen] = useState(false);
  const [week, setWeek] = useState();
  const [form_id, setForm_id] = useState();

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

  const openChooseWeek = () => {
    onClose(false);
    setChooseWeekOpen(true);
  };

  const handleChooseWeekClose = () => {
    setWeek(null);
    setForm_id(null);
    setChooseWeekOpen(false);
  };

  useEffect(() => {
    let url = window.location.pathname.split("/");
    console.log(url);
    if (url[1] === "forms" && url[3] === "week") {
      setForm_id(url[2]);
      setWeek(parseInt(url[4]));
    } else {
      setWeek(null);
      setForm_id(null);
    }
  }, [week]);

  return (
    <React.Fragment>
      <Drawer anchor="left" open={open} onClose={handleClose}>
        <List className={classes.list}>
          <ListItem
            button
            key="0"
            component={Link}
            to="/"
            onClick={handleClose}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={t("Drawer.Home")} />
          </ListItem>
          {week ? (
            <ListItem button key="1" onClick={openChooseWeek}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t("Drawer.ChooseWeek")} />
            </ListItem>
          ) : (
            <></>
          )}

          <ListItem
            button
            key="3"
            component={Link}
            to="/forms/5b248793b1c14af2980eb501ad7cfc6f/week/1"
            onClick={handleClose}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Form Test" />
          </ListItem>

          <ListItem button key="99" onClick={openLangDialog}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary={t("Drawer.Language")} />
          </ListItem>
        </List>
      </Drawer>
      <LangDialog open={langDialogOpen} onClose={handleLangDialogClose} />
      <ChooseWeek
        open={chooseWeekOpen}
        onClose={handleChooseWeekClose}
        week={week}
        form_id={form_id}
      />
    </React.Fragment>
  );
}

function LangDialog(props) {
  const { onClose, open } = props;
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    onClose(false);
  };

  const handleListItemClick = (value) => {
    i18n.changeLanguage(value);
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
      <DialogTitle>{t("Drawer.Language")}</DialogTitle>
      <List>
        {[
          ["zh-TW", "繁體中文"],
          ["ja", "日本語"],
          ["en", "English"],
        ].map((lang, index) => (
          <ListItem
            button
            onClick={() => handleListItemClick(lang[0])}
            key={index}
          >
            <ListItemText primary={lang[1]} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

function ChooseWeek(props) {
  const { onClose, open, form_id, week } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm">
      <DialogTitle>{t("Drawer.ChooseWeek")}</DialogTitle>
      <DialogContent className={classes.chooseWeekBtn}>
        Form: {form_id}
        <br />
        Week: {week}
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
          <Button
            component={Link}
            to={"/forms/" + form_id + "/week/" + 5}
            onClick={handleClose}
          >
            選擇
          </Button>
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

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthService } from "../Services/AuthService";
import toastr from "toastr";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Dialog,
  DialogTitle
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HomeIcon from "@material-ui/icons/Home";
import LanguageIcon from "@material-ui/icons/Language";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
}));

function LangDialog(props) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose(null);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
      <DialogTitle>Select Language</DialogTitle>
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

export default function NavBar() {
  const { t, i18n } = useTranslation();
  const classes = useStyles();

  const [drawerOpen, setDrawer] = useState(false);
  const [langDialogOpen, setLangDialog] = useState(false);
  const [anchorOpen, setAnchor] = useState();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const Authsubscribe = AuthService.currentUser.subscribe(setCurrentUser);
    return () => {
      Authsubscribe.unsubscribe();
      setCurrentUser(null);
    };
  }, []);

  const openDrawer = () => {
    setDrawer(true);
  };

  const handleDrawerClose = () => {
    setDrawer(false);
  };

  const openAnchor = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleAnchorClose = () => {
    setAnchor(null);
  };

  const openLangDialog = () => {
    setDrawer(false);
    setLangDialog(true);
  };

  const handleLangDialogClose = (value) => {
    if (value) {
      i18n.changeLanguage(value);
    }
    setLangDialog(false);
  };

  const handleLogout = () => {
    setAnchor(null);
    AuthService.logout();
    toastr.success(t("Notices.HasLogout"), "", {
      closeButton: true,
      positionClass: "toast-bottom-right",
    });
  };

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={openDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {t("Title")}
          </Typography>
          {currentUser ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={openAnchor}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorOpen}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={!!anchorOpen}
                onClose={handleAnchorClose}
              >
                <MenuItem
                  component={Link}
                  to="/users/me"
                  onClick={handleAnchorClose}
                >
                  {t("Profile")}
                </MenuItem>
                <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              {t("Login")}
            </Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
        <List className={classes.list}>
          <ListItem
            button
            key="Home"
            component={Link}
            to="/"
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem
            button
            key="Guild Test"
            component={Link}
            to="/forms/7971936a78db4a0292bf1e2bc117d281/1"
            onClick={handleDrawerClose}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Form Test" />
          </ListItem>

          <ListItem button key="lang" onClick={openLangDialog}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary="Change Language" />
          </ListItem>
        </List>
      </Drawer>

      <LangDialog open={langDialogOpen} onClose={handleLangDialogClose} />
    </React.Fragment>
  );
}

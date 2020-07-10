import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthService from "../Services/AuthService";
import toastr from "toastr";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
import LeftDrawer from "./LeftDrawer";

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
}));

export default function NavBar(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { position } = props;
  const [drawerOpen, setDrawer] = useState(false);
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
      <AppBar position={position}>
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
      <LeftDrawer open={drawerOpen} onClose={handleDrawerClose} />
    </React.Fragment>
  );
}

import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Slide from "@material-ui/core/Slide";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function NavBar(props) {
  const { t } = useTranslation();
  const { menuClick } = props;
  
  return (
    <HideOnScroll>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={menuClick}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            style={{ textDecoration: "none", color: "unset" }}
            to="/"
          >
            {t("Title")}
          </Typography>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}

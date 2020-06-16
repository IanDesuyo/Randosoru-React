import React from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { withTranslation } from "react-i18next";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { AuthService } from "../Services/AuthService";
import toastr from "toastr";
import LanguageIcon from "@material-ui/icons/Language";
const useStyles = (theme) => ({
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
});

class LegacyTopBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drawer: false,
      anchor: null,
      user: null,
    };
  }

  Authsubscribe = null;

  componentWillMount() {
    this.Authsubscribe = AuthService.currentUser.subscribe((x) =>
      this.setState({ user: x })
    );
  }

  componentWillUnmount() {
    this.Authsubscribe.unsubscribe();
  }

  render() {
    const { classes } = this.props;
    const { t, i18n } = this.props;
    return (
      <React.Fragment>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={() => this.setState({ drawer: true })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {t("Title")}
            </Typography>
            {this.state.user ? (
              <div>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(event) =>
                    this.setState({ anchor: event.currentTarget })
                  }
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchor}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={!!this.state.anchor}
                  onClose={() => this.setState({ anchor: null })}
                >
                  <MenuItem
                    component={Link}
                    to="/users/me"
                    onClick={() => this.setState({ anchor: null })}
                  >
                    {t("Profile")}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      AuthService.logout();
                      toastr.success(t("Notices.HasLogout"), "", {
                        closeButton: true,
                        positionClass: "toast-bottom-right",
                      });
                      this.setState({ anchor: false });
                    }}
                  >
                    {t("Logout")}
                  </MenuItem>
                </Menu>
              </div>
            ) : (
              <Button
                variant="contained"
                disableElevation
                component={Link}
                to="/login"
              >
                {t("Login")}
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="left"
          open={this.state.drawer}
          onClose={() => this.setState({ drawer: false })}
        >
          <List className={classes.list}>
            <ListItem
              button
              key="Home"
              component={Link}
              to="/"
              onClick={() => this.setState({ drawer: false })}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>

            <ListItem
              button
              key="Language"
              onClick={() => i18n.changeLanguage("zh-TW")}
            >
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="zh-TW" />
            </ListItem>

            <ListItem
              button
              key="Language"
              onClick={() => i18n.changeLanguage("ja")}
            >
              <ListItemIcon>
                <LanguageIcon />
              </ListItemIcon>
              <ListItemText primary="ja" />
            </ListItem>
          </List>
        </Drawer>
      </React.Fragment>
    );
  }
}

const TopBar = withTranslation()(LegacyTopBar);
export default withStyles(useStyles, { withTheme: true })(TopBar);

import React from "react";
import { AuthService } from "../Services/AuthService";
import axios from "axios";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import toastr from "toastr";
import Container from "@material-ui/core/Container";
import MuiAlert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import Avatar from "@material-ui/core/Avatar";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { Grid } from "@material-ui/core";

const useStyles = (theme) => ({
  avatar_box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
});

class LegacyUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check_code: 200,
      user: {
        name: "ユウキ",
        id: "",
        avatar: "https://i.imgur.com/e4KrYHe.png",
        uid: "",
        created_at: "",
        guild: {},
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.getUser(this.props.match.params.id);
    }
  }

  componentDidMount() {
    this.getUser(this.props.match.params.id);
  }

  getUser(id) {
    if (id !== "me" && id.length < 6) {
      return this.handleError(404);
    }
    if (id === "me" && AuthService.currentUserValue) {
      if (localStorage.getItem("me")) {
        let temp = JSON.parse(localStorage.getItem("me"));
        if (temp.exp > Date.now()) {
          return this.setState({ user: temp, check_code: 200 });
        }
      }
      axios
        .get("/api/profile/users/me", {
          headers: { Authorization: "Bearer " + AuthService.currentUserValue },
        })
        .then((res) => {
          this.setState({ user: res.data, check_code: 200 });
          localStorage.setItem(
            "me",
            JSON.stringify({ exp: Date.now() + 600000, ...res.data })
          );
        })
        .catch((error) => {
          return this.handleError(500);
        });
    } else if (id === "me" && !AuthService.currentUserValue) {
      return this.handleError(4011);
    } else {
      axios
        .get("/api/profile/users/" + id)
        .then((res) => {
          this.setState({ user: res.data, check_code: 200 });
        })
        .catch((error) => {
          return this.handleError(error.response.status);
        });
      return;
    }
  }

  handleError(code) {
    switch (code) {
      case 401:
        return this.setState({ check_code: 401 });
      case 4011:
        return this.setState({ check_code: 4011 });
      case 403:
        return this.setState({ check_code: 403 });
      case 404:
        return this.setState({ check_code: 404 });
      default:
        return this.setState({ check_code: 500 });
    }
  }

  render() {
    const { classes } = this.props;
    const { t } = this.props;
    if (this.state.check_code === 200) {
      return (
        <Container>
          <Box mt={3} className={classes.avatar_box}>
            <Avatar src={this.state.user.avatar} className={classes.avatar} />
            <Typography component="h1" gutterBottom variant="h5">
              {this.state.user.name}
            </Typography>
          </Box>
          <Divider />
          <Grid>
            <Typography gutterBottom variant="body1">
              {t("UID")}
              {": "}
              {this.state.user.uid ? this.state.user.uid : t("UID_Null")}
            </Typography>
          </Grid>
          <Grid>
            <Typography gutterBottom variant="body1">
              {t("JoinedGuild")}
              {": "}
              {this.state.user.guild
                ? this.state.user.guild.name
                : t("Guild_Null")}
            </Typography>
          </Grid>
          <Grid>
            <Typography gutterBottom variant="body1">
              {t("CreatedAt")}
              {": "}
              {this.state.user.created_at}
            </Typography>
          </Grid>
        </Container>
      );
    } else {
      let err;
      switch (this.state.check_code) {
        case 401:
          err = <Link to="/logout">{t("Alerts.AuthFailed")}</Link>;
          break;
        case 4011:
          err = t("Alerts.NotLogin");
          break;
        case 403:
          err = t("Alerts.ProfileNoPerms");
          break;
        case 404:
          err = t("Alerts.UserNotFound");
          break;
        default:
          err = t("Alerts.Error");
      }
      return (
        <Container>
          <Box mt={3}>
            <MuiAlert elevation={6} variant="filled" severity="error">
              {err}
            </MuiAlert>
          </Box>
        </Container>
      );
    }
  }
}

const UserProfile = withTranslation()(LegacyUserProfile);
export default withStyles(useStyles, { withTheme: true })(UserProfile);

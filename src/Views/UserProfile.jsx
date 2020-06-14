import React from "react";
import { AuthService } from "../Services/Auth/AuthService";
import axios from "axios";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import toastr from "toastr";

class LegacyUserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check_code: 0,
      user: {
        name: "Loading...",
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
          return this.handleError(error.response.status);
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
    const { t } = this.props;
    switch (this.state.check_code) {
      case 0:
        return <> </>;
      case 401:
        return (
          <div className="container mt-3">
            <div className="alert alert-danger" role="alert">
              <Link to="/logout">{t("Alerts.AuthFailed")}</Link>
            </div>
          </div>
        );
      case 4011:
        return (
          <div className="container mt-3">
            <div className="alert alert-warning" role="alert">
              {t("Alerts.NotLogin")}
            </div>
          </div>
        );
      case 403:
        return (
          <div className="container mt-3">
            <div className="alert alert-warning" role="alert">
              {t("Alerts.ProfileNoPerms")}
            </div>
          </div>
        );
      case 404:
        return (
          <div className="container mt-3">
            <div className="alert alert-danger" role="alert">
              {t("Alerts.UserNotFound")}
            </div>
          </div>
        );
      case 500:
        return (
          <div className="container mt-3">
            <div className="alert alert-danger" role="alert">
              {t("Alerts.Error")}
            </div>
          </div>
        );
      default:
        return (
          <div className="container mt-3">
            <div className="media">
              <img
                src={this.state.user.avatar}
                className="align-self-start mr-3 rounded"
                alt={this.state.user.name + "'s avatar"}
                width="128"
                height="128"
              />
              <div className="media-body">
                <h4 className="mt-0">
                  {this.state.user.name}
                  <small
                    className="ml-3 text-muted btn btn-outline-light btn-sm"
                    onClick={() => {
                      navigator.clipboard.writeText(this.state.user.id);
                      toastr.info(t("Notices.Copy"), "", {
                        closeButton: true,
                        positionClass: "toast-bottom-right",
                      });
                    }}
                  >
                    ({this.state.user.id})
                  </small>
                </h4>
                <p>
                  {t("Profile.UID")}
                  {this.state.user.uid
                    ? this.state.user.uid
                    : t("Profile.UID_Null")}
                </p>
                <p>
                  {t("Profile.Guild")}
                  {this.state.user.guild
                    ? this.state.user.guild.name
                    : t("Profile.Guild_Null")}
                </p>
                <p>
                  {t("Profile.Created_at")} {this.state.user.created_at}
                </p>
              </div>
            </div>
          </div>
        );
    }
  }
}

const UserProfile = withTranslation()(LegacyUserProfile);
export default UserProfile;

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
        avatar: "https://i.imgur.com/e4KrYHe.png",
        uid: "",
        created_at: "",
        guild_id: "",
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
    if (id === "me" && AuthService.currentUserValue) {
      axios
        .get("/api/profile/users/me", {
          headers: { Authorization: "Bearer " + AuthService.currentUserValue },
        })
        .then((res) => {
          this.setState({ user: res.data, check_code: 200 });
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.setState({ check_code: 401 });
          }
        });
    } else if (id === "me" && !AuthService.currentUserValue) {
      this.setState({ check_code: 400 });
    } else {
      axios
        .get("/api/profile/users/" + id)
        .then((res) => {
          this.setState({ user: res.data, check_code: 200 });
        })
        .catch((error) => {
          if (error.response.status === 403) {
            this.setState({ check_code: 403 });
          } else {
            this.setState({ check_code: 500 });
          }
        });
    }
  }

  render() {
    const { t } = this.props;
    switch (this.state.check_code) {
      case 0:
        return <> </>;
      case 400:
        return (
          <div className="container mt-3">
            <div className="alert alert-warning" role="alert">
              尚未登入!
            </div>
          </div>
        );
      case 401:
        return (
          <div className="container mt-3">
            <div className="alert alert-danger" role="alert">
              驗證失敗! 請<Link to="/logout">重新登入</Link>
            </div>
          </div>
        );
      case 403:
        return (
          <div className="container mt-3">
            <div className="alert alert-warning" role="alert">
              你沒有權限訪問此個人檔案
            </div>
          </div>
        );
      case 500:
        return (
          <div className="container mt-3">
            <div className="alert alert-danger" role="alert">
              發生錯誤
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
                    className="ml-2 text-muted"
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
                  UID:
                  {this.state.user.uid
                    ? this.state.user.uid
                    : t("Profile.Unbind_UID")}
                </p>
                <p>
                  {t("Profile.Created_at")}: {this.state.user.created_at}
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

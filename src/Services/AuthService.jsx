import i18n from "i18next";
import { BehaviorSubject } from "rxjs";
import toastr from "toastr";

const UserSubject = new BehaviorSubject(localStorage.getItem("token"));

const AuthService = {
  login_discord,
  login_line,
  logout,
  errorHandler,
  currentUser: UserSubject.asObservable(),
  get currentUserValue() {
    return UserSubject.value;
  }
};
export default AuthService;

function login_discord() {
  let win = window.open(
    "https://discordapp.com/api/oauth2/authorize?client_id=609318305718730790&redirect_uri=https://guild.randosoru.me/login/oauth/discord&response_type=code&scope=identify&prompt=none",
    "window",
    "toolbar=no, menubar=no, resizable=no height=600 width=400"
  );

  let checkConnect = setInterval(function () {
    if (!win || !win.closed) return;
    clearInterval(checkConnect);
    window.location.reload();
  }, 100);
}

function login_line() {
  let win = window.open(
    "https://access.line.me/dialog/oauth/weblogin?response_type=code&client_id=1654370605&redirect_uri=https://guild.randosoru.me/login/oauth/line&state=123",
    "window",
    "toolbar=no, menubar=no, resizable=no height=600 width=400"
  );

  let checkConnect = setInterval(function () {
    if (!win || !win.closed) return;
    clearInterval(checkConnect);
    window.location.reload();
  }, 100);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("me");
  UserSubject.next(null);
}

function errorHandler(error) {
  console.log(error.response);
  if (error.response.status === 401) {
    if (error.response.data.detail === "Credentials expired") {
      return errorToastr(i18n.t("Alerts.LoginExpired"));
    }
    if (error.response.data.detail === "Could not validate credentials") {
      return errorToastr(i18n.t("Alerts.AuthFailed"));
    }
    return errorToastr(error.response.data.detail);
  }
  if (error.response.status === 422) {
    return errorToastr(error.response.data.detail[0].msg);
  }
}

function errorToastr(msg) {
  toastr.error(msg, "", {
    closeButton: true,
    positionClass: "toast-bottom-right"
  });
}

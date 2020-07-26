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
  },
  next(token) {
    UserSubject.next(token)
  },
};
export default AuthService;

function login_discord() {
  let win = window.open(
    "https://discordapp.com/api/oauth2/authorize?client_id=731919330714845315&redirect_uri=https://guild.randosoru.me/login/oauth/discord&response_type=code&scope=identify&prompt=none",
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
  window.liff.login();
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("me");
  window.liff.logout();
  UserSubject.next(null);
}

function errorHandler(error) {
  if (!error.response) {
    console.log(error);
    return errorToastr("ERROR");
  }
  console.log(error.response);
  let code = error.response.status;
  if (code === 401) {
    localStorage.removeItem("me");
    localStorage.removeItem("login_status");
    localStorage.removeItem("token");
    if (error.response.data.detail === "Credentials expired") {
      return errorToastr(i18n.t("Alerts.LoginExpired"));
    }
    if (error.response.data.detail === "Could not validate credentials") {
      return errorToastr(i18n.t("Alerts.AuthFailed"));
    }
    return errorToastr(error.response.data.detail);
  }
  if (code === 422) {
    return errorToastr(error.response.data.detail[0].msg);
  }
  if (code === 503) {
    return errorToastr(i18n.t("Alerts.TooFast"));
  }
  if (code >= 500 || code < 520) {
    return errorToastr("Server ERROR", "ε=ε=ヾ(;ﾟдﾟ)/");
  }
  return errorToastr("ERROR", "Σ(っ °Д °;)っ");
}

function errorToastr(msg, title = null) {
  toastr.error(msg, title, {
    closeButton: true,
    positionClass: "toast-bottom-right",
  });
}

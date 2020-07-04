import { BehaviorSubject } from "rxjs";
const UserSubject = new BehaviorSubject(localStorage.getItem("token"));

export const AuthService = {
  login_discord,
  login_line,
  logout,
  currentUser: UserSubject.asObservable(),
  get currentUserValue() {
    return UserSubject.value;
  },
};

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

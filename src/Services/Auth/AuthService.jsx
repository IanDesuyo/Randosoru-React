import { BehaviorSubject } from "rxjs";

const UserSubject = new BehaviorSubject(localStorage.getItem("token"));

export const AuthService = {
  login_discord,
  logout,
  currentUser: UserSubject.asObservable(),
  get currentUserValue() {
    return UserSubject.value;
  },
};

function login_discord() {
  let win = window.open(
    // "https://discordapp.com/api/oauth2/authorize?client_id=609318305718730790&redirect_uri=https://test.randosoru.me/login/oauth/discord&response_type=code&scope=identify&prompt=none",
    "https://discordapp.com/api/oauth2/authorize?client_id=609318305718730790&redirect_uri=http://127.0.0.1/login/oauth/discord&response_type=code&scope=identify&prompt=none",
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


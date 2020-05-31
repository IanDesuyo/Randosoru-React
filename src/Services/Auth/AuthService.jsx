import { BehaviorSubject } from 'rxjs';
import Cookies from "js-cookie"

const currentUserSubject = new BehaviorSubject(localStorage.getItem('token'));

export const authenticationService = {
    login_discord,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login_discord() {
  let win = window.open(
    "https://discordapp.com/api/oauth2/authorize?client_id=594885334232334366&redirect_uri=http://127.0.0.1:8000/oauth/discord&response_type=code&scope=identify&prompt=none",
    "window",
    "toolbar=no, menubar=no, resizable=no height=600 width=400"
  );

  let checkConnect = setInterval(function () {
    if (!win || !win.closed) return;
    clearInterval(checkConnect);
    localStorage.setItem('token', Cookies.get('token'));
    currentUserSubject.next(Cookies.get('token'));
    Cookies.remove('token');
    window.location.reload();
  }, 100);
}

function logout() {
  localStorage.removeItem("token");
  currentUserSubject.next(null);
}

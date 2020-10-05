import { createContext, useContext } from "react";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function loginDiscord() {
  let win = window.open(
    `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_ID}&redirect_uri=${process.env.REACT_APP_DISCORD_REDIRECT_URI}&response_type=code&scope=identify&prompt=none`,
    "window",
    "toolbar=no, menubar=no, resizable=no height=600 width=400"
  );

  let checkConnect = setInterval(() => {
    if (!win || !win.closed) return;
    clearInterval(checkConnect);
    window.location.reload();
  }, 100);
}

export function loginLine() {
  window.liff.login();
}

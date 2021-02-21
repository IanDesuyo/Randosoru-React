import React, { lazy, useState, Suspense, Fragment, useMemo, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import Analytics from "react-router-ga";
import "./App.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AuthContext, checkToken } from "./Services/Auth";
import { FavContext } from "./Services/Favorite";
import NavBar from "./Components/Navbar";
import LeftDrawer from "./Components/LeftDrawer";
import Axios from "axios";
import toastr from "toastr";
import { useTranslation } from "react-i18next";

const Home = lazy(() => import("./Views/Home"));
const Login = lazy(() => import("./Views/Login"));
const DiscordOauthRedirect = lazy(() => import("./Views/DiscordOauthRedirect"));
const LineOauthRedirect = lazy(() => import("./Views/LineOauthRedirect"));
const UserProfile = lazy(() => import("./Views/UserProfile"));
const FormRecord = lazy(() => import("./Views/FormRecord"));
const FormConfig = lazy(() => import("./Views/FormModify"));
const FormOverview = lazy(() => import("./Views/FormOverview"));

const checkDarkMode = deviceDarkMode => {
  let darkMode = JSON.parse(localStorage.getItem("darkMode"));
  if (darkMode === null) {
    localStorage.setItem("darkMode", JSON.stringify(deviceDarkMode));
    darkMode = deviceDarkMode;
  }
  return darkMode;
};

const versionUpdate = () => {
  try {
    JSON.parse(localStorage.getItem("token"));
  } catch (e) {
    localStorage.removeItem("token");
  }
  localStorage.removeItem("favorite");
};

export default function App() {
  versionUpdate();

  const [darkMode, setDarkMode] = useState(
    checkDarkMode(useMediaQuery("(prefers-color-scheme: dark)"))
  );

  const existToken = JSON.parse(localStorage.getItem("token"));
  const existFav = JSON.parse(localStorage.getItem("fav"));
  const [token, setTokenState] = useState(existToken);
  const [fav, setFavState] = useState(existFav || []);
  const [currentForm, setCurrentFormState] = useState();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [liffState, setLiffState] = useState(false);
  const { liff } = window;
  const { t } = useTranslation();

  const setToken = data => {
    if (data == null) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", JSON.stringify(data));
    }
    setTokenState(data);
  };

  const isFav = id => {
    return fav.find(x => x.id === id);
  };

  const setFav = (title, id, week) => {
    let temp = [...fav.filter(x => x.id !== id), { title: title, id: id, week: week }];
    setFavState(temp);
    localStorage.setItem("fav", JSON.stringify(temp));
  };

  const removeFav = (title, id) => {
    let temp = fav.filter(x => x.id !== id);
    setFavState(temp);
    localStorage.setItem("fav", JSON.stringify(temp));
  };

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#303030" : "#2196f3",
          },
          secondary: {
            main: darkMode ? "#2196f3" : "#f50057",
          },
        },
      }),
    [darkMode]
  );

  const handleDarkModeToggle = mode => {
    localStorage.setItem("darkMode", JSON.stringify(mode));
    setDarkMode(mode);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    (async () => {
      setLiffState(true);
      await liff.init({ liffId: process.env.REACT_APP_LINE_LIFF_ID });
      setLiffState(false);

      if (token) return;

      if (liff.isInClient() || liff.isLoggedIn()) {
        Axios.post(`/api/oauth/line_liff?access_token=${liff.getAccessToken()}`).then(res => {
          localStorage.removeItem("loginStatus");
          setToken(res.data.token);
        });
      }
    })();
    if (!checkToken(existToken)) {
      toastr.info(t("Alerts.TokenExpired"), {
        closeButton: true,
        positionClass: "toast-bottom-right",
      });
      setToken(null);
    }
  }, []);

  if (liffState) return <></>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthContext.Provider value={{ token, setToken: setToken }}>
          <FavContext.Provider
            value={{
              fav,
              isFav: isFav,
              setFav: setFav,
              removeFav: removeFav,
              currentForm,
              setCurrentForm: setCurrentFormState,
            }}
          >
            <Analytics id={process.env.REACT_APP_GA}>
              <NavBar menuClick={handleDrawerToggle} />
              <LeftDrawer
                open={drawerOpen}
                onToggle={handleDrawerToggle}
                darkMode={darkMode}
                setDarkMode={handleDarkModeToggle}
              />
              <Switch>
                <Suspense fallback={<Fragment />}>
                  <Route exact path="/" component={Home} />
                  <Route path="/login" component={AuthLayout} />
                  <Route path="/users" component={UserLayout} />
                  <Route path={["/forms", "/form"]} component={FormLayout} />
                </Suspense>
              </Switch>
            </Analytics>
          </FavContext.Provider>
        </AuthContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AuthLayout() {
  return (
    <Switch>
      <Route exact path="/login/oauth/discord" component={DiscordOauthRedirect} />
      <Route exact path="/login/oauth/line" component={LineOauthRedirect} />
      <Route exact path="/login" component={Login} />
    </Switch>
  );
}

function UserLayout() {
  return (
    <Switch>
      <Route exact path="/users/:id" component={UserProfile} />
      <Redirect exact from="/user/:id" to="/users/:id" />
      <Redirect exact from="/users" to="/users/me" />
      <Redirect exact from="/user" to="/users/me" />
    </Switch>
  );
}

function FormLayout() {
  return (
    <Switch>
      <Route exact path="/forms/:id/overview" component={FormOverview} />
      <Route exact path="/forms/:id/week/:week" component={FormRecord} />
      <Route exact path="/forms/:id/modify" component={FormConfig} />
      <Redirect exact from="/form/:id/week/:week" to="/forms/:id/week/:week" />
      <Redirect exact from="/forms/:id" to="/forms/:id/week/1" />
    </Switch>
  );
}

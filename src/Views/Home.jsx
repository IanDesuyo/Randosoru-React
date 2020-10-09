import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import ReactMarkdown from "react-markdown";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import ErrorHandler from "../Services/ErrorHandler";

export default function Home() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);

  const fetchNews = () => {
    document.title = t("Title");
    Axios.get(`https://api.github.com/gists/${process.env.REACT_APP_HOME_GISTID}`)
      .then(res => {
        setData(res.data.files[process.env.REACT_APP_HOME_GIST_FILENAME].content);
      })
      .catch(error => {
        ErrorHandler(error);
        setData("Load Failed...");
      });
  };

  useEffect(fetchNews, []);

  return (
    <>
      <Backdrop open={!data}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container>
        <ReactMarkdown source={data ? data : "Loading..."} />
      </Container>
    </>
  );
}

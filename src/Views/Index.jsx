import React from "react";
import Container from "@material-ui/core/Container";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useEffect } from "react";
import Axios from "axios";

export default function Index() {
  const [data, setData] = useState(null);

  const fetchNews = () => {
    Axios.get("https://api.github.com/gists/cace6fa03a51d17758dd171278461eb1")
      .then(res => {
        setData(res.data.files["Randosoru Guild Index"].content);
      })
      .catch(error => {
        setData("Load Failed...");
      });
  };

  useEffect(() => {
    fetchNews();
  }, []);

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

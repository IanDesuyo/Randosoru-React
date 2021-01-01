import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Axios from "axios";
import { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import MuiAlert from "@material-ui/lab/Alert";
import { useTranslation } from "react-i18next";
import Typography from "@material-ui/core/Typography";
import { Toolbar } from "@material-ui/core";
import ErrorHandler from "../Services/ErrorHandler";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../Services/Auth";
import { useFav } from "../Services/Favorite";

const useStyles = makeStyles(theme => ({
  fab: {
    margin: "0px",
    top: "auto",
    right: "20px",
    bottom: "20px",
    left: "auto",
    position: "fixed",
  },
  container: {
    paddingTop: theme.spacing(2),
  },
  bossImg: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    height: theme.spacing(1),
  },
}));

export default function FormConfig() {
  let { id } = useParams();
  const classes = useStyles();
  const { t } = useTranslation();
  const [status, setStatus] = useState();
  const [formDetail, setFormDetail] = useState();
  const { setCurrentForm } = useFav();
  const { token } = useAuth();
  const [isLoading, setLoading] = useState(false);

  const fetchFormDetails = () => {
    if (id.length !== 32) {
      setStatus(401);
      return;
    }
    Axios.get("/api/forms/" + id)
      .then(res => {
        setFormDetail(res.data);
        setStatus(200);
        document.title = `${res.data.title} - ${t("Brand")}`;
        setCurrentForm({ id: id, week: 0, title: res.data.title })
      })
      .catch(error => {
        ErrorHandler(error);
        setStatus(error.response.status);
      });
  };

  useEffect(fetchFormDetails, [id]);

  if (!status) {
    return (
      <Backdrop open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (status === 200) {
    return (
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Typography>
              {formDetail.title + (formDetail.description ? ` - ${formDetail.description}` : "")}
            </Typography>
          </Toolbar>
        </AppBar>
        <Container>
          <Backdrop open={isLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Formik
            initialValues={formDetail}
            validationSchema={FormSchema}
            onSubmit={values => {
              setLoading(true);
              Axios.post(`/api/forms/${formDetail.id}/modify`, values, {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then(() => {
                  setFormDetail(values);
                  setLoading(false);
                })
                .catch(error => {
                  setLoading(false);
                  ErrorHandler(error);
                });
            }}
            validateOnChange={false}
            validateOnBlur={true}
            enableReinitialize
          >
            {props => (
              <>
                <Typography variant="h6">{t("General")}</Typography>
                <Grid container className={classes.container} spacing={2}>
                  <Grid item>
                    <Field
                      as={TextField}
                      id="title"
                      label={t("Title")}
                      value={props.values.title}
                      onChange={props.handleChange}
                      error={!!props.errors.title}
                      helperText={props.errors.title}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      as={TextField}
                      id="description"
                      label={t("Description")}
                      value={props.values.description}
                      onChange={props.handleChange}
                      error={!!props.errors.description}
                      helperText={props.errors.description}
                    />
                  </Grid>
                </Grid>
                {props.values.boss.map((value, index) => (
                  <div key={index}>
                    <Divider className={classes.divider} />
                    <Typography variant="h6">{`Boss ${index + 1}`}</Typography>
                    <Grid container className={classes.container} spacing={2}>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          id={`boss.${index}.name`}
                          label={t("Name")}
                          value={value.name}
                          onChange={props.handleChange}
                          error={
                            props.errors.boss &&
                            props.errors.boss[index] &&
                            !!props.errors.boss[index].name
                          }
                          helperText={
                            props.errors.boss &&
                            props.errors.boss[index] &&
                            props.errors.boss[index].name
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          as={TextField}
                          id={`boss.${index}.image`}
                          label={t("ImageURL")}
                          value={value.image}
                          onChange={props.handleChange}
                          type="url"
                          error={
                            props.errors.boss &&
                            props.errors.boss[index] &&
                            !!props.errors.boss[index].image
                          }
                          helperText={
                            props.errors.boss &&
                            props.errors.boss[index] &&
                            props.errors.boss[index].image
                          }
                        />
                      </Grid>
                      {value.hp.map((stage, stageIndex) => (
                        <Grid item key={stageIndex}>
                          <Field
                            as={TextField}
                            id={`boss.${index}.hp.${stageIndex}`}
                            label={`Stage ${stageIndex + 1} ${t("Hp")}`}
                            value={stage}
                            onChange={props.handleChange}
                            type="number"
                            error={
                              props.errors.boss &&
                              props.errors.boss[index] &&
                              props.errors.boss[index].hp &&
                              !!props.errors.boss[index].hp[stageIndex]
                            }
                            helperText={
                              props.errors.boss &&
                              props.errors.boss[index] &&
                              props.errors.boss[index].hp &&
                              props.errors.boss[index].hp[stageIndex]
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ))}
                {token ? (
                  <Fab
                    color="primary"
                    className={classes.fab}
                    onClick={props.isValid ? props.handleSubmit : console.log()}
                    disabled={!props.dirty || !props.isValid}
                  >
                    <SaveIcon />
                  </Fab>
                ) : (
                  <></>
                )}
              </>
            )}
          </Formik>
        </Container>
      </div>
    );
  } else {
    let error;
    switch (status) {
      case 404:
        error = t("Alerts.FormNotFound");
        break;
      case 401:
        error = t("Alerts.FormBadID");
        break;
      default:
        error = t("Alerts.Error");
    }
    return (
      <Container>
        <Box mt={3}>
          <MuiAlert elevation={6} variant="filled" severity="error">
            {error}
          </MuiAlert>
        </Box>
      </Container>
    );
  }
}

const FormSchema = Yup.object().shape({
  title: Yup.string().max(20, "字數過長").required("不能為空白"),
  description: Yup.string().max(40, "字數過長").nullable(),
  boss: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(20, "字數過長").required("不能為空白"),
      image: Yup.string().max(100, "字數過長").url("網址不正確"),
      hp: Yup.array().of(
        Yup.number()
          .min(1, "血量需介於1~500000000之間")
          .max(500000000, "血量需介於1~500000000之間")
          .required("不能為空白")
      ),
    })
  ),
});

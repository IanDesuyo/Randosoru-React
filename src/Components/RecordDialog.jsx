import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import Divider from "@material-ui/core/Divider";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
  comment: {
    margin: theme.spacing(1),
    minWidth: 240,
  },
}));

export function RecordDialog(props) {
  const classes = useStyles();
  const { onClose, open, rowData } = props;
  const { t } = useTranslation();
  const [comment, setComment] = useState();
  const [status, setStatus] = useState();
  const [damage, setDamage] = useState();
  const [damageError, setDamageError] = useState();
  const [commentError, setCommentError] = useState();

  useEffect(() => {
    setComment(rowData ? rowData.comment : null);
    setStatus(rowData ? rowData.status : 1);
    setDamage(rowData ? rowData.damage : null);
  }, [rowData]);

  const handleClose = () => {
    onClose(false);
  };

  const handleSave = () => {
    onClose({
      id: rowData ? rowData.id : null,
      damage: damage,
      status: status,
      comment: comment,
    });
  };

  const handleChangeComment = (event) => {
    let value = event.target.value;
    if (value.length > 40) {
      setCommentError(t("Record.Error.Comment"));
    }
    setComment(value);
    setCommentError(null);
  };

  const handleChangeStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleChangeDamage = (event) => {
    let value = event.target.value;
    if (value > 0 && value < 50000000) {
      setDamage(parseInt(value));
      setDamageError(null);
    } else if (value === "") {
      setDamage(null);
      setDamageError(null);
    } else {
      setDamageError(t("Record.Error.Damage"));
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        {rowData ? t("Record.EditRecord") : t("Record.AddRecord")}
      </DialogTitle>
      <DialogContent>
        <Grid container className={classes.container}>
          <Grid item>
            <FormControl className={classes.formControl}>
              <InputLabel id="status-label">{t("Record.Status")}</InputLabel>
              <Select
                labelId="status-label"
                id="demo-dialog-select"
                value={status}
                onChange={handleChangeStatus}
                input={<Input />}
                defaultValue={status}
              >
                <MenuItem value={1}>{t("Record.StatusType.1")}</MenuItem>
                <MenuItem value={2}>{t("Record.StatusType.2")}</MenuItem>
                <MenuItem value={3}>{t("Record.StatusType.3")}</MenuItem>
                <Divider />
                <MenuItem value={11}>{t("Record.StatusType.11")}</MenuItem>
                <MenuItem value={12}>{t("Record.StatusType.12")}</MenuItem>
                <MenuItem value={13}>{t("Record.StatusType.13")}</MenuItem>
                <Divider />
                <MenuItem value={21}>{t("Record.StatusType.21")}</MenuItem>
                <MenuItem value={22}>{t("Record.StatusType.22")}</MenuItem>
                <MenuItem value={23}>{t("Record.StatusType.23")}</MenuItem>
                <Divider />
                <MenuItem value={99} disabled={!rowData}>
                  {t("Record.Delete")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl className={classes.formControl}>
              <TextField
                label={t("Record.Damage")}
                defaultValue={damage}
                onChange={handleChangeDamage}
                type="number"
                error={!!damageError}
                helperText={damageError}
              />
            </FormControl>
          </Grid>
          <Grid item xs={11}>
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                label={t("Record.Comment")}
                defaultValue={comment}
                onChange={handleChangeComment}
                error={!!commentError}
                helperText={commentError}
              />
            </FormControl>
          </Grid>
          <Grid item xs={11}>
            <FormControl className={classes.formControl} fullWidth>
              <TextField
                label={t("Record.LastModified")}
                defaultValue={
                  rowData
                    ? new Date(rowData.last_modified * 1000).toLocaleString()
                    : t("Null")
                }
                disabled
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t("Cancel")}
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={commentError || damageError}
        >
          {rowData ? t("Edit") : t("Add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

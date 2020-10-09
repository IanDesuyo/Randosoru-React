import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import ExportCsv from "../Services/ExportCsv";
import Axios from "axios";
import { useFav } from "../Services/Favorite";
import { useAuth } from "../Services/Auth";
import ErrorHandler from "../Services/ErrorHandler";

export default function ExportChecker(props) {
  const { onClose, open } = props;
  const { t } = useTranslation();
  const { token } = useAuth();
  const { currentForm } = useFav();
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setLoading(false);
    onClose(false);
  };

  const handleAgree = () => {
    setLoading(true);
    Axios.get(`/api/forms/${currentForm.id}/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        ExportCsv(
          [
            { title: t("Record.Week"), field: "week" },
            { title: t("Record.Boss"), field: "boss" },
            { title: t("Name"), field: "user.name" },
            { title: t("Record.Comment"), field: "comment" },
            { title: t("Record.Damage"), field: "damage" },
            { title: t("Record.Status"), field: "status" },
            { title: t("Record.LastModified"), field: "last_modified" },
          ],
          res.data,
          currentForm.title,
          t
        );
      })
      .catch(error => ErrorHandler(error));
    setTimeout(() => {
      handleClose();
    }, 1000);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("Record.ExportCheckTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("Record.ExportCheckDescription")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isLoading}>
            {t("Disagree")}
          </Button>
          <Button
            onClick={handleAgree}
            color="primary"
            variant="contained"
            autoFocus
            disabled={isLoading}
          >
            {t("Agree")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

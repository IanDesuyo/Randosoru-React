import React from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import CommentIcon from "@material-ui/icons/Comment";
import FavoriteIcon from "@material-ui/icons/Favorite";
import AccessTimeIcon from "@material-ui/icons/AccessTime";

const useStyles = makeStyles({
  damage: {
    backgroundColor: "#ff3333",
  },
});

export default function RecordDetails(props) {
  const classes = useStyles();
  const { onClose, open, rowData } = props;
  const { t } = useTranslation();

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
      <DialogTitle>{t("Record.RecordDetails")}</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <Avatar src={rowData ? rowData.user.avatar : null} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={rowData ? rowData.user.name : null} />
          </ListItem>
          <DetailItem
            icon={
              <Avatar>
                <CommentIcon />
              </Avatar>
            }
            title={t("Record.Status")}
            value={rowData ? t("Record.StatusType." + rowData.status) : t("ERROR")}
          />
          <DetailItem
            icon={
              <Avatar className={classes.damage}>
                <FavoriteIcon />
              </Avatar>
            }
            title={t("Record.Damage")}
            value={rowData && rowData.damage !== null ? rowData.damage : t("Null")}
          />
          <DetailItem
            icon={
              <Avatar>
                <CommentIcon />
              </Avatar>
            }
            title={t("Record.Comment")}
            value={rowData && rowData.comment !== "" ? rowData.comment : t("Null")}
          />
          <DetailItem
            icon={
              <Avatar>
                <AccessTimeIcon />
              </Avatar>
            }
            title={t("Record.LastModified")}
            value={rowData ? new Date(rowData.last_modified * 1000).toLocaleString() : t("Null")}
          />
        </List>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem(props) {
  const { icon, title, value } = props;
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{icon}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={title + ": " + value} />
    </ListItem>
  );
}

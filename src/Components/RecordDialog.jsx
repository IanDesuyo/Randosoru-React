import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTranslation } from "react-i18next";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import PersonIcon from "@material-ui/icons/Person";
import Avatar from "@material-ui/core/Avatar";

export default function LangDialog(props) {
  const { onClose, open, rowData } = props;
  const { t } = useTranslation();

  const handleClose = () => {
    onClose(null);
  };

  return (
    <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
      <DialogTitle>{t("Record.DialogTitle")}</DialogTitle>
      <List>
        <ListItem button key={1}>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={rowData.key} />
        </ListItem>
      </List>
    </Dialog>
  );
}

import React from "react";
import { useTranslation } from "react-i18next";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function LangDialog(props) {
    const { onClose, open } = props;
    const { t, i18n } = useTranslation();
  
    const handleClose = () => {
      onClose(false);
    };
  
    const handleListItemClick = (value) => {
      i18n.changeLanguage(value);
      onClose(false);
    };
  
    return (
      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth={true}>
        <DialogTitle>{t("Drawer.Language")}</DialogTitle>
        <List>
          {[
            ["zh-TW", "繁體中文"],
            ["ja", "日本語"],
            ["en", "English"],
          ].map((lang, index) => (
            <ListItem
              button
              onClick={() => handleListItemClick(lang[0])}
              key={index}
            >
              <ListItemText primary={lang[1]} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    );
  }
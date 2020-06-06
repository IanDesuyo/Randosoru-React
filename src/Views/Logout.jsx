import React from "react";
import { Redirect } from "react-router-dom";
import { AuthService } from "../Services/Auth/AuthService";
import { useTranslation } from "react-i18next";
import toastr from "toastr";

export default function Logout(props) {
  const { t } = useTranslation();

  if (!AuthService.currentUserValue) {
    toastr.success(t("Notices.HasLogout"), "", {closeButton:true, positionClass: "toast-bottom-right"});
    return <Redirect to="/" />;
  } else {
    AuthService.logout();
    return <Redirect to="/" />;
  }
}

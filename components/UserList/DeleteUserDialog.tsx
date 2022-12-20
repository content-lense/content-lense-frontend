import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { AuthenticatedUserInterface } from "../../interfaces/UserInterface";

interface DeleteUserDialogPropsInterface {
  onConfirmDelete: (userIri: string) => void;
  onClose: () => void;
  openDialog: boolean;
  user: AuthenticatedUserInterface;
}

export default function DeleteUserDialog(props: DeleteUserDialogPropsInterface) {
  const { t } = useTranslation();
  return (
    <Dialog open={props.openDialog}>
      <DialogTitle>{t("Delete User")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("Do you really want to delete the user {{name}}", { name: props.user.displayName })}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={() => props.onClose()}>
          {t("Cancle")}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            props.onConfirmDelete(props.user["@id"]);
            props.onClose();
          }}
        >
          {t("Confirn")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

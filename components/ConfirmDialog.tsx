// INFO: This File is translated
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useTranslation } from "next-i18next";

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  question?: string;
  title?: string;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => props.onClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title ?? t("Confirm")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.question ?? t("Are you sure you want to delete this item?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.onClose()}>{t("Cancel")} </Button>
          <Button onClick={() => props.onConfirm()} autoFocus>
            {t("Confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

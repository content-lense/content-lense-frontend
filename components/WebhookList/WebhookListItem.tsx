import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Chip,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { AnalysisMicroserviceInterface } from "../../interfaces/AnalysisMicroserviceInterface";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import { WebhookInterface } from "../../interfaces/WebhookInterface";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "../ConfirmDialog";
import { deleteObjectByIri } from "../../data/ReactQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import WebhookDialog from "./WebhookDialog";
import { useTranslation } from "next-i18next";

function WebhookListItem(props: { webhook: WebhookInterface }) {
  const { t } = useTranslation();
  const { webhook: a } = props;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: deleteWebhook } = useMutation(deleteObjectByIri, {
    onSuccess: (deletedWebhookIri: string) => {
      queryClient.setQueryData(["webhooks"], (prev: any) => {
        const delArray = [...prev.filter((delWebhook: WebhookInterface) => delWebhook["@id"] != deletedWebhookIri)];
        return delArray;
      });
    },
  });

  return (
    <>
      <ListItem
        secondaryAction={
          <Stack direction={"row"}>
            <IconButton aria-label="edit-webhook" onClick={() => setIsDialogOpen(true)}>
              <Edit />
            </IconButton>
            <IconButton aria-label="delete-person" onClick={() => setIsOpenConfirmDialog(true)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        }
      >
        <ListItemText
          primary={a.name}
          secondary={
            <React.Fragment>
              <Typography variant="caption">{a.endpoint}</Typography>
            </React.Fragment>
          }
        />
        <Chip sx={{ mr: 10 }} color={a.isActive ? "success" : "default"} label={a.isActive ? t("Active") : t("Disabled")} />
      </ListItem>
      <WebhookDialog isWebhookDialogOpen={isDialogOpen} setIsWebhookDialogOpen={(val) => setIsDialogOpen(val)} webhook={a} />
      <ConfirmDialog onClose={() => setIsOpenConfirmDialog(false)} onConfirm={() => { deleteWebhook(a["@id"]); setIsOpenConfirmDialog(false) }} open={isOpenConfirmDialog} question={t("Do you really want to delete this webhook")} title={t("Delete webhook")} />
    </>
  );
}

export default WebhookListItem;

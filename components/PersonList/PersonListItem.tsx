import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useState } from "react";
import { deleteObjectByIri, GenericPutItem } from "../../data/ReactQueries";
import { Gender, PersonInterface, UpdatePersonInterface } from "../../interfaces/PersonInterface";
import * as yup from "yup";
import { useFormik } from "formik";
import DeleteIcon from '@mui/icons-material/Delete';
import PersonDialog from "./PersonDialog";
import ConfirmDialog from "../ConfirmDialog";
import { useTranslation } from "next-i18next";

function PersonListItem(props: { person: PersonInterface }) {
  const { t } = useTranslation();
  const { person: p } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deletePerson } = useMutation(deleteObjectByIri, {
    onSuccess: (deletedPersonIri: string) => {
      queryClient.setQueryData(["persons"], (prev: any) => {
        const delArray = [...prev.filter((delPerson: PersonInterface) => delPerson["@id"] != deletedPersonIri)];
        return delArray;
      });
    },
  });


  return (
    <>
      <ListItem
        secondaryAction={
          <Stack direction={"row"}>
            <IconButton aria-label="edit-person" onClick={() => setIsDialogOpen(true)}>
              <Edit />
            </IconButton>
            <IconButton aria-label="delete-person" onClick={() => setIsOpenConfirmDialog(true)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        }
      >
        <Stack direction={"row"} spacing={1} >
          <ListItemText primary={`${p.firstName} ${p.lastName}`} sx={{ pr: 2 }} />
          {p.age && (
            <Tooltip title={t("Age")}>
              <Chip label={p.age} />
            </Tooltip>
          )}
          {p.gender && (
            <Tooltip title={t("Gender")}>
              <Chip label={p.gender} />
            </Tooltip>
          )}
        </Stack>
      </ListItem>
      <PersonDialog isPersonDialogOpen={isDialogOpen} setIsPersonDialogOpen={(val) => setIsDialogOpen(val)} person={p} />
      <ConfirmDialog onClose={() => setIsOpenConfirmDialog(false)} onConfirm={() => { deletePerson(p["@id"]); setIsOpenConfirmDialog(false) }} open={isOpenConfirmDialog} question={t("Möchten Sie diese Person wirklich löschen?")} title={t("Delete person")} />
    </>

  );
}

export default PersonListItem;

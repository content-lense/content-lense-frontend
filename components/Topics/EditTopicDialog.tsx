import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Stack,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import {
  ArticleTopicInterface,
  CreateArticleTopicInterface,
} from "../../interfaces/ArticleTopicInterface";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GenericGetItems, GenericPostItem } from "../../data/ReactQueries";
import { loginUser } from "../../data/UserData";

interface EditTopicDialogInterface {
  isOpen: boolean;
  topic?: ArticleTopicInterface;
  onClose: () => void;
}

export default function EditTopicDialog(props: EditTopicDialogInterface) {
  const queryClient = useQueryClient();
  const { data: topics, isLoading } = useQuery(["topics"], () =>
    GenericGetItems<ArticleTopicInterface>("/article_topics")
  );
  const {
    mutate: createArticleTopic,
    isLoading: isSaving,
    isError: isErrorSaving,
    error: onSaveError,
  } = useMutation(GenericPostItem<CreateArticleTopicInterface, ArticleTopicInterface>, {
    onSuccess: (newTopic: ArticleTopicInterface) => {
      console.log("SAVED");
      queryClient.setQueryData(["topics"], [...(topics ?? []), newTopic]);
    },
    onError: (err: Error) => {
      console.log("ERROR", err);
    },
  });
  const { mutate: updateArticleTopic, isLoading: isUpdating } = useMutation(
    GenericPostItem<CreateArticleTopicInterface, ArticleTopicInterface>,
    {
      onSuccess: (newTopic: ArticleTopicInterface) => {
        queryClient.setQueryData(["topics"], [...(topics ?? []), newTopic]);
      },
    }
  );
  const validationSchema = yup.object({
    name: yup.string().required("Name wird benötigt"),
    blacklist: yup.string(),
    whitelist: yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      name: props.topic ? props.topic.name : "",
      blacklist: props.topic ? props.topic.blacklist.join("\n") : "",
      whitelist: props.topic ? props.topic.whitelist.join("\n") : "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!props.topic) {
        const result = await createArticleTopic({
          "@context": "/article_topics",
          name: values.name,
          blacklist: values.blacklist.split("\n"),
          whitelist: values.whitelist.split("\n"),
        });
      }
    },
  });
  console.log(formik.values, "formikValues", props.topic, isErrorSaving, onSaveError);
  return (
    <Dialog open={props.isOpen}>
      <DialogTitle>
        <Typography variant="h5">
          {props.topic ? "Thema bearbeiten" : "Neues Thema erstellen"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} alignItems="center">
          <TextField
            fullWidth
            name="name"
            label="Name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.errors.name && <Alert severity="info">{formik.errors.name}</Alert>}
          <TextField
            fullWidth
            name="whitelist"
            label="Whitelist keywords"
            variant="outlined"
            multiline
            minRows={3}
            value={formik.values.whitelist}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            name="blacklist"
            label="Blacklist keywords"
            variant="outlined"
            multiline
            minRows={3}
            value={formik.values.blacklist}
            onChange={formik.handleChange}
          />
          {isErrorSaving && (
            <Alert severity="warning">Beim speichern des Themas ist ein Fehler aufgetreten.</Alert>
          )}
          {isSaving && <CircularProgress />}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            props.onClose();
            formik.resetForm();
          }}
        >
          Abbrechen
        </Button>
        <Button variant="outlined" onClick={() => formik.handleSubmit()}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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
  UpdateArticleTopicInterface,
} from "../../interfaces/ArticleTopicInterface";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GenericGetItems, GenericPostItem, GenericPutItem } from "../../data/ReactQueries";
import { loginUser } from "../../data/UserData";

interface EditTopicDialogInterface {
  isOpen: boolean;
  topic?: ArticleTopicInterface;
  onClose: () => void;
}

export default function EditTopicDialog(props: EditTopicDialogInterface) {
  const { t } = useTranslation();
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
      queryClient.setQueryData(["topics"], [...(topics ?? []), newTopic]);
    },
    onError: (err: Error) => { },
  });
  const { mutate: updateArticleTopic, isLoading: isUpdating } = useMutation(
    GenericPutItem<UpdateArticleTopicInterface, ArticleTopicInterface>,
    {
      onSuccess: (updatedTopic: ArticleTopicInterface) => {
        if (!topics) return;
        const _topics = [...topics];
        _topics.splice(
          _topics.findIndex((t) => t.id === updatedTopic.id),
          1,
          updatedTopic
        );
        queryClient.setQueryData(["topics"], _topics);
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
      let result;
      if (!props.topic) {
        result = await createArticleTopic({
          "@context": "/article_topics",
          name: values.name,
          blacklist: values.blacklist.split("\n"),
          whitelist: values.whitelist.split("\n"),
        });
      } else {
        result = await updateArticleTopic({
          ...props.topic,
          name: values.name,
          blacklist: values.blacklist.split("\n"),
          whitelist: values.whitelist.split("\n"),
        });
      }

      props.onClose();
    },
  });
  return (
    <Dialog open={props.isOpen}>
      <DialogTitle>
        <Typography variant="h5">
          {props.topic ? t("Edit topic") : t("Create new topic")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} alignItems="center">
          <TextField
            fullWidth
            name="name"
            label={t("Name")}
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          {formik.errors.name && <Alert severity="info">{formik.errors.name}</Alert>}
          <TextField
            fullWidth
            name="whitelist"
            label={t("Whitelist keywords")}
            variant="outlined"
            multiline
            minRows={3}
            value={formik.values.whitelist}
            onChange={formik.handleChange}
          />
          <TextField
            fullWidth
            name="blacklist"
            label={t("Blacklist keywords")}
            variant="outlined"
            multiline
            minRows={3}
            value={formik.values.blacklist}
            onChange={formik.handleChange}
          />
          {isErrorSaving && (
            <Alert severity="warning">{t("An error occured while trying to save.")}</Alert>
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
          {t("Cancle")}
        </Button>
        <Button variant="outlined" onClick={() => formik.handleSubmit()}>
          {t("Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

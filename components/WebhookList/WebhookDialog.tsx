import { Edit } from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    MenuItem,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useState } from "react";
import { deleteObjectByIri, GenericPostItem, GenericPutItem } from "../../data/ReactQueries";
import { CreatePersonInterface, Gender, PersonInterface, UpdatePersonInterface } from "../../interfaces/PersonInterface";
import * as yup from "yup";
import { useFormik } from "formik";
import DeleteIcon from '@mui/icons-material/Delete';
import { CreateWebhookInterface, WebhookInterface } from "../../interfaces/WebhookInterface";
import { useTranslation } from "next-i18next";

interface WebhookDialogProps {
    isWebhookDialogOpen: boolean;
    setIsWebhookDialogOpen: (open: boolean) => void;
    webhook?: WebhookInterface;
}

function WebhookDialog(props: WebhookDialogProps) {
    const { t } = useTranslation();

    const queryClient = useQueryClient();

    const { mutate: updateWebhook } = useMutation(
        GenericPutItem<WebhookInterface, WebhookInterface>,
        {
            onSuccess(updatedWebhook) {
                queryClient.setQueryData(["webhooks"], (prev: any) => {
                    return [...prev.filter((webhook: WebhookInterface) => webhook.id != updatedWebhook.id), updatedWebhook];
                })
            }
        }
    );

    const { mutate: createWebhook } = useMutation(
        GenericPostItem<CreateWebhookInterface, WebhookInterface>,
        {
            onSuccess(createdWebhook) {
                queryClient.invalidateQueries(["webhooks"]);
            }
        }
    );

    const validationSchema = yup.object({
        name: yup.string().required(),
        endpoint: yup.string().required(),
    });

    const formik = useFormik({
        initialValues: {
            name: props.webhook?.name,
            endpoint: props.webhook?.endpoint,
        },
        validationSchema,
        onSubmit: async (values) => {
            if (values.name && values.endpoint) {
                props.webhook ? updateWebhook({
                    ...props.webhook,
                    name: values.name,
                    endpoint: values.endpoint,
                }) : createWebhook({
                    "@context": "/webhooks",
                    name: values.name,
                    endpoint: values.endpoint,
                });
                formik.resetForm();
            }
        }

    });

    async function handleUpdateWebhook(e: FormEvent) {
        await formik.setTouched({
            name: true,
            endpoint: true,
        });
        const errors = await formik.validateForm(formik.values);
        if (Object.keys(errors).length > 0) {
            return;
        }
        formik.handleSubmit();
        props.setIsWebhookDialogOpen(false)
    };

    return (
        <Dialog open={props.isWebhookDialogOpen} onClose={() => props.setIsWebhookDialogOpen(false)}>
            <DialogTitle>
                {props.webhook ? "Update Webhook" : "Create Webhook"}
            </DialogTitle>
            <DialogContent>
                <Stack sx={{ pt: 2 }} direction={"column"} alignItems="center" justifyContent={"center"} spacing={2} >
                    <Stack direction={"row"} alignItems="center" justifyContent={"center"} spacing={2} >
                        <TextField
                            label={t("Name")}
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            variant="outlined"
                            error={Boolean(formik.touched.name) && !!formik.errors.name}
                            helperText={Boolean(formik.touched.name) && formik.errors.name}
                        />
                        <TextField
                            label={t("Endpoint")}
                            name="endpoint"
                            value={formik.values.endpoint}
                            onChange={formik.handleChange}
                            variant="outlined"
                            error={Boolean(formik.touched.endpoint) && !!formik.errors.endpoint}
                            helperText={Boolean(formik.touched.endpoint) && formik.errors.endpoint}
                        />
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setIsWebhookDialogOpen(false)}>
                    {t("Cancle")}
                </Button>
                <Button onClick={(e) => { handleUpdateWebhook(e) }}>
                    {props.webhook ? t("Update") : t("Create")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default WebhookDialog
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
import { useTranslation } from "next-i18next";

interface PersonDialogProps {
    isPersonDialogOpen: boolean;
    setIsPersonDialogOpen: (open: boolean) => void;
    person?: PersonInterface;
}

function PersonDialog(props: PersonDialogProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    const { mutate: updatePerson } = useMutation(
        GenericPutItem<UpdatePersonInterface, PersonInterface>,
        {
            onSuccess(updatedPerson) {
                queryClient.setQueryData(["persons"], (prev: any) => {
                    return [...prev.filter((person: PersonInterface) => person.id != updatedPerson.id), updatedPerson];
                })
            }
        }
    );

    const { mutate: createPerson } = useMutation(
        GenericPostItem<CreatePersonInterface, PersonInterface>,
        {
            onSuccess(createdPerson) {
                console.log("created Person: ", createdPerson)
                queryClient.invalidateQueries(["persons"]);
                //queryClient.setQueryData(["persons"], (prev: any) => {
                //    return [...prev ?? [], createdPerson];
                //})
            }
        }
    );

    const validationSchema = yup.object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        gender: yup.mixed().oneOf([Gender.MALE, Gender.FEMALE, Gender.UNKNOWN]),
        age: yup.number().min(0).max(200),
    });

    const formik = useFormik({
        initialValues: {
            firstName: props.person?.firstName ?? "",
            lastName: props.person?.lastName ?? "",
            gender: props.person?.gender ?? Gender.UNKNOWN,
            age: props.person?.age ?? 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            props.person ? updatePerson({
                ...props.person,
                firstName: values.firstName,
                lastName: values.lastName,
                gender: values.gender,
                age: values.age,
            }) : createPerson({
                "@context": "/people",
                firstName: values.firstName,
                lastName: values.lastName,
                gender: values.gender,
                age: values.age,
            });
            formik.resetForm();
        }

    });

    async function handleUpdatePerson(e: FormEvent) {
        await formik.setTouched({
            firstName: true,
            lastName: true,
        });
        const errors = await formik.validateForm(formik.values);
        if (Object.keys(errors).length > 0) {
            return;
        }
        formik.handleSubmit();
        props.setIsPersonDialogOpen(false)
    };

    return (
        <Dialog open={props.isPersonDialogOpen} onClose={() => props.setIsPersonDialogOpen(false)}>
            <DialogTitle>
                {props.person ? t("Update Person") : t("Create Person")}
            </DialogTitle>
            <DialogContent>
                <Stack sx={{ pt: 2 }} direction={"column"} alignItems="center" justifyContent={"center"} spacing={2} >
                    <Stack direction={"row"} alignItems="center" justifyContent={"center"} spacing={2} >
                        <TextField
                            label={t("Firstname")}
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            variant="outlined"
                            error={Boolean(formik.touched.firstName) && !!formik.errors.firstName}
                            helperText={Boolean(formik.touched.firstName) && formik.errors.firstName}
                        />
                        <TextField
                            label={t("Lastname")}
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            variant="outlined"
                            error={Boolean(formik.touched.lastName) && !!formik.errors.lastName}
                            helperText={Boolean(formik.touched.lastName) && formik.errors.lastName}
                        />
                    </Stack>
                    <Stack direction={"row"} width="100%" alignItems="center" justifyContent={"space-between"} spacing={2} >
                        <TextField
                            label={t("Age")}
                            name="age"
                            type={"number"}
                            value={formik.values.age}
                            onChange={formik.handleChange}
                            variant="outlined"
                            sx={{ width: "50%" }}
                            error={!!formik.errors.age}
                            helperText={formik.errors.age}
                        />
                        <Select
                            value={formik.values.gender}
                            label={t("Gender")}
                            name="gender"
                            onChange={formik.handleChange}
                            error={!!formik.errors.gender}
                            sx={{ width: "50%" }}
                        >
                            <MenuItem value={Gender.FEMALE}>{Gender.FEMALE}</MenuItem>
                            <MenuItem value={Gender.MALE}>{Gender.MALE}</MenuItem>
                            <MenuItem value={Gender.UNKNOWN}>{Gender.UNKNOWN}</MenuItem>
                        </Select>
                        <FormHelperText>{formik.errors.gender}</FormHelperText>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => props.setIsPersonDialogOpen(false)}>
                    {t("Cancle")}
                </Button>
                <Button onClick={(e) => { handleUpdatePerson(e) }}>
                    {props.person ? t("Update") : t("Create")}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default PersonDialog
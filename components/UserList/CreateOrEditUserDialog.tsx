import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { AuthenticatedUserInterface, CreateUserInterface, UserSignupInterface } from "../../interfaces/UserInterface";
import * as yup from "yup";
import PasswordStrengthBar from "react-password-strength-bar";
import { useTranslation } from "next-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GenericPostItem, GenericPutItem } from "../../data/ReactQueries";
import { FormEvent, useEffect, useState } from "react";
import { UserRoles } from "../../enums/UserRoles";
import { useUser } from "../../helpers/useUser";

interface CreateOrEditUserDialogPropsInterface {
  user?: AuthenticatedUserInterface;
  open: boolean;
  onClose: () => void;
}

export default function CreateOrEditUserDialog(props: CreateOrEditUserDialogPropsInterface) {
  const { user } = useUser();
  const [isUserActive, setisUserActive] = useState<boolean>(props.user?.isActive ?? false);
  const queryClient = useQueryClient();

  const { mutate: updateUser } = useMutation(
    GenericPutItem<AuthenticatedUserInterface, AuthenticatedUserInterface>,
    {
      onSuccess(updatedUser) {
        queryClient.setQueryData(["users"], (prev: any) => {
          return [...prev.filter((webhook: AuthenticatedUserInterface) => webhook.id != updatedUser.id), updatedUser];
        })
      }
    }
  );

  const { mutate: createUser } = useMutation(
    GenericPostItem<CreateUserInterface, AuthenticatedUserInterface>,
    {
      onSuccess(createdUser) {
        queryClient.invalidateQueries(["users"]);
      }
    }
  );

  const { t } = useTranslation();
  const validationSchema = props.user ? yup.object({
    email: yup
      .string()
      .email("Bitte eine korrekte E-Mail Adresse eingeben")
      .required("Bitte E-Mail Adresse eingeben"),
    isActive: yup.boolean().required()
  }) : yup.object({
    email: yup
      .string()
      .email("Bitte eine korrekte E-Mail Adresse eingeben")
      .required("Bitte E-Mail Adresse eingeben"),
    password: yup
      .string()
      .min(8, t("Password should be of minimum 8 characters length"))
      .required(t("Password is required")),
    repeatPassword: yup
      .string()
      .min(8, t("Password should be of minimum 8 characters length"))
      .required(t("Password is required"))
      .oneOf([yup.ref("password"), null], t("Passwords must match")),
  });

  const formik = useFormik({
    initialValues: {
      email: props.user?.email ? props.user.email : "",
      password: props.user?.password ? props.user.password : "",
      repeatPassword: props.user?.password ? props.user.password : "",
      isActive: isUserActive
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      props.user ? updateUser({
        ...props.user,
        email: values.email,
        isActive: isUserActive
      }) : createUser({
        "@context": "/users",
        email: values.email,
        password: values.password,
        repeatPassword: values.repeatPassword
      });
      formik.resetForm();
      props.onClose();
    },
  });

  async function handleUpdateUser(e: FormEvent) {
    props.user ? await formik.setTouched({
      email: true,
      password: true,
      repeatPassword: true
    }) : await formik.setTouched({
      email: true,
      isActive: true,
    });
    const errors = await formik.validateForm(formik.values);
    if (Object.keys(errors).length > 0) {
      return;
    }
    formik.handleSubmit();
    props.onClose();
  };

  useEffect(() => {
    if (props.user?.isActive)
      setisUserActive(props.user?.isActive)
  }, [props.user?.isActive])


  return (
    <Dialog open={props.open} fullWidth onClose={props.onClose}>
      <DialogTitle >{props.user ? t("Edit user") : t("Create new user")}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 2 }}>
          <TextField
            name="email"
            label={t("E-Mail")}
            value={formik.values.email}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.email) && !!formik.errors.email}
            helperText={Boolean(formik.touched.email) && formik.errors.email}
          />
          {props.user && props.user["@id"] !== user?.["@id"] && (
            <>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Switch
                  name="isActive"
                  checked={formik.values.isActive}
                  onChange={(e) => setisUserActive(e.target.checked)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <Typography>
                  {t("Is Active")}
                </Typography>
              </Stack>
              <FormHelperText error={Boolean(formik.touched.isActive) && !!formik.errors.isActive}
              >{Boolean(formik.touched.isActive) && formik.errors.isActive?.toString()}</FormHelperText>
            </>
          )
          }
          {!props.user && (
            <>
              <TextField
                name="password"
                label={t("Password")}
                type={"password"}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.password) && !!formik.errors.password}
                helperText={Boolean(formik.touched.password) && formik.errors.password}
              />
              <TextField
                name="repeatPassword"
                label={t("Repeat Password")}
                type={"password"}
                value={formik.values.repeatPassword}
                onChange={formik.handleChange}
                error={Boolean(formik.touched.repeatPassword) && !!formik.errors.repeatPassword}
                helperText={Boolean(formik.touched.repeatPassword) && formik.errors.repeatPassword}
              />
            </>
          )
          }

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
        <Button
          variant="contained"
          onClick={(e) => {
            handleUpdateUser(e)
          }}
        >
          {t("Save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

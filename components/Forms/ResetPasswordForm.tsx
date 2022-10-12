// INFO: This File is translated
import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { ApiFetch } from "../../helpers/ApiFetch";

interface ResetPasswordFormProps {
  email?: string | null;
}

const ResetPasswordForm: FC<ResetPasswordFormProps> = (props) => {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { t } = useTranslation();
  const validationSchema = yup.object({
    email: yup
      .string()
      .email(t("Enter a valid email"))
      .required(t("Email is required")),
  });
  const formik = useFormik({
    initialValues: {
      email: props.email ?? "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const res = await ApiFetch(`/auth/reset-password`, {
        body: JSON.stringify(values),
        method: "POST",
      });
      if (res.ok) {
        router.push("/resetted-password-confirmation");
      } else {
        setSubmissionError(t("An error ocurred, please try again later."));
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label={t("Email")}
              variant="filled"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              loading={loading}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={Boolean(formik.errors.email)}
            >
              {t("Reset password")}
            </LoadingButton>
          </Grid>
          <Grid item xs={12}>
            {submissionError != null && (
              <Alert severity="error">{submissionError}</Alert>
            )}
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default ResetPasswordForm;

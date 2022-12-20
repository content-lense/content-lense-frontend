// INFO: This File is translated
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import PasswordStrengthBar from "react-password-strength-bar";
import { ApiFetch } from "../../helpers/ApiFetch";
import { logoutUser } from "../../data/UserData";

const SetNewPasswordForm = () => {
  const router = useRouter();
  const { query } = useRouter();
  const token = query.token;
  const id = query.id;
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastPassword, setLastPassword] = useState<string>("");

  useEffect(() => {
    logoutUser();
  }, []);

  const { t } = useTranslation();
  const validationSchema = yup.object({
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
      password: "",
      repeatPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const req = await ApiFetch(`/users/${id}/reset`, {
        body: JSON.stringify({ ...values, resetPasswordToken: token }),
        method: "PUT",
      });
      if (req.ok) {
        router.push("/set-new-password-confirmation");
      } else {
        setSubmissionError(t("An error ocurred, please try again later."));
        setLoading(false);
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
              id="password"
              name="password"
              label={t("New password")}
              variant="filled"
              type="password"
              onChange={(e) => {
                formik.handleChange(e);
                setLastPassword(e.target.value);
              }}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="repeatPassword"
              name="repeatPassword"
              label={t("Confirm new Password")}
              variant="filled"
              type="password"
              onChange={(e) => {
                formik.handleChange(e);
                setLastPassword(e.target.value);
              }}
              error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
              helperText={formik.touched.repeatPassword && formik.errors.repeatPassword}
            />
          </Grid>
          <Grid item xs={12}>
            {/*
            // @ts-ignore */}
            <PasswordStrengthBar
              password={lastPassword}
              minLength={8}
              shortScoreWord={[t("too short")]}
              scoreWords={[t("weak"), t("okay"), t("good"), t("strong")]}
            />
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              loading={loading}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
            >
              {t("Set new password")}
            </LoadingButton>
          </Grid>
          <Grid item xs={12}>
            {submissionError != null && <Alert severity="error">{submissionError}</Alert>}
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default SetNewPasswordForm;

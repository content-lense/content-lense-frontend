// INFO: This File is translated
import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { PwaContext } from "../../helpers/PwaContext";
import { loginUser } from "../../data/UserData";
import { getUserToken } from "../../helpers/useUser";
import { UserRoles } from "../../enums/UserRoles";

enum DevLoginType {
  Admin = "Admin",
  User = "User",
}

const DevStagingLoginMap = {
  [DevLoginType.Admin]: {
    email: "admin@cl.com",
    password: "demodemo",
  },
  [DevLoginType.User]: {
    email: "user@cl.com",
    password: "demodemo",
  },
};

const LoginForm = () => {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { forceContextUserRefetch: onUserLoggedIn } = useContext(PwaContext);
  const { t } = useTranslation();
  const validationSchema = yup.object({
    email: yup
      .string()
      .email(t("Enter a valid email"))
      .required(t("Email is required")),
    password: yup
      .string()
      .min(8, t("Password should be of minimum 8 characters length"))
      .required(t("Password is required")),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let result;
      try {
        setLoading(true);
        // await logoutUser();
        result = await loginUser(values);
        onUserLoggedIn();
        setLoading(false);
        const payload = await result.json();
        if (!result.ok) {
          setSubmissionError(payload.message);
        } else {
          setSubmissionError(null);

          const token = getUserToken();
          if (token) {
            if (router.query.returnTo && typeof window !== "undefined") {
              window.location.href = router.query.returnTo! as string;
            } else {
              router.push("/entities/articles");
            }
          } else {
            setSubmissionError("Invalid token");
          }
        }
      } catch (e:any) {
        setSubmissionError(e.message);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container columnSpacing={2} rowSpacing={2}>
          {process.env.NODE_ENV !== "production" && (
            <Grid item xs={12}>
              <Stack>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    {t("Dev Login Selection")}
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    label={t("Dev Login Selection")}
                    onChange={(e) => {
                      const value = e.target.value as DevLoginType;
                      const selectedLogin = DevStagingLoginMap[value];
                      formik.setValues(selectedLogin);
                    }}
                  >
                    <MenuItem value={DevLoginType.Admin}>
                      {DevLoginType.Admin}
                    </MenuItem>
                    <MenuItem value={DevLoginType.User}>
                      {DevLoginType.User}
                    </MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label={t("Email")}
              variant="filled"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label={t("Password")}
              type="password"
              variant="filled"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
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
              {t("login")}
            </LoadingButton>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="caption">
                <Link href="/reset-password">{t("Reset password")}</Link>{" "}
              </Typography>
            </Box>
            {/*<Alert severity="info" sx={{ mt: 2 }}>
              {t("No account yet?")}{" "}
              <Link href="/signup">{t("Signup up now!")}</Link>
                  </Alert>*/}
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

export default LoginForm;

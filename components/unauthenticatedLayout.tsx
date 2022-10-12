// INFO: This File is translated
import { Grid } from "@mui/material";
import React, { PropsWithChildren, ReactNode } from "react";

export default function UnauthenticatedLayout({
  children,
}: PropsWithChildren<ReactNode>) {

  return (
    <Grid container>
      <Grid item xs={12} sx={{ mt: 6 }}>
        {children}
      </Grid>
    </Grid>
  );
}

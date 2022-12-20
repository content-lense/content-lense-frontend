import { Delete, Edit } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import getConfig from "next/config";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AuthenticatedUserInterface } from "../../interfaces/UserInterface";


const { publicRuntimeConfig } = getConfig();

function UserListItem(props: {
  user: AuthenticatedUserInterface;
  onDelete: (user: AuthenticatedUserInterface) => void;
  onEdit: (user: AuthenticatedUserInterface) => void;
}) {
  const { t } = useTranslation();
  const { user: a } = props;
  const router = useRouter();

  const [submissionError, setSubmissionError] = useState("");


  async function handleResetPassword() {
    await fetch(`${publicRuntimeConfig.API_ENDPOINT}/auth/reset-password`, {
      body: JSON.stringify({ email: a.email }),
      headers: {
        "Content-Type": "application/ld+json",
      },
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        router.push("/resetted-password-confirmation");
      } else {
        setSubmissionError(t("An error ocurred, please try again later."));
      }
    });
  }

  return (
    <ListItem
      secondaryAction={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            color={a.isActive ? "success" : "default"}
            label={a.isActive ? t("Active") : t("Disabled")}
          />
          <Button size="small" variant="outlined" onClick={() => {
            // console.log("env: ", process.env.REACT_APP_API);
            handleResetPassword();
          }}>
            {t("Reset password")}
          </Button>
          <IconButton edge="end" aria-label="edit-user" onClick={() => props.onEdit(a)}>
            <Edit />
          </IconButton>
          <Box width="40px">
            {!a.ownedOrganisations ||
              (a.ownedOrganisations.length === 0 && (
                <IconButton edge="end" aria-label="edit-user" onClick={() => props.onDelete(a)}>
                  <Delete />
                </IconButton>
              ))}
          </Box>
        </Stack>
      }
    >
      <ListItemText
        primary={a.displayName}
        secondary={
          <React.Fragment>
            <Typography variant="caption">{a.email}</Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

export default UserListItem;

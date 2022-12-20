import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import AnalysisMicroserviceList from "../../components/AnalysisMicroserviceList/AnalysisMicroserviceList";
import ArticleSourceList from "../../components/ArticleSource/ArticleSourceList";
import WebhookList from "../../components/WebhookList/WebhookList";
import UserList from "../../components/UserList/UserList";
import CreateOrEditUserDialog from "../../components/UserList/CreateOrEditUserDialog";
import { useTranslation } from "next-i18next";

function makeid(length = 32) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const Users: NextPage = () => {
  const { t } = useTranslation();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(Buffer.from(makeid()).toString("base64"));
  const [openUserDialog, setOpenUserDialog] = useState(false);

  function resetApiKey() {
    setApiKey(Buffer.from(makeid()).toString("base64"));
    setShowApiKey(true);
  }

  return (
    <Stack flexDirection="column">
      <Stack direction="row" justifyContent={"space-between"} alignSelf={"stretch"}>
        <Typography variant="h5">{t("Users")}</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => (setOpenUserDialog(true))}>
          {t("Add")}
        </Button>
      </Stack>
      <UserList />
      <CreateOrEditUserDialog onClose={() => setOpenUserDialog(false)} open={openUserDialog} />
    </Stack>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Users;

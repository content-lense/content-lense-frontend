import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { Add } from "@mui/icons-material";
import WebhookList from "../../components/WebhookList/WebhookList";
import WebhookDialog from "../../components/WebhookList/WebhookDialog";
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

const Webhooks: NextPage = () => {
  const { t } = useTranslation();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(Buffer.from(makeid()).toString("base64"));
  const [openWebhookDialog, setOpenWebhookDialog] = useState(false);


  function resetApiKey() {
    setApiKey(Buffer.from(makeid()).toString("base64"));
    setShowApiKey(true);
  }

  return (
    <Stack flexDirection="column">
      <Stack direction="row" justifyContent={"space-between"} alignSelf={"stretch"}>
        <Typography variant="h5">{t("Webhooks")}</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={() => (setOpenWebhookDialog(true))}>
          {t("Add")}
        </Button>
      </Stack>
      <Alert severity="info">
        {t("Webhooks send POST requests with the analysis result to your configured endpoints.")}
      </Alert>
      <WebhookList />
      <WebhookDialog isWebhookDialogOpen={openWebhookDialog} setIsWebhookDialogOpen={(val) => setOpenWebhookDialog(val)} />
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

export default Webhooks;

import type { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

import { Add } from "@mui/icons-material";
import AnalysisMicroserviceList from "../../components/AnalysisMicroserviceList/AnalysisMicroserviceList";
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

const AnalysisMicroservices: NextPage = () => {
  const { t } = useTranslation();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(Buffer.from(makeid()).toString("base64"));

  function resetApiKey() {
    setApiKey(Buffer.from(makeid()).toString("base64"));
    setShowApiKey(true);
  }

  return (
    <Stack flexDirection="column" alignItems={"flex-start"}>
      <Stack direction="row" justifyContent={"space-between"} alignSelf={"stretch"}>
        <Typography variant="h5">{t("Analysis Microservices")}</Typography>
        <Button startIcon={<Add />} variant="contained">
          {t("Add")}
        </Button>
      </Stack>
      <AnalysisMicroserviceList />
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

export default AnalysisMicroservices;

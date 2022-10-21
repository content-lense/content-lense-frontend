import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
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
import AnalysisMicroserviceList from "../components/AnalysisMicroserviceList/AnalysisMicroserviceList";
import WebhookList from "../components/WebhookList/WebhookList";
import { Add } from "@mui/icons-material";
import ArticleSourceList from "../components/ArticleSource/ArticleSourceList";

function makeid(length = 32) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const Settings: NextPage = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState(
    Buffer.from(makeid()).toString("base64")
  );

  function resetApiKey() {
    setApiKey(Buffer.from(makeid()).toString("base64"));
    setShowApiKey(true);
  }

  return (
    <Stack>
      <Head>
        <title>Settings</title>
      </Head>

      <Stack gap={5} sx={{maxWidth:800}}>
        <Stack flexDirection="row">
          <Button
            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            color="error"
            variant="contained"
            disableElevation
            onClick={() => {
              resetApiKey();
            }}
          >
            Regenerate
          </Button>
          <TextField
            variant="filled"
            label="Api key"
            sx={{
              flexGrow: 2,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            value={apiKey}
            InputProps={{
              type: showApiKey ? "text" : "password",
              endAdornment: (
                <InputAdornment
                  sx={{ cursor: "pointer" }}
                  onClick={() => setShowApiKey(!showApiKey)}
                  position="end"
                >
                  <IconButton>
                    {showApiKey ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack flexDirection="column">
          <Stack direction="row" justifyContent={"space-between"} alignSelf={"stretch"}>
            <Typography variant="h5">Users</Typography>
            <Button startIcon={<Add/>} variant="contained">Add</Button>
          </Stack>
          
        </Stack>

        <Stack flexDirection="column" alignItems={"flex-start"}>
            <Stack direction="row" justifyContent={"space-between"} alignSelf={"stretch"}>
              <Typography variant="h5">Analysis Microservices</Typography>
              <Button startIcon={<Add/>} variant="contained">Add</Button>
            </Stack>
            <AnalysisMicroserviceList />

            
        </Stack>

        <Stack flexDirection="column">
          <Stack direction="row" justifyContent={"space-between"} alignSelf={"stretch"}>
            <Typography variant="h5">Webhooks</Typography>
            <Button startIcon={<Add/>} variant="contained">Add</Button>
          </Stack>
          <WebhookList />
        </Stack>

        <Stack flexDirection="column">
          <Stack direction="row" justifyContent={"space-between"} alignSelf={"stretch"}>
            <Typography variant="h5">Article Sources</Typography>
            <Button startIcon={<Add/>} variant="contained">Add</Button>
          </Stack>
          <ArticleSourceList />
        </Stack>

        
      </Stack>
      
      
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

export default Settings;

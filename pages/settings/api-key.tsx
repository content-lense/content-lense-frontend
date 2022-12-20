import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import createCacheKey from "../../components/generator/createCacheKey";
import { useUser } from "../../helpers/useUser";
import { GenericGetItem, GenericPutItem } from "../../data/ReactQueries";
import { OrganisationTeamMemberInterface } from "../../interfaces/UserInterface";
import { ApiFetch } from "../../helpers/ApiFetch";
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

const ApiKey: NextPage = () => {
  const { t } = useTranslation();
  const [showApiKey, setShowApiKey] = useState(false);


  const { user } = useUser();

  const { data: organisation } = useQuery(createCacheKey({ entity: "organisation", id: user?.ownedOrganisations[0] }),
    () => GenericGetItem<OrganisationTeamMemberInterface>(user?.ownedOrganisations[0] ?? ""),
    {
      enabled: !!user?.id
    }
  )


  const refreshRoute = async (
    payload: OrganisationTeamMemberInterface
  ) => {
    const req = await ApiFetch(`/organisations/${payload.id}/refresh-api-token`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!req.ok) {
      const result = (await req.json());
      throw new Error(result["hydra:description"] ?? "Unknown error");
    }
    const result = (await req.json());
    return result;
  };
  const queryClient = useQueryClient();
  const { mutate: refreshOrganisationApiToken, isLoading: isRefreshingApiToken } = useMutation(
    refreshRoute,
    {
      onSuccess: (updatedOrganisation: OrganisationTeamMemberInterface) => {
        queryClient.setQueryData(createCacheKey({ entity: "organisation", id: user?.ownedOrganisations[0] }), () => {
          console.log("newData: ", updatedOrganisation);

          const newData = { ...organisation, apiToken: updatedOrganisation.apiToken };
          console.log("newData: ", newData);
          return newData;
        })
      }
    }
  );

  function resetApiKey() {
    // setApiKey(Buffer.from(makeid()).toString("base64"));
    if (organisation)
      refreshOrganisationApiToken(organisation)
    setShowApiKey(true);
  }

  return (
    <Stack gap={5} sx={{ maxWidth: 800 }}>
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
          {t("Regenerate")}
        </Button>
        <TextField
          variant="filled"
          label={t("Api key")}
          focused
          sx={{
            flexGrow: 2,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
          value={organisation?.apiToken}
          InputProps={{
            type: showApiKey ? "text" : "password",
            endAdornment: (
              <InputAdornment
                sx={{ cursor: "pointer" }}
                onClick={() => setShowApiKey(!showApiKey)}
                position="end"
              >
                <IconButton>{showApiKey ? <VisibilityIcon /> : <VisibilityOffIcon />}</IconButton>
              </InputAdornment>
            ),
          }}
        />
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

export default ApiKey;

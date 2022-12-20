import type { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, Stack, Typography } from "@mui/material";
import PersonList from "../../components/PersonList/PersonList";
import PersonDialog from "../../components/PersonList/PersonDialog";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "next-i18next";
import { CreatePersonInterface, Gender, PersonInterface, UpdatePersonInterface } from "../../interfaces/PersonInterface";
import CodeExample from "../../components/CodeExample/CodeExample";

const Persons: NextPage = () => {
  const { t } = useTranslation();
  const [openPersonDialog, setOpenPersonDialog] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchString, setSearchString] = useState("");

  const [filter, setFilter] = useState("");

  return (
    <Stack spacing={2}>
      <Head>
        <title>{t("Persons")}</title>
      </Head>
      <Stack direction="row" alignItems={"center"} justifyContent="space-between">
        <Typography variant="h4">{t("Person list")}</Typography>
        <Button variant="outlined" onClick={() => (setOpenPersonDialog(true))} >
          {t("Create Person")}
        </Button>
      </Stack>
      <Stack direction={"row"} justifyContent="space-between" alignItems="center">
        <FormControl sx={{ width: "400px" }} variant="outlined">
          <InputLabel htmlFor="search">{t("Search")}</InputLabel>
          <OutlinedInput
            id="search"
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearchString(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            }
            label={t("Password")}
          />
        </FormControl>
        <FormControl sx={{ width: "30%" }}>
          <InputLabel id="demo-simple-select-label">{t("Filter")}</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={filter}
            label={t("Filter")}
            onChange={(e) => setFilter(e.target.value)}
          >
            <MenuItem value={"none"}>{t("All")}</MenuItem>
            <MenuItem value={"isAuthor"}>{t("Only authors")}</MenuItem>
            <MenuItem value={"isMentionedPerson"}>{t("Only mentioned")}</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      {/* fix height */}
      <PersonList searchString={searchString} />
      <CodeExample<CreatePersonInterface, UpdatePersonInterface, PersonInterface>
        iri={{ entity: "people" }}
        properties={{
          post: {
            "@context": "/people",
            firstName: "Alex",
            lastName: "Mustermann",
          },
          get: true,
          delete: true,
          put: {
            "@context": "/people",
            "@id": "",
            "@type": "",
            id: "",
            age: 36,
            gender: Gender.MALE,
          }
        }}
      />
      <PersonDialog isPersonDialogOpen={openPersonDialog} setIsPersonDialogOpen={(val) => setOpenPersonDialog(val)} />
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

export default Persons;

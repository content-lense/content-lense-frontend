import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TopicsTable from "../components/Topics/TopicsTable";
import AddIcon from "@mui/icons-material/Add";
import EditTopicDialog from "../components/Topics/EditTopicDialog";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../data/ReactQueries";
import { ArticleTopicInterface } from "../interfaces/ArticleTopicInterface";
import { useState } from "react";

const Topics: NextPage = () => {
  const { data: topics, isLoading } = useQuery(["topics"], () =>
    GenericGetItems<ArticleTopicInterface>("/article_topics")
  );
  const [isShowingEditTopicDialog, setIsShowingEditTopicDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ArticleTopicInterface | undefined>();
  if (!topics) {
    return <></>;
  }

  return (
    <>
      <Stack spacing={2}>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          sx={{ alignSelf: "flex-end" }}
          onClick={() => setIsShowingEditTopicDialog(true)}
        >
          Hinzufügen
        </Button>
        <TopicsTable
          topics={topics}
          onEdit={(e) => {
            setSelectedTopic(e);
            setIsShowingEditTopicDialog(true);
          }}
        />
      </Stack>
      <EditTopicDialog
        onClose={() => {
          setIsShowingEditTopicDialog(false);
          setSelectedTopic(undefined);
        }}
        isOpen={isShowingEditTopicDialog}
        topic={selectedTopic}
      />
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default Topics;

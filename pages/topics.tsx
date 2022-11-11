import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Slider, Stack } from "@mui/material";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TopicsTable from "../components/Topics/TopicsTable";
import AddIcon from "@mui/icons-material/Add";
import EditTopicDialog from "../components/Topics/EditTopicDialog";
import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../data/ReactQueries";
import { ArticleTopicInterface } from "../interfaces/ArticleTopicInterface";
import { useEffect, useState } from "react";
import { VennDiagram, VennSeries } from "reaviz";
import { ApiFetch } from "../helpers/ApiFetch";

const Topics: NextPage = () => {
  const { data: topics, isLoading } = useQuery(["topics"], () =>
    GenericGetItems<ArticleTopicInterface>("/article_topics")
  );
  const [isShowingEditTopicDialog, setIsShowingEditTopicDialog] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ArticleTopicInterface | undefined>();
  const [numOfTopics, setNumOfTopics] = useState<number>(6);


  const { data: vennData, isLoading: vennDataLoading, refetch: refetchVennData } = useQuery(["vennData"], () =>
    ApiFetch(`/article_topics_venn?limit=${numOfTopics}`).then((req) => {
      return req.json();
    })
  );

  useEffect(() => {
    refetchVennData();
  }, [numOfTopics])

  if (!topics || !vennData) {
    return <></>;
  }

  return (
    <>
      <Stack spacing={2}>
        <Slider sx={{ pt: 7 }} valueLabelDisplay="on" defaultValue={6} min={0} max={10} value={numOfTopics} onChange={(e, newValue: number | number[]) => setNumOfTopics(newValue as number)} aria-label="Disabled slider" />
        <Box width={"100%"}>
          <VennDiagram
            height={450}
            data={vennData}
            series={<VennSeries colorScheme={['#2d60e8']} />}
          />
        </Box>

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

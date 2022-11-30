import { GenericGetItems } from "../../data/ReactQueries";
import { useQuery } from "@tanstack/react-query";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import { CircularProgress, Divider, List, Typography } from "@mui/material";
import AnalysisMicroserviceListItem from "./AnalysisMicroserviceListItem";
import { AnalysisMicroserviceInterface } from "../../interfaces/AnalysisMicroserviceInterface";
import { Fragment } from "react";

function AnalysisMicroserviceList() {
  const { data, isLoading } = useQuery(["analysis_microservices"], () =>
    GenericGetItems<AnalysisMicroserviceInterface>("/analysis_microservices")
  );
  if (isLoading || !data) {
    return <CircularProgress />;
  }
  return (
    <List sx={{ alignSelf: "stretch" }}>
      {data.map((a) => (
        <Fragment key={a["@id"]}>
          <AnalysisMicroserviceListItem service={a} />
          <Divider />
        </Fragment>
      ))}
    </List>
  );
}

export default AnalysisMicroserviceList;

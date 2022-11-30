import { GenericGetItems } from "../../data/ReactQueries";
import { useQuery } from "@tanstack/react-query";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import { CircularProgress, Divider, List, Typography } from "@mui/material";
import AnalysisMicroserviceListItem from "./WebhookListItem";
import { AnalysisMicroserviceInterface } from "../../interfaces/AnalysisMicroserviceInterface";
import { WebhookInterface } from "../../interfaces/WebhookInterface";
import WebhookListItem from "./WebhookListItem";
import { Fragment } from "react";

function WebhookList() {
  const { data, isLoading } = useQuery(["webhooks"], () =>
    GenericGetItems<WebhookInterface>("/webhooks")
  );
  if (isLoading || !data) {
    return <CircularProgress />;
  }
  return (
    <List>
      {data.map((a, idx) => (
        <Fragment key={a.id}>
          <WebhookListItem webhook={a} />
          <Divider />
        </Fragment>
      ))}
    </List>
  );
}

export default WebhookList;

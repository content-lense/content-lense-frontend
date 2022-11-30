import { GenericGetItems } from "../../data/ReactQueries";
import { useQuery } from "@tanstack/react-query";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import { CircularProgress, Divider, List, Typography } from "@mui/material";
import PersonListItem from "./PersonListItem";
import { PersonInterface } from "../../interfaces/PersonInterface";
import { Fragment } from "react";

function PersonList() {
  const { data, isLoading } = useQuery(["persons"], () =>
    GenericGetItems<PersonInterface>("/people")
  );
  if (isLoading || !data) {
    return <CircularProgress />;
  }
  return (
    <List>
      {data.map((p) => (
        <Fragment key={p.id}>
          <PersonListItem person={p} />
          <Divider />
        </Fragment>
      ))}
    </List>
  );
}

export default PersonList;

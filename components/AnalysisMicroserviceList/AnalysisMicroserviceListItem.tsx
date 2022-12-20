import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Chip,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { AnalysisMicroserviceInterface } from "../../interfaces/AnalysisMicroserviceInterface";
import { ArticleInterface } from "../../interfaces/ArticleInterface";

function AnalysisMicroserviceListItem(props: {
  service: AnalysisMicroserviceInterface;
  onEdit: (service: AnalysisMicroserviceInterface) => void;
}) {
  const { service: a } = props;
  console.log(a, "a service");
  return (
    <ListItem
      secondaryAction={
        <IconButton aria-label="edit-microservice" onClick={() => props.onEdit(a)}>
          <Edit />
        </IconButton>
      }
    >
      <ListItemText
        primary={a.name}
        secondary={
          <React.Fragment>
            <Typography variant="caption">{a.endpoint}</Typography>
          </React.Fragment>
        }
      />
      <Chip color={a.isActive ? "success" : "default"} label={a.isActive ? "Active" : "Disabled"} />
    </ListItem>
  );
}

export default AnalysisMicroserviceListItem;

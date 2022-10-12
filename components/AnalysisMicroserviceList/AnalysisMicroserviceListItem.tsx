import { Edit } from "@mui/icons-material";
import { Avatar, Chip, Divider, IconButton, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import React from "react";
import { AnalysisMicroserviceInterface } from "../../interfaces/AnalysisMicroserviceInterface";
import { ArticleInterface } from "../../interfaces/ArticleInterface";

function AnalysisMicroserviceListItem(props:{service:AnalysisMicroserviceInterface}) {

    const {service: a} = props;
    return ( <ListItem 
      secondaryAction={
        <IconButton aria-label="edit-microservice">
          <Edit />
        </IconButton>
      }>
        <ListItemText
          primary={a.name}
          secondary={
            <React.Fragment>
            <Typography variant="caption">{a.endpoint}</Typography>
            </React.Fragment>
          }
        />
    </ListItem> );
}

export default AnalysisMicroserviceListItem;
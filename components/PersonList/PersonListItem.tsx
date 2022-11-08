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
import { PersonInterface } from "../../interfaces/PersonInterface";

function PersonListItem(props: { person: PersonInterface }) {
  const { person: p } = props;
  return (
    <ListItem
      secondaryAction={
        <IconButton aria-label="edit-person">
          <Edit />
        </IconButton>
      }
    >
      <ListItemText primary={`${p.firstName} ${p.lastName}`} />
    </ListItem>
  );
}

export default PersonListItem;

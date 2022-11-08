import { Edit } from "@mui/icons-material";
import {
  Avatar,
  Chip,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { ArticleSourceInterface } from "../../interfaces/ArticleSourceInterface";

function ArticleSourceListItem(props: { articleSource: ArticleSourceInterface }) {
  const { articleSource: a } = props;
  const router = useRouter();
  return (
    <ListItemButton>
      <ListItemText
        primary={a.url}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {a.type}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItemButton>
  );
}

export default ArticleSourceListItem;

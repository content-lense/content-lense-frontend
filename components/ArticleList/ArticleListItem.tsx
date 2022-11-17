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
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import StraightenIcon from "@mui/icons-material/Straighten";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

interface ArticleListItemProps {
  article: ArticleInterface;
  showTextComplexityChips?: boolean;
}
function ArticleListItem(props: ArticleListItemProps) {
  const { article: a } = props;
  const showTextComplexityChips = props.showTextComplexityChips ?? false;
  const router = useRouter();
  return (
    <ListItemButton onClick={() => router.push(`${router.pathname}/${props.article.id}`)}>
      <ListItemAvatar>
        <Avatar alt={a.title} src={a.image} />
      </ListItemAvatar>
      <ListItemText
        primary={a.title}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {a.authors &&
                a.authors.map((a) => <Chip key={a.id} label={`${a.firstName} ${a.lastName}`} />)}
            </Typography>
            {a.articleAnalysisResults.length > 0 && (
              <Chip color="info" label={`${a.articleAnalysisResults.length} analyses done`} />
            )}
            {a.publishedAt && a.publishedAt.toLocaleDateString()}
          </React.Fragment>
        }
      />
      {showTextComplexityChips && a.complexities && (
        <Stack direction="row" spacing={1}>
          {a.complexities.find((complex) => complex.part === "body")?.readingTimeInMinutes && (
            <Tooltip title="Reading Time in minutes">
              <Chip
                icon={<AccessTimeIcon fontSize="small" />}
                label={
                  a.complexities.find((complex) => complex.part === "body")?.readingTimeInMinutes +
                  " min"
                }
              />
            </Tooltip>
          )}
          {a.complexities.find((complex) => complex.part === "body")?.totalWords && (
            <Tooltip title="Length in Words">
              <Chip
                icon={<StraightenIcon fontSize="small" />}
                label={
                  a.complexities.find((complex) => complex.part === "body")?.totalWords + " words"
                }
              />
            </Tooltip>
          )}
          {a.complexities.find((complex) => complex.part === "body")?.wienerSachtextIndex && (
            <Tooltip title="Wiener Sachtext Index">
              <Chip
                icon={<SpellcheckIcon fontSize="small" />}
                label={
                  a.complexities.find((complex) => complex.part === "body")?.wienerSachtextIndex
                }
              />
            </Tooltip>
          )}
        </Stack>
      )}
    </ListItemButton>
  );
}

export default ArticleListItem;

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
import SentimentChip from "../SentimentChip/SentimentChip";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import UpdateIcon from "@mui/icons-material/Update";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
interface ArticleListItemProps {
  article: ArticleInterface;
  showTextComplexityChips?: boolean;
}
function ArticleListItem(props: ArticleListItemProps) {
  const { article: a } = props;
  const showTextComplexityChips = props.showTextComplexityChips ?? false;
  const router = useRouter();
  return (
    <ListItemButton onClick={() => router.push(`/entities/articles/${props.article.id}`)}>
      <ListItemAvatar>
        <Avatar alt={a.title} src={a.image} />
      </ListItemAvatar>
      <ListItemText
        primary={a.title}
        secondary={
          <Stack direction="row" gap={2}>
            {a.publishedAt && (
              <Tooltip title={`Published at ${a.publishedAt.toLocaleDateString()}`}>
                <Chip
                  icon={<LocalPrintshopIcon />}
                  label={`${a.publishedAt.toLocaleDateString()}`}
                />
              </Tooltip>
            )}

            {a.authors && a.authors.length > 0 && (
              <Tooltip title={`Authors: ${a.authors.map((a) => `${a.firstName} ${a.lastName}`)}`}>
                <Chip
                  icon={a.authors.length > 1 ? <PeopleIcon /> : <PersonIcon />}
                  label={
                    a.authors
                      .slice(0, 2)
                      .map((a) => `${a.firstName} ${a.lastName}`)
                      .join(", ") + (a.authors.length > 2 ? "..." : "")
                  }
                />
              </Tooltip>
            )}
            {a.articleAnalysisResults.length > 0 && (
              <Chip
                icon={<TroubleshootIcon />}
                label={`${a.articleAnalysisResults.length} analyses`}
              />
            )}
          </Stack>
        }
      />
      {showTextComplexityChips && a.complexities && (
        <Stack direction="row" spacing={1}>
          {a.sentimentOfText && <SentimentChip sentiment={a.sentimentOfText} />}
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

import { Edit } from "@mui/icons-material";
import { Avatar, Chip, Divider, IconButton, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { ArticleInterface } from "../../interfaces/ArticleInterface";

function ArticleListItem(props:{article:ArticleInterface}) {

    const {article: a} = props;
    const router = useRouter();
    return ( <ListItemButton onClick={() => router.push(`${router.pathname}/${props.article.id}`)}>
        <ListItemAvatar>
          <Avatar alt={a.title} src={a.image} />
        </ListItemAvatar>
        <ListItemText
          primary={a.title}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {a.authors && a.authors.map(a => <Chip label={`${a.firstName} ${a.lastName}`} />)}
              </Typography>
              {a.articleAnalysisResults.length > 0 && 
                <Chip color="info" label={`${a.articleAnalysisResults.length} analyses done`} />
              }
              {a.publishedAt && a.publishedAt.toLocaleDateString()}
            </React.Fragment>
          }
        />
    </ListItemButton> );
}

export default ArticleListItem;
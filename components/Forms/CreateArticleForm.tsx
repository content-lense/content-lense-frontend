import { LoadingButton } from "@mui/lab";
import { Stack, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import { GenericPostItem, GenericGetItems } from "../../data/ReactQueries";
import { ArticleInterface, CreateArticleInterface } from "../../interfaces/ArticleInterface";

function CreateArticleForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: articles, isLoading } = useQuery(["articles"], () =>
    GenericGetItems<ArticleInterface>("/articles")
  );
  const { mutate, isLoading: isSaving } = useMutation(
    GenericPostItem<CreateArticleInterface, ArticleInterface>,
    {
      onSuccess: (newArticle: ArticleInterface) => {
        queryClient.setQueryData(["articles"], [...(articles ?? []), newArticle]);
      },
    }
  );
  const handlePost = async () => {
    await mutate(
      {
        "@context": "/articles",
        title,
        text,
        abstract,
        rawTopics,
        rawAuthors,
      },
      {
        onSuccess(data, variables, context) {
          router.push("/entities/articles/" + data.id);
        },
      }
    );
  };
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [abstract, setAbstract] = useState("");
  const [rawAuthors, setRawAuthors] = useState("");
  const [rawTopics, setRawTopics] = useState("");
  return (
    <Stack spacing={2}>
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField
        label="Abstract"
        multiline
        rows={3}
        onChange={(e) => setAbstract(e.target.value)}
      />
      <TextField label="Text" multiline rows={10} onChange={(e) => setText(e.target.value)} />
      <TextField
        label="Authors"
        helperText="Comma-seperated"
        onChange={(e) => setRawAuthors(e.target.value)}
      />
      <TextField
        label="Topics"
        helperText="Comma-seperated"
        onChange={(e) => setRawTopics(e.target.value)}
      />
      <LoadingButton loading={isSaving} onClick={() => handlePost()} variant="contained">
        Save
      </LoadingButton>
    </Stack>
  );
}

export default CreateArticleForm;

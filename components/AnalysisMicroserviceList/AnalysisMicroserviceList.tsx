import { GenericGetItems, GenericPutItem } from "../../data/ReactQueries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArticleInterface } from "../../interfaces/ArticleInterface";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  List,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AnalysisMicroserviceListItem from "./AnalysisMicroserviceListItem";
import { AnalysisMicroserviceInterface } from "../../interfaces/AnalysisMicroserviceInterface";
import { Fragment, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "next-i18next";

function AnalysisMicroserviceList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<AnalysisMicroserviceInterface>();
  const { data, isLoading } = useQuery(["analysis_microservices"], () =>
    GenericGetItems<AnalysisMicroserviceInterface>("/analysis_microservices")
  );
  const validationSchema = yup.object({
    isActive: yup.bool(),
    name: yup.string().required(t("Please enter a name for the service")),
    endpoint: yup.string().url(t("Please enter a valid url")).required(t("Please enter an endpoint url")),
  });
  const formik = useFormik({
    initialValues: {
      isActive: true,
      name: "",
      endpoint: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let result;
      if (serviceToEdit) {
        result = await updateMicroservice({
          ...serviceToEdit,
          name: values.name,
          endpoint: values.endpoint,
          isActive: values.isActive,
        });
      }
      setOpenEditDialog(false);
    },
  });

  const { mutate: updateMicroservice, isLoading: isSaving } = useMutation(
    GenericPutItem<AnalysisMicroserviceInterface, AnalysisMicroserviceInterface>,
    {
      onSuccess: (newMicroservice: AnalysisMicroserviceInterface) => {
        let newAnalysisMicroservices = [...(data ?? [])];
        let serviceIdx = newAnalysisMicroservices?.findIndex(
          (service) => service["@id"] === newMicroservice["@id"]
        );
        newAnalysisMicroservices?.splice(serviceIdx, 1, newMicroservice);
        queryClient.setQueryData(["analysis_microservices"], newAnalysisMicroservices);
      },
      onError: (err: Error) => { },
    }
  );

  if (isLoading || !data) {
    return <CircularProgress />;
  }
  return (
    <>
      <List sx={{ alignSelf: "stretch" }}>
        {data.map((a) => (
          <Fragment key={a["@id"]}>
            <AnalysisMicroserviceListItem
              service={a}
              onEdit={(a) => {
                setOpenEditDialog(true);
                formik.setValues({ isActive: a.isActive, name: a.name, endpoint: a.endpoint });
                setServiceToEdit(a);
              }}
            />
            <Divider />
          </Fragment>
        ))}
      </List>
      <Dialog open={openEditDialog} fullWidth>
        <DialogTitle>
          <Typography variant="h5">{t("Edit Microservice")}</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <FormControlLabel
              control={
                <Switch
                  value={formik.values.isActive}
                  checked={formik.values.isActive}
                  name="isActive"
                  onChange={formik.handleChange}
                />
              }
              label={formik.values.isActive ? t("Is active") : t("Is inactive")}
            />
            <TextField
              fullWidth
              name="name"
              label={t("Name")}
              helperText={formik.errors.name}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            <TextField
              fullWidth
              helperText={formik.errors.endpoint}
              name="endpoint"
              label={t("Endpoint")}
              value={formik.values.endpoint}
              onChange={formik.handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenEditDialog(false);
              formik.resetForm();
            }}
          >
            {t("Cancel")}
          </Button>
          <Button variant="contained" onClick={formik.submitForm}>
            {t("Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AnalysisMicroserviceList;

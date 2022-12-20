import { deleteObjectByIri, GenericGetItems } from "../../data/ReactQueries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
} from "@mui/material";
import { Fragment, useState } from "react";
import { AuthenticatedUserInterface, UserSignupInterface } from "../../interfaces/UserInterface";
import UserListItem from "./UserListItem";
import DeleteUserDialog from "./DeleteUserDialog";
import CreateOrEditUserDialog from "./CreateOrEditUserDialog";
import ConfirmDialog from "../ConfirmDialog";
import { useTranslation } from "next-i18next";

function UserList() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["users"], () =>
    GenericGetItems<AuthenticatedUserInterface>("/users")
  );
  const [userToDeleteOrEdit, setUserToDeleteOrEdit] = useState<AuthenticatedUserInterface>();
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);

  const { mutate: deleteUser, isLoading: isDeletingUser } = useMutation(deleteObjectByIri, {
    onSuccess: (deletedUserIri: string) => {
      console.log(deletedUserIri, "deletedUserIRI");
      let newUsers = [...(data ?? [])];
      let userIdx = newUsers?.findIndex((user) => user["@id"] === deletedUserIri);
      newUsers?.splice(userIdx, 1);
      queryClient.setQueryData(["users"], newUsers);
    },
  });

  if (isLoading || !data || isDeletingUser) {
    return <CircularProgress />;
  }
  return (
    <>
      <List>
        {data.map((a) => (
          <Fragment key={a.id}>
            <UserListItem
              user={a}
              onDelete={(a) => {
                setUserToDeleteOrEdit(a);
                setShowConfirmDeleteDialog(true);
              }}
              onEdit={(a) => {
                setUserToDeleteOrEdit(a);
                setShowEditUserDialog(true);
              }}
            />
            <Divider />
          </Fragment>
        ))}
      </List>
      {userToDeleteOrEdit && (
        <>
          <ConfirmDialog
            open={showConfirmDeleteDialog}
            onConfirm={() => {
              deleteUser(userToDeleteOrEdit["@id"]);
              setShowConfirmDeleteDialog(false);
            }}
            onClose={() => setShowConfirmDeleteDialog(false)}
            title={t("Delete User")}
            question={t("Do you really want to delete this user?")}
          />
          {/* <DeleteUserDialog
            onConfirmDelete={deleteUser}
            onClose={() => setShowConfirmDeleteDialog(false)}
            openDialog={showConfirmDeleteDialog}
            user={userToDeleteOrEdit}
          /> */}
          <CreateOrEditUserDialog
            open={showEditUserDialog}
            onClose={() => setShowEditUserDialog(false)}
            user={userToDeleteOrEdit}
          />
        </>
      )}
    </>
  );
}

export default UserList;

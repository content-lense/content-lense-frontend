// INFO: This File is translated
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { ReactElement } from "react";
import SetNewPasswordForm from "../components/Forms/SetNewPasswordForm";
import UnauthenticatedLayout from "../components/unauthenticatedLayout";

export default function Page() {
    return (
        <Box sx={{ maxWidth: 400, margin: "auto" }}>
            <Paper sx={{ p: 4 }}>
                <Typography>{"Set new password"}</Typography>
                <Box sx={{ mt: 4 }}>
                    <SetNewPasswordForm />
                </Box>
            </Paper>
        </Box>
    );
}


Page.getLayout = function getLayout(page: ReactElement) {
    /** @ts-ignore */
    return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
        },
    };
}

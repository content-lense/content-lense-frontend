// INFO: This File is translated
import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { ReactElement } from "react";
import UnauthenticatedLayout from "../components/unauthenticatedLayout";

export default function Page() {
    return (
        <Box sx={{ maxWidth: 400, margin: "auto" }}>
            <Paper sx={{ p: 4 }}>
                <Typography>
                    {"Your password has been resetted."} <br />{" "}
                    {"Please check your email inbox."}
                </Typography>
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

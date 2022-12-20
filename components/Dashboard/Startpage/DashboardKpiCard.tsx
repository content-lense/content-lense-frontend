import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Stack, Typography, Box } from "@mui/material";
import { useTranslation } from "next-i18next";
import DashboardCard from "./DashboardCard";

interface DashboardKpiCardProps {
  heading: string;
  value: number;
  total: number;
  dayCount: number;
  symbol?: ReactJSXElement;
}
export function DashboardKpiCard(props: DashboardKpiCardProps) {
  const { t } = useTranslation();
  return (
    <DashboardCard>
      <Stack sx={{ m: 2 }}>
        <Typography variant="h6">{props.heading}</Typography>
        <Typography variant="body2">{t("Letzte {{count}} Tage", { count: props.dayCount })}</Typography>
        <Typography variant="h2">{props.value}</Typography>
        <Box>
          {props.symbol}
          <Typography variant="body1">{t("Total {{total}}", { total: props.total })}</Typography>
        </Box>
      </Stack>
    </DashboardCard>
  );
}

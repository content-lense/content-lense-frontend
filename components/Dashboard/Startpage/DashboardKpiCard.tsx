import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Stack, Typography, Box } from "@mui/material";
import DashboardCard from "./DashboardCard";

interface DashboardKpiCardProps {
  heading: string;
  value: number;
  total: number;
  dayCount: number;
  symbol?: ReactJSXElement;
}
export function DashboardKpiCard(props: DashboardKpiCardProps) {
  return (
    <DashboardCard>
      <Stack sx={{ m: 2 }}>
        <Typography variant="h6">{props.heading}</Typography>
        <Typography variant="body2">{`Letzte ${props.dayCount} Tage`}</Typography>
        <Typography variant="h2">{props.value}</Typography>
        <Box>
          {props.symbol}
          <Typography variant="body1">{`Gesamt ${props.total}`}</Typography>
        </Box>
      </Stack>
    </DashboardCard>
  );
}

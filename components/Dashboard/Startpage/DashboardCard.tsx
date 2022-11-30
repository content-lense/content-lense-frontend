import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Card, CardContent, Typography } from "@mui/material";

interface DashboardCardProps {
  children: ReactJSXElement | ReactJSXElement[];
  isScrollable?: boolean;
  scrollElementHeight?: number | string;
  title?: string;
  fixedSectionBelow?: ReactJSXElement | ReactJSXElement[];
}
function DashboardCard(props: DashboardCardProps) {
  const scrollableCardHeight = setCardHeight();
  function setCardHeight() {
    if (props.scrollElementHeight) {
      return props.scrollElementHeight;
    } else if (!props.scrollElementHeight) {
      return "100%";
    }
  }

  return (
    <>
      {props.isScrollable ? (
        <Card sx={{ height: props.scrollElementHeight ? null : "100%" }}>
          <CardContent>
            <Typography variant="h6">{props.title}</Typography>
          </CardContent>
          <CardContent
            sx={{
              height: scrollableCardHeight,
              overflow: "scroll",
              pt: 0,
              pb: 2,
            }}
          >
            {props.children}
          </CardContent>
          <CardContent>{props.fixedSectionBelow}</CardContent>
        </Card>
      ) : (
        <Card sx={{ height: "100%" }}>
          {props.title && (
            <CardContent>
              <Typography variant="h6">{props.title}</Typography>
            </CardContent>
          )}
          <CardContent>{props.children}</CardContent>
        </Card>
      )}
    </>
  );
}

export default DashboardCard;

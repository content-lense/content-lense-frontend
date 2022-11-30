import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { Chip, Tooltip } from "@mui/material";

function SentimentChip(props: { sentiment: number }) {
  const { sentiment } = props;
  let icon = <SentimentDissatisfiedIcon />;
  if (sentiment === 3) {
    icon = <SentimentNeutralIcon />;
  } else if (sentiment > 3) {
    icon = <SentimentSatisfiedIcon />;
  }
  return (
    <Tooltip title={`Sentiment-Score ${sentiment} / 5`}>
      <Chip
        icon={icon}
        label={sentiment}
        color={sentiment < 3 ? "warning" : sentiment === 3 ? "default" : "success"}
      />
    </Tooltip>
  );
}

export default SentimentChip;

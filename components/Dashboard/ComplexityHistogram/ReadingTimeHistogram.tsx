import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../../../data/ReactQueries";
import { ArticleComplexityInterface } from "../../../interfaces/ArticleComplexityInterface";
import { bin } from "d3-array";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  TooltipProps,
  ResponsiveContainer,
} from "recharts";
import { Props as XAxisProps } from "recharts/types/cartesian/XAxis";
import { PureComponent } from "react";

export default function ReadingTimeHistogram() {
  const { data, isLoading } = useQuery(
    ["articles-reading-time-in-minutes"],
    () =>
      GenericGetItems<ArticleComplexityInterface>("/article_complexities", {
        queryString: "?part=body&properties[]=readingTimeInMinutes",
      })
  );
  const _bin = bin();
  if (!data || isLoading) {
    return <></>;
  }

  function giveHistogramData(data: ArticleComplexityInterface[]) {
    let readingTimes = data.map((date) => {
      return date.readingTimeInMinutes;
    });
    let binedReadingTimes = _bin(readingTimes);
    let readingTimeData = binedReadingTimes.map(
      ({ x0: from, x1: to, length: count, ...values }) => {
        return { from, to, count, values: Object.values(values) };
      }
    );
    return readingTimeData;
  }
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: "rgba(255, 255, 255, 0.7)", padding: 1 }}
        >
          <span className="label">{`${payload[0].value} Artikel`}</span>
          <br />
          <span className="label">{`mit einer Lesezeit zwischen  ${payload[0].payload.from} und ${payload[0].payload.to} Minuten`}</span>
        </div>
      );
    }

    return null;
  };
  function CustomizedAxisTick(
    props: XAxisProps & {
      payload?: {
        coordinate: number;
        value: number;
        index: number;
        offset: number;
        tickCoord: number;
        isShow: boolean;
      };
    }
  ) {
    const { x, y, stroke, payload } = props;

    if (payload && data)
      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="end"
            fill="#666"
            transform="rotate(-35)"
          >
            {`${giveHistogramData(data)[payload.value].from} – ${
              giveHistogramData(data)[payload.value].to
            }`}
          </text>
        </g>
      );
    else return <></>;
  }

  return (
    <ResponsiveContainer>
      <BarChart data={giveHistogramData(data)} margin={{ bottom: 50 }}>
        <XAxis
          label={{
            value: "Benötigte Lesezeit in Minuten",
            position: "insideBottom",
            offset: -45,
          }}
          tick={<CustomizedAxisTick />}
        />
        <YAxis
          label={{
            value: "Anzahl Artikel",
            angle: -90,
            offset: 20,
            position: "insideLeft",
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={"count"} name="Anzahl an Artikeln" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

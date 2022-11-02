import { useQuery } from "@tanstack/react-query";
import { GenericGetItems } from "../../../data/ReactQueries";
import { ArticleComplexityInterface } from "../../../interfaces/ArticleComplexityInterface";
import { bin } from "d3-array";
import { BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { Props as XAxisProps } from "recharts/types/cartesian/XAxis";
import { PureComponent } from "react";

export default function ReadingTimeHistogram() {
  const { data, isLoading } = useQuery(
    ["articles-reading-time-in-minutes"],
    () =>
      GenericGetItems<ArticleComplexityInterface>(
        "/article_complexities?part=body&properties[]=readingTimeInMinutes"
      )
  );
  const _bin = bin();
  if (!data || isLoading) {
    return <></>;
  }
  console.log("before", data);
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
    console.log(payload, "load");

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
    <BarChart
      width={500}
      height={400}
      data={giveHistogramData(data)}
      margin={{ bottom: 50 }}
    >
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
      <Tooltip />
      <Bar dataKey={"count"} name="Anzahl an Artikeln" fill="#8884d8" />
    </BarChart>
  );
}

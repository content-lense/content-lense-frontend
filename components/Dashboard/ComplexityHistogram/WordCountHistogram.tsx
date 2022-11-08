import { useQuery } from "@tanstack/react-query";
import { bin } from "d3-array";
import {
  TooltipProps,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ResponsiveContainer,
  XAxisProps,
} from "recharts";
import { GenericGetItems } from "../../../data/ReactQueries";
import { ArticleComplexityInterface } from "../../../interfaces/ArticleComplexityInterface";

export default function WordCountHistogram() {
  const { data, isLoading } = useQuery(["articles-body-word-count"], () =>
    GenericGetItems<ArticleComplexityInterface>("/article_complexities", {
      queryString: "?part=body&properties[]=totalWords",
    })
  );
  if (!data || isLoading) {
    return <></>;
  }
  const _bin = bin();
  function giveHistogramData(_data: ArticleComplexityInterface[]) {
    let wordCount = _data.map((article) => {
      return article.totalWords;
    });
    let binedWords = _bin(wordCount);
    let wordCountData = binedWords.map(
      ({ x0: from, x1: to, length: count, ...values }) => {
        return { from, to, count, values: Object.values(values) };
      }
    );
    return wordCountData;
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
          <span className="label">{`mit einer Wortanzahl zwischen  ${payload[0].payload.from} und ${payload[0].payload.to}`}</span>
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

    if (payload && data) {
      const from = giveHistogramData(data)[payload.value].from;
      const to = giveHistogramData(data)[payload.value].to;
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
            {`${from && from / 1000} – ${to && to / 1000}`}
          </text>
        </g>
      );
    } else return <></>;
  }

  return (
    <ResponsiveContainer>
      <BarChart data={giveHistogramData(data)} margin={{ bottom: 50 }}>
        <XAxis
          label={{
            value: "Wortanzahl in Tausend",
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
        <Bar dataKey="count" name="Anzahl an Artikeln" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

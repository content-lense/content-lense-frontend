import { useQuery } from "@tanstack/react-query";
import { bin as d3Bin } from "d3-array";
import { useTranslation } from "next-i18next";
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
import { ApipFilterEncoder } from "../../../helpers/ApiPlatform/apip-filter-encoder";
import { ArticleComplexityInterface } from "../../../interfaces/ArticleComplexityInterface";

interface WordCountHistogramProps {
  onClick: (rangeLowerBoundary: number, rangeUpperBoundary: number) => void;
}

export default function WordCountHistogram(props: WordCountHistogramProps) {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery(["articles-body-word-count"], () => {
    const filterEncoder = new ApipFilterEncoder();
    filterEncoder.addSingleValueFilter("part", "body").addArrayFilter("properties", ["totalWords"]);
    return GenericGetItems<ArticleComplexityInterface>("/article_complexities", filterEncoder);
  });
  if (!data || isLoading) {
    return <></>;
  }
  const bin = d3Bin();
  function giveHistogramData(_data: ArticleComplexityInterface[]) {
    let wordCount = _data.map((article) => {
      return article.totalWords;
    });
    let binedWords = bin(wordCount);
    let wordCountData = binedWords.map(({ x0: from, x1: to, length: count, ...values }) => {
      return { from, to, count, values: Object.values(values) };
    });
    return wordCountData;
  }
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: "rgba(255, 255, 255, 0.7)", padding: 1 }}
        >
          <span className="label">{t(`{{value}} articles`, { value: payload[0].value })}</span>
          <br />
          <span className="label">{t(`with a wordcount between {{from}} and {{to}}`, { from: payload[0].payload.from, to: payload[0].payload.to })}</span>
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

    if (!data) return <></>;
    const histogramData = giveHistogramData(data);
    if (payload && histogramData[payload.value]) {
      const { from, to } = histogramData[payload.value];
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
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
            value: t("Wordcount in hundret"),
            position: "insideBottom",
            offset: -45,
          }}
          tick={<CustomizedAxisTick />}
        />
        <YAxis
          label={{
            value: t("Total articles"),
            angle: -90,
            offset: 20,
            position: "insideLeft",
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="count"
          name={t("Total articles")}
          fill="#8884d8"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            if (props.onClick) props.onClick(e.from, e.to);
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

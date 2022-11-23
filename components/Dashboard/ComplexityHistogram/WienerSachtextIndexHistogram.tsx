import { useQuery } from "@tanstack/react-query";
import { TooltipProps, BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer } from "recharts";
import { GenericGetItems } from "../../../data/ReactQueries";
import { ApipFilterEncoder } from "../../../helpers/ApiPlatform/apip-filter-encoder";
import { ArticleComplexityInterface } from "../../../interfaces/ArticleComplexityInterface";

interface WienerSachtextIndexHistogramProps {
  onClick: (rangeLowerBoundary: number, rangeUpperBoundary: number) => void;
}

export default function WienerSachtextIndexHistogram(props: WienerSachtextIndexHistogramProps) {
  const { data, isLoading } = useQuery(["articles-body-wiener-sachtext-index"], () => {
    const filterEncoder = new ApipFilterEncoder();
    filterEncoder
      .addSingleValueFilter("part", "body")
      .addArrayFilter("properties", ["wienerSachtextIndex"]);
    return GenericGetItems<ArticleComplexityInterface>("/article_complexities", filterEncoder);
  });
  if (!data || isLoading) {
    return <></>;
  }
  function giveHistogramData(_data: ArticleComplexityInterface[]) {
    let array = Array(13)
      .fill(null)
      .map((_, idx) => ({ wienerIndex: idx + 3, count: 0 }));
    return _data
      .map(({ wienerSachtextIndex, ...otherAttributes }) => ({
        ...otherAttributes,
        wienerSachtextIndex: wienerSachtextIndex < 4 ? 3 : Math.round(wienerSachtextIndex),
      }))
      .reduce((prev, curr) => {
        prev[prev.findIndex((o) => o.wienerIndex === curr.wienerSachtextIndex)].count++;
        return prev;
      }, array);
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: "rgba(255, 255, 255, 0.7)", padding: 1 }}
        >
          <span className="label">{`${payload[0].value} Artikel`}</span>
          <br />
          <span className="label">{`mit Wiener-Sachtextindex von ${
            label < 4 ? "<4" : label
          }`}</span>
        </div>
      );
    }

    return null;
  };
  function formatXAxis(value: number) {
    if (value < 4) return "<4";
    else return value.toString();
  }

  return (
    <ResponsiveContainer>
      <BarChart data={giveHistogramData(data)} margin={{ bottom: 50 }}>
        <XAxis
          dataKey="wienerIndex"
          label={{
            value: "Wiener-Sachtextindex",
            position: "insideBottom",
            offset: -45,
          }}
          tickFormatter={formatXAxis}
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
        <Bar
          dataKey="count"
          name="Anzahl an Artikeln"
          fill="#8884d8"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            if (props.onClick)
              props.onClick(
                e.wienerIndex < 4
                  ? data.reduce((prev, curr) => {
                      return prev.wienerSachtextIndex < curr.wienerSachtextIndex ? prev : curr;
                    }).wienerSachtextIndex
                  : e.wienerIndex - 0.5,
                e.wienerIndex + 0.49
              );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

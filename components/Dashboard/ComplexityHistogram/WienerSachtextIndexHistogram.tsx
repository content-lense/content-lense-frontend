import { useQuery } from "@tanstack/react-query";
import { TooltipProps, BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
import { GenericGetItems } from "../../../data/ReactQueries";
import { ArticleComplexityInterface } from "../../../interfaces/ArticleComplexityInterface";

export default function WienerSachtextIndexHistogram() {
  const { data, isLoading } = useQuery(
    ["articles-body-wiener-sachtext-index"],
    () =>
      GenericGetItems<ArticleComplexityInterface>(
        "/article_complexities?part=body&properties[]=wienerSachtextIndex"
      )
  );
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
        wienerSachtextIndex:
          wienerSachtextIndex < 4 ? 3 : Math.round(wienerSachtextIndex),
      }))
      .reduce((prev, curr) => {
        prev[prev.findIndex((o) => o.wienerIndex === curr.wienerSachtextIndex)]
          .count++;
        return prev;
      }, array);
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
    <BarChart width={500} height={400} data={giveHistogramData(data)}>
      <XAxis
        dataKey="wienerIndex"
        label={{
          value: "Wiener-Sachtextindex",
          position: "insideBottom",
          offset: -5,
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
      <Bar dataKey="count" name="Anzahl an Artikeln" fill="#8884d8" />
    </BarChart>
  );
}

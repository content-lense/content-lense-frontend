import { useTranslation } from "next-i18next";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ArticleInterface } from "../../../interfaces/ArticleInterface";

interface AddedArticlesGraphPropsInterface {
  articles: ArticleInterface[];
}
export default function AddedArticlesGraph(props: AddedArticlesGraphPropsInterface) {
  const { t } = useTranslation();
  let initialGroups: Record<string, ArticleInterface[]> = {};
  const groupedByDateArticles = props.articles.reduce((groups, article) => {
    if (!article.createdAt) return groups;
    const date = article.createdAt.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(article);
    return groups;
  }, initialGroups);

  const groupArrays = Object.keys(groupedByDateArticles)
    .map((date) => {
      return {
        date,
        articles: groupedByDateArticles[date],
      };
    })
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  function formatXAxis(date: string) {
    console.log("format date", date);
    return new Date(date).toLocaleDateString("de-DE");
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length > 0 && payload[0].value) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: "rgba(255, 255, 255, 0.7)", padding: 1 }}
        >
          <span className="label">{t("On {{value}}", { value: new Date(label).toLocaleDateString("de-DE") })}</span>
          <br />
          <span className="label">{t("{{value}} articles added", { value: payload[0].value })}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <ResponsiveContainer height={200}>
        <LineChart
          data={groupArrays}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="articles.length"
            name={t("Added articles")}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

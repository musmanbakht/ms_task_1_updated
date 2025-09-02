import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const colors = [
  "#8884d8", // purple
  "#82ca9d", // green
  "#ff7300", // orange
  "#00c49f", // teal
  "#ff0000", // red
  "#a83279", // magenta
  "#005f73", // deep teal
  "#ffb703", // yellow-orange
];

export default function SchoolsPieChart({ data, totalPublications }) {
  // Prepare data for recharts
  const chartData = useMemo(() => {
    return data
      .slice() // copy array
      .sort((a, b) => b.publicationCount - a.publicationCount)
      .map((dept) => ({
        name: dept.name,
        value: dept.publicationCount,
        percentage: ((dept.publicationCount / totalPublications) * 100).toFixed(
          1
        ),
      }));
  }, [data, totalPublications]);
  console.log("IN PIE CHART", data, totalPublications);
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      {/* Header */}
      <div className="rounded-t mb-0 px-2 py-5 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-gray-500 mb-1 text-xs font-semibold">
              Overview
            </h6>
            <h2 className="text-gray-800 text-xl font-semibold">
              Publication Percentage
            </h2>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-2 flex-auto">
        <div className="relative h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={(entry) => `${entry.percentage}%`}
                animationBegin={200}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} (${props.payload.percentage}%)`,
                  name,
                ]}
              />
              {/* <Legend layout="vertical" align="right" verticalAlign="middle" /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

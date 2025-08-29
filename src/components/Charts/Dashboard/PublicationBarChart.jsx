import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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

export default function PublicationBarChart({
  allDepartments,
  highlightDepartment = "School of Mining Engineering",
}) {
  console.log("IN PUB BAR CHART", highlightDepartment);

  // Transform API → recharts data format
  const chartData = useMemo(() => {
    return allDepartments.map((dept) => ({
      name: dept.abbreviation,
      publicationCount: dept.publicationCount,
    }));
  }, [allDepartments]);
  console.log("CHART DATA", chartData);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      <div className="rounded-t mb-0 px-2 py-5 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-gray-500 mb-1 text-xs font-semibold">
              Overview
            </h6>
            <h2 className="text-gray-800 text-xl font-semibold">
              Publications by School
            </h2>
          </div>
        </div>
      </div>
      <div className="p-2 flex-auto">
        <div className="relative h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={20}
                tickFormatter={(value) => value.split(" ")[0]} // ✅ only first word
              />
              <YAxis />
              <Tooltip />

              {/* ✅ Only one Bar, assign colors per department */}
              <Bar
                dataKey="publicationCount"
                barSize={30}
                isAnimationActive={true}
                animationBegin={300}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {chartData.map((dept, index) => {
                  console.log("HIGHLI", dept.name, highlightDepartment);
                  const isHighlighted = dept.name == highlightDepartment;
                  return (
                    <Cell
                      key={dept.name}
                      // fill={colors[index % colors.length]}
                      fill="#005f73"
                      // stroke={
                      //   isHighlighted ? colors[index % colors.length] : "none"
                      // }
                      stroke={isHighlighted ? "#ffffff" : "none"}
                      strokeWidth={isHighlighted ? 3 : 0}
                      opacity={isHighlighted ? 1 : 0.7}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

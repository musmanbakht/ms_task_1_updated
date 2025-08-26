import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

// import classnames from "classnames";

const colors = [
  "#8884d8",
  "#82ca9d",
  "#ff7300",
  "#00c49f",
  "#ff0000",
  "#a83279",
  "#005f73",
  "#ffb703",
];

export default function PublicationLineChart({ publicationCountPerMonth }) {
  const [selectedDept, setSelectedDept] = useState("all");
  const [range, setRange] = useState(null); // store brush range
  console.log("PUB LINE CAHRT", publicationCountPerMonth);
  // Transform API response → chart format
  const chartData = useMemo(() => {
    const grouped = {};
    publicationCountPerMonth.forEach((item) => {
      const month = item.month.slice(0, 7); // YYYY-MM
      if (!grouped[month]) {
        grouped[month] = { month };
      }
      grouped[month][item.name] = Number(item.publicationCount);
    });
    return Object.values(grouped);
  }, [publicationCountPerMonth]);

  const departments = [
    ...new Set(publicationCountPerMonth.map((item) => item.name)),
  ];

  // --- Linear regression function ---
  const computeTrendline = (data, dept) => {
    const points = data
      .map((d, i) => [i, d[dept] ?? 0]) // use index as x
      .filter(([, y]) => y !== 0);

    if (points.length < 2) return null;

    const n = points.length;
    const sumX = points.reduce((acc, [x]) => acc + x, 0);
    const sumY = points.reduce((acc, [, y]) => acc + y, 0);
    const sumXY = points.reduce((acc, [x, y]) => acc + x * y, 0);
    const sumX2 = points.reduce((acc, [x]) => acc + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((d, i) => ({
      month: d.month,
      trend: slope * i + intercept,
    }));
  };

  // slice chartData by brush range
  const visibleData =
    range && range.startIndex !== undefined && range.endIndex !== undefined
      ? chartData.slice(range.startIndex, range.endIndex + 1)
      : chartData;

  const trendData =
    selectedDept !== "all" ? computeTrendline(visibleData, selectedDept) : null;

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
      {/* Header */}
      <div className="rounded-t mb-0 px-2 py-3 bg-transparent flex justify-between items-center">
        <div>
          <h6 className="uppercase text-gray-500 mb-1 text-xs font-semibold">
            Overview
          </h6>
          <h2 className="text-gray-800 text-xl font-semibold">
            Publications Over Time
          </h2>
        </div>

        {/* Department selector */}
        {/* Department selector */}
        <div className="w-full max-w-sm min-w-[200px]">
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
            >
              <option value="all">All Schools</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.2"
              stroke="currentColor"
              className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700 pointer-events-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
              />
            </svg>
          </div>
        </div>

        {/* <Select.Root value={selectedDept} onValueChange={setSelectedDept}>
          <Select.Trigger
            placeholder="Select school…"
            className="inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] text-[13px] leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9"
          />
          <Select.Content>
            <Select.Item value="all">All Schools</Select.Item>
            {departments.map((dept) => (
              <Select.Item key={dept} value={dept}>
                {dept}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root> */}
      </div>

      {/* Chart */}
      <div className="p-4 flex-auto">
        <div className="relative h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Brush
                dataKey="month"
                height={30}
                stroke="#8884d8"
                onChange={(e) => setRange(e)}
              />

              {departments.map((dept, index) => {
                if (selectedDept !== "all" && selectedDept !== dept) {
                  return null;
                }
                return (
                  <Line
                    key={dept}
                    type="monotone"
                    dataKey={dept}
                    name={dept}
                    strokeWidth={selectedDept === dept ? 4 : 2}
                    dot={selectedDept === dept ? { r: 5 } : { r: 1 }}
                    stroke={colors[index % colors.length]}
                  />
                );
              })}

              {/* Trendline (only for single dept) */}
              {trendData && (
                <Line
                  type="monotone"
                  data={trendData}
                  dataKey="trend"
                  name="Trendline"
                  stroke="#000"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Radix SelectItem with docs CSS
// const SelectItem = React.forwardRef(
//   ({ children, className, ...props }, forwardedRef) => {
//     return (
//       <Select.Item
//         className={classnames(
//           "relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] leading-none text-violet11 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1 data-[highlighted]:outline-none",
//           className
//         )}
//         {...props}
//         ref={forwardedRef}
//       >
//         <Select.ItemText>{children}</Select.ItemText>
//         <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
//           <CheckIcon />
//         </Select.ItemIndicator>
//       </Select.Item>
//     );
//   }
// );
// SelectItem.displayName = "SelectItem";

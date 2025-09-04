import React, { useEffect } from "react";
import PatentsTable from "../components/Tables.jsx/PatentsTable";
import { useState } from "react";
import PatentsBarChart from "../components/Charts/Patents/PatentsBarChart";
import { getPatentsStats } from "../API";
import PatentsCountryMap from "../components/Maps/PatentsCountryMap";

const Patents = () => {
  const [patentsData, setPatentsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);

  useEffect(() => {
    const PatentStats = async () => {
      try {
        setLoading(true);
        const response = await getPatentsStats(selectedSchool);
        setPatentsData(response.data || null);
      } catch (err) {
        console.log("Failed to fetch Data:", err);
      } finally {
        setLoading(false);
      }
    };
    PatentStats();
  }, [selectedSchool]);
  const handleBarClick = (schoolId) => {
    setSelectedSchool(schoolId);
  };
  return (
    <>
      <div className="flex flex-wrap mt-2 ">
        <div className="w-full xl:w-4/12 mb-12 xl:mb-0 pl-4">
          {!loading && (
            <PatentsBarChart
              allPatents={patentsData ? patentsData?.patentsBySchool : []}
              onBarClick={handleBarClick}
            />
          )}
        </div>
        <div className="w-full xl:w-8/12 px-4">
          {!loading && patentsData && (
            // <PublicationBarChart
            //   allDepartments={departmentData}
            //   highlightDepartment={
            //     highlightSchool || "School of Mining Engineering"
            //   }
            // />
            <PatentsCountryMap data={patentsData?.patentsByCountry || []} />
          )}
        </div>
      </div>
      <PatentsTable />
    </>
  );
};

export default Patents;

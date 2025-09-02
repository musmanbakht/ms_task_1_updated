import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchDepartments } from "../../API/index"; // axios function
import Legend from "./Legends/DashboardMapLegend";
import PublicationHeatmap from "./PublicationHeatmap";

// Recenter map with animation
function RecenterMap({ lat, long }) {
  const map = useMap();
  useEffect(() => {
    if (lat && long) {
      map.flyTo([lat, long], 18, { animate: true, duration: 1.5 });
    }
  }, [lat, long, map]);
  return null;
}

function DashboardMap({ schools, onSchoolSelect, selectedYear, onYearChange }) {
  // const [schools, setSchools] = useState([]);
  console.log("SCHOOLSSSSSS", schools);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false); // ✅ toggle state

  const minCount =
    schools && schools.length > 0
      ? Math.min(...schools.map((s) => s.publicationCount || 0))
      : 0;
  const maxCount =
    schools && schools.length > 0
      ? Math.max(...schools.map((s) => s.publicationCount || 0))
      : 0;

  const lastFiveYears = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
  // Function to set circle color
  const getColor = (count) => {
    if (count < 15) return "#e41a1c"; // red (low)
    if (count <= 20) return "#ff7f00"; // orange (medium)
    return "#4daf4a"; // green (high)
  };
  function getDynamicColor(count, min, max) {
    if (max === min) return "#a6bddb"; // edge case: all same
    const mid = (min + max) / 2;

    if (count <= mid) {
      return "#c59ca4ff"; // low
    } else if (count < max) {
      return "#a48d9eff"; // medium
    } else {
      return "#606d94ff"; // high
    }
  }

  return (
    <div className="p-4">
      <div
        className="relative border border-gray-300 rounded-lg overflow-hidden"
        style={{ width: "100%", height: "500px" }}
      >
        {/* Show shadowed placeholder when loading */}
        {!schools || schools.length === 0 ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 shadow-inner">
            <p className="text-lg font-semibold text-gray-600">
              Loading Schools...
            </p>
          </div>
        ) : (
          <MapContainer
            center={[-26.1922, 28.0285]}
            zoom={16}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            {/* <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            /> */}
            <TileLayer
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              minZoom={0}
              maxZoom={20}
            />
            {showHeatmap && <PublicationHeatmap schools={schools} />}
            {/* Custom select overlay */}
            <div className="absolute top-2 right-2 z-999 bg-white rounded shadow">
              <select
                value={selectedYear}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="w-full bg-white border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:border-gray-400"
              >
                <option value="">Select Year</option> {/* default option */}
                {lastFiveYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowHeatmap((prev) => !prev)}
              className={`absolute z-999 w-8 h-8 top-20 left-[11px] rounded shadow border text-sm font-bold ${
                showHeatmap
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
              title="Toggle Heatmap"
            >
              🔥
            </button>
            {!showHeatmap &&
              schools.map((school) => (
                <CircleMarker
                  key={school.id}
                  center={[school.lat, school.long]}
                  // radius={getRadius(school.publicationCount)}
                  pathOptions={{
                    color: getDynamicColor(
                      school.publicationCount,
                      minCount,
                      maxCount
                    ),
                    fillColor: getDynamicColor(
                      school.publicationCount,
                      minCount,
                      maxCount
                    ),
                    fillOpacity: 1,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelected({ lat: school.lat, long: school.long });
                      if (onSchoolSelect) {
                        onSchoolSelect(school.abbreviation); // ✅ send selected department name
                      }
                    },
                  }}
                >
                  <Popup>
                    <h2 className="font-bold">{school.name}</h2>
                    <p>Publications Approved: {school.publicationCount}</p>
                    <p>Faculty Name: {school.faculty.name}</p>
                    <p>Abbreviation: {school.abbreviation}</p>
                  </Popup>
                </CircleMarker>
              ))}
            {selected && (
              <RecenterMap lat={selected.lat} long={selected.long} />
            )}
            <Legend min={minCount} max={maxCount} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}
export default DashboardMap;

// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { fetchDepartments } from "../../API/index"; // axios function
// import customIconBlack from "../../media/building_black.png";
// import customIconGreen from "../../media/building_green.png";
// import customIconBlue from "../../media/building_blue.png";
// import buildingSvg from "../../media/building_black.svg";
// // Custom icon
// // import customIconUrl from "../../media/building_black.png";

// // let CustomIcon = L.icon({
// //   iconUrl: customIconUrl,
// //   iconSize: [32, 32],
// //   iconAnchor: [16, 32],
// //   popupAnchor: [0, -32],
// // });

// function getCustomIcon(publicationCount) {
//   let iconUrl = customIconBlack;
//   if (publicationCount < 15) {
//     iconUrl = customIconBlack;
//   } else if (publicationCount > 20) {
//     iconUrl = customIconGreen;
//   } else {
//     iconUrl = customIconBlue;
//   }

//   return L.icon({
//     iconUrl,
//     iconSize: [32, 32],
//     iconAnchor: [16, 32],
//     popupAnchor: [0, -32],
//   });
// }

// // Recenter map with animation
// function RecenterMap({ lat, long }) {
//   const map = useMap();
//   useEffect(() => {
//     if (lat && long) {
//       map.flyTo([lat, long], 18, { animate: true, duration: 1.5 });
//     }
//   }, [lat, long, map]);
//   return null;
// }

// function MapDashboard() {
//   const [departments, setDepartments] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadDepartments = async () => {
//       try {
//         const response = await fetchDepartments();
//         setDepartments(response.allDepartments || []);
//       } catch (err) {
//         console.error("Failed to fetch departments:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadDepartments();
//   }, []);
//   console.log("DEPARTMENTS", departments);
//   return (
//     <div className="p-4">
//       <div
//         className="relative border border-gray-300 rounded-lg overflow-hidden"
//         style={{ width: "100%", height: "500px" }}
//       >
//         {/* Show shadowed placeholder when loading */}
//         {loading ? (
//           <div className="flex items-center justify-center w-full h-full bg-gray-200 shadow-inner">
//             <p className="text-lg font-semibold text-gray-600">
//               Loading departments...
//             </p>
//           </div>
//         ) : (
//           <MapContainer
//             center={[-26.1922, 28.0285]}
//             zoom={16}
//             scrollWheelZoom={true}
//             className="h-full w-full"
//           >
//             <TileLayer
//               attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />

//             {departments.map((dept) => (
//               <Marker
//                 key={dept.id}
//                 position={[dept.lat, dept.long]}
//                 icon={getCustomIcon(dept.publicationCount)}
//                 eventHandlers={{
//                   click: () => {
//                     setSelected({ lat: dept.lat, long: dept.long });
//                   },
//                 }}
//               >
//                 <Popup>
//                   <h2 className="font-bold">{dept.name}</h2>
//                   <p>Publications: {dept.publicationCount}</p>
//                   <p>Faculty Name: {dept.faculty.name}</p>
//                 </Popup>
//               </Marker>
//             ))}

//             {selected && (
//               <RecenterMap lat={selected.lat} long={selected.long} />
//             )}
//           </MapContainer>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MapDashboard;

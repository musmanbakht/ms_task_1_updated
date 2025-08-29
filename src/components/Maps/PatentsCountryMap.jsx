import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function PatentsCountryMap({ data }) {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMap = async () => {
      try {
        const geojson = await fetch(
          "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        ).then((res) => res.json());
        setGeoData(geojson);
      } catch (err) {
        console.error("Failed to fetch geojson:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMap();
  }, []);

  // Color scale
  const getColor = (count) => {
    if (!count) return "#ccc"; // grey for no data
    if (count < 15) return "#e41a1c"; // red
    if (count <= 20) return "#ff7f00"; // orange
    return "#4daf4a"; // green
  };

  // Style each country
  const styleCountry = (feature) => {
    const record = data.find((d) => d.country === feature.id); // ISO3 code match
    return {
      fillColor: getColor(record?.patentCount),
      weight: 1,
      color: "black",
      fillOpacity: 0.7,
    };
  };

  // Popup
  const onEachCountry = (feature, layer) => {
    const record = data.find((d) => d.country === feature.id);
    if (record) {
      layer.bindPopup(`
        <strong>${feature.properties.name}</strong><br/>
        Code: ${record.country}<br/>
        Patents: ${record.patentCount}
      `);
    }
  };

  return (
    <div>
      <div
        className="relative border border-gray-300 rounded-lg overflow-hidden"
        style={{ width: "100%", height: "455px" }}
      >
        {loading ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 shadow-inner">
            <p className="text-lg font-semibold text-gray-600">
              Loading Map...
            </p>
          </div>
        ) : (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {geoData && (
              <GeoJSON
                data={geoData}
                style={styleCountry}
                onEachFeature={onEachCountry}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default PatentsCountryMap;

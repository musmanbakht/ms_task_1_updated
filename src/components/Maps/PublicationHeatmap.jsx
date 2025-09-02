import React, { useMemo } from "react";
// import HeatmapLayer from "react-leaflet-heatmap-layer-v3";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

export default function PublicationHeatmap({ schools }) {
  // Transform schools into [lat, long, intensity] points
  const heatmapData = useMemo(() => {
    return schools
      .filter((s) => s.lat && s.long) // ensure valid coords
      .map((s) => [s.lat, s.long, s.publicationCount || 0]);
  }, [schools]);

  return (
    <HeatmapLayer
      fitBoundsOnLoad
      fitBoundsOnUpdate
      points={heatmapData}
      longitudeExtractor={(m) => m[1]}
      latitudeExtractor={(m) => m[0]}
      intensityExtractor={(m) => m[2]}
      radius={25} // adjust for spread
      blur={15} // smoothness
      max={Math.max(...schools.map((s) => s.publicationCount || 0), 1)} // normalize
    />
  );
}

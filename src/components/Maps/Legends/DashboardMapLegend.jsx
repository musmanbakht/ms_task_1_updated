import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

function Legend({ min, max }) {
  const map = useMap();

  useEffect(() => {
    if (min == null || max == null) return;

    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = () => {
      const div = L.DomUtil.create(
        "div",
        "info legend bg-white p-3 rounded shadow text-sm"
      );

      const mid = Math.round((min + max) / 2);

      div.innerHTML = `
        <div><span style="background:#c59ca4ff; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> ${min} (low)</div>
        <div><span style="background:#a48d9eff; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> ~${mid} (medium)</div>
        <div><span style="background:#606d94ff; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> ${max} (high)</div>
      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map, min, max]);

  return null;
}

export default Legend;

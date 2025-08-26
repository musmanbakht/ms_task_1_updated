import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomleft" });

    legend.onAdd = () => {
      const div = L.DomUtil.create(
        "div",
        "info legend bg-white p-3 rounded shadow text-sm"
      );
      div.innerHTML = `
        <div><span style="background:#e41a1c; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> < 15 publications</div>
        <div><span style="background:#ff7f00; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> 15 - 20 publications</div>
        <div><span style="background:#4daf4a; width:12px; height:12px; display:inline-block; margin-right:6px;"></span> > 20 publications</div>
      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}
export default Legend;

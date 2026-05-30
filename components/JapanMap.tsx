"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

type Props = {
  data: Record<string, number>;
};

function getColor(count: number): string {
  if (count === 0) return "#e5e7eb";
  if (count <= 2) return "#fecaca";
  if (count <= 4) return "#fca5a5";
  if (count <= 6) return "#f87171";
  return "#ef4444";
}

const TOPO_URL = "/japan.topojson";

export default function JapanMap({ data }: Props) {
  const [tooltip, setTooltip] = useState("");

  return (
    <div className="relative">
      {tooltip && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-3 py-1 rounded pointer-events-none z-10">
          {tooltip}
        </div>
      )}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1800,
          center: [137, 38],
        }}
        width={800}
        height={900}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={TOPO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name: string = geo.properties.nam_ja;
              const count = data[name] ?? 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(count)}
                  stroke="#fff"
                  strokeWidth={0.5}
                  onMouseEnter={() => setTooltip(`${name}: ${count}回`)}
                  onMouseLeave={() => setTooltip("")}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", opacity: 0.7 },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

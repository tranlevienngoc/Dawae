"use client";

import { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface WarriorData {
  title: string;
  level: string; // "steady", "seeking", "new"
  count: number;
  location: string;
}

interface TooltipData extends WarriorData {
  x: number;
  y: number;
  visible: boolean;
}

// Dawae Warriors data around the world
const warriors = [
  // Steady Wae Warriors (Green) - 12 warriors (28.7%)
  { title: "Uganda Tribe Alpha", latitude: 1.3733, longitude: 32.2903, level: "steady", count: 8, location: "Kampala, Uganda" },
  { title: "Kenya Warriors", latitude: -1.2921, longitude: 36.8219, level: "steady", count: 6, location: "Nairobi, Kenya" },
  { title: "Tanzania Knuckles", latitude: -6.7924, longitude: 39.2083, level: "steady", count: 5, location: "Dar es Salaam, Tanzania" },
  { title: "Nigeria Dawae", latitude: 9.0765, longitude: 7.3986, level: "steady", count: 7, location: "Abuja, Nigeria" },
  { title: "Ghana Warriors", latitude: 5.6037, longitude: -0.1870, level: "steady", count: 4, location: "Accra, Ghana" },
  { title: "South Africa Tribe", latitude: -25.7479, longitude: 28.2293, level: "steady", count: 3, location: "Pretoria, South Africa" },
  { title: "Morocco Knuckles", latitude: 33.9716, longitude: -6.8498, level: "steady", count: 2, location: "Rabat, Morocco" },
  { title: "Ethiopia Warriors", latitude: 9.1450, longitude: 40.4897, level: "steady", count: 4, location: "Addis Ababa, Ethiopia" },
  { title: "Cameroon Dawae", latitude: 3.8480, longitude: 11.5021, level: "steady", count: 3, location: "Yaoundé, Cameroon" },
  { title: "Senegal Tribe", latitude: 14.7167, longitude: -17.4677, level: "steady", count: 2, location: "Dakar, Senegal" },
  { title: "Congo Warriors", latitude: -4.2634, longitude: 15.2429, level: "steady", count: 5, location: "Kinshasa, DRC" },
  { title: "Madagascar Knuckles", latitude: -18.8792, longitude: 47.5079, level: "steady", count: 3, location: "Antananarivo, Madagascar" },

  // Seeking Wae Warriors (Orange) - 16 warriors (35.1%)
  { title: "London Seekers", latitude: 51.5074, longitude: -0.1278, level: "seeking", count: 4, location: "London, UK" },
  { title: "Paris Dawae", latitude: 48.8566, longitude: 2.3522, level: "seeking", count: 3, location: "Paris, France" },
  { title: "Berlin Warriors", latitude: 52.5200, longitude: 13.4050, level: "seeking", count: 5, location: "Berlin, Germany" },
  { title: "Rome Knuckles", latitude: 41.9028, longitude: 12.4964, level: "seeking", count: 2, location: "Rome, Italy" },
  { title: "Madrid Tribe", latitude: 40.4168, longitude: -3.7038, level: "seeking", count: 3, location: "Madrid, Spain" },
  { title: "Amsterdam Warriors", latitude: 52.3676, longitude: 4.9041, level: "seeking", count: 4, location: "Amsterdam, Netherlands" },
  { title: "Stockholm Dawae", latitude: 59.3293, longitude: 18.0686, level: "seeking", count: 2, location: "Stockholm, Sweden" },
  { title: "Copenhagen Seekers", latitude: 55.6761, longitude: 12.5683, level: "seeking", count: 3, location: "Copenhagen, Denmark" },
  { title: "Vienna Knuckles", latitude: 48.2082, longitude: 16.3738, level: "seeking", count: 2, location: "Vienna, Austria" },
  { title: "Prague Warriors", latitude: 50.0755, longitude: 14.4378, level: "seeking", count: 3, location: "Prague, Czech Republic" },
  { title: "Warsaw Tribe", latitude: 52.2297, longitude: 21.0122, level: "seeking", count: 4, location: "Warsaw, Poland" },
  { title: "Budapest Dawae", latitude: 47.4979, longitude: 19.0402, level: "seeking", count: 2, location: "Budapest, Hungary" },
  { title: "Bucharest Seekers", latitude: 44.4268, longitude: 26.1025, level: "seeking", count: 3, location: "Bucharest, Romania" },
  { title: "Helsinki Warriors", latitude: 60.1699, longitude: 24.9384, level: "seeking", count: 2, location: "Helsinki, Finland" },
  { title: "Oslo Knuckles", latitude: 59.9139, longitude: 10.7522, level: "seeking", count: 3, location: "Oslo, Norway" },
  { title: "Zurich Tribe", latitude: 46.9481, longitude: 7.4474, level: "seeking", count: 2, location: "Zurich, Switzerland" },

  // New Wae Warriors (Red/Pink) - 14 warriors (33.3%)
  { title: "Tokyo New Dawae", latitude: 35.6762, longitude: 139.6503, level: "new", count: 6, location: "Tokyo, Japan" },
  { title: "Seoul Warriors", latitude: 37.5665, longitude: 126.9780, level: "new", count: 5, location: "Seoul, South Korea" },
  { title: "Beijing Knuckles", latitude: 39.9042, longitude: 116.4074, level: "new", count: 4, location: "Beijing, China" },
  { title: "Mumbai Tribe", latitude: 19.0760, longitude: 72.8777, level: "new", count: 7, location: "Mumbai, India" },
  { title: "Sydney Dawae", latitude: -33.8688, longitude: 151.2093, level: "new", count: 3, location: "Sydney, Australia" },
  { title: "Singapore Warriors", latitude: 1.3521, longitude: 103.8198, level: "new", count: 4, location: "Singapore" },
  { title: "Bangkok Seekers", latitude: 13.7563, longitude: 100.5018, level: "new", count: 3, location: "Bangkok, Thailand" },
  { title: "Jakarta Knuckles", latitude: -6.2088, longitude: 106.8456, level: "new", count: 5, location: "Jakarta, Indonesia" },
  { title: "Manila Warriors", latitude: 14.5995, longitude: 120.9842, level: "new", count: 4, location: "Manila, Philippines" },
  { title: "Ho Chi Minh Tribe", latitude: 10.8231, longitude: 106.6297, level: "new", count: 3, location: "Ho Chi Minh City, Vietnam" },
  { title: "Kuala Lumpur Dawae", latitude: 3.1390, longitude: 101.6869, level: "new", count: 2, location: "Kuala Lumpur, Malaysia" },
  { title: "New York Seekers", latitude: 40.7128, longitude: -74.0060, level: "new", count: 8, location: "New York, USA" },
  { title: "Los Angeles Warriors", latitude: 34.0522, longitude: -118.2437, level: "new", count: 6, location: "Los Angeles, USA" },
  { title: "São Paulo Knuckles", latitude: -23.5505, longitude: -46.6333, level: "new", count: 4, location: "São Paulo, Brazil" },
];

// Custom Tooltip Component
const CustomTooltip = ({ data, x, y, visible }: { data: WarriorData | null, x: number, y: number, visible: boolean }) => {
  if (!visible || !data) return null;

  const levelColors = {
    steady: "#00ff00",
    seeking: "#ff8c00", 
    new: "#ff1493"
  };

  const bgColors = {
    steady: "rgba(0, 255, 0, 0.2)",
    seeking: "rgba(255, 140, 0, 0.2)",
    new: "rgba(255, 20, 147, 0.2)"
  };

  const levelLabels = {
    steady: "Steady Wae Warriors",
    seeking: "Seeking Wae Warriors",
    new: "New Wae Warriors"
  };

  return (
    <div
      style={{
        position: "fixed",
        left: x + 15,
        top: y - 10,
        zIndex: 10000,
        backgroundColor: "rgba(42, 42, 42, 0.95)",
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "12px",
        minWidth: "250px",
        color: "white",
        fontSize: "12px",
        lineHeight: "1.5",
        backdropFilter: "blur(10px)",
        pointerEvents: "none",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
          padding: "6px 10px",
          borderRadius: "4px",
          backgroundColor: bgColors[data.level as keyof typeof bgColors]
        }}
      >
        <div
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: levelColors[data.level as keyof typeof levelColors]
          }}
        />
        <span style={{ fontWeight: "bold", color: "white" }}>
          {data.title}
        </span>
      </div>
      
      <div style={{ color: "#e0e0e0" }}>
        <div><strong>Location:</strong> {data.location}</div>
        <div><strong>Warriors Count:</strong> {data.count}</div>
        <div><strong>Type:</strong> {levelLabels[data.level as keyof typeof levelLabels]}</div>
        
        <div style={{ marginTop: "8px", fontSize: "11px", color: "#ccc" }}>
          <div>"Do you know da wae, bruddah?"</div>
          <div style={{ fontStyle: "italic", marginTop: "4px" }}>
            Join the tribe and help spread da wae!
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WorldMap() {
  const [selectedWarrior, setSelectedWarrior] = useState(warriors[0]); // Uganda Tribe Alpha
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    title: "",
    level: "",
    count: 0,
    location: "",
    x: 0,
    y: 0,
    visible: false
  });

  useEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "translateY",
        projection: am5map.geoMercator(),
        homeGeoPoint: { longitude: 0, latitude: 0 },
      })
    );

    chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x2a2a2a),
      stroke: am5.color(0x444444),
      strokeWidth: 0.5,
    });

    const pointSeries = chart.series.push(am5map.ClusteredPointSeries.new(root, {}));

    pointSeries.set("clusteredBullet", function (root) {
      const container = am5.Container.new(root, { cursorOverStyle: "pointer" });

      // Get the level from the first data item in cluster
      const level = (container.dataItem as any)?.get("level") || "low";
      
      let color;
      switch (level) {
        case "high":
          color = am5.color(0xff0000);
          break;
        case "moderate":
          color = am5.color(0xff8c00);
          break;
        default:
          color = am5.color(0x00ff00);
      }

      container.children.push(
        am5.Circle.new(root, { 
          radius: 8, 
          tooltipY: 0, 
          fill: color,
          stroke: am5.color(0xffffff),
          strokeWidth: 1
        })
      );
      container.children.push(
        am5.Circle.new(root, {
          radius: 12,
          fillOpacity: 0.3,
          tooltipY: 0,
          fill: color,
        })
      );
      container.children.push(
        am5.Circle.new(root, {
          radius: 16,
          fillOpacity: 0.2,
          tooltipY: 0,
          fill: color,
        })
      );
      container.children.push(
        am5.Label.new(root, {
          centerX: am5.p50,
          centerY: am5.p50,
          fill: am5.color(0xffffff),
          populateText: true,
          fontSize: "8",
          text: "{value}",
        })
      );

      container.events.on("click", function (e) {
        if (e.target.dataItem) {
          pointSeries.zoomToCluster(e.target.dataItem as any);
        }
      });

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    for (const warrior of warriors) {
      pointSeries.data.push({
        geometry: { type: "Point", coordinates: [warrior.longitude, warrior.latitude] },
        title: warrior.title,
        level: warrior.level,
        count: warrior.count,
        location: warrior.location,
        color: warrior.level === "new" ? am5.color(0xff1493) : 
               warrior.level === "seeking" ? am5.color(0xff8c00) : 
               am5.color(0x00ff00)
      });
    }

    // Custom bullets with hover tooltip
    pointSeries.bullets.push(function () {
      const bullet = am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          radius: 6,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        }),
      });

      // Set fill color from data
      bullet.get("sprite").adapters.add("fill", function (fill, target) {
        const dataItem = target.dataItem;
        if (dataItem && dataItem.dataContext) {
          const data = dataItem.dataContext as any;
          return data.color || fill;
        }
        return fill;
      });

      // Add hover events for custom tooltip
      bullet.get("sprite").events.on("pointerover", function (ev) {
        const dataItem = ev.target.dataItem;
        if (dataItem && dataItem.dataContext) {
          const data = dataItem.dataContext as WarriorData;
          
          setTooltipData({
            ...data,
            x: ev.originalEvent.clientX,
            y: ev.originalEvent.clientY,
            visible: true
          });
        }
      });

      bullet.get("sprite").events.on("pointerout", function () {
        setTooltipData(prev => ({ ...prev, visible: false }));
      });



      return bullet;
    });

    chart.appear(1000, 100);

    return () => root.dispose();
  }, [selectedWarrior, setTooltipData]);

  // Calculate statistics
  const totalWarriors = warriors.length;
  const steadyWarriors = warriors.filter(w => w.level === "steady").length;
  const seekingWarriors = warriors.filter(w => w.level === "seeking").length;
  const newWarriors = warriors.filter(w => w.level === "new").length;
  
  const totalCount = warriors.reduce((sum, w) => sum + w.count, 0);

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      backgroundColor: "#1a1a1a",
      position: "relative",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Title and Description */}
      <div style={{
        position: "absolute",
        top: "40px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        textAlign: "center",
        color: "white"
      }}>
        <h1 style={{ 
          margin: "0 0 20px 0", 
          fontSize: "48px", 
          fontWeight: "bold",
          letterSpacing: "2px"
        }}>
          The Ugandan Knuckles Empire
        </h1>
        <p style={{
          margin: "0",
          fontSize: "16px",
          color: "#ccc",
          maxWidth: "800px",
          lineHeight: "1.6"
        }}>
          Our sacred mission is to revive the spirit of Ugandan Knuckles, to make da tribe great again! Dis house unites bruddahs globally, tappin' to honor Da Queen and prove Da Wae lives eternal. Join us, spit on da doubters, and let's show da world da Ugandan Knuckles tribe never fades.
        </p>
      </div>

      {/* Top Right Panel - Total Dawae Warriors */}
      <div style={{
        position: "absolute",
        right: "20px",
        top: "200px",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        padding: "20px",
        color: "white",
        minWidth: "300px",
        backdropFilter: "blur(10px)"
      }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "normal" }}>
          Total Dawae Warriors
        </h3>
        <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "15px" }}>
          {totalCount}
        </div>
        
        {/* Progress Bar */}
        <div style={{ 
          width: "100%", 
          height: "8px", 
          backgroundColor: "#333", 
          borderRadius: "4px", 
          marginBottom: "15px",
          display: "flex"
        }}>
          <div style={{ 
            width: `${(steadyWarriors/totalWarriors*100)}%`, 
            height: "100%", 
            backgroundColor: "#00ff00", 
            borderRadius: "4px 0 0 4px" 
          }}></div>
          <div style={{ 
            width: `${(seekingWarriors/totalWarriors*100)}%`, 
            height: "100%", 
            backgroundColor: "#ff8c00" 
          }}></div>
          <div style={{ 
            width: `${(newWarriors/totalWarriors*100)}%`, 
            height: "100%", 
            backgroundColor: "#ff1493",
            borderRadius: "0 4px 4px 0" 
          }}></div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              width: "20px", 
              height: "8px", 
              backgroundColor: "#00ff00", 
              borderRadius: "4px" 
            }}></div>
            <span style={{ color: "#00ff00" }}>Steady Wae Warriors: {steadyWarriors} ({(steadyWarriors/totalWarriors*100).toFixed(1)}%)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              width: "20px", 
              height: "8px", 
              backgroundColor: "#ff8c00", 
              borderRadius: "4px" 
            }}></div>
            <span style={{ color: "#ff8c00" }}>Seeking Wae Warriors: {seekingWarriors} ({(seekingWarriors/totalWarriors*100).toFixed(1)}%)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              width: "20px", 
              height: "8px", 
              backgroundColor: "#ff1493", 
              borderRadius: "4px" 
            }}></div>
            <span style={{ color: "#ff1493" }}>New Wae Warriors: {newWarriors} ({(newWarriors/totalWarriors*100).toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div id="chartdiv" style={{ 
        width: "100%", 
        height: "100%",
        backgroundColor: "#1a1a1a"
      }}></div>

      {/* Custom Tooltip */}
      <CustomTooltip 
        data={tooltipData.visible ? tooltipData : null}
        x={tooltipData.x} 
        y={tooltipData.y} 
        visible={tooltipData.visible} 
      />
    </div>
  );
}


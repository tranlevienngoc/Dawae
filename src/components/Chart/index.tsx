"use client";

import { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface RegionData {
  title: string;
  level: string;
  rate: number;
  location: string;
}

interface TooltipData extends RegionData {
  x: number;
  y: number;
  visible: boolean;
}

// Data với các mức độ interruption khác nhau
const regions = [
  // High interruption (Red) - 13 regions
  { title: "europe-west4", latitude: 52.3676, longitude: 4.9041, level: "high", rate: 19.917, location: "Netherlands" },
  { title: "asia-northeast1", latitude: 35.6762, longitude: 139.6503, level: "high", rate: 15.094, location: "Tokyo, Japan" },
  { title: "us-west1", latitude: 37.7749, longitude: -122.4194, level: "high", rate: 7.632, location: "Oregon, USA" },
  { title: "us-central1", latitude: 41.8781, longitude: -87.6298, level: "high", rate: 6.8, location: "Iowa, USA" },
  { title: "us-east1", latitude: 40.7128, longitude: -74.0060, level: "high", rate: 6.2, location: "South Carolina, USA" },
  { title: "europe-west1", latitude: 52.5200, longitude: 13.4050, level: "high", rate: 5.9, location: "Belgium" },
  { title: "asia-southeast1", latitude: 1.3521, longitude: 103.8198, level: "high", rate: 5.5, location: "Singapore" },
  { title: "southamerica-east1", latitude: -23.5505, longitude: -46.6333, level: "high", rate: 5.1, location: "São Paulo, Brazil" },
  { title: "australia-southeast1", latitude: -33.8688, longitude: 151.2093, level: "high", rate: 4.8, location: "Sydney, Australia" },
  { title: "europe-west2", latitude: 51.5074, longitude: -0.1278, level: "high", rate: 4.5, location: "London, UK" },
  { title: "us-west2", latitude: 34.0522, longitude: -118.2437, level: "high", rate: 4.2, location: "Los Angeles, USA" },
  { title: "asia-east1", latitude: 25.0330, longitude: 121.5645, level: "high", rate: 3.9, location: "Taiwan" },
  { title: "europe-west3", latitude: 50.1109, longitude: 8.6821, level: "high", rate: 3.6, location: "Frankfurt, Germany" },

  // Moderate interruption (Orange) - 15 regions
  { title: "europe-north1", latitude: 60.1699, longitude: 24.9384, level: "moderate", rate: 0.35, location: "Hamina, Finland" },
  { title: "europe-central1", latitude: 50.0755, longitude: 14.4378, level: "moderate", rate: 2.6, location: "Prague, Czech Republic" },
  { title: "europe-west6", latitude: 46.9481, longitude: 7.4474, level: "moderate", rate: 2.4, location: "Zurich, Switzerland" },
  { title: "europe-west8", latitude: 40.4168, longitude: -3.7038, level: "moderate", rate: 2.2, location: "Madrid, Spain" },
  { title: "europe-west9", latitude: 48.8566, longitude: 2.3522, level: "moderate", rate: 2.0, location: "Paris, France" },
  { title: "europe-west10", latitude: 41.9028, longitude: 12.4964, level: "moderate", rate: 1.8, location: "Milan, Italy" },
  { title: "europe-west12", latitude: 52.2297, longitude: 21.0122, level: "moderate", rate: 1.6, location: "Warsaw, Poland" },
  { title: "europe-west13", latitude: 47.4979, longitude: 19.0402, level: "moderate", rate: 1.4, location: "Budapest, Hungary" },
  { title: "europe-west14", latitude: 44.4268, longitude: 26.1025, level: "moderate", rate: 1.2, location: "Bucharest, Romania" },
  { title: "europe-west15", latitude: 55.7558, longitude: 37.6176, level: "moderate", rate: 1.0, location: "Moscow, Russia" },
  { title: "europe-west16", latitude: 59.3293, longitude: 18.0686, level: "moderate", rate: 0.8, location: "Stockholm, Sweden" },
  { title: "europe-west17", latitude: 52.3676, longitude: 4.9041, level: "moderate", rate: 0.6, location: "Amsterdam, Netherlands" },
  { title: "europe-west18", latitude: 59.9139, longitude: 10.7522, level: "moderate", rate: 0.4, location: "Oslo, Norway" },
  { title: "europe-west19", latitude: 55.6761, longitude: 12.5683, level: "moderate", rate: 0.2, location: "Copenhagen, Denmark" },

  // Low interruption (Green) - 14 regions
  { title: "europe-west20", latitude: 48.2082, longitude: 16.3738, level: "low", rate: 0.15, location: "Vienna, Austria" },
  { title: "europe-west21", latitude: 53.9045, longitude: 27.5615, level: "low", rate: 0.12, location: "Minsk, Belarus" },
  { title: "europe-west22", latitude: 50.8503, longitude: 4.3517, level: "low", rate: 0.10, location: "Brussels, Belgium" },
  { title: "europe-west23", latitude: 43.8564, longitude: 18.4131, level: "low", rate: 0.08, location: "Sarajevo, Bosnia" },
  { title: "europe-west24", latitude: 42.6977, longitude: 23.3219, level: "low", rate: 0.06, location: "Sofia, Bulgaria" },
  { title: "europe-west25", latitude: 45.8150, longitude: 15.9819, level: "low", rate: 0.04, location: "Zagreb, Croatia" },
  { title: "europe-west26", latitude: 42.6629, longitude: 21.1655, level: "low", rate: 0.03, location: "Pristina, Kosovo" },
  { title: "europe-west27", latitude: 50.0755, longitude: 14.4378, level: "low", rate: 0.02, location: "Prague, Czech Republic" },
  { title: "europe-west28", latitude: 55.6761, longitude: 12.5683, level: "low", rate: 0.01, location: "Copenhagen, Denmark" },
  { title: "europe-west29", latitude: 59.4369, longitude: 24.7536, level: "low", rate: 0.005, location: "Tallinn, Estonia" },
  { title: "europe-west30", latitude: 60.1699, longitude: 24.9384, level: "low", rate: 0.003, location: "Helsinki, Finland" },
  { title: "europe-west31", latitude: 48.8566, longitude: 2.3522, level: "low", rate: 0.001, location: "Paris, France" },
  { title: "europe-west32", latitude: 52.5200, longitude: 13.4050, level: "low", rate: 0.0005, location: "Berlin, Germany" },
  { title: "europe-west33", latitude: 37.9838, longitude: 23.7275, level: "low", rate: 0.0001, location: "Athens, Greece" },
];

// Custom Tooltip Component
const CustomTooltip = ({ data, x, y, visible }: { data: RegionData | null, x: number, y: number, visible: boolean }) => {
  if (!visible || !data) return null;

  const levelColors = {
    high: "#ff0000",
    moderate: "#ff8c00", 
    low: "#00ff00"
  };

  const bgColors = {
    high: "rgba(255, 0, 0, 0.2)",
    moderate: "rgba(255, 140, 0, 0.2)",
    low: "rgba(0, 255, 0, 0.2)"
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
          Region: {data.title}
        </span>
      </div>
      
      <div style={{ color: "#e0e0e0" }}>
        <div><strong>Location:</strong> {data.location}</div>
        <div><strong>Interrupted nodes:</strong> {data.rate}%</div>
        <div><strong>Availability zones:</strong> 3</div>
        
        <div style={{ marginTop: "8px", fontSize: "11px", color: "#ccc" }}>
          <div style={{ marginBottom: "2px" }}>Availability Zone rates:</div>
          <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#333", padding: "4px 8px", marginBottom: "2px" }}>
            <span>AZ</span>
            <span>Interrupted nodes</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#2a2a2a", padding: "4px 8px", marginBottom: "1px" }}>
            <span>{data.title}-c</span>
            <span>{(data.rate * 2.8).toFixed(2)}%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#2a2a2a", padding: "4px 8px", marginBottom: "1px" }}>
            <span>{data.title}-b</span>
            <span>{(data.rate * 1.4).toFixed(2)}%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#2a2a2a", padding: "4px 8px" }}>
            <span>{data.title}-a</span>
            <span>{(data.rate * 1.2).toFixed(2)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WorldMap() {
  const [selectedRegion, setSelectedRegion] = useState(regions[13]); // europe-north1
  const [tooltipData, setTooltipData] = useState<TooltipData>({
    title: "",
    level: "",
    rate: 0,
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

    for (const region of regions) {
      pointSeries.data.push({
        geometry: { type: "Point", coordinates: [region.longitude, region.latitude] },
        title: region.title,
        level: region.level,
        rate: region.rate,
        location: region.location,
        color: region.level === "high" ? am5.color(0xff0000) : 
               region.level === "moderate" ? am5.color(0xff8c00) : 
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
          const data = dataItem.dataContext as RegionData;
          
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
  }, [selectedRegion, setTooltipData]);

  // Calculate statistics
  const totalRegions = regions.length;
  const highRegions = regions.filter(r => r.level === "high").length;
  const moderateRegions = regions.filter(r => r.level === "moderate").length;
  const lowRegions = regions.filter(r => r.level === "low").length;
  
  const avgRate = regions.reduce((sum, r) => sum + r.rate, 0) / totalRegions;

  return (
    <div style={{ 
      width: "100%", 
      height: "100vh", 
      backgroundColor: "#1a1a1a",
      position: "relative",
      display: "flex"
    }}>
      {/* Top Left Panel - Avg. Spot interruption rate */}
      <div style={{
        position: "absolute",
        left: "20px",
        top: "20px",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        padding: "20px",
        color: "white",
        minWidth: "300px",
        backdropFilter: "blur(10px)"
      }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "normal" }}>
          Avg. Spot interruption rate
        </h3>
        <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "15px" }}>
          {avgRate.toFixed(4)}%
        </div>
        <div style={{ fontSize: "14px" }}>
          <div style={{ color: "#ff0000" }}>europe-west4: 19.917%</div>
          <div style={{ color: "#ff0000" }}>asia-northeast1: 15.094%</div>
          <div style={{ color: "#ff0000" }}>us-west1: 7.632%</div>
        </div>
      </div>

      {/* Bottom Left Panel - Total regions */}
      <div style={{
        position: "absolute",
        left: "20px",
        bottom: "20px",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        padding: "20px",
        color: "white",
        minWidth: "300px",
        backdropFilter: "blur(10px)"
      }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "normal" }}>
          Total regions
        </h3>
        <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "15px" }}>
          {totalRegions}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              width: "20px", 
              height: "8px", 
              backgroundColor: "#00ff00", 
              borderRadius: "4px" 
            }}></div>
            <span style={{ color: "#00ff00" }}>Low interruptions: {lowRegions} ({(lowRegions/totalRegions*100).toFixed(2)}%)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              width: "20px", 
              height: "8px", 
              backgroundColor: "#ff8c00", 
              borderRadius: "4px" 
            }}></div>
            <span style={{ color: "#ff8c00" }}>Moderate interruptions: {moderateRegions} ({(moderateRegions/totalRegions*100).toFixed(2)}%)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ 
              width: "20px", 
              height: "8px", 
              backgroundColor: "#ff0000", 
              borderRadius: "4px" 
            }}></div>
            <span style={{ color: "#ff0000" }}>High interruptions: {highRegions} ({(highRegions/totalRegions*100).toFixed(2)}%)</span>
          </div>
        </div>
      </div>

      {/* Top Right Panel - Region Detail */}
      <div style={{
        position: "absolute",
        right: "20px",
        top: "20px",
        zIndex: 1000,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "10px",
        padding: "20px",
        color: "white",
        minWidth: "300px",
        backdropFilter: "blur(10px)"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px", 
          marginBottom: "15px",
          padding: "8px 12px",
          borderRadius: "6px",
          backgroundColor: selectedRegion.level === "high" ? "rgba(255, 0, 0, 0.2)" : 
                         selectedRegion.level === "moderate" ? "rgba(255, 140, 0, 0.2)" : 
                         "rgba(0, 255, 0, 0.2)"
        }}>
          <div style={{ 
            width: "12px", 
            height: "12px", 
            borderRadius: "50%",
            backgroundColor: selectedRegion.level === "high" ? "#ff0000" : 
                           selectedRegion.level === "moderate" ? "#ff8c00" : "#00ff00"
          }}></div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "normal" }}>
            Region: {selectedRegion.title}
          </h3>
        </div>
        <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
          <div><strong>Location:</strong> {selectedRegion.location}</div>
          <div><strong>Interrupted nodes:</strong> {selectedRegion.rate}%</div>
          <div><strong>Availability zones:</strong> 3</div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ fontSize: "12px", color: "#ccc", marginBottom: "5px" }}>Availability Zone rates:</div>
            <div style={{ fontSize: "12px" }}>{selectedRegion.title}-c: {(selectedRegion.rate * 2.8).toFixed(2)}%</div>
            <div style={{ fontSize: "12px" }}>{selectedRegion.title}-b: {(selectedRegion.rate * 1.4).toFixed(2)}%</div>
            <div style={{ fontSize: "12px" }}>{selectedRegion.title}-a: {(selectedRegion.rate * 1.2).toFixed(2)}%</div>
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

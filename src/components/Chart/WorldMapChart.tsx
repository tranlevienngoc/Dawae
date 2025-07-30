import { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { warriors, WarriorData } from "../../constants/warriors";
import { TooltipData } from "../../hooks/useTooltip";
import CustomTooltip from "./CustomTooltip";

// interface WorldMapChartProps {
//     onTooltipShow?: (data: WarriorData, x: number, y: number) => void;
//     onTooltipHide?: () => void;
// }

const WorldMapChart = () => {
    console.log("WorldMapChart");
    const [tooltipData, setTooltipData] = useState<TooltipData>({
        title: "",
        level: "",
        count: 0,
        location: "",
        latitude: 0,
        longitude: 0,
        x: 0,
        y: 0,
        visible: false,
    });

    const showTooltip = (data: WarriorData, x: number, y: number) => {
        setTooltipData({
            ...data,
            x,
            y,
            visible: true,
        });
    };

    const hideTooltip = () => {
        setTooltipData((prev) => ({ ...prev, visible: false }));
    };

    useEffect(() => {
        const root = am5.Root.new("chartdiv");

        root.setThemes([am5themes_Animated.new(root)]);

        const chart = root.container.children.push(
            am5map.MapChart.new(root, {
                panX: "translateX",
                panY: "translateY",
                projection: am5map.geoMercator(),
                homeGeoPoint: { longitude: 0, latitude: 0 },
                maxPanOut: 0.1,
            })
        );

        // Disable zoom controls
        chart.set("zoomControl", undefined);

        const polygonSeries = chart.series.push(
            am5map.MapPolygonSeries.new(root, {
                geoJSON: am5geodata_worldLow,
                exclude: ["AQ"],
            })
        );

        polygonSeries.mapPolygons.template.setAll({
            fill: am5.color(0x303037),
            stroke: am5.color(0x0e0f13),
            strokeWidth: 0.5,
        });

        const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

        for (const warrior of warriors) {
            pointSeries.data.push({
                geometry: { type: "Point", coordinates: [warrior.longitude, warrior.latitude] },
                title: warrior.title,
                level: warrior.level,
                count: warrior.count,
                location: warrior.location,
                color:
                    warrior.level === "new"
                        ? am5.color(0xe12c4e)
                        : warrior.level === "seeking"
                        ? am5.color(0xff9840)
                        : am5.color(0x26bb73),
            });
        }

        // Custom bullets with hover tooltip
        pointSeries.bullets.push(function () {
            const container = am5.Container.new(root, { cursorOverStyle: "pointer" });

            // Get color from data
            const bulletColor = am5.color(0xff8c00);

            // Create outer glow circle
            const outerCircle = container.children.push(
                am5.Circle.new(root, {
                    radius: 26,
                    fillOpacity: 0.2,
                    tooltipY: 0,
                    fill: bulletColor,
                })
            );

            // Create middle circle
            const middleCircle = container.children.push(
                am5.Circle.new(root, {
                    radius: 15,
                    fillOpacity: 0.3,
                    tooltipY: 0,
                    fill: bulletColor,
                    stroke: bulletColor,
                    strokeWidth: 1,
                })
            );

            // Create inner circle
            const innerCircle = container.children.push(
                am5.Circle.new(root, {
                    radius: 8,
                    tooltipY: 0,
                    fill: bulletColor,
                    strokeWidth: 1,
                })
            );

            // Set colors from data
            container.children.each((child, index) => {
                child.adapters.add("fill" as keyof am5.ISpriteSettings, function (fill, target) {
                    const dataItem = target.dataItem;
                    if (dataItem && dataItem.dataContext) {
                        const data = dataItem.dataContext as WarriorData & { color: am5.Color };
                        return data.color || fill;
                    }
                    return fill;
                });

                // Add stroke adapter only for middle circle (index 1)
                if (index === 1) {
                    child.adapters.add("stroke" as keyof am5.ISpriteSettings, function (stroke, target) {
                        const dataItem = target.dataItem;
                        if (dataItem && dataItem.dataContext) {
                            const data = dataItem.dataContext as WarriorData & { color: am5.Color };
                            return data.color || stroke;
                        }
                        return stroke;
                    });
                }
            });

            // Add hover effects
            container.events.on("pointerover", function (ev) {
                const dataItem = ev.target.dataItem;
                if (dataItem && dataItem.dataContext) {
                    const data = dataItem.dataContext as WarriorData;

                    // Increase opacity on hover
                    outerCircle.set("fillOpacity", 0.4);
                    middleCircle.set("fillOpacity", 0.6);
                    innerCircle.set("fillOpacity", 1);

                    // Add stroke to outer circle on hover
                    const dataWithColor = dataItem.dataContext as WarriorData & { color: am5.Color };
                    outerCircle.set("stroke", dataWithColor.color || am5.color(0xff8c00));
                    outerCircle.set("strokeWidth", 1);

                    showTooltip(data, ev.originalEvent.clientX, ev.originalEvent.clientY);
                }
            });

            container.events.on("pointerout", function () {
                // Reset opacity
                outerCircle.set("fillOpacity", 0.2);
                middleCircle.set("fillOpacity", 0.3);
                innerCircle.set("fillOpacity", 1);

                // Remove stroke from outer circle
                outerCircle.set("stroke", undefined);
                outerCircle.set("strokeWidth", 0);

                hideTooltip();
            });

            return am5.Bullet.new(root, {
                sprite: container,
            });
        });

        chart.appear(1000, 100);

        return () => root.dispose();
    }, []);

    return (
        <>
            <div
                id="chartdiv"
                className="mobile-map-container"
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#0e0f13",
                }}
            />
            <CustomTooltip
                data={tooltipData.visible ? tooltipData : null}
                x={tooltipData.x}
                y={tooltipData.y}
                visible={tooltipData.visible}
            />
        </>
    );
};

export default WorldMapChart;

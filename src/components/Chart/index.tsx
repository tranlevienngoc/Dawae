"use client";

import { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import Image from "next/image";
import AiOutlineMenu from "../svg/AiOutlineMenu";
import ReactCountryFlag from "react-country-flag";
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
    {
        title: "Uganda Tribe Alpha",
        latitude: 1.3733,
        longitude: 32.2903,
        level: "steady",
        count: 8,
        location: "Kampala, Uganda",
    },
    {
        title: "Kenya Warriors",
        latitude: -1.2921,
        longitude: 36.8219,
        level: "steady",
        count: 6,
        location: "Nairobi, Kenya",
    },
    {
        title: "Tanzania Knuckles",
        latitude: -6.7924,
        longitude: 39.2083,
        level: "steady",
        count: 5,
        location: "Dar es Salaam, Tanzania",
    },
    {
        title: "Nigeria Dawae",
        latitude: 9.0765,
        longitude: 7.3986,
        level: "steady",
        count: 7,
        location: "Abuja, Nigeria",
    },
    {
        title: "Ghana Warriors",
        latitude: 5.6037,
        longitude: -0.187,
        level: "steady",
        count: 4,
        location: "Accra, Ghana",
    },
    {
        title: "South Africa Tribe",
        latitude: -25.7479,
        longitude: 28.2293,
        level: "steady",
        count: 3,
        location: "Pretoria, South Africa",
    },
    {
        title: "Morocco Knuckles",
        latitude: 33.9716,
        longitude: -6.8498,
        level: "steady",
        count: 2,
        location: "Rabat, Morocco",
    },
    {
        title: "Ethiopia Warriors",
        latitude: 9.145,
        longitude: 40.4897,
        level: "steady",
        count: 4,
        location: "Addis Ababa, Ethiopia",
    },
    {
        title: "Cameroon Dawae",
        latitude: 3.848,
        longitude: 11.5021,
        level: "steady",
        count: 3,
        location: "Yaoundé, Cameroon",
    },
    {
        title: "Senegal Tribe",
        latitude: 14.7167,
        longitude: -17.4677,
        level: "steady",
        count: 2,
        location: "Dakar, Senegal",
    },
    {
        title: "Congo Warriors",
        latitude: -4.2634,
        longitude: 15.2429,
        level: "steady",
        count: 5,
        location: "Kinshasa, DRC",
    },
    {
        title: "Madagascar Knuckles",
        latitude: -18.8792,
        longitude: 47.5079,
        level: "steady",
        count: 3,
        location: "Antananarivo, Madagascar",
    },

    // Seeking Wae Warriors (Orange) - 16 warriors (35.1%)
    {
        title: "London Seekers",
        latitude: 51.5074,
        longitude: -0.1278,
        level: "seeking",
        count: 4,
        location: "London, UK",
    },
    {
        title: "Paris Dawae",
        latitude: 48.8566,
        longitude: 2.3522,
        level: "seeking",
        count: 3,
        location: "Paris, France",
    },
    {
        title: "Warsaw Tribe",
        latitude: 52.2297,
        longitude: 21.0122,
        level: "seeking",
        count: 4,
        location: "Warsaw, Poland",
    },
    {
        title: "Budapest Dawae",
        latitude: 47.4979,
        longitude: 19.0402,
        level: "seeking",
        count: 2,
        location: "Budapest, Hungary",
    },
    {
        title: "Bucharest Seekers",
        latitude: 44.4268,
        longitude: 26.1025,
        level: "seeking",
        count: 3,
        location: "Bucharest, Romania",
    },
    {
        title: "Helsinki Warriors",
        latitude: 60.1699,
        longitude: 24.9384,
        level: "seeking",
        count: 2,
        location: "Helsinki, Finland",
    },
    {
        title: "Oslo Knuckles",
        latitude: 59.9139,
        longitude: 10.7522,
        level: "seeking",
        count: 3,
        location: "Oslo, Norway",
    },
    {
        title: "Zurich Tribe",
        latitude: 46.9481,
        longitude: 7.4474,
        level: "seeking",
        count: 2,
        location: "Zurich, Switzerland",
    },

    // New Wae Warriors (Red/Pink) - 14 warriors (33.3%)
    {
        title: "Tokyo New Dawae",
        latitude: 35.6762,
        longitude: 139.6503,
        level: "new",
        count: 6,
        location: "Tokyo, Japan",
    },
    {
        title: "Seoul Warriors",
        latitude: 37.5665,
        longitude: 126.978,
        level: "new",
        count: 5,
        location: "Seoul, South Korea",
    },
    {
        title: "Sydney Dawae",
        latitude: -33.8688,
        longitude: 151.2093,
        level: "new",
        count: 3,
        location: "Sydney, Australia",
    },
    {
        title: "Singapore Warriors",
        latitude: 1.3521,
        longitude: 103.8198,
        level: "new",
        count: 4,
        location: "Singapore",
    },
    {
        title: "Bangkok Seekers",
        latitude: 13.7563,
        longitude: 100.5018,
        level: "new",
        count: 3,
        location: "Bangkok, Thailand",
    },
    {
        title: "Ho Chi Minh Tribe",
        latitude: 10.8231,
        longitude: 106.6297,
        level: "new",
        count: 3,
        location: "Ho Chi Minh City, Vietnam",
    },
    {
        title: "Kuala Lumpur Dawae",
        latitude: 3.139,
        longitude: 101.6869,
        level: "new",
        count: 2,
        location: "Kuala Lumpur, Malaysia",
    },
    {
        title: "New York Seekers",
        latitude: 40.7128,
        longitude: -74.006,
        level: "new",
        count: 8,
        location: "New York, USA",
    },
    {
        title: "Los Angeles Warriors",
        latitude: 34.0522,
        longitude: -118.2437,
        level: "new",
        count: 6,
        location: "Los Angeles, USA",
    },
    {
        title: "São Paulo Knuckles",
        latitude: -23.5505,
        longitude: -46.6333,
        level: "new",
        count: 4,
        location: "São Paulo, Brazil",
    },
];

// Custom Tooltip Component
const CustomTooltip = ({
    data,
    x,
    y,
    visible,
}: {
    data: WarriorData | null;
    x: number;
    y: number;
    visible: boolean;
}) => {
    if (!visible || !data) return null;

    const levelColors = {
        steady: "#26bb73",
        seeking: "#ff9840",
        new: "#e12c4e",
    };

    // Generate availability zones data
    const availabilityZones = [
        { az: `${data.title.toLowerCase().replace(/\s+/g, "")}-a`, interrupted: `${(Math.random() * 2).toFixed(2)}%` },
        {
            az: `${data.title.toLowerCase().replace(/\s+/g, "")}-b`,
            interrupted: `${(Math.random() * 1.5).toFixed(2)}%`,
        },
        { az: `${data.title.toLowerCase().replace(/\s+/g, "")}-c`, interrupted: `${(Math.random() * 1).toFixed(2)}%` },
    ];

    const totalInterrupted = availabilityZones.reduce((sum, az) => sum + parseFloat(az.interrupted), 0);

    return (
        <div
            style={{
                position: "fixed",
                left: x + 15,
                top: y - 10,
                zIndex: 10000,
                backgroundColor: "#161618",
                border: "1px solid #444",
                borderRadius: "8px",
                minWidth: "220px",
                color: "white",
                padding: "10px",
                fontSize: "12px",
                lineHeight: "1.5",
                backdropFilter: "blur(10px)",
                pointerEvents: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            }}
        >
            {/* Header Section */}
            <div
                style={{
                    padding: "5px",
                    backgroundColor: levelColors[data.level as keyof typeof levelColors],
                    borderRadius: "5px",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "13px",
                    textAlign: "center",
                }}
            >
                Region: {data.title.toLowerCase().replace(/\s+/g, "-")}
            </div>

            {/* Summary Information Section */}
            <div style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#ccc", fontSize: "11px" }}>Location:</span>
                    <span style={{ color: "white", fontSize: "11px" }}>{data.location}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ color: "#ccc", fontSize: "11px" }}>Interrupted nodes:</span>
                    <span style={{ color: "white", fontSize: "11px" }}>{totalInterrupted.toFixed(2)}%</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#ccc", fontSize: "11px" }}>Availability zones:</span>
                    <span style={{ color: "white", fontSize: "11px" }}>{availabilityZones.length}</span>
                </div>
            </div>

            {/* Detailed Table Section */}
            <div style={{ marginTop: "15px" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "11px",
                    }}
                >
                    <thead>
                        <tr
                            style={{
                                backgroundColor: "#303037",
                                border: "1px solid #303037",
                                padding: "5px",
                            }}
                        >
                            <th
                                style={{
                                    color: "#828a9b",
                                    fontWeight: "600",
                                    textAlign: "left",
                                    padding: "5px",
                                    borderBottom: "1px solid #303037",
                                }}
                            >
                                AZ
                            </th>
                            <th
                                style={{
                                    color: "#828a9b",
                                    fontWeight: "600",
                                    textAlign: "right",
                                    padding: "5px",
                                    borderBottom: "1px solid #303037",
                                }}
                            >
                                Interrupted nodes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {availabilityZones.map((az, index) => (
                            <tr
                                key={index}
                                style={{
                                    borderBottom: "1px solid #303037",
                                    borderLeft: "1px solid #303037",
                                    borderRight: "1px solid #303037",
                                }}
                            >
                                <td
                                    style={{
                                        color: "white",
                                        padding: "5px",
                                        borderLeft: "1px solid #303037",
                                    }}
                                >
                                    {az.az}
                                </td>
                                <td
                                    style={{
                                        color: "white",
                                        textAlign: "right",
                                        padding: "5px",
                                        borderRight: "1px solid #303037",
                                    }}
                                >
                                    {az.interrupted}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function WorldMap() {
    const [selectedWarrior] = useState(warriors[0]); // Uganda Tribe Alpha
    const [tooltipData, setTooltipData] = useState<TooltipData>({
        title: "",
        level: "",
        count: 0,
        location: "",
        x: 0,
        y: 0,
        visible: false,
    });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        // chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
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
                    // stroke: am5.color(0xffffff),
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

                    setTooltipData({
                        ...data,
                        x: ev.originalEvent.clientX,
                        y: ev.originalEvent.clientY,
                        visible: true,
                    });
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

                setTooltipData((prev) => ({ ...prev, visible: false }));
            });

            return am5.Bullet.new(root, {
                sprite: container,
            });
        });

        chart.appear(1000, 100);

        return () => root.dispose();
    }, [selectedWarrior, setTooltipData]);

    // Calculate statistics
    const totalWarriors = warriors.length;
    const steadyWarriors = warriors.filter((w) => w.level === "steady").length;
    const seekingWarriors = warriors.filter((w) => w.level === "seeking").length;
    const newWarriors = warriors.filter((w) => w.level === "new").length;

    const totalCount = warriors.reduce((sum, w) => sum + w.count, 0);

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#0e0f13",
                position: "relative",
            }}
        >
            {/* Header */}
            <header
                style={{
                    backgroundColor: "white",
                    padding: "15px",
                    color: "#333",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontWeight: "bold",
                                fontSize: "18px",
                            }}
                        >
                            <Image src="/logo.png" alt="Login" width={100} height={20} />
                        </div>
                        <div className="header-nav-links-container">
                            <nav className="header-nav-links">
                                <span style={{ cursor: "pointer" }}>Dawae Tribe</span>
                                <span style={{ cursor: "pointer" }}>Dawae Charity</span>
                                <span style={{ cursor: "pointer" }}>Dawae Click</span>
                                <span style={{ cursor: "pointer" }}>Dawae Coin</span>
                                <span style={{ cursor: "pointer" }}>Community</span>
                            </nav>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    fontSize: "14px",
                                    alignItems: "center",
                                    marginLeft: "auto",
                                }}
                            >
                                <button
                                    style={{
                                        backgroundColor: "white",
                                        color: "black",
                                        border: "1px solid #e1e4ea",
                                        padding: "5px 15px",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Sign in
                                </button>
                                <button
                                    style={{
                                        backgroundColor: "rgb(14, 15, 19)",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 15px",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Join the tribe
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="header-hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {!isMenuOpen ? (
                            <AiOutlineMenu />
                        ) : (
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "white",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    padding: "0",
                                    marginRight: "2px",
                                    zIndex: 10002,
                                    position: "relative",
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div style={{ backgroundColor: "#0e0f13" }}>
                {/* Title and Description */}
                <div className="title-dawae-container">
                    <h1 className="title-dawae">The Ugandan Knuckles Empire</h1>
                    <div className="title-dawae-description-container">
                        <p className="title-dawae-description">
                            Our sacred mission is to revive the spirit of Ugandan Knuckles, to make da tribe great
                            again! Dis house unites bruddahs globally, tappin&apos; to honor Da Queen and prove Da Wae
                            lives eternal. Join us, spit on da doubters, and let&apos;s show da world da Ugandan
                            Knuckles tribe never fades.
                        </p>
                    </div>
                </div>

                {/* Top Right Panel - Total Dawae Warriors */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "600px",
                        position: "relative",
                    }}
                >
                    {/* Map Container */}
                    <div
                        id="chartdiv"
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#0e0f13",
                        }}
                    ></div>

                    <div
                        
                        className="total-dawae-warriors-box"
                    >
                        <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "normal", color: "#646974" }}>
                            Total Dawae Warriors
                        </h3>
                        <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "15px" }}>{totalCount}</div>

                        {/* Progress Bar */}
                        <div
                            style={{
                                width: "100%",
                                height: "8px",
                                backgroundColor: "#333",
                                borderRadius: "4px",
                                marginBottom: "15px",
                                display: "flex",
                                gap: "5px",
                            }}
                        >
                            <div
                                style={{
                                    width: `${(steadyWarriors / totalWarriors) * 100}%`,
                                    height: "100%",
                                    backgroundColor: "#26bb73",
                                    borderRadius: "4px 0 0 4px",
                                }}
                            ></div>
                            <div
                                style={{
                                    width: `${(seekingWarriors / totalWarriors) * 100}%`,
                                    height: "100%",
                                    backgroundColor: "#ff9840",
                                }}
                            ></div>
                            <div
                                style={{
                                    width: `${(newWarriors / totalWarriors) * 100}%`,
                                    height: "100%",
                                    backgroundColor: "#e12c4e",
                                    borderRadius: "0 4px 4px 0",
                                }}
                            ></div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderBottom: "1px solid #48484d",
                                    padding: "10px 0px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "25px",
                                        height: "5px",
                                        backgroundColor: "#26bb73",
                                        borderRadius: "4px",
                                    }}
                                ></div>
                                <span style={{ color: "white", marginLeft: "10px" }}>Steady Wae Warriors</span>
                                <span style={{ color: "white", marginLeft: "10px" }}>{steadyWarriors}</span>
                                <span style={{ color: "#646974" }}>
                                    ({((steadyWarriors / totalWarriors) * 100).toFixed(1)}%)
                                </span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    borderBottom: "1px solid #48484d",
                                    padding: "10px 0px",
                                }}
                            >
                                <div
                                    style={{
                                        width: "25px",
                                        height: "5px",
                                        backgroundColor: "#ff9840",
                                        borderRadius: "4px",
                                    }}
                                ></div>
                                <span style={{ color: "white", marginLeft: "10px" }}>Seeking Wae Warriors</span>
                                <span style={{ color: "white", marginLeft: "10px" }}>{seekingWarriors}</span>
                                <span style={{ color: "#646974" }}>
                                    ({((seekingWarriors / totalWarriors) * 100).toFixed(1)}%)
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <div
                                    style={{
                                        width: "25px",
                                        height: "5px",
                                        backgroundColor: "#e12c4e",
                                        borderRadius: "4px",
                                    }}
                                ></div>
                                <span style={{ color: "white", marginLeft: "10px" }}>New Wae Warriors</span>
                                <span style={{ color: "white", marginLeft: "10px" }}>{newWarriors}</span>
                                <span style={{ color: "#646974" }}>
                                    ({((newWarriors / totalWarriors) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Unites Bruddahs Globally Section */}
            <div
                style={{
                    backgroundColor: "white",
                    padding: "40px 20px 80px 20px",
                    color: "#333",
                }}
            >
                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto",
                        textAlign: "center",
                    }}
                >
                    <h2 className="unites-bruddahs-globally-title">Unites Bruddahs Globally</h2>
                    <p className="unites-bruddahs-globally-description">
                        Join us, spit on da doubters, and let&apos;s show da world da Knuckles tribe never fades
                    </p>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                            gap: "40px",
                            marginTop: "40px",
                        }}
                    >
                        {/* Dawae Tribe Cards */}
                        {[
                            {
                                flag: "🇺🇸",
                                countryCode: "US",
                                title: "Dawae Tribe USA",
                                description:
                                    "Connect and optimize Kubernetes workloads running in Microsoft Azure environments.",
                                button: "Join",
                            },
                            {
                                flag: "🇨🇳",
                                countryCode: "CN",
                                title: "Dawae Tribe China",
                                description: "Optimize your private Kubernetes Service cluster using automation.",
                                button: "Join",
                            },
                            {
                                flag: "🇮🇳",
                                countryCode: "IN",
                                title: "Dawae Tribe India",
                                description: "Optimize your Google Kubernetes Engine cluster using automation.",
                                button: "Join",
                            },
                            {
                                flag: "🇻🇳",
                                countryCode: "VN",
                                title: "Dawae Tribe Vietnam",
                                description: "Optimize your Kubernetes clusters with workload auto-scaling.",
                                button: "Join",
                            },
                            {
                                flag: "🇰🇷",
                                countryCode: "KR",
                                title: "Dawae Tribe Korea",
                                description:
                                    "Visualize Cost AI metrics in Grafana dashboards alongside infrastructure data.",
                                button: "Join",
                            },
                            {
                                flag: "🇯🇵",
                                countryCode: "JP",
                                title: "Dawae Tribe Japan",
                                description:
                                    "Integrate with Terraform for infrastructure-as-Code-driven cluster onboarding.",
                                button: "Join",
                            },
                            {
                                flag: "🇦🇺",
                                countryCode: "AU",
                                title: "Dawae Tribe Australia",
                                description:
                                    "Infrastructure-as-Code framework for managing cloud resources using Kubernetes.",
                                button: "Join",
                            },
                            {
                                flag: "🇳🇬",
                                countryCode: "NG",
                                title: "Dawae Tribe Nigeria",
                                description:
                                    "Optimize query performance and caching with autonomous database optimization.",
                                button: "Join",
                            },
                            {
                                flag: "🇹🇭",
                                countryCode: "TH",
                                title: "Dawae Tribe Thailand",
                                description: "Ingest Prometheus metrics to inform workload optimization decisions.",
                                button: "Join",
                            },
                        ].map((tribe, index) => (
                            <div key={index} className="unites-bruddahs-globally-card">
                                <div className="unites-bruddahs-globally-card-header">
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <ReactCountryFlag
                                            countryCode={tribe.countryCode}
                                            svg
                                            className="flag-icon"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                            }}
                                        />
                                    </div>
                                    <button className="join-community-button">{tribe.button}</button>
                                </div>
                                <div className="unites-bruddahs-globally-card-body">
                                    <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>
                                            {tribe.title}
                                        </h3>
                                    <p className="unites-bruddahs-globally-card-description">{tribe.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer
                style={{
                    backgroundColor: "#0e0f13",
                    color: "white",
                    padding: "15px",
                    textAlign: "center",
                }}
            >
                <div className="footer-container">
                    <div style={{ color: "rgb(136, 146, 161)" }}>© 2025 CAST AI Group Inc.</div>
                    <div className="footer-links">
                        <span>Privacy policy</span>
                        <span>Terms of service</span>
                        <span>EU Projects</span>
                        <span>Information security policy</span>
                    </div>
                </div>
            </footer>

            {/* Custom Tooltip */}
            <CustomTooltip
                data={tooltipData.visible ? tooltipData : null}
                x={tooltipData.x}
                y={tooltipData.y}
                visible={tooltipData.visible}
            />

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            position: "fixed",
                            top: 60,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 1001,
                            display: "flex",
                            flexDirection: "column",
                            height: "400px",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "white",
                                flex: 1,
                                margin: "20px",
                                borderRadius: "12px",
                                padding: "20px",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                                {[
                                    { text: "Dawae Tribe", hasChevron: true },
                                    { text: "Dawae Charity", hasChevron: true },
                                    { text: "Dawae Click", hasChevron: true },
                                    { text: "Dawae Coin", hasChevron: true },
                                    { text: "Community", hasChevron: false },
                                ].map((item, index) => (
                                    <div key={index}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "15px 0",
                                                borderBottom: index < 4 ? "1px solid #e1e4ea" : "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <span style={{ color: "#333", fontSize: "16px" }}>{item.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    fontSize: "14px",
                                    alignItems: "center",
                                }}
                            >
                                <button
                                    style={{
                                        backgroundColor: "white",
                                        color: "black",
                                        border: "1px solid #e1e4ea",
                                        padding: "5px 15px",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Sign in
                                </button>
                                <button
                                    style={{
                                        backgroundColor: "rgb(14, 15, 19)",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 15px",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Join the tribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

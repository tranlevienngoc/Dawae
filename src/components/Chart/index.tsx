"use client";

import Header from "../Header";
import WorldMapChart from "./WorldMapChart";
import StatsPanel from "./StatsPanel";
// import CustomTooltip from "./CustomTooltip";
import TribesSection from "../TribesSection";
import Footer from "../Footer";
// import { useTooltip } from "../../hooks/useTooltip";
// import "../../styles/responsive.css";

export default function WorldMap() {
    // const { tooltipData, showTooltip, hideTooltip } = useTooltip();

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#0e0f13",
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div style={{ flex: 1, backgroundColor: "#0e0f13" }}>
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

                {/* Map Section */}
                <div className="map-section">
                    {/* World Map Chart */}
                    <WorldMapChart />

                    {/* Stats Panel */}
                    <StatsPanel />
                </div>
            </div>

            {/* Tribes Section */}
            <TribesSection />

            {/* Footer */}
            <Footer />

            {/* Custom Tooltip */}
        </div>
    );
}

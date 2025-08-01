import { WarriorData } from "../../constants/warriors";

interface CustomTooltipProps {
    data: WarriorData | null;
    x: number;
    y: number;
    visible: boolean;
}

const CustomTooltip = ({ data, x, y, visible }: CustomTooltipProps) => {
    if (!visible || !data) return null;

    // Calculate position to prevent tooltip from being cut off
    const tooltipWidth = 280; // maxWidth
    const tooltipHeight = 200; // estimated height
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    
    let tooltipX = x + 15;
    let tooltipY = y - 10;
    
    // Adjust horizontal position if tooltip would go off screen
    if (tooltipX + tooltipWidth > windowWidth - 20) {
        tooltipX = x - tooltipWidth - 15;
    }
    
    // Adjust vertical position if tooltip would go off screen
    if (tooltipY + tooltipHeight > windowHeight - 20) {
        tooltipY = y - tooltipHeight - 10;
    }
    
    // Ensure tooltip doesn't go above or left of screen
    tooltipX = Math.max(20, tooltipX);
    tooltipY = Math.max(20, tooltipY);

    const levelColors = {
        steady: "#26bb73",
        seeking: "#ff9840",
        new: "#e12c4e",
    };

    // Generate availability zones data
    const availabilityZones = [
        { az: `${data.title.toLowerCase().replace(/\s+/g, "")}-a`, interrupted: `${(Math.random() * 2).toFixed(2)}%` },
        { az: `${data.title.toLowerCase().replace(/\s+/g, "")}-b`, interrupted: `${(Math.random() * 1.5).toFixed(2)}%` },
        { az: `${data.title.toLowerCase().replace(/\s+/g, "")}-c`, interrupted: `${(Math.random() * 1).toFixed(2)}%` },
    ];

    const totalInterrupted = availabilityZones.reduce((sum, az) => sum + parseFloat(az.interrupted), 0);

    return (
        <div
            style={{
                position: "fixed",
                left: tooltipX,
                top: tooltipY,
                zIndex: 99999,
                backgroundColor: "#161618",
                border: "1px solid #444",
                borderRadius: "8px",
                minWidth: "220px",
                maxWidth: "280px",
                color: "white",
                padding: "10px",
                fontSize: "12px",
                lineHeight: "1.5",
                backdropFilter: "blur(10px)",
                pointerEvents: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                wordWrap: "break-word",
                overflowWrap: "break-word",
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

export default CustomTooltip; 
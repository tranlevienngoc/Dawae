import { warriors } from "../../constants/warriors";

const StatsPanel = () => {
    // Calculate statistics
    const totalWarriors = warriors.length;
    const steadyWarriors = warriors.filter((w) => w.level === "steady").length;
    const seekingWarriors = warriors.filter((w) => w.level === "seeking").length;
    const newWarriors = warriors.filter((w) => w.level === "new").length;
    const totalCount = warriors.reduce((sum, w) => sum + w.count, 0);

    return (
        <div className="total-dawae-warriors-box">
            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "normal", color: "#646974" }}>
                Total Dawae Warriors
            </h3>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "15px" }}>
                {totalCount}
            </div>

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
                            width: "20px",
                            height: "5px",
                            backgroundColor: "#26bb73",
                            borderRadius: "4px",
                        }}
                    ></div>
                    <span style={{ color: "white", margin: "0 10px", fontSize: "14px" }}>Steady Wae Warriors</span>
                    <span style={{ color: "white", marginLeft: "auto" }}>{steadyWarriors}</span>
                    <span style={{ color: "#646974", marginLeft: "5px" }}>
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
                            width: "20px",
                            height: "5px",
                            backgroundColor: "#ff9840",
                            borderRadius: "4px",
                        }}
                    ></div>
                    <span style={{ color: "white", margin: "0 10px", fontSize: "14px" }}>Seeking Wae Warriors</span>
                    <span style={{ color: "white", marginLeft: "auto" }}>{seekingWarriors}</span>
                    <span style={{ color: "#646974", marginLeft: "5px" }}>
                        ({((seekingWarriors / totalWarriors) * 100).toFixed(1)}%)
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 0px",
                    }}
                >
                    <div
                        style={{
                            width: "20px",
                            height: "5px",
                            backgroundColor: "#e12c4e",
                            borderRadius: "4px",
                        }}
                    ></div>
                    <span style={{ color: "white", margin: "0 10px", fontSize: "14px" }}>New Wae Warriors</span>
                    <span style={{ color: "white", marginLeft: "auto" }}>{newWarriors}</span>
                    <span style={{ color: "#646974", marginLeft: "5px" }}>
                        ({((newWarriors / totalWarriors) * 100).toFixed(1)}%)
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatsPanel; 
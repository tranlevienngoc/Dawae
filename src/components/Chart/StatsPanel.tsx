import { warriors } from "../../constants/warriors";
import LastUpdate from "../svg/LastUpdate";

const StatsPanel = () => {
    // Calculate statistics
    const stats = {
        total: warriors.length,
        steady: warriors.filter(w => w.level === "steady").length,
        seeking: warriors.filter(w => w.level === "seeking").length,
        new: warriors.filter(w => w.level === "new").length,
        totalCount: warriors.reduce((sum, w) => sum + w.count, 0)
    };

    const levelConfig = [
        { key: 'steady', color: '#26bb73', label: 'Steady Wae Warriors' },
        { key: 'seeking', color: '#ff9840', label: 'Seeking Wae Warriors' },
        { key: 'new', color: '#e12c4e', label: 'New Wae Warriors' }
    ];

    const styles = {
        container: { margin: "0 0 10px 0", fontSize: "16px", fontWeight: "normal", color: "#646974" },
        totalCount: { fontSize: "32px", fontWeight: "bold", marginBottom: "15px", display: "flex", alignItems: "center", justifyContent: "space-between" },
        progressBar: {
            width: "100%",
            height: "8px",
            backgroundColor: "#333",
            borderRadius: "4px",
            marginBottom: "15px",
            display: "flex",
            gap: "5px"
        },
        progressSegment: (color: string, isFirst = false, isLast = false) => ({
            height: "100%",
            backgroundColor: color,
            borderRadius: isFirst ? "4px 0 0 4px" : isLast ? "0 4px 4px 0" : "0"
        }),
        statRow: {
            display: "flex",
            alignItems: "center",
            padding: "10px 0px"
        },
        colorIndicator: {
            width: "20px",
            height: "5px",
            borderRadius: "4px"
        },
        statLabel: { color: "white", margin: "0 10px", fontSize: "14px" },
        statCount: { color: "white", marginLeft: "auto", fontSize: "14px" },
        statPercentage: { color: "#646974", marginLeft: "5px", fontSize: "14px" }
    };

    return (
        <div className="total-dawae-warriors-box">
            <h3 style={styles.container}>Total Dawae Warriors</h3>
            <div style={styles.totalCount}>
                <span style={{ fontSize: "32px", fontWeight: "bold" }}>{stats.totalCount}</span>
                <div style={{ fontSize: "14px", color: "#646974", display: "flex", alignItems: "center", justifyContent: "space-between", marginLeft: "30px" }}>
                    <LastUpdate />
                    <span style={{ marginLeft: "5px" }}>
                        Last update: 5 minutes ago
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={styles.progressBar}>
                {levelConfig.map((level, index) => (
                    <div
                        key={level.key}
                        style={{
                            ...styles.progressSegment(level.color, index === 0, index === levelConfig.length - 1),
                            width: `${(stats[level.key as keyof typeof stats] / stats.total) * 100}%`
                        }}
                    />
                ))}
            </div>

            {/* Stats List */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                {levelConfig.map((level, index) => (
                    <div
                        key={level.key}
                        style={{
                            ...styles.statRow,
                            padding: level.key === "new" ? "10px 0px 0px 0px" : "10px 0px 10px 0px",
                            borderBottom: index < levelConfig.length - 1 ? "1px solid #48484d" : "none"
                        }}
                    >
                        <div style={{ ...styles.colorIndicator, backgroundColor: level.color }} />
                        <span style={styles.statLabel}>{level.label}</span>
                        <span style={styles.statCount}>{stats[level.key as keyof typeof stats]}</span>
                        <span style={styles.statPercentage}>
                            ({((stats[level.key as keyof typeof stats] / stats.total) * 100).toFixed(1)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsPanel; 
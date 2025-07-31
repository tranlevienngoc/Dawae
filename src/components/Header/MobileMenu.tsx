interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu = ({ isOpen }: MobileMenuProps) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1001,
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
                    height: "375px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        flex: 1,
                        margin: "10px",
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
                        <button className="sign-in-button">Sign in</button>
                        <button className="join-the-tribe-button">Join the tribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu; 
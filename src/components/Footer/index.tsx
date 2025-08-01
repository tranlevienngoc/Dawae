import { menu } from "@/constants/menu";

const Footer = () => {
    return (
        <footer
            className="mobile-footer"
            style={{
                backgroundColor: "#0e0f13",
                color: "white",
                padding: "15px",
                textAlign: "center",
            }}
        >
            <div className="footer-container">
                <div style={{ color: "rgb(136, 146, 161)" }}>© 2025 Dawae Tribe.</div>
                <div className="footer-links">
                    {menu.map((item) => (
                        <span key={item.title} style={{ cursor: "pointer" }}>{item.title}</span>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer; 
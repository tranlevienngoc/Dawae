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
                    <span>Privacy policy</span>
                    <span>Terms of service</span>
                    <span>EU Projects</span>
                    <span>Information security policy</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 
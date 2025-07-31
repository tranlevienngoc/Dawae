import { useState } from "react";
import Image from "next/image";
import AiOutlineMenu from "../svg/AiOutlineMenu";
import MobileMenu from "./MobileMenu";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Header */}
            <header style={{ backgroundColor: "white", padding: "15px", color: "#333" }}>
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
                                marginRight: "25px",
                            }}
                        >
                            <Image src="/logo.png" alt="DAWAE Logo" width={130} height={25} />
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
                                <button className="sign-in-button">Sign in</button>
                                <button className="join-the-tribe-button">Join the tribe</button>
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

            {/* Mobile Menu */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Header; 
import { useAuth } from "@/context/AuthContect";
import Image from "next/image";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useState, useEffect, useRef } from "react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
    const { user } = useAuth();
    const { handleLoginTwitter, handleLogout } = useAuthActions();
    const [showSignOut, setShowSignOut] = useState(false);
    const avatarRef = useRef<HTMLDivElement>(null);

    const handleMobileLogin = () => {
        handleLoginTwitter();
        onClose(); // Close mobile menu after login attempt
    };

    const handleMobileLogout = () => {
        handleLogout();
        onClose(); // Close mobile menu after logout
    };

    const handleAvatarClick = () => {
        setShowSignOut(!showSignOut);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (showSignOut && avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
                setShowSignOut(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSignOut]);
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
                            marginTop: "20px",
                        }}
                    >
                        {!user?.id ? (
                            <button 
                                className="sign-in-button"
                                onClick={handleMobileLogin}
                            >
                                Sign in
                            </button>
                        ) : (
                            <div ref={avatarRef} style={{ position: "relative" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        cursor: "pointer",
                                    }}
                                    onClick={handleAvatarClick}
                                >
                                    <Image
                                        src={user?.avatar as string}
                                        alt="User Avatar"
                                        width={32}
                                        height={32}
                                        style={{ borderRadius: "50%" }}
                                    />
                                </div>
                                {showSignOut && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: 0,
                                            minWidth: "120px",
                                            backgroundColor: "white",
                                            border: "1px solid #e1e4ea",
                                            borderRadius: "8px",
                                            padding: "10px",
                                            marginTop: "5px",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                                            zIndex: 1000,
                                        }}
                                        onClick={handleMobileLogout}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            <Image
                                                src="/logoutIcon.svg"
                                                alt="Logout"
                                                width={16}
                                                height={16}
                                            />
                                            <span style={{ color: "#333", fontSize: "14px" }}>
                                                Sign Out
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        <button className="join-the-tribe-button">Join the tribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileMenu; 
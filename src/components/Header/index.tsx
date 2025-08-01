import { menu } from "@/constants/menu";
import Image from "next/image";
import { useState } from "react";
import AiOutlineMenu from "../svg/AiOutlineMenu";
import MobileMenu from "./MobileMenu";

import { getInfoTwitter, getMe } from "@/api/auth";
import { TYPE_STATUS_AUTH } from "@/constants";
import { useAuth } from "@/context/AuthContect";
import { toastError, toastSuccess } from "@/utils/toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { useAuthActions } from "@/hooks/useAuthActions";
import { MainNetworkAccess } from "@/access";
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
    }
}
const Header = () => {
    const router = useRouter();
    const avatarWrapperRef = useRef<HTMLDivElement>(null);

    const { data: session } = useSession();
    const { user, setUser, setIsLoadingUser } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isShowSignOut, setIsShowSignOut] = useState(false);
    const { handleLoginTwitter, handleLogout } = useAuthActions();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isShowSignOut && avatarWrapperRef.current && !avatarWrapperRef.current.contains(event.target as Node)) {
                setIsShowSignOut(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isShowSignOut]);

    useEffect(() => {
        async function fetchData() {
            const { oauth_token, oauth_verifier } = router.query;
            if (oauth_token && oauth_verifier) {
                try {
                    const infoTwitter = await getInfoTwitter({
                        oauthToken: oauth_token as string,
                        oauthVerifier: oauth_verifier as string,
                    });
                    if (infoTwitter) {
                        if (!user?.id) {
                            const countryCode = localStorage.getItem("country_code") || "VN";
                            const signInResponse = await signIn("credentials", {
                                redirect: false,
                                email: infoTwitter?.email,
                                user_name: infoTwitter?.screen_name,
                                name: infoTwitter?.name,
                                avatar: infoTwitter?.picture,
                                twitter_id: infoTwitter?.id,
                                country_code: countryCode,
                            });

                            if (signInResponse?.ok) {
                                localStorage.setItem("userTwitter", JSON.stringify(infoTwitter));
                                toastSuccess("Logged in successfully!");
                                router.push("/");
                                setIsLoadingUser(false);
                                return;
                            } else {
                                localStorage.removeItem("refCode");
                                return toastError("Login faild");
                            }
                        } else {
                            localStorage.setItem("userTwitter", JSON.stringify(infoTwitter));
                        }
                    }
                } catch (error) {
                    console.error("Failed to get info twitter:", error);
                }
            }
        }
        if (!user?.id) {
            fetchData();
        }
    }, [router, setIsLoadingUser, user, user?.id]);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getMe();

                if (user) {
                    setUser({
                        id: user.id,
                        //   email: user.email,
                        avatar: user.avatar,
                        user_name: user.user_name,
                        name: user.name,
                        country_code: user.country_code,
                        clicks: user.clicks,
                    });
                    setIsLoadingUser(false);
                }
            } catch (error) {
                console.error("Failed to get user:", error);
            }
        }

        if (status === TYPE_STATUS_AUTH.LOADING) {
            setIsLoadingUser(true);
        }

        if (session?.accessToken) {
            // Set authorization header for API calls
            MainNetworkAccess.defaultHeaders = {
                Authorization: `Bearer ${session.accessToken}`,
            };
            fetchData();
            setIsLoadingUser(true);
        }

        if (status === TYPE_STATUS_AUTH.UNAUTHENTICATED) {
            console.error("No access token available");
            setIsLoadingUser(false);
        }
    }, [session, session?.accessToken, setIsLoadingUser, setUser]);

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
                                {menu.map((item) => (
                                    <span key={item.title} style={{ cursor: "pointer" }}>
                                        {item.title}
                                    </span>
                                ))}
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
                                {!user?.id ? (
                                    <button
                                        className="sign-in-button"
                                        onClick={(e) => {
                                            handleLoginTwitter();
                                            e.stopPropagation();
                                        }}
                                    >
                                        Sign in
                                    </button>
                                ) : (
                                    <div
                                        ref={avatarWrapperRef}
                                        className="avatar-wrapper"
                                        onClick={(e) => {
                                            setIsShowSignOut(true);
                                            e.stopPropagation();
                                        }}
                                        style={{
                                            cursor: "pointer",
                                            marginRight: "10px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "relative",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    zIndex: 9999,
                                                }}
                                            >
                                                <Image
                                                    src={user?.avatar as string}
                                                    alt="Login"
                                                    width={42}
                                                    height={42}
                                                    style={{ borderRadius: "50%" }}
                                                />
                                            </div>
                                            {isShowSignOut && (
                                                <div
                                                    className="logout-button"
                                                    onClick={(e) => {
                                                        handleLogout();
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <Image
                                                        src="/logoutIcon.svg"
                                                        alt="Login"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    <span
                                                        style={{
                                                            fontSize: "16px",
                                                            fontWeight: "bold",
                                                            marginLeft: "10px",
                                                        }}
                                                    >
                                                        Sign Out
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
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

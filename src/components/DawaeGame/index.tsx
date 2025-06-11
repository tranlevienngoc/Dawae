"use client";

import { SoundcontrolContext } from "@/context/soundControl";
import useVisible from "@/hook/useVisible";
import { useRef, useState, useContext, useCallback, useEffect } from "react";
import SoundModal from "./SoundModal";
import InfoModal from "./InfoModal";
import ReactCountryFlag from "react-country-flag";
import { getLeaderboard, LeaderboardResponse } from "@/api/countries";
import { authorizationTwitter, getInfoTwitter, getMe } from "@/api/auth";
import axios from "axios";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toastError } from "@/utils/toast";
import { toastSuccess } from "@/utils/toast";
import { useAuth } from "@/context/AuthContect";
import { MainNetworkAccess } from "@/access";
import { TYPE_STATUS_AUTH } from "@/constants";
import Image from "next/image";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
    }
}

export default function DawaeGame() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardResponse[]>([]);
    const [score, setScore] = useState(0);
    const [sound, setSound] = useState("/Da_Wae_1.mp3");
    const [imageSrc, setImageSrc] = useState("/unmount.webp");

    const { muteAudio, toggleMuteAudio } = useContext(SoundcontrolContext);

    const modalSound = useVisible();
    const modalInfo = useVisible();
    const [isClicked, setIsClicked] = useState(false);
    const [worldWideScore, setWorldWideScore] = useState(0);
    const [isSvgClicked, setIsSvgClicked] = useState(false);
    const [userCountry, setUserCountry] = useState<{
        countryName: string;
        countryCode: string;
    }>({
        countryName: "Unknown",
        countryCode: "Unknown",
    });
    const [myScore, setMyScore] = useState(
        leaderboard.find((c) => c.code === userCountry.countryCode.toLocaleUpperCase())?.total_clicks || 0
    );

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scoreRef = useRef<HTMLParagraphElement | null>(null);
    const checkboxRef = useRef<HTMLInputElement>(null);

    const highestScoreCountry = () => {
        const maxScoreIndex = leaderboard.findIndex(
            (c) => c.total_clicks === Math.max(...leaderboard.map((c) => c.total_clicks))
        );
        return {
            ...leaderboard[maxScoreIndex],
            currentScore: leaderboard[maxScoreIndex]?.total_clicks,
        };
    };

    const [isOpenTable, setIsOpenTable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("https://api.ugandanknuckles.click/v1/cdn-cgi/trace");
                const data = await response.data;

                if (data.country_code) {
                    setUserCountry({
                        countryName: data.country_code,
                        countryCode: data.country_code,
                    });
                    if (data.country_code) {
                        localStorage.setItem("country_code", data.country_code.toLocaleUpperCase());
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        audioRef.current = new Audio(sound);
        audioRef.current.muted = muteAudio;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [muteAudio, sound]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onended = () => {
                if (isClicked && audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch((err) => {
                        console.error("Audio playback failed:", err);
                    });
                }
            };
        }
    }, [isClicked]);

    const handleClick = useCallback(() => {
        setScore((prev) => prev + 1);

        setLeaderboard((prev: LeaderboardResponse[]) => {
            const updated = [...prev];
            const countryIndex = updated.findIndex((c) => c.code === userCountry.countryCode);

            updated[countryIndex !== -1 ? countryIndex : 4] = {
                ...updated[countryIndex !== -1 ? countryIndex : 4],
                total_clicks: updated[countryIndex !== -1 ? countryIndex : 4].total_clicks + 1,
                pps: 0,
            };

            return updated;
        });

        const scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.classList.add("score-increase");
            setTimeout(() => {
                scoreElement.classList.remove("score-increase");
            }, 300);
        }

        if (scoreRef.current) {
            scoreRef.current.classList.add("score-increase");
            setTimeout(() => {
                if (scoreRef.current) {
                    scoreRef.current.classList.remove("score-increase");
                }
            }, 300);
        }

        setIsClicked(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setIsClicked(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        }, 1000);

        if (audioRef.current && audioRef.current.paused) {
            audioRef.current.play().catch((err) => {
                console.error("Audio playback failed:", err);
            });
        }

        setImageSrc("/mount.webp");
        setTimeout(() => {
            setImageSrc("/unmount.webp");
        }, 100);
    }, [userCountry.countryCode]);

    const handleSvgClick = () => {
        if (checkboxRef.current) {
            setIsSvgClicked(!isSvgClicked);
            checkboxRef.current.checked = !checkboxRef.current.checked;
            setIsOpenTable(!isOpenTable);
        }
    };

    const [clickCount, setClickCount] = useState(0);

    const router = useRouter();

    const { user, setUser, setIsLoadingUser, resetUser } = useAuth();
    console.log(user, 'user-------->');
    const { data: session } = useSession();

    useEffect(() => {
        const click = localStorage.getItem("click_count");
        if (click) {
            setClickCount(Number(JSON.parse(click)));
        } else {
            localStorage.setItem("click_count", JSON.stringify(0));
        }
    }, []);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const leaderboard = await getLeaderboard();
            if (leaderboard) {
                setLeaderboard(leaderboard);
            }
        };
        fetchLeaderboard();
    }, []);

    useEffect(() => {
        const intervals = setInterval(async () => {
            const leaderboardNew = await getLeaderboard();
            const newArray: LeaderboardResponse[] = [];
            if (leaderboardNew) {
                for (let i = 0; i < leaderboardNew.length; i++) {
                    const findCountry = leaderboard.find((c) => c.code === leaderboardNew[i].code);
                    if (findCountry) {
                        newArray.push({
                            code: leaderboardNew[i].code,
                            name: leaderboardNew[i].name,
                            total_clicks: leaderboardNew[i].total_clicks,
                            pps: leaderboardNew[i].total_clicks - findCountry.total_clicks,
                        });
                    }
                }
                setLeaderboard(newArray);
            }
        }, 5000);

        return () => {
            clearInterval(intervals);
        };
    }, [leaderboard]);

    useEffect(() => {
        if (leaderboard.length) {
            setWorldWideScore(leaderboard.reduce((a, b) => a + b.total_clicks, 0));
            setMyScore(
                leaderboard.find((c) => c.code === userCountry.countryCode.toLocaleUpperCase())?.total_clicks || 0
            );
        }
    }, [leaderboard, userCountry.countryCode]);

    useEffect(() => {
        const intervals = setInterval(async () => {
            if (score > 0) {
                try {
                    const response = await fetch("/api/click", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            countryCode: userCountry.countryCode,
                            clickCount: score,
                        }),
                    });

                    const result = await response.json();
                    if (result.success && result.data) {
                        setLeaderboard((prev: LeaderboardResponse[]) => {
                            const updated = [...prev];
                            const countryIndex = updated.findIndex((c) => c.code === userCountry.countryCode);
                            updated[countryIndex !== -1 ? countryIndex : 4] = {
                                ...updated[countryIndex !== -1 ? countryIndex : 4],
                                total_clicks: updated[countryIndex !== -1 ? countryIndex : 4].total_clicks,
                                pps: 0,
                            };
                            return updated;
                        });
                        setScore(0);
                        if (user?.id) {
                            // localStorage.setItem("click_count", JSON.stringify(Number(user?.clicks) + score));
                            setUser({
                                ...user,
                                clicks: Number(user?.clicks) + score,
                            });
                        } else {
                            localStorage.setItem("click_count", JSON.stringify(clickCount + score));
                            setClickCount(clickCount + score);
                        }
                    }
                } catch (error) {
                    console.error("Failed to click:", error);
                }
            }
        }, 5000);

        return () => {
            clearInterval(intervals);
        };
    }, [clickCount, score, setUser, user, userCountry.countryCode]);

    const handleLoginTwitter = useCallback(async () => {
        const url = await authorizationTwitter();
        if (url) {
            window.location.replace(url);
        }
    }, []);

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
                            const countryCode = localStorage.getItem("country_code") || 'VN';
                            const signInResponse = await signIn("credentials", {
                                redirect: false,
                                email: infoTwitter?.email,
                                user_name: infoTwitter?.screen_name,
                                avatar: infoTwitter?.picture,
                                twitter_id: infoTwitter?.id,
                                country_code: countryCode,
                            });
    
                            if (signInResponse?.ok) {
                                localStorage.setItem("userTwitter", JSON.stringify(infoTwitter));
                                toastSuccess("Logged in successfully!");
                                router.push('/');
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
    }, [router, setIsLoadingUser, user, user?.id, userCountry.countryCode]);

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
            MainNetworkAccess.defaultHeaders = {
                Authorization: `Bearer ${session?.accessToken}`,
            };
            fetchData();
            setIsLoadingUser(true);
        }

        if (status === TYPE_STATUS_AUTH.UNAUTHENTICATED) {
            console.error("No access token available");
            setIsLoadingUser(false);
        }
    }, [session?.accessToken, setIsLoadingUser, setUser]);


    const handleLogout = useCallback(() => {
        signOut({
          redirect: false,
        });
        MainNetworkAccess.defaultHeaders = {};
        resetUser();
    
        localStorage.removeItem('userTwitter');
        router.push('/');
      }, [resetUser, router]);

    return (
        <div className="container" onClick={handleClick} style={{ position: "relative" }}>
            <h1 className="logo">
                <span className="nitish">UGANDAN </span>
                <span className="k">K</span>
                <span className="pjt">NUCKLES</span>
            </h1>
            {!user?.id ? (
                <button
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        color: "#757575",
                        fontSize: "16px",
                        fontWeight: "bold",
                        background: "white",
                        border: "none",
                        borderRadius: "5px",
                        padding: "10px 20px",
                        cursor: "pointer",
                        zIndex: 9999,
                    }}
                    onClick={(e) => {
                        handleLoginTwitter();
                        e.stopPropagation();
                    }}
                >
                    Login with X
                </button>
            ) : (
                <div
                    style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 9999,
                    }}
                    onClick={(e) => {
                        handleLogout();
                        e.stopPropagation();
                    }}
                >
                    <Image
                        src={user?.avatar as string}
                        alt="Login"
                        width={100}
                        height={100}
                        style={{ borderRadius: "50%", zIndex: 9999 }}
                    />
                </div>
            )}
            {/* <p id={clickCount + score > 0 ? "score" : "score-hidden"}>{(clickCount + score).toLocaleString()}</p> */}
            <p id={(user?.id ? Number( user?.clicks) : clickCount) + score > 0 ? "score" : "score-hidden"}>{(user?.id ? Number( user?.clicks) : clickCount) + score > 0 ? (user?.id ? Number( user?.clicks) : clickCount) + score : 0}</p>
            <img
                src={imageSrc}
                alt="Dawae"
                className="img-actor"
                width={760}
                height={760}
                style={{ maxWidth: "760px", cursor: "pointer" }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
            />

            <div
                className="tabs"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSvgClick();
                }}
            >
                <div className="tab">
                    <div className="tab-header">
                        <div className="tab-label-left">
                            <div>🏆</div>
                            <div>
                                <span className="text-label">{highestScoreCountry().name} </span>
                                <span className="text-label">
                                    {Number(highestScoreCountry().currentScore).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="tab-label-right">
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                <ReactCountryFlag countryCode={userCountry.countryCode} svg className="flag-icon" />
                                <span style={{ fontSize: "16px" }} className="text-label">
                                    {myScore.toLocaleString()}
                                </span>
                            </div>

                            {isSvgClicked ? (
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    height="20px"
                                    width="20px"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSvgClick();
                                    }} //
                                >
                                    <path d="M256 217.9L383 345c9.4 9.4 24.6 9.4 33.9 0 9.4-9.4 9.3-24.6 0-34L273 167c-9.1-9.1-23.7-9.3-33.1-.7L95 310.9c-4.7 4.7-7 10.9-7 17s2.3 12.3 7 17c9.4 9.4 24.6 9.4 33.9 0l127.1-127z"></path>
                                </svg>
                            ) : (
                                <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    height="20px"
                                    width="20px"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSvgClick();
                                    }}
                                >
                                    <path d="M256 294.1L383 167c9.4-9.4 24.6-9.4 33.9 0s9.3 24.6 0 34L273 345c-9.1 9.1-23.7 9.3-33.1.7L95 201.1c-4.7-4.7-7-10.9-7-17s2.3-12.3 7-17c9.4-9.4 24.6-9.4 33.9 0l127.1 127z"></path>
                                </svg>
                            )}
                        </div>
                    </div>
                    <input type="checkbox" style={{ display: "none" }} id="chck1" ref={checkboxRef} />
                    {/* Add ref */}
                    <label className="tab-label" htmlFor="chck1"></label>
                    <div className="tab-content" style={{ overflowY: "auto" }}>
                        <table id="table">
                            <tbody>
                                <tr style={{ borderBottom: "1px solid #e3e2e2" }}>
                                    <td style={{ textAlign: "center" }}>🌏</td>
                                    <td>WorldWide</td>

                                    <td></td>
                                    <td>{worldWideScore.toLocaleString()}</td>
                                </tr>
                                {leaderboard.map((c, i) => (
                                    <tr
                                        key={c.code}
                                        style={{
                                            borderBottom: i != leaderboard.length - 1 ? "1px solid #e3e2e2" : "none",
                                        }}
                                    >
                                        <td className={i < 3 ? "rank" : "text"}>
                                            {i < 3 ? (i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉") : `${i + 1}`}
                                        </td>
                                        <td>
                                            <ReactCountryFlag className="flag-icon-table" countryCode={c.code} svg />
                                        </td>
                                        <td className={
                                            (c.code === userCountry.countryCode.toLowerCase() ? "user-country " : "") + "country-name"
                                        }>{c.name}</td>
                                        <td>
                                            {c.pps > 0 && (
                                                <span>
                                                    <span className="pps">{c.pps} PPS</span>{" "}
                                                </span>
                                            )}
                                            {c.total_clicks}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="container-icon">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        modalSound.show();
                    }}
                    className="sound-icon"
                >
                    <svg
                        stroke="#fff"
                        fill="#fff"
                        strokeWidth="0"
                        viewBox="0 0 512 512"
                        height="20px"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M499.1 6.3c8.1 6 12.9 15.6 12.9 25.7l0 72 0 264c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L448 147 192 223.8 192 432c0 44.2-43 80-96 80s-96-35.8-96-80s43-80 96-80c11.2 0 22 1.6 32 4.6L128 200l0-72c0-14.1 9.3-26.6 22.8-30.7l320-96c9.7-2.9 20.2-1.1 28.3 5z"></path>
                    </svg>
                </div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        modalInfo.show();
                    }}
                    className="info-icon"
                >
                    <svg width="14" height="23" viewBox="0 0 14 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.9365 8.67368C11.4709 9.22748 11.6659 10.0055 11.5741 10.7578C11.4409 11.8497 11.1258 12.8721 10.756 13.9028C10.3604 15.0056 9.95892 16.1062 9.55537 17.2061C8.90986 18.9661 8.25929 20.7241 7.62089 22.4867C7.46226 22.9245 7.34913 23.3919 7.30396 23.8544C7.25473 24.358 7.61695 24.6058 8.07174 24.3823C8.43599 24.2033 8.79053 23.9595 9.07574 23.6711C9.5417 23.1999 10.0057 22.7265 10.4583 22.2423C10.6846 22.0001 10.9083 21.7552 11.1279 21.5067C11.3028 21.3086 11.4825 21.0106 11.7226 20.8901C12.1771 20.662 12.5279 21.2233 12.4456 21.6163C12.367 21.9921 12.1082 22.3219 11.8701 22.6219L11.8538 22.6426C11.8322 22.6697 11.8106 22.697 11.7892 22.7242C10.989 23.7421 10.1114 24.7234 9.11593 25.5531C8.13734 26.3664 7.05082 27.0583 5.8576 27.5069C5.46896 27.653 5.07073 27.7731 4.66595 27.8651C3.88451 28.0429 3.02098 28.0297 2.22237 27.9137C1.63684 27.8288 1.11045 27.4552 0.862271 26.9118C0.431421 25.9683 0.731313 24.8031 0.954073 23.8427C1.22696 22.6669 1.63657 21.5475 2.05501 20.4212L2.0868 20.3356L2.10273 20.2928L2.13455 20.2072L2.16637 20.1216C2.65133 18.8161 3.14981 17.5159 3.64989 16.2162C4.10626 15.0306 4.56456 13.8459 5.0162 12.6586C5.05068 12.568 5.08918 12.4779 5.12804 12.388L5.14262 12.3542C5.2423 12.1237 5.34141 11.8932 5.37852 11.6529C5.46761 11.0763 5.05177 10.563 4.47458 10.8953C3.47679 11.4699 2.72959 12.3244 1.98904 13.1841L1.89899 13.2887C1.66886 13.5559 1.43841 13.8225 1.20033 14.0803C0.965696 14.3345 0.686367 14.6497 0.282934 14.3584C-0.147581 14.0477 -0.0198891 13.6491 0.22479 13.3116C1.58366 11.4364 3.21519 9.68236 5.3415 8.69182C6.23009 8.27786 7.47231 7.85641 8.63561 7.84259C9.50772 7.83228 10.3355 8.05097 10.9365 8.67368ZM12.2787 0.216218C13.3973 0.651473 14.0001 1.62399 14 2.99313C13.9999 5.46047 11.3348 7.14804 9.10686 6.09144C7.95541 5.54535 7.39538 4.25099 7.6745 2.78099C8.06087 0.745185 10.3546 -0.532388 12.2787 0.216218Z"
                            fill="white"
                        />
                    </svg>
                </div>
            </div>
            {modalSound.visible && (
                <div>
                    <div
                        className="modal-overlay"
                        onClick={(e) => {
                            e.stopPropagation();
                            modalSound.hide();
                        }}
                    />

                    <div className="modal-sound">
                        <div className="modal-sound-content">
                            <SoundModal
                                muteAudio={muteAudio}
                                toggleMuteAudio={toggleMuteAudio}
                                setSound={setSound}
                                sound={sound}
                                closeModal={() => modalSound.hide()}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={modalInfo.visible ? "show" : "info"}>
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        e.stopPropagation();
                        modalInfo.hide();
                    }}
                />

                <div className="modal-info">
                    <div className="modal-info-content">
                        <InfoModal onClose={() => modalInfo.hide()} />
                    </div>
                </div>
            </div>
        </div>
    );
}

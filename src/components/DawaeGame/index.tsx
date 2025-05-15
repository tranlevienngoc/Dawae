"use client";

import { SoundcontrolContext } from "@/context/soundControl";
import useVisible from "@/hook/useVisible";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import SoundModal from "./SoundModal";
import InfoModal from "./InfoModal";
import ReactCountryFlag from "react-country-flag"

const countries = [
  { code: "hk", name: "Hong Kong", start: 0, interval: 1, flag: "flag-icon-hk" },
  { code: "tw", name: "Taiwan", start: 0, interval: 20, flag: "flag-icon-tw" },
  { code: "th", name: "Thailand", start: 0, interval: 25, flag: "flag-icon-th" },
  { code: "jp", name: "Japan", start: 0, interval: 40, flag: "flag-icon-jp" },
  { code: "vn", name: "Vietnam", start: 0, interval: 0, flag: "flag-icon-vn" },
  { code: "fi", name: "Finland", start: 0, interval: 34, flag: "flag-icon-fi" },
  { code: "se", name: "Sweden", start: 0, interval: 20, flag: "flag-icon-se" },
  { code: "pl", name: "Poland", start: 0, interval: 15, flag: "flag-icon-pl" },
  { code: "dk", name: "Denmark", start: 0, interval: 31, flag: "flag-icon-dk" },
  { code: "id", name: "Indonesia", start: 0, interval: 29, flag: "flag-icon-id" },
  { code: "hu", name: "Hungary", start: 0, interval: 70, flag: "flag-icon-hu" },
  { code: "rs", name: "Serbia", start: 0, interval: 5, flag: "flag-icon-rs" },
];

export default function DawaeGame() {
  const [score, setScore] = useState(0);
  const [myScore, setMyScore] = useState(countries[4].start);
  const [sound, setSound] = useState("/Da_Wae_1.mp3");
  const [imageSrc, setImageSrc] = useState("/unmount.webp");

  const { muteAudio, toggleMuteAudio } = useContext(SoundcontrolContext);

  const modalSound = useVisible();
  const modalInfo = useVisible();
  const [countryScores, setCountryScores] = useState<number[]>(
    countries.map((c) => c.start)
  );
  const [isClicked, setIsClicked] = useState(false);
  const [isSvgClicked, setIsSvgClicked] = useState(false);
  const [userCountry, setUserCountry] = useState<{
    countryName: string;
    countryCode: string;
  }>({
    countryName: "Unknown",
    countryCode: "Unknown",
  });
  const [userIp, setUserIp] = useState<string>("Unknown");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef<HTMLParagraphElement | null>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const highestScoreCountry = () => {
    const maxScoreIndex = countryScores.indexOf(Math.max(...countryScores));
    const country = countries[maxScoreIndex];
    return {
      ...country,
      currentScore: countryScores[maxScoreIndex],
    };
  };

  const [isOpenTable, setIsOpenTable] = useState(false);

  const fetchCountry = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
              { cache: "no-store" }
            );
            if (!response.ok) {
              throw new Error(
                `Failed to fetch country from Geolocation: ${response.status} ${response.statusText}`
              );
            }
            const data = await response.json();
            setUserCountry({
              countryName: data.countryName || "Unknown",
              countryCode: data.countryCode.toLowerCase() || "Unknown",
            });
            localStorage.setItem("userCountry", data.countryName || "Unknown");
          } catch (error) {
            console.error("Error fetching country:", error);
            setUserCountry({
              countryName: "Unknown",
              countryCode: "Unknown",
            });
            localStorage.setItem("userCountry", "Unknown");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          console.log("Geolocation error:", error.message, error.code);
          setUserCountry({
            countryName: "Denied",
            countryCode: "Unknown",
          });
          localStorage.setItem("userCountry", "Denied");
        },
        { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation not supported");
      setUserCountry({
        countryName: "Unsupported",
        countryCode: "Unknown",
      });
      localStorage.setItem("userCountry", "Unsupported");
    }
  };
  const checkPermission = useCallback(async () => {
    if ("permissions" in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });
        console.log("Initial Permission status:", permissionStatus.state);
        if (
          permissionStatus.state === "granted" ||
          permissionStatus.state === "prompt"
        ) {
          fetchCountry();
        } else {
          setUserCountry({
            countryName: "Denied",
            countryCode: "Unknown",
          });
        }

        permissionStatus.onchange = () => {
          if (
            permissionStatus.state === "granted" ||
            permissionStatus.state === "prompt"
          ) {
            fetchCountry();
          } else if (permissionStatus.state === "denied") {
            setUserCountry({
              countryName: "Denied",
              countryCode: "Unknown",
            });
            localStorage.setItem("userCountry", "Denied");
          }
        };
      } catch (error) {
        console.error("Error checking permissions:", error);
        setUserCountry({
          countryName: "Unsupported",
          countryCode: "Unknown",
        });
        localStorage.setItem("userCountry", "Unsupported");
      }
    } else {
      fetchCountry();
    }
  }, []);
  const fetchIp = async () => {
    try {
      const response = await fetch("/api/get-ip");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch IP: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setUserIp(data.ip === "::1" ? "171.225.185.6" : data.ip);
    } catch (error) {
      console.error("Error fetching IP:", error);
      setUserIp("Unknown");
    }
  };

  useEffect(() => {
    const dataScore = localStorage.getItem("scoreUser");
    if (dataScore) {
      setScore(JSON.parse(dataScore).score);
      setUserCountry({
        countryName: JSON.parse(dataScore).countryName,
        countryCode: JSON.parse(dataScore).countryCode,
      });
      setUserIp(JSON.parse(dataScore).ip);
    } else {
      fetchIp();
      checkPermission();
    }
  }, [checkPermission]);

  useEffect(() => {
    if (
      (userCountry.countryName === "Denied" ||
        userCountry.countryName === "Unsupported" ||
        userCountry.countryName === "Unknown") &&
      userIp !== "Unknown"
    ) {
      const fetchIpAndCountry = async () => {
        try {
          const fallbackResponse = await fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=5cf3259461f3432aac6f5314b2695c33&ip=${userIp}`,
            { cache: "no-store" }
          );
          if (!fallbackResponse.ok) {
            throw new Error(
              `Failed to fetch country from fallback: ${fallbackResponse.status} ${fallbackResponse.statusText}`
            );
          }
          const countryData = await fallbackResponse.json();
          setUserCountry({
            countryName: countryData.country_name || "Unknown",
            countryCode: countryData.country_code2.toLowerCase() || "Unknown",
          });
        } catch (error) {
          console.error("Error fetching country:", error);
          setUserCountry({
            countryName: "Unknown",
            countryCode: "Unknown",
          });
        }
      };
      fetchIpAndCountry();
    }
  }, [userCountry, userIp]);

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
    const intervals = countries.map((c, index) => {
      if (c.interval <= 0) return null;
      return setInterval(() => {
        setCountryScores((prev) => {
          const updated = [...prev];
          updated[index]++;
          return updated;
        });
      }, c.interval);
    });

    return () => {
      intervals.forEach((id) => id && clearInterval(id));
    };
  }, []);

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

  const handleClick = () => {
    setScore((prev) => prev + 1);
    setMyScore((prev) => prev + 1);

    setCountryScores((prev) => {
      const updated = [...prev];
      const countryIndex = countries.findIndex(
        (c) => c.name === userCountry.countryName
      );
      updated[countryIndex !== -1 ? countryIndex : 4] += 1;
      return updated;
    });

    if (userCountry.countryName === "Prompt") {
      fetchCountry();
    }

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

    const dataScore = {
      ip: userIp,
      score: score + 1,
      countryName: userCountry.countryName,
      countryCode: userCountry.countryCode,
    };

    localStorage.setItem("scoreUser", JSON.stringify(dataScore));

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
  };

  const handleSvgClick = () => {
    if (checkboxRef.current) {
      setIsSvgClicked(!isSvgClicked);
      checkboxRef.current.checked = !checkboxRef.current.checked;
      setIsOpenTable(!isOpenTable);
    }
  };

  return (
    <div className="container" onClick={handleClick}>
      <h1 className="logo">
        <span className="nitish">UGANDAN </span>
        <span className="k">K</span>
        <span className="pjt">NUCKLES</span>
      </h1>
      <p id={score > 0 ? "score" : "score-hidden"}>{score.toLocaleString()}</p>
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
                <span className="text-label">
                  {highestScoreCountry().name}{" "}
                </span>
                <span className="text-label">
                  {Number(highestScoreCountry().currentScore).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="tab-label-right">
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
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
          <input
            type="checkbox"
            style={{ display: "none" }}
            id="chck1"
            ref={checkboxRef}
          />
          {/* Add ref */}
          <label className="tab-label" htmlFor="chck1"></label>
          <div className="tab-content">
            <table id="table">
              <tbody>
                <tr style={{   borderBottom: "1px solid #e3e2e2" }}>
                  <td style={{ textAlign: "center" }}>🌏</td>
                  <td>WorldWide</td>

                  <td></td>
                  <td>
                    {Number(
                      countryScores.reduce((a, b) => a + b, 0)
                    ).toLocaleString()}
                  </td>
                </tr>
                {countries.map((c, i) => (
                  <tr key={c.code} style={{   borderBottom: i != countries.length - 1 ? "1px solid #e3e2e2" : "none" }}>
                    <td className={i < 3 ? "rank" : "text"}>
                      {i < 3
                        ? i === 0
                          ? "🥇"
                          : i === 1
                          ? "🥈"
                          : "🥉"
                        : `${i + 1}`}
                    </td>
                    <td>
                      <ReactCountryFlag className="flag-icon-table" countryCode={c.code} svg />
                    </td>
                    <td className={c.code === "vi" ? "user-country" : ""}>
                      {c.name}
                    </td>
                    <td>
                      {i === 0 || c.code === "vn" ? (
                        <span>
                          <span className="pps">
                            {i === 0 ? "101.5" : "50"} PPS
                          </span>{" "}
                          {Number(countryScores[i]).toLocaleString()}
                        </span>
                      ) : (
                        Number(countryScores[i]).toLocaleString()
                      )}
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
          <svg
            width="14"
            height="23"
            viewBox="0 0 14 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
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

/* eslint-disable @next/next/no-img-element */
"use client";

import { SoundcontrolContext } from "@/context/soundControl";
import useVisible from "@/hook/useVisible";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import SoundModal from "./SoundModal";
import InfoModal from "./InfoModal";

const countries = [
  { code: "hk", name: "Hong Kong", start: 0, interval: 1, flag: "🇭🇰" },
  { code: "tw", name: "Taiwan", start: 0, interval: 20, flag: "🇹🇼" },
  { code: "th", name: "Thailand", start: 0, interval: 25, flag: "🇹🇭" },
  { code: "jp", name: "Japan", start: 0, interval: 40, flag: "🇯🇵" },
  { code: "vi", name: "Vietnam", start: 0, interval: 0, flag: "🇻🇳" }, // manual update
  { code: "fi", name: "Finland", start: 0, interval: 34, flag: "🇫🇮" },
  { code: "se", name: "Sweden", start: 0, interval: 20, flag: "🇸🇪" },
  { code: "pl", name: "Poland", start: 0, interval: 15, flag: "🇵🇱" },
  { code: "dk", name: "Denmark", start: 0, interval: 31, flag: "🇩🇰" },
  { code: "id", name: "Indonesia", start: 0, interval: 29, flag: "🇮🇩" },
  { code: "hu", name: "Hungary", start: 0, interval: 70, flag: "🇭🇺" },
  { code: "rs", name: "Serbia", start: 0, interval: 5, flag: "🇷🇸" },
];

export default function DawaeGame() {
  const [score, setScore] = useState(0);
  const [myScore, setMyScore] = useState(countries[4].start);
  const [sound, setSound] = useState("/Da_Wae_1.mp3");

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

  const imgRef = useRef<HTMLImageElement>(null);
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

    if (imgRef.current) {
      imgRef.current.src = "/mount.webp";
      setTimeout(() => {
        if (imgRef.current) {
          imgRef.current.src = "/unmount.webp";
        }
      }, 100);
    }
  };

  const handleSvgClick = () => {
    if (checkboxRef.current) {
      setIsSvgClicked(!isSvgClicked);
      checkboxRef.current.checked = !checkboxRef.current.checked;
    }
  };

  return (
    <div className="container" onClick={handleClick}>
      <h1 className="logo">
        <span className="nitish">UGANDAN </span>
        <span className="k">K</span>
        <span className="pjt">NUCKLES</span>
      </h1>
      <p id="score">{score.toLocaleString()}</p>
      <img
        ref={imgRef}
        src="/unmount.webp"
        alt="Dawae"
        height="auto"
        style={{ maxWidth: "760px", cursor: "pointer" }}
        width="90%"
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
                <span style={{ marginTop: "2px" }} className="text-label">
                  🇻🇳
                </span>
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
                  onClick={handleSvgClick} //
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
                  onClick={handleSvgClick}
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
          />{" "}
          {/* Add ref */}
          <label className="tab-label" htmlFor="chck1"></label>
          <div className="tab-content">
            <table id="table">
              <tbody>
                <tr>
                  <td>🌏</td>
                  <td>WorldWide</td>

                  <td></td>
                  <td>
                    {Number(
                      countryScores.reduce((a, b) => a + b, 0)
                    ).toLocaleString()}
                  </td>
                </tr>
                {countries.map((c, i) => (
                  <tr key={c.code}>
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
                      <span
                        className={`flag-icon flag-icon-${c.code}`}
                        style={{ marginRight: "5px" }}
                      >
                        {c.flag}
                      </span>
                    </td>
                    <td className={c.code === "vi" ? "user-country" : ""}>
                      {c.name}
                    </td>
                    <td>
                      {i === 0 || c.code === "vi" ? (
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
            stroke="#fff"
            fill="#fff"
            stroke-width="0"
            viewBox="0 0 16 16"
            height="30px"
            width="30px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0"></path>
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
            <div className="modal-info-content" >
              <InfoModal
                onClose={() => modalInfo.hide()}
              />
            </div>
          </div>
        </div>
    </div>
  );
}

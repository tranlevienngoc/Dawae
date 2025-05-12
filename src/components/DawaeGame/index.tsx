/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

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
  const [myScore, setMyScore] = useState(countries[4].start); // Vietnam
  const [countryScores, setCountryScores] = useState<number[]>(countries.map((c) => c.start));
  const [isClicked, setIsClicked] = useState(false);
  const [isSvgClicked, setIsSvgClicked] = useState(false);
  const [userCountry, setUserCountry] = useState<string>("Unknown");
  const [userIp, setUserIp] = useState<string>("Unknown");

  const imgRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scoreRef = useRef<HTMLParagraphElement | null>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);

  // Lấy quốc gia cao điểm nhất
  const highestScoreCountry = () => {
    const maxScoreIndex = countryScores.indexOf(Math.max(...countryScores));
    const country = countries[maxScoreIndex];
    return {
      ...country,
      currentScore: countryScores[maxScoreIndex],
    };
  };

  // Lấy vị trí và quốc gia qua Geolocation
  const fetchCountry = async () => {
    console.log("fetchCountry");
    if (navigator.geolocation) {
      console.log("if");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("getCurrentPosition");
          try {
            const { latitude, longitude } = position.coords;
            console.log("Coords:", { latitude, longitude });
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
              { cache: "no-store" }
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch country from Geolocation: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log("Geolocation data:", data);
            setUserCountry(data.countryName || "Unknown");
            localStorage.setItem("userCountry", data.countryName || "Unknown");
          } catch (error) {
            console.error("Error fetching country:", error);
            setUserCountry("Unknown");
            localStorage.setItem("userCountry", "Unknown");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          console.log("Geolocation error:", error.message, error.code);
          setUserCountry("Denied");
          localStorage.setItem("userCountry", "Denied");
        },
        { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
      );
    } else {
      console.log("Geolocation not supported");
      setUserCountry("Unsupported");
      localStorage.setItem("userCountry", "Unsupported");
    }
  };

  // Kiểm tra quyền và khởi động Geolocation
  useEffect(() => {
    console.log("useEffect - Check Permission");
    const cachedCountry = localStorage.getItem("userCountry");
    if (cachedCountry) {
      setUserCountry(cachedCountry);
      return;
    }

    const checkPermission = async () => {
      if ("permissions" in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
          console.log("Permission status:", permissionStatus.state);
          if (permissionStatus.state === "granted") {
            fetchCountry();
          } else if (permissionStatus.state === "prompt") {
            setUserCountry("Prompt");
          } else {
            setUserCountry("Denied");
          }

          permissionStatus.onchange = () => {
            console.log("Permission changed:", permissionStatus.state);
            if (permissionStatus.state === "granted") {
              fetchCountry();
            } else if (permissionStatus.state === "denied") {
              setUserCountry("Denied");
              localStorage.setItem("userCountry", "Denied");
            }
          };
        } catch (error) {
          console.error("Error checking permissions:", error);
          setUserCountry("Unsupported");
          localStorage.setItem("userCountry", "Unsupported");
        }
      } else {
        fetchCountry();
      }
    };

    checkPermission();
  }, []);

  // Lấy IP qua API
  useEffect(() => {
    console.log("useEffect - Fetch IP");
    const fetchIp = async () => {
      try {
        const response = await fetch("/api/get-ip");
        if (!response.ok) {
          throw new Error(`Failed to fetch IP: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("API IP data:", data);
        setUserIp(data.ip || "Unknown");
        localStorage.setItem("userIp", data.ip || "Unknown");
      } catch (error) {
        console.error("Error fetching IP:", error);
        setUserIp("Unknown");
        localStorage.setItem("userIp", "Unknown");
      }
    };
    fetchIp();
  }, []);

  // Fallback: Lấy quốc gia qua IP nếu Geolocation thất bại
  useEffect(() => {
    console.log("useEffect - Fetch IP-based Country");
    if ((userCountry === "Denied" || userCountry === "Unsupported" || userCountry === "Unknown") && userIp !== "Unknown")  {
      const fetchIpAndCountry = async () => {
        try {
          

         
          const fallbackResponse = await fetch(
            `https://api.ipgeolocation.io/ipgeo?apiKey=5cf3259461f3432aac6f5314b2695c33&ip=${userIp}`,
            { cache: "no-store" }
          );
            if (!fallbackResponse.ok) {
              throw new Error(`Failed to fetch country from fallback: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
            }
            const countryData = await fallbackResponse.json();
            setUserCountry(countryData.country || "Unknown");
         

          console.log("IP-based country data:", countryData);
          localStorage.setItem("userCountry", countryData.country || countryData.country_name || "Unknown");
        } catch (error) {
          console.error("Error fetching IP or country:", error);
          setUserIp("Unknown");
          setUserCountry("Unknown");
          localStorage.setItem("userCountry", "Unknown");
        }
      };
      fetchIpAndCountry();
    }
  }, [userCountry, userIp]);

  // Khởi tạo audio
  useEffect(() => {
    console.log("useEffect - Initialize Audio");
    audioRef.current = new Audio("/uk-click.mp3");
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Xử lý interval cho các quốc gia
  useEffect(() => {
    console.log("useEffect - Start Country Intervals");
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

  // Xử lý audio lặp khi isClicked
  useEffect(() => {
    console.log("useEffect - Handle Audio Looping", isClicked);
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

  // Xử lý click
  const handleClick = () => {
    console.log("handleClick");
    setScore((prev) => prev + 1);
    setMyScore((prev) => prev + 1);

    // Cập nhật countryScores dựa trên userCountry
    setCountryScores((prev) => {
      const updated = [...prev];
      const countryIndex = countries.findIndex((c) => c.name === userCountry);
      updated[countryIndex !== -1 ? countryIndex : 4] += 1; // Mặc định Vietnam nếu không tìm thấy
      return updated;
    });

    if (userCountry === "Prompt") {
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

    // Lưu score vào localStorage
    const currentScore = localStorage.getItem("score");
    const dataScore = {
      ip: userIp,
      score: currentScore ? parseInt(currentScore) + 1 : 1,
    };
    localStorage.setItem("score", JSON.stringify(dataScore));

    // Quản lý timeout và audio
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

    // Toggle hình ảnh
    if (imgRef.current) {
      imgRef.current.src = "/unmount.webp";
      setTimeout(() => {
        if (imgRef.current) {
          imgRef.current.src = "/mount.webp";
        }
      }, 100);
    }
  };

  // Xử lý click SVG
  const handleSvgClick = () => {
    console.log("handleSvgClick");
    if (checkboxRef.current) {
      setIsSvgClicked(!isSvgClicked);
      checkboxRef.current.checked = !checkboxRef.current.checked;
    }
  };

  // Nút retry Geolocation


  return (
    <div className="container">
      <div className="logo">
        <span className="nitish">UGANDAN </span>
        <span className="k">K</span>
        <span className="pjt">NUCKLES</span>
      </div>
      <p id="score">{score.toLocaleString()}</p>
      <img
        ref={imgRef}
        src="/mount.webp"
        alt="Dawae"
        height="auto"
        style={{ maxWidth: "760px", cursor: "pointer" }}
        width="90%"
        onMouseDown={handleClick}
        onTouchStart={handleClick}
      />

      <div className="tabs">
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
                  stroke-width="0"
                  viewBox="0 0 512 512"
                  height="20px"
                  width="20px"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={handleSvgClick} // Add click handler
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
                  onClick={handleSvgClick} // Add click handler
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
                  <td></td>
                  <td>🌏</td>
                  <td>WorldWide</td>
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
    </div>
  );
}

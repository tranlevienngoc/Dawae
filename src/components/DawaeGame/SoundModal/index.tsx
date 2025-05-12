import React from "react";

interface Song {
  name: string;
  link: string;
}

interface ModalMusicProps {
  toggleMuteAudio: () => void;
  setSound: (link: string) => void;
  muteAudio: boolean;
  sound: string;
  closeModal: () => void;
}

export default function SoundModal({
  toggleMuteAudio,
  setSound,
  muteAudio,
  sound,
  closeModal,
}: ModalMusicProps) {
  const LISTSONG: Song[] = [
    {
      name: "Dawae 1",
      link: "/Do-You-Know-DaWae-1.mp3",
    },
    {
      name: "Dawae 2",
      link: "/Do-You-Know-DaWae-2.mp3",
    },
    {
      name: "Dawae 3",
      link: "/uk-click.mp3",
    },
  ];


  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <button onClick={toggleMuteAudio} className="muteButton">
          {!muteAudio ? (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 16 16"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M1.5 4.83h2.79L8.15 1l.85.35v13l-.85.33-3.86-3.85H1.5l-.5-.5v-5l.5-.5zM4.85 10L8 13.14V2.56L4.85 5.68l-.35.15H2v4h2.5l.35.17zM15 7.83a6.97 6.97 0 0 1-1.578 4.428l-.712-.71A5.975 5.975 0 0 0 14 7.83c0-1.4-.48-2.689-1.284-3.71l.712-.71A6.971 6.971 0 0 1 15 7.83zm-2 0a4.978 4.978 0 0 1-1.002 3.004l-.716-.716A3.982 3.982 0 0 0 12 7.83a3.98 3.98 0 0 0-.713-2.28l.716-.716c.626.835.997 1.872.997 2.996zm-2 0c0 .574-.16 1.11-.44 1.566l-.739-.738a1.993 1.993 0 0 0 .005-1.647l.739-.739c.276.454.435.988.435 1.558z"
              ></path>
            </svg>
          ) : (
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 512 512"
              height="20px"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
                d="M416 432 64 80"
              ></path>
              <path d="M224 136.92v33.8a4 4 0 0 0 1.17 2.82l24 24a4 4 0 0 0 6.83-2.82v-74.15a24.53 24.53 0 0 0-12.67-21.72 23.91 23.91 0 0 0-25.55 1.83 8.27 8.27 0 0 0-.66.51l-31.94 26.15a4 4 0 0 0-.29 5.92l17.05 17.06a4 4 0 0 0 5.37.26zm0 238.16-78.07-63.92a32 32 0 0 0-20.28-7.16H64v-96h50.72a4 4 0 0 0 2.82-6.83l-24-24a4 4 0 0 0-2.82-1.17H56a24 24 0 0 0-24 24v112a24 24 0 0 0 24 24h69.76l91.36 74.8a8.27 8.27 0 0 0 .66.51 23.93 23.93 0 0 0 25.85 1.69A24.49 24.49 0 0 0 256 391.45v-50.17a4 4 0 0 0-1.17-2.82l-24-24a4 4 0 0 0-6.83 2.82zM125.82 336zM352 256c0-24.56-5.81-47.88-17.75-71.27a16 16 0 0 0-28.5 14.54C315.34 218.06 320 236.62 320 256q0 4-.31 8.13a8 8 0 0 0 2.32 6.25l19.66 19.67a4 4 0 0 0 6.75-2A146.89 146.89 0 0 0 352 256zm64 0c0-51.19-13.08-83.89-34.18-120.06a16 16 0 0 0-27.64 16.12C373.07 184.44 384 211.83 384 256c0 23.83-3.29 42.88-9.37 60.65a8 8 0 0 0 1.9 8.26l16.77 16.76a4 4 0 0 0 6.52-1.27C410.09 315.88 416 289.91 416 256z"></path>
              <path d="M480 256c0-74.26-20.19-121.11-50.51-168.61a16 16 0 1 0-27 17.22C429.82 147.38 448 189.5 448 256c0 47.45-8.9 82.12-23.59 113a4 4 0 0 0 .77 4.55L443 391.39a4 4 0 0 0 6.4-1C470.88 348.22 480 307 480 256z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="songList">
        <div className="songListTitle">List Song</div>

        {LISTSONG.map((item) => (
          <div
            key={item.name}
            className="songItem"
            onClick={() => {
                setSound(item.link)
                closeModal()
            }}
          >
            <div className="songName">{item.name}</div>
            {sound === item.link && (
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="16px"
                width="16px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path>
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

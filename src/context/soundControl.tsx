import {
    createContext,
    useCallback,
    useState,
    ReactNode,
  } from "react";
  
  interface SoundControlContextValue {
    muteAudio: boolean;
    setMuteAudio: React.Dispatch<React.SetStateAction<boolean>>;
    toggleMuteAudio: () => void;
  }

  const SoundControlContextValue: SoundControlContextValue = {
    muteAudio: false,
    setMuteAudio: () => ({}),
    toggleMuteAudio: () => ({}),
  };
  
  const SoundcontrolContext = createContext<SoundControlContextValue>(SoundControlContextValue);
  
  interface SoundControlProviderProps {
    children: ReactNode;
  }
  
  const SoundControlProvider = ({ children }: SoundControlProviderProps) => {
    const [muteAudio, setMuteAudio] = useState<boolean>(true);
  
    const muteMe = useCallback(
      (elem: HTMLAudioElement | HTMLVideoElement, status: boolean) => {
        elem.muted = status;
        if (status) {
          elem.pause();
        }
        elem.play();
      },
      []
    );
  
    const mutePage = useCallback(() => {
      document
        .querySelectorAll("audio, video")
        .forEach((elem) => {
          if (elem instanceof HTMLAudioElement || elem instanceof HTMLVideoElement) {
            muteMe(elem, muteAudio);
          }
        });
    }, [muteAudio, muteMe]);
  
    const toggleMuteAudio = () => {
      setMuteAudio((prevState) => !prevState);
      mutePage();
    };
  
    const value = {
      muteAudio,
      setMuteAudio,
      toggleMuteAudio,
    };
  
    return (
      <SoundcontrolContext.Provider value={value}>
        {children}
      </SoundcontrolContext.Provider>
    );
  };
  
  export { SoundcontrolContext, SoundControlProvider };
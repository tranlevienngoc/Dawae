import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@/components/DawaeGame/SoundModal/SoundModal.css";
import "@/components/DawaeGame/InfoModal/InfoModal.css";
import { SoundControlProvider } from "@/context/soundControl";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <SoundControlProvider>
        <Component {...pageProps} />
      </SoundControlProvider>
    </>
  );
}

export default MyApp;

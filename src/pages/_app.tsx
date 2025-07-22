import type { AppProps } from "next/app";
import "@/styles/globals.css";
import "@/components/DawaeGame/SoundModal/SoundModal.css";
import "@/components/DawaeGame/InfoModal/InfoModal.css";

import { SoundControlProvider } from "@/context/soundControl";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContect";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
          <SessionProvider session={pageProps.session}>
            <AuthProvider>
              <SoundControlProvider>
                  <Component {...pageProps} />
              </SoundControlProvider>
            </AuthProvider>
          </SessionProvider>
        </>
    );
}

export default MyApp;

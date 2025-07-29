import type { AppProps } from "next/app";
import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/context/AuthContect";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
          <SessionProvider session={pageProps.session}>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </SessionProvider>
        </>
    );
}

export default MyApp;

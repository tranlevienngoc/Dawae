import DawaeGame from "@/components/DawaeGame";
import Head from "next/head";

export default function Home() {
  const URL_BASE = "https://ugandanknuckles.click";
  return (
    <>
      <Head>
        <title>Ugandan Knuckles Clicking</title>
        <meta
          name="description"
          content="Do you know da wae, bruddah? Tap Ugandan Knuckles to unleash his iconic spit and stack points for your country. Compete on the global leaderboard to prove your nation is the ultimate Knuckles warrior."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preload" as="image" href="/mount.webp"></link>
        <meta name="author" content="Ugandan Knuckles Tribe" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />

        <link
          rel="preload"
          href="https://fonts.gstatic.com/s/luckiestguy/v23/_gP_1RrxsjcxVyin9l9n_j2hTd52.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />

        <link rel="manifest" href="/manifest.json" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Ugandan Knuckles Clicking"
        />
        <meta property="og:url" content={URL_BASE} />
        <meta
          property="og:description"
          content="Do you know da wae, bruddah? Tap Ugandan Knuckles to unleash his iconic spit and stack points for your country. Compete on the global leaderboard to prove your nation is the ultimate Knuckles warrior."
        />
        <meta property="og:image" content="/dawae-thumbnail.webp" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="/dawae-thumbnail.webp" />
        <meta name="twitter:site" content="@DaWaeClicking" />
      </Head>
      <DawaeGame />
    </>
  );
}

import DawaeGame from "@/components/DawaeGame";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>UGANDAN KNUCKLES</title>
        <meta
          name="description"
          content="Do you know da wae, bruddah? Tap Ugandan Knuckles to unleash his iconic spit and stack points for your country. Compete on the global leaderboard to prove your nation is the ultimate Knuckles warrior."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preload" as="image" href="/mount.webp"></link>
        <link rel="preload" as="image" href="/unmount.webp"></link>
        <meta name="author" content="Ugandan Knuckles Tribe" />

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
        <meta property="og:title" content="UGANDAN KNUCKLES" />
        <meta property="og:url" content="/mount.webp" />
        <meta
          property="og:description"
          content="Do you know da wae, bruddah? Tap Ugandan Knuckles to unleash his iconic spit and stack points for your country. Compete on the global leaderboard to prove your nation is the ultimate Knuckles warrior."
        />
        <meta property="og:image" content="/mount.webp" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="/mount.webp" />
        <meta name="twitter:site" content="@dawaetribe" />
      </Head>
      <DawaeGame />
    </>
  );
}

import dynamic from "next/dynamic";
import Head from "next/head";

const Chart = dynamic(() => import("@/components/Chart"), {
  ssr: false,
});

export default function Dawae() {
  const URL_BASE = "https://dawae-tribe.vercel.app/";
  return (
    <>
    <Head>
        <title>Dawae Tribe - The Ugandan Knuckles Empire</title>
        <meta
          name="description"
          content="Our sacred mission is to revive the spirit of Ugandan Knuckles, to make da tribe great again! Dis house unites bruddahs globally, tappin' to honor Da Queen and prove Da Wae lives eternal."
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
          content="Dawae Tribe - The Ugandan Knuckles Empire"
        />
        <meta property="og:url" content={URL_BASE} />
        <meta
          property="og:description"
          content="Our sacred mission is to revive the spirit of Ugandan Knuckles, to make da tribe great again! Dis house unites bruddahs globally, tappin' to honor Da Queen and prove Da Wae lives eternal."
        />
        <meta property="og:image" content="/dawae-thumbnail.webp" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="/dawae-thumbnail.webp" />
        <meta name="twitter:site" content="@DawaeTribe" />
      </Head>
    <div className="flex flex-col items-center justify-center" style={{ backgroundColor: "white", height: "100vh" }}>
      <Chart />
    </div>
    </>
  );
}

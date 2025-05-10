import DawaeGame from "@/components/DawaeGame";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>UGANDAN KNUCKLES</title>
        <meta
          name="description"
          content="Click Knuckles to earn points for Uganda!"

        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />  
        <link rel="icon" href="/logo.png" /> 
      </Head>
      <DawaeGame />
    </>
  );
}

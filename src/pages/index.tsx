import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/Chart"), {
  ssr: false,
});

export default function Dawae() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ backgroundColor: "white", height: "100vh" }}>
      <Chart />
    </div>
  );
}

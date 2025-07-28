// import Chart from "@/components/Chart";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("@/components/Chart"), {
  ssr: false,
});

export default function ABC() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ backgroundColor: "white", height: "100vh" }}>
      <Chart />
    </div>
  );
}

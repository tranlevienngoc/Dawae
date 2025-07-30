import { tribes } from "../../constants/tribes";
import TribeCard from "./TribeCard";

const TribesSection = () => {
    return (
        <div
            style={{
                backgroundColor: "white",
                padding: "40px 20px 80px 20px",
                color: "#333",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <h2 className="unites-bruddahs-globally-title">Unites Bruddahs Globally</h2>
                <p className="unites-bruddahs-globally-description">
                    Join us, spit on da doubters, and let&apos;s show da world da Knuckles tribe never fades
                </p>

                <div
                    className="mobile-tribes-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                        gap: "40px",
                        marginTop: "40px",
                    }}
                >
                    {tribes.map((tribe, index) => (
                        <TribeCard key={index} tribe={tribe} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TribesSection; 
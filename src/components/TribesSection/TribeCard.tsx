import ReactCountryFlag from "react-country-flag";
import { TribeData } from "../../constants/tribes";

interface TribeCardProps {
    tribe: TribeData;
}

const TribeCard = ({ tribe }: TribeCardProps) => {
    return (
        <div className="unites-bruddahs-globally-card">
            <div className="unites-bruddahs-globally-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <ReactCountryFlag
                        countryCode={tribe.countryCode}
                        svg
                        className="flag-icon"
                        style={{
                            width: "24px",
                            height: "18px",
                            borderRadius: "5px",
                            border: "1px solid #e1e4ea",
                        }}
                    />
                </div>
                <button className="join-community-button">{tribe.button}</button>
            </div>
            <div className="unites-bruddahs-globally-card-body">
                <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: "0" }}>
                    {tribe.title}
                </h3>
                <p className="unites-bruddahs-globally-card-description">
                    {tribe.description}
                </p>
            </div>
        </div>
    );
};

export default TribeCard; 
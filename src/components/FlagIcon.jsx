import React from "react";
import ReactCountryFlag from "react-country-flag";

export const FlagIcon = ({ code }) => {
    const flagCodes = {
        en: "GB",
        sq: "AL",
        mk: "MK",
    };

    return (
        <ReactCountryFlag
            countryCode={flagCodes[code] || "GB"}
            svg
            style={{
                width: "22px",
                height: "16px",
                borderRadius: "3px",
            }}
        />
    );
};
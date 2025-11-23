import React from "react";   // ← REQUIRED FOR YOUR SETUP

export default function GoldSpinner({ size = 24, className = "" }) {
    const px = typeof size === "number" ? `${size}px` : size;

    return (
        <div
            className={`
                border-2 border-yellow-400 border-t-transparent 
                rounded-full animate-spin
                ${className}
            `}
            style={{
                width: px,
                height: px,
            }}
        />
    );
}
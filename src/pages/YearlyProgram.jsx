import React from "react";
import DocumentPage from "../components/DocumentPage.jsx";

export default function YearlyProgram() {
    return (
        <DocumentPage
            titleKey="yearlyProgram.title"
            descriptionKey="yearlyProgram.description"
            buttonKey="yearlyProgram.open"
            pdfPath="/Решение програма 2026.pdf"
        />
    );
}
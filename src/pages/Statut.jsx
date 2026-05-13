import React from "react";
import DocumentPage from "../components/DocumentPage.jsx";

export default function Statut() {
    return (
        <DocumentPage
            titleKey="statut.title"
            descriptionKey="statut.description"
            buttonKey="statut.open"
            pdfPath="/statut-nu-muzicki-ansambl-tetovo.pdf"
        />
    );
}
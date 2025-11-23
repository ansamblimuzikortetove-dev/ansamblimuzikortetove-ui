// src/services/apiClient.ts
import toast from "react-hot-toast";
import i18n from "../i18n.js";

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

// -------------------------------------------
//   Unified Error Formatter
// -------------------------------------------
function handleApiError(error: any, url: string) {
    console.error("❌ API ERROR:", url, error);

    let message = i18n.t("errors.generic") || "Something went wrong.";

    // Network disconnected
    if (error?.message === "Failed to fetch") {
        message =
            i18n.t("errors.noConnection") || "Network error. Check your internet.";
    }

    // Strapi error format
    if (error?.error?.message) {
        message = error.error.message;
    }

    // Strapi multiple errors
    if (Array.isArray(error?.error?.details?.errors)) {
        message = error.error.details.errors.map((e) => e.message).join(", ");
    }

    // Show toast only once per 2 seconds (spam-protection)
    toast.error(message, { id: "api_error" });

    throw error;
}

// -------------------------------------------
//   GET Helper With FULL Error Protection
// -------------------------------------------
export async function get(path: string, params: Record<string, any> = {}) {
    const locale = i18n.language;

    const fullParams = { ...params, locale };
    const query = new URLSearchParams();

    function buildQuery(prefix: string, value: any) {
        if (value === undefined || value === null) return;

        if (typeof value !== "object") {
            query.append(prefix, String(value));
            return;
        }

        Object.entries(value).forEach(([key, val]) =>
            buildQuery(prefix ? `${prefix}[${key}]` : key, val)
        );
    }

    buildQuery("", fullParams);

    const url = `${API_BASE}/api${path}?${query.toString()}`;

    try {
        const res = await fetch(url);

        if (!res.ok) {
            const txt = await res.text();
            let json;

            try {
                json = JSON.parse(txt);
            } catch {
                json = { error: { message: "Invalid server response" } };
            }

            handleApiError(json, url);
        }

        let data;
        try {
            data = await res.json();
        } catch {
            handleApiError(
                { error: { message: "Invalid JSON response from server" } },
                url
            );
        }

        return data;
    } catch (err) {
        handleApiError(err, url);
    }
}
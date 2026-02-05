// src/services/eventService.ts
import { get } from "./apiClient";

interface Pagination {
    page?: number;
    pageSize?: number;
}
type SortParam = string | string[];

export async function fetchEvents({
                                      page = 1,
                                      pageSize = 9,
                                      sort = "date:asc",
                                      populate = {
                                          cover: { fields: ["url", "alternativeText", "formats"] },
                                          eventVideos: {
                                              fields: ["url"],
                                              populate: { thumbnail: { fields: ["url", "alternativeText", "name"] } },
                                          },
                                      },
                                      filters = {},
                                  }: {
    page?: number;
    pageSize?: number;
    sort?: string | string[];
    populate?: any;
    filters?: Record<string, any>;
} = {}) {
    const params = {
        populate,
        pagination: { page, pageSize },
        filters,
        sort,
    };

    const res = await get("/events", params);
    console.log("🔍 Strapi Response:", res);
    return res;
}


export async function fetchEventById(
    id: number | string,
    {
        populate = {
            cover: { fields: ["url", "name", "alternativeText"] },
            images: { fields: ["url", "name", "alternativeText"] },
            eventVideos: {
                fields: ["url"],
                populate: {
                    thumbnail: { fields: ["url", "name", "alternativeText"] }
                }
            }
        },
    }: { populate?: any } = {}
) {
    const params = { populate };
    const res = await get(`/events/${id}`, params);
    return res.data;
}


export async function fetchTestEventYears() {
    // No params needed — simple GET
    const res = await get("/events/years");

    // The response from Strapi is:
    // { years: [2024, 2025, 2026] }
    return res.years || [];
}

export async function fetchTestEventMonths(year: number) {
    const res = await get("/events/months", { year });
    return res.months || [];
}
export async function fetchUpcomingEventYears() {
    // Simple GET — same style like fetchTestEventYears
    const res = await get("/events/upcoming-years");

    // Strapi response:
    // { years: [2025, 2026, 2028] }
    return res.years || [];
}
export async function fetchTestEventsByMonth(
    year: number,
    month: number,
    locale: string = "en"
) {
    const params = {
        year,
        month,
        locale,
        populate: {
            images: { fields: ["url", "formats", "name"] },
            eventVideos: {
                fields: ["url"],
                populate: { thumbnail: { fields: ["url", "alternativeText", "name"] } },
            },
        },
    };

    // Same style as other functions: use get()
    const res = await get("/events/by-month", params);

    // Strapi returns raw array
    return Array.isArray(res) ? res : [];
}
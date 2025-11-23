import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::test-event.test-event",
    ({ strapi }) => ({

        // --------------------------
        // GET YEARS (TRANSLATION AWARE)
        // --------------------------
        async getYears(ctx) {
            try {
                const locale = ctx.query.locale || "en";

                const events = await strapi.db
                    .query("api::test-event.test-event")
                    .findMany({
                        select: ["date"],
                        where: { locale },
                    });

                const years = Array.from(
                    new Set(
                        events
                            .map(ev => ev.date)
                            .filter(Boolean)
                            .map(date => new Date(date).getFullYear())
                    )
                ).sort((a, b) => b - a);

                ctx.body = { years };
            } catch (err) {
                console.error("❌ getYears ERROR:", err);
                ctx.throw(500, "Failed to load years");
            }
        },

        // --------------------------
        // GET MONTHS (TRANSLATION AWARE)
        // --------------------------
        async getMonths(ctx) {
            try {
                const year = Number(ctx.query.year);
                const locale = ctx.query.locale || "en";

                if (!year) {
                    return ctx.badRequest("Missing year param");
                }

                const events = await strapi.db
                    .query("api::test-event.test-event")
                    .findMany({
                        select: ["date"],
                        where: {
                            locale,
                            date: {
                                $gte: `${year}-01-01T00:00:00.000Z`,
                                $lte: `${year}-12-31T23:59:59.999Z`,
                            },
                        },
                    });

                const months = Array.from(
                    new Set(
                        events
                            .map(ev => ev.date)
                            .filter(Boolean)
                            .map(d => new Date(d).getUTCMonth() + 1)
                    )
                ).sort((a, b) => a - b);

                ctx.body = { months };
            } catch (err) {
                console.error("❌ getMonths ERROR:", err);
                ctx.throw(500, "Failed to load months");
            }
        },

        // --------------------------
        // GET UPCOMING YEARS (TRANSLATION AWARE)
        // --------------------------
        async upcomingYears(ctx) {
            try {
                const locale = ctx.query.locale || "en";
                const nowIso = new Date().toISOString();

                const events = await strapi.entityService.findMany(
                    "api::test-event.test-event",
                    {
                        filters: {
                            locale,
                            date: { $gte: nowIso },
                        },
                        fields: ["date"],
                        limit: 9999,
                    }
                );

                const years = Array.from(
                    new Set(events.map(e => new Date(e.date).getFullYear()))
                ).sort((a, b) => a - b);

                ctx.body = { years };
            } catch (err) {
                console.error("❌ upcomingYears ERROR:", err);
                ctx.throw(500, "Failed to load upcoming years");
            }
        },

        // ----------------------------------------------------
        // 🔥 FIX: GET EVENTS BY MONTH (TRANSLATION-AWARE)
        // ----------------------------------------------------
        async byMonth(ctx) {
            try {
                const year = Number(ctx.query.year);
                const month = Number(ctx.query.month);
                const locale = ctx.query.locale || "en";

                if (!year || !month) {
                    return ctx.badRequest("Missing year or month");
                }

                const start = new Date(Date.UTC(year, month - 1, 1)).toISOString();
                const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString();

                const events = await strapi.entityService.findMany(
                    "api::test-event.test-event",
                    {
                        filters: {
                            locale, // ⭐ FILTER BY LOCALE FIRST (THE FIX)
                            date: {
                                $gte: start,
                                $lte: end
                            }
                        },
                        populate: {
                            images: {
                                fields: ["url", "alternativeText", "formats", "name"]
                            }
                        },
                        limit: 9999,
                        sort: { date: "desc" }
                    }
                );

                ctx.body = events;

            } catch (err) {
                console.error("❌ byMonth ERROR:", err);
                ctx.throw(500, "Failed to load events for this month");
            }
        }

    })
);

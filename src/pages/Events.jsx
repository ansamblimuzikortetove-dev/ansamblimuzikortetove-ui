/* ——————————————————————————
     FIXED EVENTS MONTH COMPONENT (FULL)
   —————————————————————————— */

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import CloudImage from "../components/CloudImage";
import { FiChevronDown } from "react-icons/fi";
import {
    fetchEvents,
    fetchTestEventYears,
} from "../services/eventService.ts";
import SelectInput from "../components/SelectInput.jsx";
import { useTranslation } from "react-i18next";
import GoldSpinner from "../components/GoldSpinner.jsx"; // NEW ✔

const PAGE_SIZE = 4;

/* ————— HELPERS ————— */

function getUrl(u) {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    return `${import.meta.env.VITE_API_URL}${u}`;
}

function monthLabel(m, t) {
    const key = `months.${m}`;
    return t(key);
}

function getUtcMonthRange(year, month) {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return { start: start.toISOString(), end: end.toISOString() };
}

/* ————————————————————
     MAIN COMPONENT
———————————————————— */

export default function Events() {
    const { t, i18n } = useTranslation();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [monthsData, setMonthsData] = useState({});
    const monthRefs = useRef({});

    const [yearOptions, setYearOptions] = useState([]);
    const [year, setYear] = useState(currentYear);
    const [loadingYears, setLoadingYears] = useState(true);

    /* ——— Load years ——— */
    useEffect(() => {
        async function loadYears() {
            setLoadingYears(true);

            try {
                const years = await fetchTestEventYears(i18n.language);

                if (years.length) {
                    setYearOptions(
                        years
                            .sort((a, b) => a - b)
                            .filter((y) => y >= currentYear)
                    );

                    setYear(years[0]); // default first available
                }
            } catch (err) {
                console.error("Failed to load years:", err);
            } finally {
                setLoadingYears(false);
            }
        }

        setMonthsData({});
        loadYears();
    }, [i18n.language]);

    /* ——— Toggle month accordion ——— */
    function toggleMonth(month) {
        const key = `${year}-${month}`;
        const data = monthsData[key];

        setMonthsData((prev) => {
            const updated = {};

            Object.keys(prev).forEach((k) => {
                updated[k] = { ...prev[k], open: false };
            });

            updated[key] = { ...prev[key], open: !data?.open };

            return updated;
        });

        if (!data?.events) loadMonthEvents(year, month);
    }

    /* ——— Load month events ——— */
    async function loadMonthEvents(year, month) {
        const key = `${year}-${month}`;
        const info = monthsData[key];
        const page = info?.page || 1;

        const nowIso = new Date().toISOString();
        const { start, end } = getUtcMonthRange(year, month);

        // set loading for button but NOT global
        setMonthsData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                buttonLoading: true // NEW ✔
            }
        }));

        const res = await fetchEvents({
            page,
            pageSize: PAGE_SIZE,
            sort: "date:asc",
            filters: {
                $and: [
                    { date: { $gte: nowIso } },
                    { date: { $gte: start } },
                    { date: { $lte: end } },
                ]
            },
            populate: {
                cover: { fields: ["url", "alternativeText", "formats"] },
            }
        });

        const mapped = res.data.map(it => ({
            id: it.id,
            documentId: it.documentId,
            title: it.name,
            date: it.date,
            location: it.location,
            image:
                it.cover?.url ||
                it.cover?.formats?.medium?.url ||
                it.cover?.formats?.large?.url ||
                ""
        }));

        setMonthsData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                buttonLoading: false,     // NEW ✔
                loadingMore: false,
                open: true,
                events: [...(prev[key]?.events || []), ...mapped],
                page: page + 1,
                hasMore: res.meta.pagination.page < res.meta.pagination.pageCount
            }
        }));
    }


    /* ————————————————————————————————————————
     🔥 UI STARTS HERE — FULL BEAUTIFUL VERSION
    ————————————————————————————————————————— */

    return (
        <section className="container-max py-12 space-y-10">
            {/* HEADER + YEAR SELECT */}
            <div className="flex justify-between items-center mb-8 px-2">
                <h1 className="text-3xl font-bold text-accent animate-fadeDown">
                    {t("events.title")}
                </h1>

                <SelectInput
                    key={year}
                    label={t("events.year")}
                    value={year}
                    onChange={(e) => {
                        const y = Number(e.target.value);
                        setYear(y);
                        setMonthsData({});
                    }}
                    loading={loadingYears}
                    options={
                        loadingYears
                            ? []
                            : yearOptions.map((y) => ({ label: y, value: y }))
                    }
                    placeholder={loadingYears ? t("events.loading") : t("events.selectYear")}
                    className="w-32"
                />
            </div>

            {/* MONTH ACCORDIONS */}
            {Array.from({ length: 12 }).map((_, i) => {
                const month = i + 1;
                const key = `${year}-${month}`;
                const data = monthsData[key];
                const isOpen = data?.open;

                if (year < currentYear) return null;
                if (year === currentYear && month < currentMonth) return null;

                return (
                    <div
                        key={key}
                        ref={(el) => (monthRefs.current[key] = el)}
                        className="border border-white/10 rounded-xl bg-black/20
                                   backdrop-blur-md shadow-xl transition-all duration-300"
                    >
                        {/* HEADER */}
                        <button
                            onClick={() => toggleMonth(month)}
                            className="w-full flex justify-between items-center px-6 py-4
                                       hover:bg-white/5 transition group"
                        >
                            <span className="text-xl font-medium group-hover:text-accent transition">
                                {monthLabel(month, t)} {year}
                            </span>

                            <FiChevronDown
                                size={22}
                                className={`text-accent transition-transform duration-300 ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* CONTENT */}
                        <div
                            className={`transition-all duration-500 overflow-hidden ${
                                isOpen
                                    ? "max-h-[9999px] opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            <div className="p-4 sm:p-6 space-y-6">

                                {/* LOADING FIRST EVENTS */}
                                {!data?.events && data?.open && (
                                    <div className="py-12 flex justify-center">
                                        <GoldSpinner size={40} />
                                    </div>
                                )}

                                {/* NO EVENTS */}
                                {data?.events && data.events.length === 0 && (
                                    <div className="py-16 flex flex-col items-center">
                                        <div className="text-accent text-5xl mb-4">🎻</div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            {t("events.noEvents")} {/* 🔥 NEW */}
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            {t("events.checkAnotherMonth")} {/* 🔥 NEW */}
                                        </p>
                                    </div>
                                )}

                                {/* EVENTS GRID */}
                                {data?.events && data.events.length > 0 && (
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                        {data.events.map((e, idx) => (
                                            <EventCard key={e.id} event={e} idx={idx} />
                                        ))}
                                    </div>
                                )}

                                {/* LOAD MORE BUTTON */}
                                {data?.hasMore && (
                                    <button
                                        onClick={() => loadMonthEvents(year, month)}
                                        disabled={data?.buttonLoading}
                                        className="
            relative mx-auto px-6 py-3 rounded-full
            flex items-center justify-center gap-3
            bg-white/5 border border-white/10 backdrop-blur-md
            text-white text-sm font-medium tracking-wide uppercase
            transition-all duration-300
            hover:bg-white/10 hover:border-white/20
            hover:shadow-lg hover:shadow-accent/20
            active:scale-[0.97]
            disabled:opacity-60 disabled:cursor-not-allowed
        "
                                    >

                                        {data?.buttonLoading ? (
                                            <div className="flex items-center gap-2">
                                                <GoldSpinner size={18} />
                                                <span>{t("events.loadingMore")}</span> {/* 🔥 NEW */}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>{t("events.loadMore")}</span> {/* 🔥 NEW */}
                                                <FiChevronDown size={18} className="text-accent" />
                                            </div>
                                        )}
                                    </button>
                                )}


                                {/* AUTO LOAD-MORE SPINNER */}
                                {data?.loadingMore && (
                                    <div className="py-6 flex justify-center">
                                        <GoldSpinner size={28} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

/* ——————————————————————————
       EVENT CARD
—————————————————————————— */

function EventCard({ event: e, idx }) {
    const { t } = useTranslation();

    const d = new Date(e.date);
    const day = d.getUTCDate();
    const monthShort = d
        .toLocaleDateString(undefined, {
            month: "short",
            timeZone: "UTC",
        })
        .toUpperCase();

    return (
        <div
            className="rounded-xl overflow-hidden bg-black/30 shadow-md backdrop-blur-sm
                       transition hover:-translate-y-1 hover:shadow-gold opacity-0 animate-fadeUp"
            style={{ animationDelay: `${idx * 70}ms` }}
        >
            <Link to={`/events/${e.documentId}`} className="block">
                {/* IMAGE */}
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl">
                    <CloudImage
                        src={getUrl(e.image)}
                        alt={e.title}
                        className="object-cover w-full h-full"
                    />

                    {/* DATE BADGE */}
                    <div className="absolute left-3 top-3 bg-black/70 rounded-xl px-3 py-2 text-center leading-none shadow">
                        <div className="text-xl font-extrabold text-accent">{day}</div>
                        <div className="text-[10px] text-slate-300 tracking-wider">
                            {monthShort}
                        </div>
                    </div>
                </div>

                {/* TEXT */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">{e.title}</h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                        {e.location || t("events.unknownLocation")}
                    </p>
                </div>
            </Link>
        </div>
    );
}
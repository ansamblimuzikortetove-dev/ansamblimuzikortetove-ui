import React, { useEffect, useState, useCallback, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";
import { flushSync } from "react-dom";
import {
    fetchEvents,
    fetchTestEventMonths,
    fetchTestEventYears,
} from "../services/eventService.ts";
import CloudImage from "../components/CloudImage";
import SelectInput from "../components/SelectInput.jsx";
import { useTranslation } from "react-i18next";
import GoldSpinner from "../components/GoldSpinner.jsx";
import LightboxGallery from "../components/LightboxGallery.jsx";

const INITIAL_EVENTS = 4;
const LOAD_MORE = 4;

const CHUNK_INITIAL = 12;
const CHUNK_MORE = 4;

/* -------------------- HELPERS -------------------- */

function getUrl(u) {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}${u}`;
}

function monthLabel(month, t) {
    const monthName = new Date(2025, month - 1, 1).toLocaleDateString(undefined, {
        month: "long",
    });
    return t(`gallery.months.${monthName.toLowerCase()}`, monthName);
}

function getUtcMonthRange(year, month) {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
    return {
        start: start.toISOString(),
        end: end.toISOString(),
    };
}

/* -------------------- CHUNKED IMAGES -------------------- */

function useChunkedImages(all = []) {
    const [visible, setVisible] = useState(CHUNK_INITIAL);
    const hasMore = visible < all.length;

    const load = () => {
        if (hasMore) setVisible((v) => v + CHUNK_MORE);
    };

    const reset = () => setVisible(CHUNK_INITIAL);

    return {
        visibleImages: all.slice(0, visible),
        hasMore,
        load,
        reset,
    };
}

function PanelImages({ images, onOpen }) {
    const { visibleImages, hasMore, load, reset } = useChunkedImages(images);
    const sentinelRef = useRef(null);

    useEffect(() => {
        reset();
    }, [images]);

    useEffect(() => {
        if (!sentinelRef.current) return;

        const obs = new IntersectionObserver(
            (entries) => {
                const isVisible = entries[0].isIntersecting;
                if (isVisible && hasMore) load();
            },
            { rootMargin: "400px" }
        );

        obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [visibleImages.length, hasMore, load]);

    return (
        <div className="max-h-[70vh] overflow-auto pr-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {visibleImages.map((img, idx) => (
                    <button
                        key={img.id || idx}
                        type="button"
                        onClick={() => onOpen(images, idx)}
                        className="rounded-lg overflow-hidden shadow bg-black/20 hover:scale-[1.02] transition"
                    >
                        <CloudImage
                            src={getUrl(img.url)}
                            alt={img.name || ""}
                            placeholder={
                                img.formats?.thumbnail?.url &&
                                getUrl(img.formats.thumbnail.url)
                            }
                            className="w-full h-48 object-cover"
                        />
                    </button>
                ))}
            </div>

            <div ref={sentinelRef} className="text-center py-2">
                {hasMore && (
                    <div className="w-6 h-6 mx-auto border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                )}
            </div>
        </div>
    );
}

/* -------------------- MAIN COMPONENT -------------------- */

export default function Gallery() {
    const { t, i18n } = useTranslation();
    const locale = i18n.language || "en";

    const currentYear = new Date().getFullYear();

    const [yearOptions, setYearOptions] = useState([]);
    const [loadingYears, setLoadingYears] = useState(true);

    const [monthOptions, setMonthOptions] = useState([]);
    const [loadingMonths, setLoadingMonths] = useState(true);

    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(0);

    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [openId, setOpenId] = useState(null);

    const [lbOpen, setLbOpen] = useState(false);
    const [lbSlides, setLbSlides] = useState([]);
    const [lbIndex, setLbIndex] = useState(0);

    const sentinelRef = useRef(null);
    const isFetching = useRef(false);

    /* -------------------- LOAD YEARS -------------------- */

    useEffect(() => {
        let mounted = true;

        async function loadYears() {
            try {
                const years = await fetchTestEventYears(locale);

                if (mounted && years.length > 0) {
                    setYearOptions(years.sort((a, b) => b - a));
                }
            } catch (err) {
                console.error("Failed to load years:", err);
            } finally {
                if (mounted) setLoadingYears(false);
            }
        }

        loadYears();

        return () => (mounted = false);
    }, [locale]);

    /* -------------------- LOAD MONTHS -------------------- */

    useEffect(() => {
        if (!year) return;

        let mounted = true;

        async function loadMonths() {
            setLoadingMonths(true);
            try {
                const months = await fetchTestEventMonths(year, locale);
                if (mounted) setMonthOptions(months);
            } catch (err) {
                console.error("Failed to load months:", err);
            } finally {
                if (mounted) setLoadingMonths(false);
            }
        }

        loadMonths();

        return () => (mounted = false);
    }, [year, locale]);

    /* -------------------- FETCH EVENTS -------------------- */

    const loadEvents = useCallback(async () => {
        if (isFetching.current || !hasMore) return;
        isFetching.current = true;

        let filters = {
            locale: { $eq: locale },
        };

        if (month > 0) {
            const { start, end } = getUtcMonthRange(year, month);
            filters = {
                locale: { $eq: locale },
                date: { $gte: start, $lte: end },
            };
        } else {
            filters = {
                locale: { $eq: locale },
                date: {
                    $gte: new Date(`${year}-01-01T00:00:00.000Z`).toISOString(),
                    $lte: new Date(`${year}-12-31T23:59:59.999Z`).toISOString(),
                },
            };
        }

        const res = await fetchEvents({
            page,
            pageSize: page === 1 ? INITIAL_EVENTS : LOAD_MORE,
            sort: "date:desc",
            filters,
            populate: {
                images: { fields: ["url", "alternativeText", "formats", "name"] },
            },
        });

        if (res?.data?.length) {
            const mapped = res.data.map((it) => ({
                id: it.id,
                title: it.name,
                date: it.date,
                location: it.location,
                images: it.images || [],
            }));

            flushSync(() => {
                setEvents((prev) => [...prev, ...mapped]);
            });

            const meta = res.meta?.pagination;
            if (!meta || meta.page >= meta.pageCount) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }

        isFetching.current = false;
    }, [page, hasMore, year, month, locale]);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    /* -------------------- RESET WHEN FILTERS CHANGE -------------------- */

    useEffect(() => {
        setEvents([]);
        setPage(1);
        setHasMore(true);
        isFetching.current = false;
    }, [year, month, locale]);

    /* -------------------- INFINITE SCROLL -------------------- */

    useEffect(() => {
        if (!sentinelRef.current) return;

        const obs = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching.current) {
                    setPage((p) => p + 1);
                }
            },
            { rootMargin: "300px" }
        );

        obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [events.length, hasMore]);

    /* -------------------- LIGHTBOX -------------------- */

    const openLightbox = (imgs, index) => {
        setLbSlides(
            imgs.map((img) => ({
                src: getUrl(img.url),
                description: img.name || "",
            }))
        );
        setLbIndex(index);
        setLbOpen(true);
    };

    /* -------------------- UI -------------------- */

    return (
        <section className="container-max py-12 space-y-10">
            {/* FILTERS */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                <h1 className="h-serif text-3xl font-bold text-accent">
                    {t("gallery.title")}
                </h1>

                <div className="flex items-center gap-3">
                    {/* YEAR */}
                    <SelectInput
                        label={t("gallery.year")}
                        value={year}
                        onChange={(e) => {
                            const y = Number(e.target.value);
                            setYear(y);
                            setMonth(0);
                        }}
                        loading={loadingYears}
                        options={yearOptions.map((y) => ({ label: y, value: y }))}
                        placeholder={t("gallery.selectYear")}
                    />

                    {/* MONTH */}
                    <SelectInput
                        label={t("gallery.month")}
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        loading={loadingMonths}
                        options={[
                            { label: t("gallery.allMonths"), value: 0 },
                            ...monthOptions.map((m) => ({
                                label: monthLabel(m, t),
                                value: m,
                            })),
                        ]}
                        placeholder={t("gallery.selectMonth")}
                    />

                </div>
            </div>

            {/* ACCORDIONS */}
            {events.map((ev) => {
                const isOpen = openId === ev.id;

                return (
                    <div
                        key={ev.id}
                        className="border border-white/10 rounded-xl bg-black/20 backdrop-blur-md shadow-xl transition-all"
                    >
                        <button
                            onClick={() => setOpenId(isOpen ? null : ev.id)}
                            className="w-full flex justify-between items-center px-6 py-4 hover:bg-white/5 transition group"
                        >
                            <div className="text-left space-y-1">
                                <h3 className="font-semibold text-lg group-hover:text-accent transition">
                                    {ev.title}
                                </h3>

                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                    <span>
                                        {new Date(ev.date).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                    <span className="opacity-50">•</span>
                                    <span>{ev.location || t("gallery.unknownLocation")}</span>
                                    <span className="opacity-50">•</span>
                                    <span>
                                        {ev.images.length} {t("gallery.pictures")}
                                    </span>
                                </div>
                            </div>

                            <FiChevronDown
                                size={22}
                                className={`text-accent transition-transform duration-300 ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        <div
                            className={`transition-all duration-500 overflow-hidden ${
                                isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
                            }`}
                        >
                            <div className="p-5">
                                {ev.images.length === 0 ? (
                                    <div className="py-10 text-center text-slate-400">
                                        <div className="text-4xl mb-3">📷</div>
                                        <p>{t("gallery.noImages")}</p>
                                    </div>
                                ) : (
                                    <PanelImages images={ev.images} onOpen={openLightbox} />
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* LOAD MORE SENTINEL */}
            {hasMore && (
                <div ref={sentinelRef} className="py-10 flex justify-center items-center">
                    <GoldSpinner size={36} />
                </div>
            )}

            {!loadingYears && !loadingMonths && events.length === 0 && (
                <div className="py-16 text-center text-slate-400">
                    <div className="text-4xl mb-3">🎻</div>
                    <p>{t("gallery.noEvents")}</p>
                </div>
            )}

            {/* LIGHTBOX */}
            <LightboxGallery
                images={lbSlides}
                open={lbOpen}
                index={lbIndex}
                onClose={() => setLbOpen(false)}
                onIndexChange={setLbIndex}
            />
        </section>
    );
}
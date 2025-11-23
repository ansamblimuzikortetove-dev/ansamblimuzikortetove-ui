import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchEvents } from "../services/eventService.ts";
import CloudImage from "../components/CloudImage";
import {useTranslation} from "react-i18next";
import GoldSpinner from "../components/GoldSpinner.jsx";

const PAGE_SIZE = 2;

function getUrl(u) {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}${u}`;
}

export default function PastEvents() {
    const [initialized, setInitialized] = useState(false);
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { i18n } = useTranslation();


    const loadingRef = useRef(null);
    const isFetching = useRef(false);

    const loadEvents = useCallback(async () => {
        if (isFetching.current || !hasMore) return;
        isFetching.current = true;

        const now = new Date().toISOString();

        const res = await fetchEvents({
            page,
            pageSize: PAGE_SIZE,
            filters: { date: { $lt: now } },
            sort: "date:desc",
            populate: { cover: { fields: ["url", "alternativeText", "formats"] } },
            locale: i18n.language,
        });

        const items = res?.data || [];
        if (items.length > 0) {
            const mapped = items.map((it) => ({
                id: it.id,
                documentId: it.documentId,
                title: it.name,
                description: it.description,
                date: new Date(it.date).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    timeZone: "UTC",
                }),
                image: it.cover?.url || "",
                location: it.location,
            }));

            setEvents(prev => [...prev, ...mapped]);
            setInitialized(true);
            const meta = res.meta?.pagination;
            if (!meta || meta.page >= meta.pageCount) setHasMore(false);
        } else {
            setHasMore(false);
        }

        isFetching.current = false;
    }, [page, hasMore, i18n.language]);


    console.log(i18n.language)

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);



    useEffect(() => {
        isFetching.current = false;
        setEvents([]);
        setPage(1);
        setHasMore(true);
    }, [i18n.language]);



    // FALLBACK FAST SCROLL
    useEffect(() => {
        let lastY = window.scrollY;
        let lastTime = Date.now();

        const onScroll = () => {
            if (!hasMore || isFetching.current) return;

            const now = Date.now();
            const y = window.scrollY;

            const velocity = Math.abs(y - lastY) / (now - lastTime);
            lastY = y;
            lastTime = now;

            const FAST_SCROLL = velocity > 1.2;
            const nearBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 100;

            if (FAST_SCROLL && nearBottom) {
                setPage((p) => p + 1);
            }
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [hasMore]);

    // PRIMARY IntersectionObserver
    useEffect(() => {
        if (!loadingRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !isFetching.current && hasMore) {
                    setPage((p) => p + 1);
                }
            },
            {
                root: null,
                rootMargin: "400px",
                threshold: 0,
            }
        );

        observer.observe(loadingRef.current);
        return () => observer.disconnect();
    }, [hasMore]);


    return (
        <section className="container-max py-20 relative">
            <h1 className="text-4xl font-bold text-accent text-center mb-16">
                Past Performances
            </h1>
            {events.length === 0 && hasMore && (
                <div className="py-20 flex justify-center">
                    <GoldSpinner size={40} />
                </div>
            )}

            <div className="relative">
                {/* Timeline vertical line */}
                <div className="absolute top-0 bottom-0 w-1
                    bg-gradient-to-b from-accent/60 via-accent/20 to-transparent
                    left-6 md:left-1/2 -translate-x-1/2 animate-lineGrow origin-top"
                />

                <div className="space-y-20 relative">
                    {events.map((event, i) => {
                        const isEven = i % 2 === 0;

                        return (
                            <Link
                                to={`/events/${event.documentId}`}
                                key={event.documentId}
                                className={`relative flex flex-col md:flex-row items-start md:items-stretch group
                                ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
                                opacity-0 animate-fadeUp pl-12 pr-4 md:pl-0`}
                                style={{ animationDelay: `${i * 150}ms` }}
                            >
                                {/* Timeline dot */}
                                <div
                                    className="absolute z-10 left-6 md:left-1/2 -translate-x-1/2
                                    w-5 h-5 rounded-full bg-accent border-4 border-black/80
                                    shadow-gold group-hover:scale-125 transition-transform duration-300 ml-0.5"
                                />

                                {/* IMAGE */}
                                <div className="w-full md:w-1/2 flex justify-center md:px-4">
                                    <div className="w-full max-w-lg aspect-[16/9] rounded-3xl overflow-hidden shadow-gold">
                                        <CloudImage
                                            src={getUrl(event.image)}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                </div>

                                {/* CONTENT */}
                                <div className="w-full md:w-1/2 flex flex-col justify-center mt-6 md:mt-0 px-3 sm:px-6 md:px-8">
                                    <div
                                        className={`
                                            p-6 flex flex-col rounded-2xl bg-black/40 border border-white/10
                                            backdrop-blur-md shadow-md group-hover:bg-black/50 transition duration-300
                                            ${isEven ? "md:ml-12 md:text-left" : "md:mr-12 md:text-right"}
                                        `}
                                    >
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-semibold text-accent break-words">
                                                {event.title}
                                            </h2>

                                            <p className="text-sm text-slate-400 mt-1 italic">
                                                {event.date}
                                            </p>

                                            <div
                                                className="line-clamp-3 mt-3 text-slate-300 leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: event.description || "",
                                                }}
                                            />

                                            <p className="text-xs text-slate-500 mt-3">
                                                {event.location}
                                            </p>
                                        </div>

                                        {/* View Details ALWAYS stays inside */}
                                        <span className="inline-block mt-4 text-sm font-semibold text-accent opacity-90 group-hover:text-accent transition">
                                            View Details →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {initialized && hasMore && (
                <div
                    ref={loadingRef}
                    className="py-14 flex justify-center items-center"
                >
                    <GoldSpinner size={34} />
                </div>
            )}

        </section>
    );
}
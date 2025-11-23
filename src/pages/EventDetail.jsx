import React, {
    useEffect,
    useMemo,
    useState,
    useCallback,
    useRef,
} from "react";
import {useParams, Link, useNavigate} from "react-router-dom";
import { fetchEventById } from "../services/eventService.ts";
import CloudImage from "../components/CloudImage";
import LightboxGallery from "../components/LightboxGallery.jsx";
import GoldSpinner from "../components/GoldSpinner.jsx";
import {FiArrowLeft} from "react-icons/fi";

/* ---------------- CONSTANTS ---------------- */
const CHUNK_INITIAL = 9;
const CHUNK_MORE = 3;

/* ---------------- HELPERS ---------------- */
function getImageUrl(img) {
    if (!img?.url) return "";
    if (img.url.startsWith("http")) return img.url;
    const base = import.meta.env.VITE_API_URL || "";
    return `${base}${img.url}`;
}

function formatDateTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString(undefined, {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
}
/* ---------------- CHUNK HOOK ---------------- */
function useChunkedImages(allImages = []) {
    const [visibleCount, setVisibleCount] = useState(CHUNK_INITIAL);

    const visibleImages = useMemo(
        () => allImages.slice(0, visibleCount),
        [allImages, visibleCount]
    );

    const hasMore = visibleCount < allImages.length;

    const loadMore = useCallback(() => {
        setVisibleCount((prev) =>
            Math.min(prev + CHUNK_MORE, allImages.length)
        );
    }, [allImages.length]);

    const reset = useCallback(() => {
        setVisibleCount(CHUNK_INITIAL);
    }, []);

    return { visibleImages, hasMore, loadMore, reset };
}

/* ---------------- MAIN SCREEN ---------------- */
export default function EventDetail() {
    const { documentId } = useParams();
    const [event, setEvent] = useState(null);
    const sentinelRef = useRef(null);
    const observerRef = useRef(null);
    const navigate = useNavigate();


    /* ---------------- FETCH EVENT ---------------- */
    useEffect(() => {
        if (!documentId) return;
        setEvent(null); // show skeleton again when navigating to new event

        fetchEventById(documentId).then((res) => setEvent(res));
    }, [documentId]);

    /* ---------------- LOADING STATE ---------------- */
    const loading = !event;

    /* ---------------- GALLERY SETUP ---------------- */
    const images = event?.images || [];
    const { visibleImages, hasMore, loadMore, reset } = useChunkedImages(images);

    useEffect(() => reset(), [images]);

    /* ---------------- SCROLL OBSERVER (FIXED) ---------------- */
    useEffect(() => {
        if (!sentinelRef.current) return;

        // destroy existing observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    if (hasMore) loadMore();
                }
            },
            {
                rootMargin: "300px",
                threshold: 0,
            }
        );

        observerRef.current.observe(sentinelRef.current);

        return () => observerRef.current?.disconnect();
    }, [hasMore, loadMore, visibleImages.length]);

    /* ---------------- LIGHTBOX ---------------- */
    const [lbOpen, setLbOpen] = useState(false);
    const [lbIndex, setLbIndex] = useState(0);
    const [lbSlides, setLbSlides] = useState([]);

    const openLightbox = useCallback(
        (idx) => {
            const slides = images.map((img) => ({
                src: getImageUrl(img),
                description: img.name,
            }));
            setLbSlides(slides);
            setLbIndex(idx);
            setLbOpen(true);
        },
        [images]
    );

    /* ---------------- SKELETON ---------------- */
    if (loading) {
        return (
            <div className="animate-pulse min-h-screen bg-black">
                <div className="h-[45vh] bg-white/10 w-full"></div>
                <div className="container-max py-10 space-y-4">
                    <div className="h-6 bg-white/10 rounded w-1/3"></div>
                    <div className="h-4 bg-white/10 rounded w-full"></div>
                    <div className="h-4 bg-white/10 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    /* ---------------- EVENT FIELDS ---------------- */
    const coverImage = event?.cover
        ? getImageUrl(
            event.cover.formats?.large ||
            event.cover.formats?.medium ||
            event.cover.formats?.small ||
            event.cover
        )
        : null;

    const eventDateLabel = event?.date ? formatDateTime(event.date) : "";
    const dateObj = event?.date ? new Date(event.date) : null;
    const dayBadge = dateObj ? dateObj.getUTCDate() : "";
    const monthBadge = dateObj
        ? dateObj
            .toLocaleDateString(undefined, {
                month: "short",
                timeZone: "UTC",
            })
            .toUpperCase()
        : "";

    return (
        <div className="min-h-screen bg-black">

            <div className="relative h-[45vh] w-full overflow-hidden">
                {/* PREMIUM BACK BUTTON (TOP-LEFT) */}
                <button
                    onClick={() => navigate(-1)}
                    className="
        absolute top-6 left-6 z-50
        flex items-center gap-2
        px-3 py-2 rounded-xl
        bg-black/40 backdrop-blur-md
        border border-white/10
        text-slate-200
        hover:text-accent hover:border-accent/50
        transition-all duration-300
        shadow-lg hover:shadow-accent/20
    "
                >
                    <FiArrowLeft
                        className="
            text-xl text-accent
            transition-all duration-300
            group-hover:-translate-x-1
        "
                    />
                    <span className="hidden sm:inline text-sm">Back</span>
                </button>

                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={event?.name || "Event cover"}
                        className="absolute inset-0 w-full h-full object-cover scale-105 opacity-70"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-slate-900 to-black"/>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"/>

                <div className="relative container-max h-full flex items-end pb-10">
                    <div className="flex flex-col gap-3 animate-fadeUp">
                        {loading ? (
                            <>
                                <div className="h-8 w-56 rounded bg-white/10 animate-pulse"/>
                                <div className="h-4 w-32 rounded bg-white/5 animate-pulse"/>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl sm:text-5xl font-bold text-accent drop-shadow-2xl">
                                    {event?.name}
                                </h1>
                                {eventDateLabel && (
                                    <p className="text-sm text-slate-200">
                                        {eventDateLabel}
                                        {event?.location ? ` • ${event.location}` : ""}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* date badge */}
                    {!loading && dateObj && (
                        <div
                            className="ml-auto mb-2 mr-2 sm:mr-6 bg-black/80 border border-accent/50 rounded-2xl px-3 py-2 text-center shadow-lg">
                            <div className="text-xs text-slate-300 tracking-wide">DATE</div>
                            <div className="text-2xl font-extrabold text-accent leading-none">
                                {dayBadge}
                            </div>
                            <div className="text-[10px] text-slate-400 tracking-[0.2em] mt-1">
                                {monthBadge}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT */}
            <section className="container-max py-10">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    {/* LEFT: Description */}
                    <div className="space-y-4">
                        <div
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl animate-fadeUp">
                            <h2 className="text-xl font-semibold mb-3 text-accent">
                                About This Event
                            </h2>

                            {loading ? (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-4 bg-white/10 rounded w-11/12"/>
                                    <div className="h-4 bg-white/10 rounded w-10/12"/>
                                    <div className="h-4 bg-white/10 rounded w-9/12"/>
                                    <div className="h-4 bg-white/10 rounded w-8/12"/>
                                </div>
                            ) : (
                                <p className="text-slate-300 leading-relaxed">
                                    {event?.description}
                                </p>
                            )}
                        </div>

                        {/* Event Info / Program */}
                        <div
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl animate-fadeUp">
                            <h2 className="text-xl font-semibold mb-3 text-accent">
                                Event Info
                            </h2>

                            {loading ? (
                                <div className="space-y-2 animate-pulse">
                                    <div className="h-4 bg-white/10 rounded w-3/4"/>
                                    <div className="h-4 bg-white/10 rounded w-4/5"/>
                                    <div className="h-4 bg-white/10 rounded w-2/3"/>
                                </div>
                            ) : event?.eventInfo ? (
                                <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                                    {event.eventInfo}
                                </p>
                            ) : (
                                <p className="text-slate-500 text-sm">
                                    Additional program information will be announced soon.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Meta card */}
                    <aside className="space-y-4 animate-fadeUp">
                        <div className="bg-black/60 border border-white/10 rounded-2xl p-6 backdrop-blur-lg shadow-xl">
                            <h3 className="text-lg font-semibold mb-4 text-accent">
                                Event Details
                            </h3>

                            <dl className="space-y-3 text-sm text-slate-200">
                                <div>
                                    <dt className="text-slate-400">Date & Time</dt>
                                    <dd className="font-medium">
                                        {eventDateLabel || "TBA"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-slate-400">Location</dt>
                                    <dd className="font-medium">
                                        {event?.location || "To be announced"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-slate-400">Document ID</dt>
                                    <dd className="font-mono text-xs text-slate-400 break-all">
                                        {event?.documentId}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-slate-400">Created</dt>
                                    <dd className="text-xs text-slate-400">
                                        {event?.createdAt
                                            ? formatDateTime(event.createdAt)
                                            : "—"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-slate-400">Last Updated</dt>
                                    <dd className="text-xs text-slate-400">
                                        {event?.updatedAt
                                            ? formatDateTime(event.updatedAt)
                                            : "—"}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </aside>
                </div>
            </section>

            {/* ---------------- GALLERY ---------------- */}
            <section className="container-max pb-10">
                <h3 className="text-2xl font-semibold text-accent mb-4">Event Gallery</h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {visibleImages.map((img, idx) => (
                        <button
                            key={img.id || idx}
                            onClick={() => openLightbox(idx)}
                            className="rounded-xl overflow-hidden bg-white/10 hover:bg-white/20 transition shadow-lg hover:-translate-y-1"
                        >
                            <CloudImage
                                src={getImageUrl(img)}
                                alt={img.name}
                                className="w-full h-48 object-cover"
                            />
                        </button>
                    ))}
                </div>

                <div ref={sentinelRef}>
                    {hasMore &&     <GoldSpinner size={30} /> }
                </div>

                <LightboxGallery
                    images={lbSlides}
                    open={lbOpen}
                    index={lbIndex}
                    onClose={() => setLbOpen(false)}
                    onIndexChange={setLbIndex}
                />
            </section>


        </div>
    );
}
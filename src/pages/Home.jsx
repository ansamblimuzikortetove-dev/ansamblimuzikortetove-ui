import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EventCard from "../components/EventCard";
import GoldSpinner from "../components/GoldSpinner.jsx";
import { fetchEvents } from "../services/eventService.ts";
import bgImage from "../assets/home-bg.png";


export default function Home() {
    const { t, i18n } = useTranslation();

    // ------------------------------
    // State
    // ------------------------------
    const [upcoming, setUpcoming] = useState([]);
    const [loadingUpcoming, setLoadingUpcoming] = useState(true);

    const [past, setPast] = useState([]);
    const [loadingPast, setLoadingPast] = useState(true);

    // ------------------------------
    // Fetch Upcoming Events
    // ------------------------------
    useEffect(() => {
        const loadUpcoming = async () => {
            setLoadingUpcoming(true);
            const now = new Date().toISOString();

            const res = await fetchEvents({
                page: 1,
                pageSize: 3,
                filters: { date: { $gte: now } },
                sort: "date:asc",
                populate: { cover: { fields: ["url", "alternativeText", "formats"] } },
                locale: i18n.language,
            });

            const items = res?.data || [];

            const mapped = items.map((it) => ({
                id: it.documentId,
                documentId: it.documentId,
                title: it.name,
                description: it.description,
                image: it.cover?.url || "",
                location: it.location,
                date: new Date(it.date).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    timeZone: "UTC",
                }),
            }));

            setUpcoming(mapped);
            setLoadingUpcoming(false);
        };

        loadUpcoming();
    }, [i18n.language]);

    // ------------------------------
    // Fetch Past Events
    // ------------------------------
    useEffect(() => {
        const loadPast = async () => {
            setLoadingPast(true);
            const now = new Date().toISOString();

            const res = await fetchEvents({
                page: 1,
                pageSize: 3,
                filters: { date: { $lt: now } },
                sort: "date:desc",
                populate: { cover: { fields: ["url", "alternativeText", "formats"] } },
                locale: i18n.language,
            });

            const items = res?.data || [];

            const mapped = items.map((it) => ({
                id: it.documentId,
                documentId: it.documentId,
                title: it.name,
                description: it.description,
                image: it.cover?.url || "",
                location: it.location,
                date: new Date(it.date).toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                    day: "numeric",
                    timeZone: "UTC",
                }),
            }));

            setPast(mapped);
            setLoadingPast(false);
        };

        loadPast();
    }, [i18n.language]);

    return (
        <div className="bg-black text-white">

            {/* ------------------------------ */}
            {/* HERO (unchanged from your original) */}
            {/* ------------------------------ */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                <img
                    src={bgImage}
                    alt="orchestra"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
                <div className="relative text-center text-white z-10 px-6">
                    <h1 className="text-4xl sm:text-6xl font-bold mb-4 animate-fadeUp">
                        Experience the <span className="text-accent">Symphony</span> of Excellence
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-slate-300 animate-fadeUp" style={{ animationDelay: "100ms" }}>
                        Join our orchestra in a journey through timeless classics and new masterpieces.
                    </p>
                    <div className="mt-8 flex justify-center gap-4 animate-fadeUp" style={{ animationDelay: "200ms" }}>
                        <Link to="/events" className="btn btn-primary">Upcoming Events</Link>
                        <Link to="/about" className="btn btn-ghost">Learn More</Link>
                    </div>
                </div>
            </section>

            {/* ------------------------------ */}
            {/* ABOUT SECTION (unchanged) */}
            {/* ------------------------------ */}
            <section className="container-max py-16 grid lg:grid-cols-2 gap-10 items-center">
                <div className="opacity-0 animate-fadeUp">
                    <h2 className="text-3xl font-bold mb-4 text-accent">About the Orchestra</h2>
                    <p className="text-slate-300 leading-relaxed">
                        Founded with passion and precision, our orchestra unites musicians from diverse backgrounds.
                    </p>
                    <p className="text-slate-400 mt-4">
                        From Beethoven to contemporary composers, we perform a repertoire that bridges tradition and innovation.
                    </p>
                    <Link to="/about" className="btn btn-primary mt-6">Read More</Link>
                </div>
                <div className="relative opacity-0 animate-scaleIn" style={{ animationDelay: "150ms" }}>
                    <img
                        src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80"
                        alt="orchestra players"
                        className="rounded-3xl shadow-gold"
                    />
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-accent/20"></div>
                </div>
            </section>

            {/* ------------------------------ */}
            {/* UPCOMING EVENTS (REAL DATA) */}
            {/* ------------------------------ */}
            <section className="container-max py-12">
                <div className="flex items-end justify-between gap-4">
                    <h2 className="h-serif text-2xl sm:text-3xl font-bold text-accent">{t("home.upcoming")}</h2>
                    <Link to="/events" className="text-sm link">See all</Link>
                </div>

                {loadingUpcoming ? (
                    <div className="py-16 flex justify-center"><GoldSpinner size={45} /></div>
                ) : upcoming.length === 0 ? (
                    <p className="text-center text-slate-400 py-12">No upcoming events.</p>
                ) : (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {upcoming.map((e, idx) => (
                            <div key={e.id} className="opacity-0 animate-fadeUp" style={{ animationDelay: `${idx * 90}ms` }}>
                                <EventCard
                                    event={e}
                                    className="group card overflow-hidden transition duration-300 ease-smooth hover:-translate-y-1 hover:shadow-gold"
                                    imgClass="transition duration-300 ease-smooth group-hover:scale-105"
                                    titleClass="transition duration-300 group-hover:text-accent"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ------------------------------ */}
            {/* PAST EVENTS (REAL DATA) */}
            {/* ------------------------------ */}
            <section className="container-max py-12">
                <div className="flex items-end justify-between gap-4">
                    <h2 className="h-serif text-2xl sm:text-3xl font-bold text-accent">Past Events</h2>
                    <Link to="/past-events" className="text-sm link">See all</Link>
                </div>

                {loadingPast ? (
                    <div className="py-16 flex justify-center"><GoldSpinner size={45} /></div>
                ) : past.length === 0 ? (
                    <p className="text-center text-slate-400 py-12">No past events found.</p>
                ) : (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {past.map((e, idx) => (
                            <div key={e.id} className="opacity-0 animate-fadeUp" style={{ animationDelay: `${idx * 90}ms` }}>
                                <EventCard
                                    event={e}
                                    className="group card overflow-hidden transition duration-300 ease-smooth hover:-translate-y-1 hover:shadow-gold"
                                    imgClass="transition duration-300 ease-smooth group-hover:scale-105"
                                    titleClass="transition duration-300 group-hover:text-accent"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/*/!* ------------------------------------------------ *!/*/}
            {/*/!* MUSICIANS SECTION — 3 COLUMN ELEGANT GRID *!/*/}
            {/*/!* ------------------------------------------------ *!/*/}
            {/*<section className="py-20 bg-black/40">*/}
            {/*    <div className="container-max">*/}

            {/*        <h2 className="text-3xl sm:text-4xl font-bold text-accent text-center mb-14">*/}
            {/*            Our Musicians*/}
            {/*        </h2>*/}

            {/*        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">*/}

            {/*            {[*/}
            {/*                {*/}
            {/*                    name: "Elira Krasniqi",*/}
            {/*                    instrument: "Violin — Concertmaster",*/}
            {/*                    img: "https://images.unsplash.com/photo-1518900684172-2c2e1e25c4e0?auto=format&fit=crop&w=900&q=80"*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    name: "Milan Dimitrov",*/}
            {/*                    instrument: "Cello — Principal",*/}
            {/*                    img: "https://images.unsplash.com/photo-1520608421741-68228b76aa68?auto=format&fit=crop&w=900&q=80"*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    name: "Arta Selmani",*/}
            {/*                    instrument: "Flute — Principal Flutist",*/}
            {/*                    img: "https://images.unsplash.com/photo-1521312701210-049f50f1c3af?auto=format&fit=crop&w=900&q=80"*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    name: "Gregory Vance",*/}
            {/*                    instrument: "Trumpet — Lead",*/}
            {/*                    img: "https://images.unsplash.com/photo-1581591524425-c7e0978865eb?auto=format&fit=crop&w=900&q=80"*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    name: "Lira Stojanova",*/}
            {/*                    instrument: "Harp — Soloist",*/}
            {/*                    img: "https://images.unsplash.com/photo-1554188248-986adbb73be7?auto=format&fit=crop&w=900&q=80"*/}
            {/*                },*/}
            {/*                {*/}
            {/*                    name: "Faton Berisha",*/}
            {/*                    instrument: "Percussion — Principal",*/}
            {/*                    img: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=900&q=80"*/}
            {/*                }*/}
            {/*            ].map((m, i) => (*/}
            {/*                <div*/}
            {/*                    key={i}*/}
            {/*                    className="opacity-0 animate-fadeUp"*/}
            {/*                    style={{ animationDelay: `${i * 100}ms` }}*/}
            {/*                >*/}
            {/*                    <div className="rounded-3xl overflow-hidden shadow-gold border border-white/10 bg-black/40 backdrop-blur">*/}
            {/*                        <img*/}
            {/*                            src={m.img}*/}
            {/*                            alt={m.name}*/}
            {/*                            className="w-full h-64 object-cover transition duration-500 hover:scale-105"*/}
            {/*                        />*/}
            {/*                        <div className="p-6 text-center">*/}
            {/*                            <h3 className="text-xl font-semibold text-white">{m.name}</h3>*/}
            {/*                            <p className="text-accent text-sm mt-1">{m.instrument}</p>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*</section>*/}


            {/* ------------------------------ */}
            {/* OPTIONAL EXTRA SECTION */}
            {/* ------------------------------ */}
            <section className="py-20 bg-black/40">
                <div className="container-max text-center">
                    <h2 className="text-3xl font-bold text-accent mb-4">Our Mission</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Bringing timeless classical music to modern audiences through passion,
                        excellence, and innovation.
                    </p>
                </div>
            </section>

        </div>
    );
}
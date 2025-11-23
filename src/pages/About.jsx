import React from "react";

export default function About() {
  return (
      <div className="container-max py-16 space-y-16">
        {/* Intro */}
        <section className="grid lg:grid-cols-2 gap-12 items-center opacity-0 animate-fadeUp">
          <div>
            <h1 className="text-4xl font-bold text-accent mb-4">About Our Orchestra</h1>
            <p className="text-slate-300 leading-relaxed">
              Our orchestra was founded in 1995 with a vision to bring classical music closer to the modern world.
              We’ve performed in over 20 countries, collaborating with world-renowned conductors and soloists.
            </p>
            <p className="text-slate-400 mt-4">
              Our mission is to foster a love of symphonic music through performances, education, and outreach.
            </p>
          </div>
          <img
              src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1000&q=80"
              alt="Orchestra hall"
              className="rounded-3xl shadow-gold opacity-0 animate-scaleIn"
              style={{ animationDelay: "120ms" }}
          />
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-6 opacity-0 animate-fadeUp" style={{ animationDelay: "200ms" }}>
          <div className="card p-8 text-center hover:-translate-y-1 transition duration-300">
            <h2 className="text-2xl font-semibold text-accent mb-3">Our Mission</h2>
            <p className="text-slate-300">To inspire, educate, and entertain audiences through the power of live orchestral music.</p>
          </div>
          <div className="card p-8 text-center hover:-translate-y-1 transition duration-300">
            <h2 className="text-2xl font-semibold text-accent mb-3">Our Vision</h2>
            <p className="text-slate-300">To become a global symbol of cultural excellence and musical innovation.</p>
          </div>
        </section>

        {/* Timeline */}
        <section className="opacity-0 animate-fadeIn" style={{ animationDelay: "300ms" }}>
          <h2 className="text-3xl font-bold text-accent mb-8 text-center">Our Journey</h2>
          <div className="relative border-l border-accent/40 ml-4 space-y-8">
            {[
              { year: "1995", text: "Orchestra founded by Maestro Nikola Stojanov" },
              { year: "2005", text: "First international performance in Vienna" },
              { year: "2018", text: "Awarded Best Symphony Ensemble in Europe" },
              { year: "2024", text: "Expanded repertoire with contemporary composers" },
            ].map((t, i) => (
                <div key={i} className="ml-6 relative opacity-0 animate-fadeUp" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="absolute -left-3 top-1 w-3 h-3 bg-accent rounded-full" />
                  <h3 className="text-xl font-semibold text-white">{t.year}</h3>
                  <p className="text-slate-400">{t.text}</p>
                </div>
            ))}
          </div>
        </section>
      </div>
  );
}

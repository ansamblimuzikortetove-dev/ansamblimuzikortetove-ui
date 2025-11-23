// components/EventCard.jsx (adapt without breaking existing API)
import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event, className = "card overflow-hidden", imgClass = "", titleClass = "" }) {
  return (
      <div className={className}>
        <Link to={`/events/${event.id}`} className="block">
          <div className="relative h-40">
            <img
                src={event.image}
                alt={event.title}
                className={`absolute inset-0 w-full h-full object-cover opacity-90 ${imgClass}`}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          </div>
          <div className="p-4">
            <h3 className={`font-semibold ${titleClass}`}>{event.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{event.location}</p>
            <div className="mt-3 text-xs text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1">
              <span className="i-lucide-calendar text-[1em]" />
              {event.date}
            </span>
            </div>
          </div>
        </Link>
      </div>
  );
}

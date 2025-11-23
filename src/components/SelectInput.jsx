import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";

export default function SelectInput({
                                        label,
                                        value,
                                        onChange,
                                        options = [],
                                        placeholder = "Select...",
                                        className = "",
                                        loading = false,          // NEW ✔
                                        loadingItems = 4,         // NEW ✔ skeleton count
                                    }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        if (loading) return;
        onChange({ target: { value: val } });
        setOpen(false);
    };

    const selectedLabel =
        options.find((opt) => (opt.value ?? opt) === value)?.label ??
        (loading ? "Loading..." : placeholder);

    return (
        <div
            ref={containerRef}
            className={`relative text-sm ${className}`}
            style={{ minWidth: "150px" }}
        >
            {label && (
                <label className="block text-slate-300 text-sm mb-1 font-medium">
                    {label}
                </label>
            )}

            {/* TRIGGER BUTTON */}
            <button
                type="button"
                disabled={loading}
                onClick={() => !loading && setOpen((o) => !o)}
                className={`
                    w-full bg-black/40 border border-white/10 rounded-xl
                    flex items-center justify-between gap-3
                    px-4 py-3 backdrop-blur-md transition-all
                    hover:border-accent/50
                    text-base sm:text-sm
                    ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
            >
                <span
                    className={`truncate ${
                        value ? "text-white" : loading ? "text-slate-500" : "text-slate-400"
                    }`}
                >
                    {selectedLabel}
                </span>

                {/* WHEN LOADING - SPINNER */}
                {loading ? (
                    <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <FaChevronDown
                        className={`text-accent transition-transform duration-300 ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                )}
            </button>

            {/* DROPDOWN */}
            {open && (
                <div
                    className="
                        absolute z-50 mt-2 w-full bg-black/80 backdrop-blur-xl
                        rounded-xl border border-white/10 shadow-2xl
                        animate-slideDown max-h-[50vh] overflow-y-auto
                    "
                >
                    <ul className="py-2">

                        {/* LOADING SKELETONS */}
                        {loading &&
                            Array.from({ length: loadingItems }).map((_, idx) => (
                                <li key={idx} className="px-4 py-3">
                                    <div className="h-4 w-3/4 bg-white/10 animate-pulse rounded" />
                                </li>
                            ))}

                        {/* NO OPTIONS */}
                        {!loading && options.length === 0 && (
                            <li className="px-4 py-6 text-center text-slate-400 text-sm">
                                <div className="text-3xl mb-2">📭</div>
                                <p>No options available</p>
                            </li>
                        )}

                        {/* REAL OPTIONS */}
                        {!loading &&
                            options.map((opt, idx) => {
                                const val = opt.value ?? opt;
                                const lbl = opt.label ?? opt;
                                const active = value === val;

                                return (
                                    <li key={idx}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelect(val)}
                                            className={`
                                                w-full text-left px-4 py-3 rounded-lg
                                                text-base sm:text-sm transition-all
                                                ${
                                                active
                                                    ? "bg-accent/30 text-accent font-semibold"
                                                    : "text-slate-200 hover:bg-white/10"
                                            }
                                            `}
                                        >
                                            {lbl}
                                        </button>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            )}
        </div>
    );
}
import React, { useState, useMemo } from "react";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import SelectInput from "../components/SelectInput.jsx";

const reports = [
  { id: 1, year: 2024, type: "Financial", file: "report2024.pdf", size: "2.1 MB", updated: "2024-10-20", uploadedBy: "Finance Dept" },
  { id: 2, year: 2023, type: "Activity", file: "activity2023.pdf", size: "1.6 MB", updated: "2023-11-02", uploadedBy: "HR Team" },
  { id: 3, year: 2023, type: "Annual", file: "annual2023.pdf", size: "2.8 MB", updated: "2023-12-05", uploadedBy: "Admin Office" },
  { id: 4, year: 2022, type: "Financial", file: "finance2022.pdf", size: "1.9 MB", updated: "2022-08-15", uploadedBy: "Finance Dept" },
  { id: 5, year: 2021, type: "Audit", file: "audit2021.pdf", size: "2.4 MB", updated: "2021-07-30", uploadedBy: "External Auditor" },
];

export default function Reports() {
  const [year, setYear] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "year", direction: "desc" });

  const yearOptions = useMemo(() => ["all", ...new Set(reports.map((r) => r.year))], []);
  const typeOptions = useMemo(() => ["all", ...new Set(reports.map((r) => r.type))], []);

  const filtered = useMemo(() => {
    return reports.filter(
        (r) =>
            (year === "all" || r.year === Number(year)) &&
            (type === "all" || r.type === type) &&
            (r.type.toLowerCase().includes(search.toLowerCase()) ||
                r.file.toLowerCase().includes(search.toLowerCase()) ||
                r.uploadedBy.toLowerCase().includes(search.toLowerCase()))
    );
  }, [year, type, search]);

  const sortedReports = useMemo(() => {
    const sorted = [...filtered];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filtered, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
      <section className="container-max py-16">
        <h1 className="text-4xl font-bold text-accent mb-8 text-center">Reports</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-10 items-stretch md:items-end">
          <div className="w-full md:w-40">
            <SelectInput
                label="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                options={yearOptions.map((y) => ({
                  value: y,
                  label: y === "all" ? "All Years" : y,
                }))}
            />
          </div>

          <div className="w-full md:w-48">
            <SelectInput
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={typeOptions.map((t) => ({
                  value: t,
                  label: t === "all" ? "All Types" : t,
                }))}
            />
          </div>

          <div className="w-full md:w-64">
            <label className="block text-slate-300 text-sm mb-1 font-medium">Search</label>
            <input
                type="text"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl bg-black/40 border border-white/10 text-slate-200 px-4 py-2
                       placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/60
                       hover:border-accent/40 transition-all duration-200 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto opacity-0 animate-fadeIn">
          <table className="min-w-full border border-white/10 rounded-2xl overflow-hidden text-sm backdrop-blur-md bg-black/40">
            <thead className="bg-black/70 text-accent uppercase text-xs tracking-wider">
            <tr>
              {[
                { key: "year", label: "Year" },
                { key: "type", label: "Type" },
                { key: "file", label: "File" },
                { key: "size", label: "Size" },
                { key: "updated", label: "Last Updated" },
                { key: "uploadedBy", label: "Uploaded By" },
              ].map((col) => (
                  <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="py-3 px-4 cursor-pointer select-none hover:bg-white/5 transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortConfig.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                              <FaSortUp className="text-accent text-xs" />
                          ) : (
                              <FaSortDown className="text-accent text-xs" />
                          )
                      ) : (
                          <span className="text-slate-600 text-xs">↕</span>
                      )}
                    </div>
                  </th>
              ))}
            </tr>
            </thead>

            <tbody>
            {sortedReports.length > 0 ? (
                sortedReports.map((r, i) => (
                    <tr
                        key={r.id}
                        className={`${
                            i % 2 === 0 ? "bg-black/40" : "bg-black/25"
                        } hover:bg-accent/10 transition`}
                    >
                      <td className="py-3 px-4">{r.year}</td>
                      <td className="py-3 px-4">{r.type}</td>
                      <td className="py-3 px-4">
                        <a
                            href={`/${r.file}`}
                            className="text-accent hover:underline"
                        >
                          {r.file}
                        </a>
                      </td>
                      <td className="py-3 px-4">{r.size}</td>
                      <td className="py-3 px-4">{r.updated}</td>
                      <td className="py-3 px-4">{r.uploadedBy}</td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400 italic">
                    No matching reports found.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      </section>
  );
}

"use client"
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Search, Download, Save,
    BookOpen, SlidersHorizontal, RotateCcw, CheckSquare,
    ChevronLeft, ChevronRight, Building2, AlertCircle
} from "lucide-react";
import Badge from "@/components/Badge";
import Select from "@/components/Select";
import DragItem from "@/components/DragItem";
import { addPreference, addPreferences, removePreference, reorderPreference } from "@/utils/cardSlice";
import { DATA_API, ROWS_PER_PAGE } from "@/utils/coonstants";
import Navbar from "@/components/Navbar";

export default function Filter() {
    const dispatch = useDispatch();
    const preferences = useSelector(state => state.card.items);
    const dark = useSelector(state => state.other.darkMode);
    const [filters, setFilters] = useState({
        year: "", instituteType: "", institute: "",
        branch: "", quota: "", seatType: "", gender: "",
    });
    const [checked, setChecked] = useState({});
    const [page, setPage] = useState(1);
    const [applied, setApplied] = useState(false);
    const [allData, setAllData] = useState([]);
    const [extraInstitutes, setExtraInstitutes] = useState([]);
    const [extraBranches, setExtraBranches] = useState([]);
    const [newInstitute, setNewInstitute] = useState("");
    const [newBranch, setNewBranch] = useState("");

    const dragFrom = useRef(null);


    useEffect(() => {
        const fetchCsvData = async () => {
            const response = await fetch(DATA_API);
            const json = await response.json();
            const rows = (json.data || []).map((row, index) => {

                const institute = row["Institute"]?.trim();

                const instituteType =
                    institute.includes("Indian Institute of Technology")
                        ? "IIT"
                        : institute.includes("National Institute of Technology")
                            ? "NIT"
                            : institute.includes("Indian Institute of Information Technology")
                                ? "IIIT"
                                : "GFTI";

                const rawGender = row.Gender ? row.Gender.replace(/\s+/g, " ").trim() : "";
                const gender = /female/i.test(rawGender) ? "Female Only" : (rawGender ? "Gender-Neutral" : "");

                const parseRank = (value) => {
                    const label = String(value ?? "").trim();
                    const rank = Number(label.replace(/,/g, "").replace(/p$/i, ""));
                    return {
                        rank: Number.isNaN(rank) ? null : rank,
                        label,
                    };
                };

                const openingRank = parseRank(row.OpeningRank);
                const closingRank = parseRank(row.ClosingRank);

                return {
                    id: index + 1,

                    institute: row.Institute?.trim(),
                    instituteType,
                    program: row.Program?.trim(),
                    quota: row.Quota?.trim(),
                    seatType: row.SeatType?.trim(),
                    gender,
                    openingRank: openingRank.rank,
                    openingRankLabel: openingRank.label,
                    closingRank: closingRank.rank,
                    closingRankLabel: closingRank.label,
                };
            });

            setAllData(rows);
            console.log("First row:", rows[0]);
            console.log("Institutes:", rows.slice(0, 5).map(r => r.institute));
            console.log("Programs:", rows.slice(0, 5).map(r => r.program));
        };

        fetchCsvData().catch(console.error);
    }, []);


    const setFilter = useCallback((k, v) => {
        setFilters(f => ({ ...f, [k]: v }));
        setPage(1);
    }, []);

    const resetFilters = () => {
        setFilters({ year: "", instituteType: "", institute: "", branch: "", quota: "", seatType: "", gender: "" });
        setChecked({});
        setPage(1);
        setApplied(false);
    };

    const addCustomPreference = () => {
        const inst = (newInstitute || "").trim();
        const br = (newBranch || "").trim();
        if (!inst && !br) return;

        if (inst) setExtraInstitutes(prev => {
            const next = Array.from(new Set([...(prev || []), inst]));
            return next.sort((a, b) => a.localeCompare(b));
        });

        if (br) setExtraBranches(prev => {
            const next = Array.from(new Set([...(prev || []), br]));
            return next.sort((a, b) => a.localeCompare(b));
        });

        // If preference already exists (same institute+program), just select it
        const exists = preferences.find(p => (p.institute === inst && p.program === br));
        if (exists) {
            if (inst) setFilter("institute", inst);
            if (br) setFilter("branch", br);
            setNewInstitute("");
            setNewBranch("");
            return;
        }

        const id = Date.now();
        const item = {
            id,
            institute: inst || "",
            program: br || "",
            quota: "",
            seatType: "",
            gender: "",
            openingRank: null,
            closingRank: null,
            openingRankLabel: "",
            closingRankLabel: "",
            isNew: true,
        };

        dispatch(addPreference(item));
        setNewInstitute("");
        setNewBranch("");
        if (inst) setFilter("institute", inst);
        if (br) setFilter("branch", br);
    };

    const filtered = useMemo(() => {
        if (!applied) return [];
        return allData.filter(r => {
            if (filters.institute && r.institute !== filters.institute) return false;
            if (filters.branch && r.program !== filters.branch) return false;
            if (filters.quota && r.quota !== filters.quota) return false;
            if (filters.seatType && r.seatType !== filters.seatType) return false;
            if (filters.gender && r.gender !== filters.gender) return false;
            if (filters.instituteType && r.instituteType !== filters.instituteType) {
                return false;
            }
            return true;
        });
    }, [filters, applied]);

    const availableOptions = useMemo(() => {
        const keyMap = {
            instituteType: "instituteType",
            institute: "institute",
            branch: "program",
            quota: "quota",
            seatType: "seatType",
            gender: "gender",
        };

        const getOptions = (excludeKey) => {
            return [...new Set(
                allData
                    .filter(row => {
                        return Object.entries(filters).every(([key, value]) => {
                            if (!value || key === "year" || key === excludeKey) return true;
                            const rowKey = keyMap[key] || key;
                            return row[rowKey] === value;
                        });
                    })
                    .map(row => row[keyMap[excludeKey]])
                    .filter(Boolean)
            )].sort();
        };

        return {
            instituteTypes: getOptions("instituteType"),
            institutes: getOptions("institute"),
            branches: getOptions("branch"),
            quotas: getOptions("quota"),
            seatTypes: getOptions("seatType"),
            genders: getOptions("gender"),
        };
    }, [allData, filters]);

    useEffect(() => {
        setFilters(current => {
            let changed = false;
            const next = { ...current };
            if (current.instituteType && !availableOptions.instituteTypes.includes(current.instituteType)) {
                next.instituteType = "";
                changed = true;
            }
            if (current.institute && !availableOptions.institutes.includes(current.institute)) {
                next.institute = "";
                changed = true;
            }
            if (current.branch && !availableOptions.branches.includes(current.branch)) {
                next.branch = "";
                changed = true;
            }
            if (current.quota && !availableOptions.quotas.includes(current.quota)) {
                next.quota = "";
                changed = true;
            }
            if (current.seatType && !availableOptions.seatTypes.includes(current.seatType)) {
                next.seatType = "";
                changed = true;
            }
            if (current.gender && !availableOptions.genders.includes(current.gender)) {
                next.gender = "";
                changed = true;
            }
            return changed ? next : current;
        });
    }, [availableOptions]);

    const {
        instituteTypes,
        institutes,
        branches,
        quotas,
        seatTypes,
        genders,
    } = availableOptions;

    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const pageData = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

    const toggleRow = (row) => {
        setChecked(c => ({ ...c, [row.id]: !c[row.id] }));
    };

    const toggleAll = () => {
        const allChecked = pageData.every(r => checked[r.id]);
        const next = { ...checked };
        pageData.forEach(r => { next[r.id] = !allChecked; });
        setChecked(next);
    };

    const addSelected = () => {
        const toAdd = filtered.filter(r => checked[r.id] && !preferences.find(p => p.id === r.id));
        if (toAdd.length) {
            dispatch(addPreferences(toAdd));
        }
    };

    const handleRemovePreference = (id) => dispatch(removePreference(id));

    const handleDragStart = (i) => { dragFrom.current = i; };
    const handleDragOver = (i) => {
        if (dragFrom.current === null || dragFrom.current === i) return;
        dispatch(reorderPreference({ fromIndex: dragFrom.current, toIndex: i }));
        dragFrom.current = i;
    };

    const activeFilters = Object.entries(filters).filter(([, v]) => v);


    const bg = dark ? "bg-slate-900" : "bg-slate-50";
    const card = dark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200";
    const text = dark ? "text-slate-100" : "text-slate-900";
    const sub = dark ? "text-slate-400" : "text-slate-500";
    const head = dark ? "bg-slate-750 text-slate-300 border-slate-700" : "bg-slate-50 text-slate-600 border-slate-200";
    const rowBase = dark ? "border-slate-700/50 text-slate-300 hover:bg-slate-700/40" : "border-slate-100 text-slate-700 hover:bg-blue-50/40";

    return (
        <div className={`w-full h-full min-h-screen ${bg}`}>
            <Navbar />
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 flex gap-5 items-start">
                {/* ── LEFT COLUMN ── */}
                <div className="flex-1 min-w-0 space-y-5">

                    {/* Filter Card */}
                    <div className={`rounded-2xl border shadow-sm p-5 ${card}`}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2.5">
                                <div className={`p-2 rounded-xl ${dark ? "bg-blue-900/40" : "bg-blue-50"}`}>
                                    <SlidersHorizontal size={16} className="text-blue-500" />
                                </div>
                                <div>
                                    <h2 className={`text-sm font-bold ${text}`}>Filter Colleges</h2>
                                    <p className={`text-xs ${sub}`}>Narrow down by your criteria</p>
                                </div>
                            </div>
                            {activeFilters.length > 0 && (
                                <button onClick={resetFilters} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors
                  ${dark ? "text-red-400 hover:bg-red-900/30" : "text-red-500 hover:bg-red-50"}`}>
                                    <RotateCcw size={12} /> Reset
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            <Select label="Year" options={["2025"]} value={filters.year} onChange={v => setFilter("year", v)} dark={dark} />
                            <Select label="Institute Type" options={instituteTypes} value={filters.instituteType} onChange={v => setFilter("instituteType", v)} dark={dark} />
                            <Select label="Quota" options={quotas} value={filters.quota} onChange={v => setFilter("quota", v)} dark={dark} />
                            <Select label="Seat Type" options={seatTypes} value={filters.seatType} onChange={v => setFilter("seatType", v)} dark={dark} />
                            <Select label="Gender" options={genders} value={filters.gender} onChange={v => setFilter("gender", v)} dark={dark} />
                            <Select label="Institute" options={[...institutes, ...extraInstitutes]} value={filters.institute} onChange={v => setFilter("institute", v)} searchable dark={dark} />
                            <Select label="Branch" options={[...branches, ...extraBranches]} value={filters.branch} onChange={v => setFilter("branch", v)} searchable dark={dark} />
                        </div>

                        {/* Add custom institute / branch inputs */}
                        <div className="mt-3 flex flex-col sm:flex-row gap-2">
                            <div className="flex-1 flex gap-2">
                                <input
                                    value={newInstitute}
                                    onChange={e => setNewInstitute(e.target.value)}
                                    placeholder="Type institute name (new)"
                                    className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm outline-none ${dark ? "bg-slate-800 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-700"}`}
                                />
                                <input
                                    value={newBranch}
                                    onChange={e => setNewBranch(e.target.value)}
                                    placeholder="Type branch name (new)"
                                    className={`flex-1 px-3.5 py-2.5 rounded-xl border text-sm outline-none ${dark ? "bg-slate-800 border-slate-600 text-slate-200" : "bg-white border-slate-200 text-slate-700"}`}
                                />
                                <button
                                    onClick={addCustomPreference}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold ${dark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
                                >
                                    Add to Preferences
                                </button>
                            </div>
                        </div>

                        {/* Active filters */}
                        {activeFilters.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
                                {activeFilters.map(([k, v]) => (
                                    <Badge key={k} onRemove={() => setFilter(k, "")} dark={dark}>
                                        {v}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={() => { setApplied(true); setPage(1); }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/25 transition-all duration-200 active:scale-95"
                            >
                                <Search size={14} /> Apply Filters
                            </button>
                            <button
                                onClick={resetFilters}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95
                  ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                            >
                                <RotateCcw size={14} /> Reset
                            </button>
                        </div>
                    </div>

                    {/* Results Card */}
                    <div className={`rounded-2xl border shadow-sm overflow-hidden ${card}`}>
                        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
                            <div className="flex items-center gap-2.5">
                                <Building2 size={16} className="text-blue-500" />
                                <span className={`text-sm font-bold ${text}`}>
                                    Results
                                    {applied && <span className={`ml-2 text-xs font-normal ${sub}`}>({filtered.length} colleges)</span>}
                                </span>
                            </div>
                            {Object.values(checked).some(Boolean) && (
                                <button
                                    onClick={addSelected}
                                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                >
                                    <CheckSquare size={13} /> Add to Preferences
                                </button>
                            )}
                        </div>

                        {!applied ? (
                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                <div className={`w-16 h-16 rounded-2xl ${dark ? "bg-slate-700" : "bg-slate-100"} flex items-center justify-center mb-4`}>
                                    <SlidersHorizontal size={28} className={sub} />
                                </div>
                                <p className={`text-sm font-semibold ${text}`}>Apply filters to see results</p>
                                <p className={`text-xs mt-1 ${sub}`}>Select your criteria above and click "Apply Filters"</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                <div className={`w-16 h-16 rounded-2xl ${dark ? "bg-slate-700" : "bg-slate-100"} flex items-center justify-center mb-4`}>
                                    <AlertCircle size={28} className="text-orange-400" />
                                </div>
                                <p className={`text-sm font-semibold ${text}`}>No colleges match the selected filters</p>
                                <p className={`text-xs mt-1 ${sub}`}>Try adjusting or resetting your filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className={`border-b text-xs font-semibold uppercase tracking-wide ${head}`}>
                                                <th className="px-4 py-3 text-center w-10">
                                                    <input
                                                        type="checkbox"
                                                        checked={pageData.length > 0 && pageData.every(r => checked[r.id])}
                                                        onChange={toggleAll}
                                                        className="rounded accent-blue-500 cursor-pointer"
                                                    />
                                                </th>
                                                {["Institute", "Program", "Quota", "Seat Type", "Gender", "Opening", "Closing"].map(h => (
                                                    <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pageData.map((row, i) => (
                                                <tr
                                                    key={row.id}
                                                    className={`border-b transition-colors duration-150 cursor-pointer ${rowBase}
                            ${checked[row.id] ? (dark ? "bg-blue-900/20" : "bg-blue-50/60") : ""}`}
                                                    onClick={() => toggleRow(row)}
                                                >
                                                    <td className="px-4 py-3 text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={!!checked[row.id]}
                                                            onChange={() => toggleRow(row)}
                                                            onClick={e => e.stopPropagation()}
                                                            className="rounded accent-blue-500 cursor-pointer"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span title={row.institute} className={`font-semibold text-xs ${dark ? "text-slate-200" : "text-slate-800"}`}>{row.institute}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span title={row.program} className={`text-xs ${dark ? "text-slate-300" : "text-slate-600"} max-w-50 block truncate`}>{row.program}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span title={row.quota} className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${dark ? "bg-blue-900/50 text-blue-300" : "bg-blue-50 text-blue-700"}`}>{row.quota}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span title={row.seatType} className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium
                              ${dark ? "bg-purple-900/50 text-purple-300" : "bg-purple-50 text-purple-700"}`}>{row.seatType}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span title={row.gender} className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{row.gender}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span title={row.openingRankLabel} className={`text-xs font-mono font-semibold ${dark ? "text-emerald-400" : "text-emerald-600"}`}>{row.openingRankLabel || "—"}</span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span title={row.closingRankLabel} className={`text-xs font-mono font-semibold ${dark ? "text-orange-400" : "text-orange-600"}`}>{row.closingRankLabel || "—"}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className={`flex items-center justify-between px-5 py-3.5 border-t text-xs ${dark ? "border-slate-700" : "border-slate-100"}`}>
                                    <span className={sub}>
                                        Showing {(page - 1) * ROWS_PER_PAGE + 1}-{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-30
                        ${dark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
                                        >
                                            <ChevronLeft size={15} />
                                        </button>
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            const p = i + 1;
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all
                                                        ${page === p
                                                            ? "bg-blue-500 text-white shadow-sm"
                                                            : (dark ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100")
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                            className={`p-1.5 rounded-lg transition-colors disabled:opacity-30
                        ${dark ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
                                        >
                                            <ChevronRight size={15} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ── RIGHT SIDEBAR ── */}
                <div className="hidden lg:flex flex-col gap-4 min-w-3xs">
                    <div className={`rounded-2xl border shadow-sm overflow-hidden flex flex-col ${card}`} style={{ maxHeight: "calc(100vh - 120px)" }}>
                        <div className={`px-4 py-4 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <BookOpen size={15} className="text-blue-500" />
                                    <span className={`text-sm font-bold ${text}`}>Selected Preferences</span>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                  ${dark ? "bg-blue-900/50 text-blue-300" : "bg-blue-50 text-blue-600"}`}>
                                    {preferences.length}
                                </span>
                            </div>
                            <p className={`text-xs mt-1 ${sub}`}>Drag to reorder your priorities</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {preferences.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className={`w-12 h-12 rounded-xl ${dark ? "bg-slate-700" : "bg-slate-100"} flex items-center justify-center mb-3`}>
                                        <BookOpen size={20} className={sub} />
                                    </div>
                                    <p className={`text-xs font-medium ${text}`}>No preferences added</p>
                                    <p className={`text-xs mt-0.5 ${sub}`}>Select rows and click "Add to Preferences"</p>
                                </div>
                            ) : (
                                preferences.map((item, i) => (
                                    <div key={item.id} className="flex items-start gap-2">
                                        <span className={`mt-3 text-xs font-bold w-5 shrink-0 text-right ${dark ? "text-slate-500" : "text-slate-400"}`}>{i + 1}</span>
                                        <div className="flex-1">
                                            <DragItem
                                                item={item}
                                                index={i}
                                                onRemove={handleRemovePreference}
                                                onDragStart={handleDragStart}
                                                onDragOver={handleDragOver}
                                                onDrop={() => { }}
                                                dark={dark}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {preferences.length > 0 && (
                            <div className={`p-3 border-t space-y-2 ${dark ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50/80"}`}>
                                <button
                                    onClick={() => {
                                        // Preferences are already saved in the card slice.
                                    }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs font-bold hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-95"
                                >
                                    <Save size={13} /> Save Preference List
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── MOBILE BOTTOM BAR ── */}
            {preferences.length > 0 && (
                <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t p-4 flex gap-3
          ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"} shadow-2xl`}>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 text-white text-sm font-bold">
                        <Save size={15} /> Save ({preferences.length})
                    </button>
                    <button className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold
            ${dark ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>
                        <Download size={15} />
                    </button>
                </div>
            )}
        </div>
    );
}
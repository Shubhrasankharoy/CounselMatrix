import { ChevronDown, Search } from 'lucide-react';
import React, { useRef, useState } from 'react'

export default function Select({ label, options, value, onChange, searchable = false, dark }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    const filtered = searchable
        ? options.filter(
            o =>
                o &&
                o.toLowerCase().includes(query.toLowerCase())
        )
        : options.filter(Boolean);

    const handleBlur = (e) => {
        if (ref.current && !ref.current.contains(e.relatedTarget)) setOpen(false);
    };

    return (
        <div className="relative" ref={ref} onBlur={handleBlur} tabIndex={-1}>
            <label className={`block text-xs font-semibold mb-1.5 tracking-wide uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}>
                {label}
            </label>
            <button
                onClick={() => setOpen(o => !o)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200
          ${dark
                        ? "bg-slate-800 border-slate-600 text-slate-200 hover:border-blue-500 focus:border-blue-500"
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-400 focus:border-blue-500 shadow-sm"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
                <span className={value ? "" : (dark ? "text-slate-500" : "text-slate-400")}>
                    {value || `Select ${label}`}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${open ? "rotate-180" : ""} ${dark ? "text-slate-400" : "text-slate-400"}`} />
            </button>

            {open && (
                <div className={`absolute z-50 w-full mt-1.5 rounded-xl border shadow-xl overflow-hidden
          ${dark ? "bg-slate-800 border-slate-600" : "bg-white border-slate-200"}`}
                    style={{ maxHeight: 240 }}>
                    {searchable && (
                        <div className={`flex items-center gap-2 px-3 py-2 border-b ${dark ? "border-slate-700" : "border-slate-100"}`}>
                            <Search size={13} className="text-slate-400 shrink-0" />
                            <input
                                autoFocus
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder={`Search ${label}...`}
                                className={`flex-1 text-sm outline-none bg-transparent ${dark ? "text-slate-200 placeholder-slate-500" : "text-slate-700 placeholder-slate-400"}`}
                            />
                        </div>
                    )}
                    <div className="overflow-y-auto" style={{ maxHeight: searchable ? 192 : 200 }}>
                        <button
                            onClick={() => { onChange(""); setOpen(false); setQuery(""); }}
                            className={`w-full text-left px-3.5 py-2 text-sm transition-colors
                ${dark ? "text-slate-400 hover:bg-slate-700" : "text-slate-400 hover:bg-slate-50"}`}
                        >
                            Any {label}
                        </button>
                        {filtered.map(opt => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); setQuery(""); }}
                                className={`w-full text-left px-3.5 py-2 text-sm transition-colors
                  ${value === opt
                                        ? (dark ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 font-medium")
                                        : (dark ? "text-slate-200 hover:bg-slate-700" : "text-slate-700 hover:bg-slate-50")
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <div className={`px-3.5 py-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No results</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

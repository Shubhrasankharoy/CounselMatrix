"use client"
import { useState } from "react";
import {
    FileText, Download, Save, ArrowLeft, GraduationCap, User,
    Settings, Eye, ChevronDown, Moon, Sun, BookOpen, Shield,
    Printer, Star, AlertTriangle, CheckCircle, Calendar,
    Phone, Mail, MapPin, Hash, Award, Layers,
    AlertCircle,
    MessageSquareMore
} from "lucide-react";
import { generateDOCReport } from "@/utils/generateDOCReport"; 
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import GeneratePDFButton from "@/components/GeneratePDFButton";
import { DEMO_CONFIG, DEMO_CONSIDERATIONS, DEMO_OVERVIEW, DEMO_WORD_OF_ADVICE } from "@/utils/coonstants";
import Navbar from "@/components/Navbar";

// ── Sample Data ────────────────────────────────────────────────────────────────
const SAMPLE_STUDENT = {
    name: "",
    crlRank: "",
    category: "",
    categoryRank: "",
    gender: "",
    homeState: "",
    mobile: "",
    email: "",
};

function formatRank(value) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric.toLocaleString();
    if (value || value === 0) return String(value);
    return "-";
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, accent = "blue", children, dark }) {
    const accents = {
        blue: { bar: "from-blue-500 to-cyan-400", icon: dark ? "bg-blue-900/40 text-blue-400" : "bg-blue-50 text-blue-600" },
        violet: { bar: "from-violet-500 to-purple-400", icon: dark ? "bg-violet-900/40 text-violet-400" : "bg-violet-50 text-violet-600" },
        emerald: { bar: "from-emerald-500 to-teal-400", icon: dark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-50 text-emerald-600" },
        amber: { bar: "from-amber-500 to-orange-400", icon: dark ? "bg-amber-900/40 text-amber-400" : "bg-amber-50 text-amber-600" },
        rose: { bar: "from-rose-500 to-pink-400", icon: dark ? "bg-rose-900/40 text-rose-400" : "bg-rose-50 text-rose-600" },
        slate: { bar: "from-slate-500 to-slate-400", icon: dark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600" },
    };
    const a = accents[accent];

    return (
        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg
      ${dark ? "bg-slate-800/70 border-slate-700/80 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-slate-200/60"}`}>
            <div className={`h-0.5 bg-gradient-to-r ${a.bar}`} />
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${dark ? "border-slate-700/60" : "border-slate-100"}`}>
                <div className={`p-2 rounded-xl ${a.icon}`}>
                    <Icon size={16} />
                </div>
                <h2 className={`text-sm font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-800"}`}>{title}</h2>
            </div>
            <div className="px-6 py-5">{children}</div>
        </div>
    );
}

function Field({ label, value, onChange, type = "text", placeholder, dark }) {
    return (
        <div className="space-y-1.5">
            <label className={`block text-xs font-semibold tracking-wide uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder || label}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 outline-none
          focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400
          ${dark
                        ? "bg-slate-900/60 border-slate-600 text-slate-200 placeholder-slate-500 hover:border-slate-500"
                        : "bg-slate-50/80 border-slate-200 text-slate-800 placeholder-slate-400 hover:border-slate-300 focus:bg-white"
                    }`}
            />
        </div>
    );
}

function TextArea({ label, value, onChange, rows = 4, dark }) {
    return (
        <div className="space-y-1.5">
            {label && <label className={`block text-xs font-semibold tracking-wide uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</label>}
            <textarea
                rows={rows}
                value={value}
                onChange={e => onChange(e.target.value)}
                className={`w-full px-3.5 py-3 rounded-xl border text-sm leading-relaxed transition-all duration-200 outline-none resize-none
          focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400
          ${dark
                        ? "bg-slate-900/60 border-slate-600 text-slate-200 placeholder-slate-500 hover:border-slate-500"
                        : "bg-slate-50/80 border-slate-200 text-slate-700 hover:border-slate-300 focus:bg-white"
                    }`}
            />
        </div>
    );
}

function ChanceBadge({ chance }) {
    const map = {
        Safe: "bg-emerald-100 text-emerald-700 border-emerald-200",
        Moderate: "bg-amber-100 text-amber-700 border-amber-200",
        Risky: "bg-red-100 text-red-700 border-red-200",
    };
    const icons = { Safe: CheckCircle, Moderate: AlertTriangle, Risky: AlertTriangle };
    const Icon = icons[chance] || AlertCircle;
    const badgeStyle = map[chance] || "bg-slate-100 text-slate-600 border-slate-200";
    const label = chance || "Unknown";
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
            <Icon size={11} /> {label}
        </span>
    );
}

function SelectField({ label, value, onChange, options, dark }) {
    return (
        <div className="space-y-1.5">
            <label className={`block text-xs font-semibold tracking-wide uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl border text-sm font-medium transition-all duration-200 outline-none
            focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 cursor-pointer
            ${dark
                            ? "bg-slate-900/60 border-slate-600 text-slate-200 hover:border-slate-500"
                            : "bg-slate-50/80 border-slate-200 text-slate-800 hover:border-slate-300 focus:bg-white"
                        }`}
                >
                    {options.map((o,i) => <option key={o+i} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${dark ? "text-slate-400" : "text-slate-400"}`} />
            </div>
        </div>
    );
}

// ── Report Preview ─────────────────────────────────────────────────────────────
function ReportPreview({ student, config, overview, wordOfAdvice, considerations, preferences, dark }) {
    return (
        <div className={`relative rounded-xl overflow-hidden border font-serif
      ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"}`}
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
                <span className="text-6xl font-black opacity-[0.09] select-none whitespace-nowrap rotate-[-35deg] tracking-widest"
                    style={{ color: dark ? "#94a3b8" : "#1e3a5f" }}>
                    {config.watermark}
                </span>
            </div>

            {/* Header band */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-8 py-6 text-white relative z-20">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                <GraduationCap size={16} className="text-white" />
                            </div>
                            <span className="text-xl font-semibold tracking-widest uppercase text-white">{config.agencyName}</span>
                        </div>
                        <p className="text-blue-200 text-xs mt-1">Date: {config.date} · Counselor: {config.counselorName} · Mentor: {config.mentorName}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/20">
                            <p className="text-xs text-blue-200 font-medium">CRL Rank</p>
                            <p className="text-2xl font-black text-white leading-tight">{student.crlRank}</p>
                            <p className="text-xs text-blue-300 mt-0.5">{student.category} · {student.categoryRank}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student info strip */}
            <div className={`px-8 py-4 border-b ${dark ? "bg-slate-800/80 border-slate-700" : "bg-blue-50/60 border-blue-100"} relative z-20`}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Student", value: student.name, icon: User },
                        { label: "Gender", value: student.gender, icon: Award },
                        { label: "Home State", value: student.homeState, icon: MapPin },
                        { label: "Category", value: student.category, icon: Shield },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label+value}>
                            <p className={`text-xs font-semibold uppercase tracking-wide mb-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
                            <p className={`text-sm font-bold ${dark ? "text-slate-200" : "text-slate-800"}`}>{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="px-8 py-6 space-y-6 relative z-20">
                {/* Overview */}
                <div>
                    <h3 className={`text-xs font-black uppercase tracking-[0.15em] mb-2 pb-1.5 border-b flex items-center gap-2
            ${dark ? "text-blue-400 border-slate-700" : "text-blue-700 border-blue-100"}`}>
                        <Layers size={12} /> Overview
                    </h3>
                    <p className={`text-xs leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{overview}</p>
                </div>

                {/* Considerations */}
                <div>
                    <h3 className={`text-xs font-black uppercase tracking-[0.15em] mb-2 pb-1.5 border-b flex items-center gap-2
            ${dark ? "text-blue-400 border-slate-700" : "text-blue-700 border-blue-100"}`}>
                        <Shield size={12} /> Considerations
                    </h3>
                    <p className={`text-xs leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{considerations}</p>
                </div>

                {/* Notes */}
                {config.notes && (
                    <div className={`rounded-xl p-4 border-l-4 border-blue-500 ${dark ? "bg-blue-900/20" : "bg-blue-50"}`}>
                        <p className={`text-xs font-bold mb-1 ${dark ? "text-blue-300" : "text-blue-700"}`}>Counselor Note</p>
                        <p className={`text-xs leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{config.notes}</p>
                    </div>
                )}


                {/* Table */}
                <div>
                    <h3 className={`text-xs font-black uppercase tracking-[0.15em] mb-3 pb-1.5 border-b flex items-center gap-2
            ${dark ? "text-blue-400 border-slate-700" : "text-blue-700 border-blue-100"}`}>
                        <BookOpen size={12} /> Advised Choice Filling List
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-blue-100 dark:border-slate-700">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="bg-blue-900 text-blue-100">
                                    {["#", "Institute", "Program", "Quota", "Seat Type", "Open", "Close"].map((h,i) => ( //chance
                                        <th key={h+i} className="px-3 py-2.5 text-left font-bold tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preferences.map((row, i) => (
                                    <tr key={`pref-${row.priority ?? i}-${row.institute ?? row.program ?? i}`}
                                        className={`border-t ${i % 2 === 0
                                            ? (dark ? "bg-slate-800/50 border-slate-700" : "bg-white border-blue-50")
                                            : (dark ? "bg-slate-900/50 border-slate-700" : "bg-blue-50/30 border-blue-50")}`}>
                                        <td className={`px-3 py-2 font-black ${dark ? "text-blue-400" : "text-blue-700"}`}>{i + 1}</td>
                                        <td className={`px-3 py-2 font-semibold whitespace-nowrap ${dark ? "text-slate-200" : "text-slate-800"}`}>{row.institute}</td>
                                        <td className={`px-3 py-2 ${dark ? "text-slate-300" : "text-slate-600"}`}>{row.program}</td>
                                        <td className={`px-3 py-2 font-mono ${dark ? "text-slate-300" : "text-slate-600"}`}>{row.quota}</td>
                                        <td className={`px-3 py-2 font-mono ${dark ? "text-slate-300" : "text-slate-600"}`}>{row.seatType}</td>
                                        <td className={`px-3 py-2 font-mono font-semibold ${dark ? "text-emerald-400" : "text-emerald-700"}`}>{formatRank(row.openingRank)}</td>
                                        <td className={`px-3 py-2 font-mono font-semibold ${dark ? "text-orange-400" : "text-orange-600"}`}>{formatRank(row.closingRank)}</td>
                                        {/* <td className="px-3 py-2"><ChanceBadge chance={row.chance} /></td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                
                {/* wordOfAdvice */}
                <div>
                    <h3 className={`text-xs font-black uppercase tracking-[0.15em] mb-2 pb-1.5 border-b flex items-center gap-2
            ${dark ? "text-blue-400 border-slate-700" : "text-blue-700 border-blue-100"}`}>
                        <MessageSquareMore size={12}/> Word of Advice
                    </h3>
                    <ul className="pl-3">
                        {wordOfAdvice.map((advice, i) => (
                            <li key={i} className={`text-xs list-disc leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{advice}</li>

                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <div className={`flex items-center justify-between pt-4 border-t text-xs ${dark ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400"}`}>
                    <span>Generated by {config.agencyName}</span>
                    <span className="font-mono">{config.watermark} · CONFIDENTIAL</span>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ReportGenerator() {
    const [student, setStudent] = useState(SAMPLE_STUDENT);
    const [config, setConfig] = useState(DEMO_CONFIG);
    const [overview, setOverview] = useState(DEMO_OVERVIEW);
    const [considerations, setConsiderations] = useState(DEMO_CONSIDERATIONS);
    const [wordOfAdvice, setWordOfAdvice] = useState(DEMO_WORD_OF_ADVICE)
    
    const router = useRouter();

    const dark = useSelector(state=>state.other.darkMode);
    const preferences = useSelector(state=>state.card.items);

    const setS = (k) => (v) => setStudent(s => ({ ...s, [k]: v }));
    const setC = (k) => (v) => setConfig(c => ({ ...c, [k]: v }));

    const bg = dark ? "bg-slate-900" : "bg-slate-50";
    const text = dark ? "text-slate-100" : "text-slate-900";
    const sub = dark ? "text-slate-400" : "text-slate-500";
    const actionBar = dark ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-slate-200";

    return (
        <div className={`w-screen h-full ${bg}`}>
            <Navbar />
            {/* ── PAGE TITLE ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-2">
                <div className="flex items-start gap-4">
                    <div className={`hidden sm:flex p-3 rounded-2xl ${dark ? "bg-blue-900/30" : "bg-blue-50"} mt-1`}>
                        <FileText size={22} className="text-blue-500" />
                    </div>
                    <div>
                        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${text}`}>Generate Counseling Report</h1>
                        <p className={`text-sm mt-1 ${sub}`}>Review student details and generate a professional choice filling report.</p>
                    </div>
                </div>

                {/* Progress strip */}
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                    {[
                        { n: "1", label: "Student Info" },
                        { n: "2", label: "Report Config" },
                        { n: "3", label: "Content" },
                        { n: "4", label: "Preferences" },
                        { n: "5", label: "Preview" },
                    ].map((s, i) => (
                        <div key={s.n} className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center
                  ${dark ? "bg-blue-600 text-white" : "bg-blue-600 text-white"}`}>{s.n}</div>
                                <span className={`text-xs font-semibold hidden sm:block ${sub}`}>{s.label}</span>
                            </div>
                            {i < 4 && <div className={`w-6 h-px ${dark ? "bg-slate-700" : "bg-slate-300"}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32 space-y-6">

                {/* § 1 — Student Information */}
                <SectionCard title="Student Information" icon={User} accent="blue" dark={dark}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="sm:col-span-2">
                            <Field label="Student Name" value={student.name} onChange={setS("name")} dark={dark} />
                        </div>
                        <Field label="CRL Rank" value={student.crlRank} onChange={setS("crlRank")} dark={dark} />
                        <SelectField label="Category" value={student.category} onChange={setS("category")}
                            options={["OPEN", "OPEN-EWS", "OBC-NCL", "SC", "ST"]} dark={dark} />
                        <Field label="Category Rank" value={student.categoryRank} onChange={setS("categoryRank")} dark={dark} />
                        <SelectField label="Gender" value={student.gender} onChange={setS("gender")}
                            options={["Male", "Female", "Other"]} dark={dark} />
                        <Field label="Home State" value={student.homeState} onChange={setS("homeState")} dark={dark} />
                        <div />
                        <Field label="Mobile Number" value={student.mobile} onChange={setS("mobile")} type="tel" dark={dark} />
                        <div className="sm:col-span-2 lg:col-span-3">
                            <Field label="Email Address" value={student.email} onChange={setS("email")} type="email" dark={dark} />
                        </div>
                    </div>

                    {/* Student summary chip row */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-700">
                        {[
                            { icon: Hash, v: `CRL: ${student.crlRank}` },
                            { icon: Shield, v: student.category },
                            { icon: Award, v: `Cat. Rank: ${student.categoryRank}` },
                            { icon: MapPin, v: student.homeState },
                            { icon: Phone, v: student.mobile },
                            { icon: Mail, v: student.email },
                        ].map(({ icon: Icon, v },i) => (
                            <span key={v+i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border
                ${dark ? "bg-slate-900/60 border-slate-600 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-600"}`}>
                                <Icon size={11} className="text-blue-400" /> {v}
                            </span>
                        ))}
                    </div>
                </SectionCard>

                {/* § 2 — Report Settings */}
                <SectionCard title="Report Configuration" icon={Settings} accent="violet" dark={dark}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 lg:col-span-2">
                            <Field label="Counseling Agency Name" value={config.agencyName} onChange={setC("agencyName")} dark={dark} />
                        </div>
                        <Field label="Counselor Name" value={config.counselorName} onChange={setC("counselor")} dark={dark} />
                        <div className="sm:col-span-2">
                            <Field label="Mentor Name" value={config.mentorName} onChange={setC("mentorName")} dark={dark} />
                        </div>
                        <Field label="Watermark Text" value={config.watermark} onChange={setC("watermark")} dark={dark} />
                        <div className="space-y-1.5">
                            <label className={`block text-xs font-semibold tracking-wide uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}>Report Date</label>
                            <div className="relative">
                                <Calendar size={14} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${dark ? "text-slate-500" : "text-slate-400"}`} />
                                <input type="date" value={config.date} onChange={e => setC("date")(e.target.value)}
                                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 outline-none
                    focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400
                    ${dark ? "bg-slate-900/60 border-slate-600 text-slate-200 hover:border-slate-500" : "bg-slate-50/80 border-slate-200 text-slate-800 hover:border-slate-300 focus:bg-white"}`} />
                            </div>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <TextArea label="Notes (Optional)" value={config.notes} onChange={setC("notes")} rows={3} dark={dark} />
                        </div>
                    </div>
                </SectionCard>

                {/* § 3 — Overview */}
                <SectionCard title="Overview" icon={BookOpen} accent="emerald" dark={dark}>
                    <TextArea value={overview} onChange={setOverview} rows={5} dark={dark} />
                    <p className={`text-xs mt-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        This content will appear in the "Overview" section of the generated report.
                    </p>
                </SectionCard>

                {/* § 4 — Considerations */}
                <SectionCard title="Considerations" icon={Shield} accent="amber" dark={dark}>
                    <TextArea value={considerations} onChange={setConsiderations} rows={4} dark={dark} />
                    <p className={`text-xs mt-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                        This content will appear in the "Considerations" section of the generated report.
                    </p>
                </SectionCard>

                {/* § 5 — Preferences Table */}
                <SectionCard title="Selected Preferences" icon={Star} accent="rose" dark={dark}>
                    <div className="overflow-x-auto rounded-xl border ${dark ? 'border-slate-700' : 'border-slate-200'}">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={`text-xs font-bold uppercase tracking-wide border-b sticky top-0
                  ${dark ? "bg-slate-700/80 text-slate-300 border-slate-600" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                                    {["Priority", "Institute", "Program", "Quota", "Seat Type", "Opening Rank", "Closing Rank"].map((h,i) => (  //, "Chance"
                                        <th key={h+i} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {preferences.map((row, i) => {
                                    return (
                                        <tr key={`pref-preview-${row.priority ?? i}-${row.institute ?? row.program ?? i}`}
                                            className={`border-b transition-colors duration-150
                      ${dark
                                                    ? "border-slate-700 hover:bg-slate-700/40 text-slate-300"
                                                    : "border-slate-100 hover:bg-blue-50/50 text-slate-700"
                                                }`}>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black
                        ${dark ? "bg-blue-900/60 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                                                    {i + 1}
                                                </span>
                                            </td>
                                            <td className={`px-4 py-3 font-semibold whitespace-nowrap text-sm ${dark ? "text-slate-200" : "text-slate-800"}`}>
                                                {row.institute}
                                            </td>
                                            <td className={`px-4 py-3 text-xs max-w-[180px] truncate ${dark ? "text-slate-300" : "text-slate-600"}`}>{row.program}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold
                        ${dark ? "bg-cyan-900/50 text-cyan-300" : "bg-cyan-50 text-cyan-700"}`}>{row.quota}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold
                        ${dark ? "bg-purple-900/50 text-purple-300" : "bg-purple-50 text-purple-700"}`}>{row.seatType}</span>
                                            </td>
                                            <td className={`px-4 py-3 font-mono font-bold ${dark ? "text-emerald-400" : "text-emerald-700"}`}>
                                                {formatRank(row.openingRank)}
                                            </td>
                                            <td className={`px-4 py-3 font-mono font-bold ${dark ? "text-orange-400" : "text-orange-600"}`}>
                                                {formatRank(row.closingRank)}
                                            </td>
                                            {/* <td className="px-4 py-3"><ChanceBadge chance={row.chance} /></td> */}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className={`flex items-center justify-between mt-3 text-xs ${sub}`}>
                        <span>{preferences.length} choices selected</span>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1"><CheckCircle size={11} className="text-emerald-500" /> Safe</span>
                            <span className="flex items-center gap-1"><AlertTriangle size={11} className="text-amber-500" /> Moderate</span>
                            <span className="flex items-center gap-1"><AlertTriangle size={11} className="text-red-500" /> Risky</span>
                        </div>
                    </div>
                </SectionCard>

                {/* § 6 — Report Preview */}
                <SectionCard title="Document Preview" icon={Eye} accent="slate" dark={dark}>
                    <div className={`rounded-xl p-3 ${dark ? "bg-slate-950" : "bg-slate-100"}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <span className={`text-xs font-mono ${dark ? "text-slate-500" : "text-slate-400"}`}>counseling-report.pdf</span>
                            <Printer size={13} className={sub} />
                        </div>
                        <ReportPreview
                            student={student}
                            config={config}
                            overview={overview}
                            wordOfAdvice={wordOfAdvice}
                            considerations={considerations}
                            preferences={preferences}
                            dark={dark}
                        />
                    </div>
                </SectionCard>
            </div>

            {/* ── STICKY ACTION BAR ── */}
            <div className={`fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl ${actionBar} shadow-2xl`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
                    <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95
            ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                        <ArrowLeft size={15} />
                        <span onClick={()=>{router.push('/')}} className="hidden sm:inline">Back to Preference Builder</span>
                        <span className="sm:hidden">Back</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95
              ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                            <Save size={14} />
                            <span className="hidden sm:inline">Save Report</span>
                        </button>

                        <button
                            onClick={() =>
                                generateDOCReport(student, preferences, config, overview, considerations, wordOfAdvice)
                            }
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 active:scale-95
              ${dark ? "border-slate-600 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                            <FileText size={14} />
                            <span className="hidden sm:inline">Generate DOCX</span>
                            <span className="sm:hidden">DOCX</span>
                        </button>

                        <GeneratePDFButton
                            student={student}
                            preferences={preferences}
                            config={config}
                            overview={overview}
                            considerations={considerations}
                            wordOfAdvice={wordOfAdvice}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
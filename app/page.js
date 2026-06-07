"use client"
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  GraduationCap, TrendingUp, BookOpen, ListOrdered, FileText,
  Filter, ChevronRight, Star, BarChart2, Users, Database,
  Building2, Layers, GripVertical, Download, CheckCircle2,
  Zap, Shield, Award, ArrowRight, Sparkles, Search, ChevronDown,
  Brain, Target, Clock, Globe,
} from "lucide-react";
import Navbar from "@/components/Navbar";

/* ─────────────────────────────────────────────────
   TINY HELPERS  (dark passed as prop)
───────────────────────────────────────────────── */
const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${className}`}
  >
    {children}
  </span>
);

const GradBtn = ({ children, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${className}`}
  >
    {children}
  </button>
);

/* ─────────────────────────────────────────────────
   ANIMATED COUNTER HOOK
───────────────────────────────────────────────── */
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ─────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────── */
const stats = [
  { icon: Database, value: 3, suffix: "+ Yrs", label: "JoSAA Data", color: "from-blue-500 to-blue-600" },
  { icon: BarChart2, value: 50000, suffix: "+", label: "Cutoff Records", color: "from-indigo-500 to-indigo-600" },
  { icon: Building2, value: 120, suffix: "+", label: "Institutes", color: "from-sky-500 to-sky-600" },
  { icon: Layers, value: 1000, suffix: "+", label: "Programs", color: "from-cyan-500 to-cyan-600" },
];

const features = [
  { icon: Target, title: "College Predictor", desc: "Enter your JEE rank and get a curated list of colleges you're likely to get based on historical cutoff trends.", color: "from-blue-500 to-blue-600" },
  { icon: Brain, title: "Branch Predictor", desc: "Find which branches are within your reach across all IITs, NITs, IIITs, and GFTIs with real data.", color: "from-indigo-500 to-indigo-600" },
  { icon: TrendingUp, title: "Opening & Closing Ranks", desc: "Explore year-wise opening and closing ranks for any institute-branch-category combination.", color: "from-sky-500 to-sky-600" },
  { icon: ListOrdered, title: "Preference List Builder", desc: "Drag and drop colleges into your optimal preference order with smart conflict detection.", color: "from-violet-500 to-violet-600" },
  { icon: FileText, title: "Counseling Report", desc: "Generate polished, professional DOCX and PDF counseling reports you can share with mentors.", color: "from-emerald-500 to-emerald-600" },
  { icon: Filter, title: "Smart Filtering", desc: "Filter by category, home state, gender, pool, seat type, and more — with instant results.", color: "from-orange-500 to-orange-600" },
];

const featureBgLight = ["bg-blue-50", "bg-indigo-50", "bg-sky-50", "bg-violet-50", "bg-emerald-50", "bg-orange-50"];
const featureBgDark = ["bg-blue-950/30", "bg-indigo-950/30", "bg-sky-950/30", "bg-violet-950/30", "bg-emerald-950/30", "bg-orange-950/30"];

const steps = [
  { n: "01", title: "Filter Colleges", desc: "Set your rank, category, and preferences to narrow down thousands of options instantly.", icon: Filter },
  { n: "02", title: "Build Preference List", desc: "Drag and arrange your shortlisted choices into the perfect priority order.", icon: ListOrdered },
  { n: "03", title: "Generate Report", desc: "Export a professional counseling report in DOCX or PDF to guide your final decision.", icon: FileText },
];

const mockColleges = [
  { name: "IIT Bombay", branch: "Computer Science & Engg", rank: "67 – 312", prob: 92, tag: "High Chance" },
  { name: "IIT Delhi", branch: "Electrical Engineering", rank: "203 – 580", prob: 78, tag: "Good Chance" },
  { name: "IIT Madras", branch: "Mechanical Engineering", rank: "445 – 890", prob: 65, tag: "Moderate" },
  { name: "IIT Kharagpur", branch: "Civil Engineering", rank: "810 – 1420", prob: 50, tag: "Possible" },
];

const whyUs = [
  { icon: Shield, title: "Accurate Data", desc: "Sourced directly from official JoSAA records — no guesswork.", iconColor: "text-blue-600" },
  { icon: Zap, title: "Fast Filtering", desc: "Instant results across 50,000+ cutoff data points.", iconColor: "text-indigo-600" },
  { icon: Award, title: "Professional Reports", desc: "Structured DOCX/PDF output trusted by mentors.", iconColor: "text-emerald-600" },
  { icon: Users, title: "Student Friendly", desc: "Designed for JEE aspirants — no learning curve.", iconColor: "text-violet-600" },
];
const whyBgLight = ["bg-blue-50", "bg-indigo-50", "bg-emerald-50", "bg-violet-50"];
const whyBgDark = ["bg-blue-950/40", "bg-indigo-950/40", "bg-emerald-950/40", "bg-violet-950/40"];

/* ─────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────── */
function StatCard({ icon: Icon, value, suffix, label, color, inView, dark }) {
  const count = useCounter(value, 1600, inView);
  return (
    <div
      className={`group relative rounded-2xl p-6 shadow-md hover:shadow-xl border transition-all duration-300 hover:-translate-y-1 overflow-hidden
        ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} mb-4 shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className={`text-3xl font-extrabold tracking-tight ${dark ? "text-white" : "text-slate-800"}`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className={`text-sm mt-1 font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</div>
    </div>
  );
}


export default function Home() {
  /* ── Redux dark mode ── */
  const dark = useSelector((state) => state.other.darkMode);

  /* ── local state ── */
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);
  const [category, setCategory] = useState("OPEN");
  const [state, setState] = useState("All India");
  const [rank, setRank] = useState("1250");

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsInView(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── helpers ── */
  const tagColor = (t) => {
    if (t === "High Chance") return dark ? "bg-emerald-900/40 text-emerald-400" : "bg-emerald-100 text-emerald-700";
    if (t === "Good Chance") return dark ? "bg-blue-900/40 text-blue-400" : "bg-blue-100 text-blue-700";
    if (t === "Moderate") return dark ? "bg-amber-900/40 text-amber-400" : "bg-amber-100 text-amber-700";
    return dark ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-600";
  };

  /* ── shorthand aliases ── */
  const bg = dark ? "bg-slate-900" : "bg-white";
  const card = dark ? "bg-slate-800" : "bg-white";
  const cardBdr = dark ? "border-slate-700" : "border-slate-100";
  const txt = dark ? "text-white" : "text-slate-800";
  const sub = dark ? "text-slate-400" : "text-slate-500";
  const muted = dark ? "text-slate-300" : "text-slate-600";
  const inputBg = dark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-800";
  const rowHover = dark ? "hover:bg-slate-700/50" : "hover:bg-slate-50";

  return (
    <div className={`${bg} ${txt} overflow-x-hidden font-sans`}>
      <Navbar />
      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pb-16 overflow-hidden">

        {/* blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute -top-32 -left-32 w-150 h-150 rounded-full blur-3xl opacity-70
            ${dark ? "bg-gradient-to-br from-blue-950/60 to-indigo-950/60" : "bg-gradient-to-br from-blue-100 to-indigo-100"}`} />
          <div className={`absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-60
            ${dark ? "bg-gradient-to-br from-sky-950/50 to-cyan-950/50" : "bg-gradient-to-br from-sky-100 to-cyan-100"}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border opacity-40
            ${dark ? "border-blue-900/40" : "border-blue-100"}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border opacity-30
            ${dark ? "border-indigo-900/30" : "border-indigo-100"}`} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div className="space-y-8">
              <Badge className={`border ${dark
                ? "bg-blue-950/50 text-blue-300 border-blue-800"
                : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                <Sparkles className="w-3.5 h-3.5" />
                Trusted by JEE Aspirants
              </Badge>

              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  Build Your{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Perfect JoSAA
                  </span>
                  <br />Preference List
                </h1>
                <p className={`text-lg max-w-xl leading-relaxed ${sub}`}>
                  Analyze cutoffs, predict colleges, compare branches, and generate professional counseling reports — all in minutes.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <GradBtn className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <GraduationCap className="w-4 h-4" />
                  College Predictor
                  <ArrowRight className="w-4 h-4" />
                </GradBtn>
                <GradBtn className={`border shadow-sm ${dark
                  ? "bg-slate-800 text-slate-200 border-slate-700 hover:border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"}`}>
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Explore Cutoffs
                </GradBtn>
              </div>

              {/* social proof */}
              <div className="flex items-center gap-6 pt-2">
                <div className="flex -space-x-2">
                  {["bg-blue-500", "bg-indigo-500", "bg-sky-500", "bg-violet-500"].map((c, i) => (
                    <div key={i}
                      className={`w-8 h-8 rounded-full ${c} border-2 flex items-center justify-center text-white text-xs font-bold
                        ${dark ? "border-slate-900" : "border-white"}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div className={`text-sm ${sub}`}>
                  <span className={`font-bold ${txt}`}>12,000+</span> students used this platform last year
                </div>
                <div className="hidden sm:flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  <span className={`text-xs ml-1 ${sub}`}>4.9</span>
                </div>
              </div>
            </div>

            {/* RIGHT — dashboard mockup */}
            <div className="relative flex justify-center lg:justify-end">

              {/* floating top-left card */}
              <div
                className={`absolute -top-6 -left-6 w-40 h-24 rounded-2xl shadow-xl border p-3 flex flex-col justify-between z-10
                  ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}
                style={{ animation: "float 4s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>Admitted!</span>
                </div>
                <div className={`text-xs ${sub}`}>IIT Bombay · CSE</div>
                <div className={`w-full rounded-full h-1.5 ${dark ? "bg-emerald-900/40" : "bg-emerald-100"}`}>
                  <div className="bg-emerald-500 h-1.5 rounded-full w-4/5" />
                </div>
              </div>

              {/* main card */}
              <div className={`relative rounded-3xl shadow-2xl border w-full max-w-md overflow-hidden ${card} ${cardBdr}`}>
                {/* card header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-bold text-sm">JoSAA Predictor</span>
                    <Badge className="bg-white/20 text-white border-0">Rank: 1,250</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[["92%", "IIT Bombay"], ["78%", "IIT Delhi"], ["65%", "IIT Madras"]].map(([p, n], i) => (
                      <div key={i} className="bg-white/15 rounded-xl p-2.5 text-center">
                        <div className="text-white font-extrabold text-lg">{p}</div>
                        <div className="text-blue-100 text-[10px] leading-tight mt-0.5">{n}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* college list */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${sub}`}>Predicted Colleges</span>
                    <span className="text-xs text-blue-600 font-semibold">View All →</span>
                  </div>
                  {mockColleges.slice(0, 3).map((c, i) => (
                    <div key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors
                        ${dark
                          ? "bg-slate-700/50 hover:bg-blue-950/30"
                          : "bg-slate-50 hover:bg-blue-50"}`}>
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold truncate ${txt}`}>{c.name}</div>
                        <div className={`text-[10px] truncate ${sub}`}>{c.branch}</div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColor(c.tag)}`}>{c.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* floating bottom-right pill */}
              <div className={`absolute -bottom-4 -right-4 rounded-2xl shadow-xl border px-4 py-3 flex items-center gap-2.5 z-10
                ${dark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100"}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${txt}`}>50K+ Records</div>
                  <div className={`text-[10px] ${sub}`}>Updated 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. STATS
      ══════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className={`py-16 ${dark
          ? "bg-gradient-to-b from-slate-800/50 to-slate-900"
          : "bg-gradient-to-b from-slate-50 to-white"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} inView={statsInView} dark={dark} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. FEATURES
      ══════════════════════════════════════════ */}
      <section className={`py-20 ${dark ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className={`border mb-4 ${dark
              ? "bg-blue-950/50 text-blue-300 border-blue-800"
              : "bg-blue-50 text-blue-700 border-blue-200"}`}>
              <BookOpen className="w-3.5 h-3.5" /> Features
            </Badge>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${txt}`}>
              Everything You Need for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">JoSAA Counseling</span>
            </h2>
            <p className={`mt-3 max-w-xl mx-auto ${sub}`}>A complete toolkit built for JEE aspirants navigating the counseling process.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i}
                className={`group relative rounded-2xl p-6 border border-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer
                  ${dark
                    ? `${featureBgDark[i]} hover:border-blue-800`
                    : `${featureBgLight[i]} hover:border-blue-200`}`}>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className={`text-base font-bold mb-2 ${txt}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${sub}`}>{f.desc}</p>
                <div className={`mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  ${dark ? "text-blue-400" : "text-blue-600"}`}>
                  Learn more <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className={`py-20 ${dark
        ? "bg-gradient-to-b from-slate-800/40 to-slate-900"
        : "bg-gradient-to-b from-slate-50 to-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className={`border mb-4 ${dark
              ? "bg-indigo-950/50 text-indigo-300 border-indigo-800"
              : "bg-indigo-50 text-indigo-700 border-indigo-200"}`}>
              <Clock className="w-3.5 h-3.5" /> Process
            </Badge>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${txt}`}>How It Works</h2>
            <p className={`mt-3 max-w-xl mx-auto ${sub}`}>Three simple steps to your complete JoSAA counseling strategy.</p>
          </div>

          <div className="relative grid sm:grid-cols-3 gap-8">
            {/* connecting line */}
            <div className={`hidden sm:block absolute top-12 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 z-0
              ${dark
                ? "bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700"
                : "bg-gradient-to-r from-blue-300 via-indigo-300 to-violet-300"}`} />

            {steps.map((s, i) => (
              <div key={i} className="relative z-10 text-center group">
                <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto mb-6">
                  <div className={`absolute inset-0 rounded-full group-hover:scale-110 transition-transform duration-300
                    ${dark
                      ? "bg-gradient-to-br from-blue-950/60 to-indigo-950/60"
                      : "bg-gradient-to-br from-blue-100 to-indigo-100"}`} />
                  <div className="relative text-4xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {s.n}
                  </div>
                </div>
                <div className={`rounded-2xl p-6 shadow-md border hover:shadow-xl transition-shadow duration-300 ${card} ${cardBdr}`}>
                  <div className="inline-flex p-2.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mb-3 shadow-sm">
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className={`font-bold text-base mb-2 ${txt}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${sub}`}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. COLLEGE PREDICTOR SHOWCASE
      ══════════════════════════════════════════ */}
      <section className={`py-20 ${dark ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* left: form */}
            <div>
              <Badge className={`border mb-4 ${dark
                ? "bg-blue-950/50 text-blue-300 border-blue-800"
                : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                <Target className="w-3.5 h-3.5" /> College Predictor
              </Badge>
              <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${txt}`}>
                Know Your College{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Before Counseling</span>
              </h2>
              <p className={`mb-8 leading-relaxed ${sub}`}>
                Enter your JEE rank and get an instant prediction based on 3+ years of actual JoSAA cutoff data.
              </p>

              <div className={`rounded-2xl p-6 border space-y-4
                ${dark ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                {/* rank input */}
                <div>
                  <label className={`text-xs font-semibold mb-2 block uppercase tracking-wide ${sub}`}>JEE Rank</label>
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                    <input
                      type="text"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${inputBg}`}
                      placeholder="Enter your rank…"
                    />
                  </div>
                </div>
                {/* dropdowns */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Category", val: category, set: setCategory, opts: ["OPEN", "OBC-NCL", "SC", "ST", "EWS"] },
                    { label: "State", val: state, set: setState, opts: ["All India", "West Bengal", "Maharashtra", "Delhi", "Tamil Nadu"] },
                  ].map(({ label, val, set, opts }) => (
                    <div key={label}>
                      <label className={`text-xs font-semibold mb-2 block uppercase tracking-wide ${sub}`}>{label}</label>
                      <div className="relative">
                        <select
                          value={val}
                          onChange={(e) => set(e.target.value)}
                          className={`w-full px-3 py-3 border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${inputBg}`}
                        >
                          {opts.map((o) => <option key={o}>{o}</option>)}
                        </select>
                        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${sub}`} />
                      </div>
                    </div>
                  ))}
                </div>
                <GradBtn className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <Target className="w-4 h-4" /> Predict My Colleges
                </GradBtn>
              </div>
            </div>

            {/* right: results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-bold ${dark ? "text-slate-300" : "text-slate-700"}`}>Predicted Results</span>
                <span className={`text-xs ${sub}`}>Based on 2021–2024 data</span>
              </div>
              {mockColleges.map((c, i) => (
                <div key={i}
                  className={`flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-all group cursor-pointer
                    ${dark
                      ? "bg-slate-800 border-slate-700 hover:border-blue-700 hover:shadow-md"
                      : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-md"}`}>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0 group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${txt}`}>{c.name}</div>
                    <div className={`text-xs truncate ${sub}`}>{c.branch}</div>
                    <div className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Closing Rank: {c.rank}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-black text-lg ${dark ? "text-blue-400" : "text-blue-600"}`}>{c.prob}%</div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColor(c.tag)}`}>{c.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. PREFERENCE BUILDER SHOWCASE
      ══════════════════════════════════════════ */}
      <section className={`py-20 ${dark
        ? "bg-gradient-to-b from-slate-800/40 to-slate-900"
        : "bg-gradient-to-b from-slate-50 to-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* left: drag list */}
            <div className="order-2 lg:order-1">
              <div className={`rounded-2xl shadow-xl border overflow-hidden ${card} ${cardBdr}`}>
                {/* header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between">
                  <span className="text-white font-bold text-sm">My Preference List</span>
                  <Badge className="bg-white/20 text-white border-0">6 Choices</Badge>
                </div>
                {/* rows */}
                <div className="p-4 space-y-2">
                  {[
                    { n: 1, inst: "IIT Kharagpur", br: "CSE", type: "OS" },
                    { n: 2, inst: "IIT Delhi", br: "Electrical Engg", type: "OS" },
                    { n: 3, inst: "IIT Madras", br: "Mechanical", type: "OS" },
                    { n: 4, inst: "IIT Roorkee", br: "CSE", type: "HS" },
                    { n: 5, inst: "NIT Trichy", br: "CSE", type: "OS" },
                  ].map((item, i) => (
                    <div key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl border group cursor-grab active:cursor-grabbing
                        ${i === 0
                          ? dark
                            ? "border-blue-700 bg-blue-950/30"
                            : "border-blue-300 bg-blue-50"
                          : dark
                            ? "border-slate-700 bg-slate-700/30"
                            : "border-slate-100 bg-slate-50"}`}>
                      <GripVertical className={`w-4 h-4 transition-colors
                        ${dark
                          ? "text-slate-600 group-hover:text-slate-400"
                          : "text-slate-300 group-hover:text-slate-500"}`} />
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                        ${i === 0
                          ? "bg-blue-600 text-white"
                          : dark
                            ? "bg-slate-600 text-slate-300"
                            : "bg-slate-200 text-slate-600"}`}>
                        {item.n}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-bold ${txt}`}>{item.inst} — {item.br}</div>
                        <div className={`text-[10px] ${sub}`}>OPEN · {item.type}</div>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    </div>
                  ))}
                </div>
                {/* footer buttons */}
                <div className={`p-4 border-t flex gap-2 ${dark ? "border-slate-700" : "border-slate-100"}`}>
                  <button className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Export List
                  </button>
                  <button className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors
                    ${dark
                      ? "border-slate-600 text-slate-400 hover:bg-slate-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* right: text */}
            <div className="order-1 lg:order-2">
              <Badge className={`border mb-4 ${dark
                ? "bg-violet-950/50 text-violet-300 border-violet-800"
                : "bg-violet-50 text-violet-700 border-violet-200"}`}>
                <ListOrdered className="w-3.5 h-3.5" /> Preference Builder
              </Badge>
              <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${txt}`}>
                Drag & Drop Your{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Choice Filling Order</span>
              </h2>
              <p className={`mb-6 leading-relaxed ${sub}`}>
                Arrange your college-branch combinations in the optimal priority order. Smart conflict detection highlights issues in real-time.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Intuitive drag-and-drop interface",
                  "Smart conflict & overlap detection",
                  "Export to PDF, DOCX, or clipboard",
                  "Supports OS/HS seat pool filtering",
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${muted}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <GradBtn className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                <ListOrdered className="w-4 h-4" /> Build Preference List
              </GradBtn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. COUNSELING REPORT SHOWCASE
      ══════════════════════════════════════════ */}
      <section className={`py-20 ${dark ? "bg-slate-900" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* left: text */}
            <div>
              <Badge className={`border mb-4 ${dark
                ? "bg-emerald-950/50 text-emerald-300 border-emerald-800"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                <FileText className="w-3.5 h-3.5" /> Report Generator
              </Badge>
              <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${txt}`}>
                Generate a{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Professional Report</span>{" "}
                in Seconds
              </h2>
              <p className={`mb-6 leading-relaxed ${sub}`}>
                Generate professional counseling reports in DOCX and PDF formats — complete with your preference list, analysis, and choice filling table.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Structured student profile section",
                  "Comprehensive college-branch analysis",
                  "Choice filling table with rank data",
                  "Exportable in DOCX and PDF formats",
                ].map((item, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${muted}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <GradBtn className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                <FileText className="w-4 h-4" /> Generate Report
              </GradBtn>
            </div>

            {/* right: report preview */}
            <div className="relative">
              {/* watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-5">
                <span className="text-6xl font-black text-slate-400 rotate-[-30deg] select-none tracking-widest">PREVIEW</span>
              </div>

              <div className={`rounded-2xl shadow-2xl border overflow-hidden ${card} ${dark ? "border-slate-700" : "border-slate-200"}`}>
                {/* report header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-white font-bold text-base">JoSAA Counseling Report</div>
                      <div className="text-slate-400 text-xs mt-0.5">Session 2024 · Generated by JoSAA Advisor</div>
                    </div>
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* student details */}
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${sub}`}>Student Details</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[["Name", "Rahul Sharma"], ["JEE Rank", "1,250"], ["Category", "OPEN"], ["Home State", "West Bengal"]].map(([k, v]) => (
                        <div key={k} className={`rounded-lg px-3 py-2 ${dark ? "bg-slate-700/50" : "bg-slate-50"}`}>
                          <div className={`text-[9px] uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-400"}`}>{k}</div>
                          <div className={`text-xs font-bold ${txt}`}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* overview */}
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${sub}`}>Overview & Considerations</div>
                    <div className={`rounded-lg p-3 text-xs leading-relaxed
                      ${dark ? "bg-blue-950/30 text-slate-400" : "bg-blue-50 text-slate-600"}`}>
                      Based on JEE rank{" "}
                      <span className={`font-bold ${dark ? "text-blue-400" : "text-blue-700"}`}>1,250 (OPEN)</span>,
                      the student has strong prospects at IIT Bombay (CSE) and IIT Delhi (EE). Historical cutoffs suggest 3 high-probability choices among the top 5 preferences.
                    </div>
                  </div>

                  {/* choice filling table */}
                  <div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${sub}`}>Choice Filling Table</div>
                    <div className={`overflow-x-auto rounded-lg border ${dark ? "border-slate-700" : "border-slate-100"}`}>
                      <table className="w-full text-[10px]">
                        <thead className={dark ? "bg-slate-700" : "bg-slate-100"}>
                          <tr>
                            {["#", "Institute", "Branch", "OR", "CR"].map((h) => (
                              <th key={h} className={`px-2 py-1.5 text-left font-bold ${dark ? "text-slate-300" : "text-slate-600"}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["1", "IIT Bombay", "CSE", "67", "312"],
                            ["2", "IIT Delhi", "EE", "203", "580"],
                            ["3", "IIT Madras", "Mech", "445", "890"],
                          ].map(([n, inst, br, or_, cr]) => (
                            <tr key={n} className={`border-t transition-colors
                              ${dark
                                ? "border-slate-700 hover:bg-slate-700/50"
                                : "border-slate-50 hover:bg-slate-50"}`}>
                              <td className={`px-2 py-1.5 font-bold ${dark ? "text-blue-400" : "text-blue-600"}`}>{n}</td>
                              <td className={`px-2 py-1.5 font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{inst}</td>
                              <td className={`px-2 py-1.5 ${sub}`}>{br}</td>
                              <td className={`px-2 py-1.5 ${sub}`}>{or_}</td>
                              <td className={`px-2 py-1.5 ${sub}`}>{cr}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* footer */}
                <div className={`px-5 py-3 border-t flex items-center gap-2
                  ${dark ? "bg-slate-700/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`text-[10px] ${sub}`}>Available in DOCX and PDF formats</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. WHY CHOOSE US
      ══════════════════════════════════════════ */}
      <section className={`py-20 ${dark
        ? "bg-gradient-to-b from-slate-800/40 to-slate-900"
        : "bg-gradient-to-b from-slate-50 to-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge className={`border mb-4 ${dark
              ? "bg-emerald-950/50 text-emerald-300 border-emerald-800"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
              <Star className="w-3.5 h-3.5" /> Why Choose Us
            </Badge>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${txt}`}>
              Built for JEE Aspirants,{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                by People Who've Been There
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map((w, i) => (
              <div key={i}
                className={`group rounded-2xl p-6 border border-transparent transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                  ${dark
                    ? `${whyBgDark[i]} hover:border-blue-800`
                    : `${whyBgLight[i]} hover:border-blue-200`}`}>
                <div className={`inline-flex p-3 rounded-xl shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300
                  ${dark ? "bg-slate-800" : "bg-white"}`}>
                  <w.icon className={`w-5 h-5 ${w.iconColor}`} />
                </div>
                <h3 className={`font-bold mb-2 ${txt}`}>{w.title}</h3>
                <p className={`text-sm leading-relaxed ${sub}`}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. CTA  (gradient — same in both modes)
      ══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-white text-xs font-semibold mb-6 border border-white/20">
            <Globe className="w-3.5 h-3.5" /> Free to Use · No Login Required
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to Build Your<br />
            <span className="text-blue-200">JoSAA Strategy?</span>
          </h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Start exploring colleges and create your personalized choice filling list today. No account needed — just your rank and your ambition.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <GradBtn className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl">
              <GraduationCap className="w-4 h-4" />
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </GradBtn>
            <GradBtn className="bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25">
              <FileText className="w-4 h-4" />
              Generate Report
            </GradBtn>
          </div>
        </div>
      </section>

      {/* float keyframe */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

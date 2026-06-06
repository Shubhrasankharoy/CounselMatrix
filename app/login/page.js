"use client"
import { useState, useEffect } from "react";
import {
    Eye, EyeOff, Mail, Lock, GraduationCap, BarChart3,
    ListChecks, FileText, ChevronRight, Sparkles, Shield, BookOpen
} from "lucide-react";
import { AUTH_PROVIDERS } from "@/utils/coonstants";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const FEATURES = [
    {
        icon: BarChart3,
        title: "Accurate Cutoff Analysis",
        desc: "Deep-dive into 6+ years of JoSAA opening & closing ranks across all institutes.",
    },
    {
        icon: ListChecks,
        title: "Smart Choice Filling",
        desc: "AI-powered preference ordering based on your rank, category & branch interests.",
    },
    {
        icon: FileText,
        title: "Personalized Reports",
        desc: "Downloadable PDF reports with seat matrix, trends & your admission probability.",
    },
];

function FloatingDot({ style }) {
    return (
        <div
            className="absolute rounded-full opacity-10 animate-pulse"
            style={style}
        />
    );
}

export default function JoSAALoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({ email: "", password: "" });
    const [cardVisible, setCardVisible] = useState(false);

    const userDetails = useSelector((state)=>state.user)
    const dispatch = useDispatch();

    const router = useRouter();
    console.log(router);
    console.log(userDetails);
    

    useEffect(() => {
      if(userDetails && userDetails.isLoggedIn == true) router.push('/')
    
    }, [userDetails, router])
    

    useEffect(() => {
        setMounted(true);
        const t = setTimeout(() => setCardVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    const validate = () => {
        const e = {};
        if (!form.email) e.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
        if (!form.password) e.password = "Password is required.";
        else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setIsLoading(true);


        await new Promise((r) => setTimeout(r, 2000));
        setIsLoading(false);
    };

    const handleAuthProvider = async (authProvider) => {
        console.log("Button is clicked");

        if (authProvider === "google") {
            console.log("Google");
            const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
            const { AUTH } = await import("@/firebase");
            const provider = new GoogleAuthProvider();

            try {
                const result = await signInWithPopup(AUTH, provider);
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const { uid, displayName, email, photoURL } = result.user;

                dispatch(setUser({ uid, displayName, email, photoURL }));
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData?.email;
                const credential = GoogleAuthProvider.credentialFromError?.(error);
                console.error("Google sign-in error:", errorCode, errorMessage, email, credential);
            }
        }
    }

    const handleChange = (field) => (e) => {
        setForm((p) => ({ ...p, [field]: e.target.value }));
        if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
    };

    const dm = darkMode;

    return (
        <div
            className={`min-h-screen flex flex-col lg:flex-row font-sans transition-colors duration-300 ${dm ? "bg-gray-950" : "bg-slate-50"}`}
            style={{ fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif" }}
        >
            {/* ── LEFT HERO ─────────────────────────────────────────────────── */}
            <div
                className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden"
                style={{ background: "linear-gradient(145deg, #0A2540 0%, #0F4C81 55%, #1565A8 100%)" }}
            >
                {/* Geometric grid overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                {/* Floating decorative blobs */}
                <FloatingDot style={{ width: 340, height: 340, background: "#F4B400", top: -80, right: -80, animationDuration: "4s" }} />
                <FloatingDot style={{ width: 220, height: 220, background: "#1E88E5", bottom: 80, left: -60, animationDuration: "6s" }} />
                <FloatingDot style={{ width: 120, height: 120, background: "#F4B400", bottom: 240, right: 60, animationDuration: "5s" }} />

                {/* Diagonal accent bar */}
                <div
                    className="absolute opacity-20"
                    style={{
                        width: 3,
                        height: "120%",
                        background: "linear-gradient(180deg, transparent, #F4B400, transparent)",
                        right: 80,
                        top: "-10%",
                        transform: "rotate(12deg)",
                    }}
                />

                <div className="relative z-10 flex flex-col h-full px-12 py-10">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "#F4B400" }}
                        >
                            <GraduationCap size={22} color="#0A2540" strokeWidth={2.5} />
                        </div>
                        <div>
                            <span className="text-white font-bold text-lg tracking-tight leading-none">Counsel</span>
                            <span className="text-white/50 font-normal text-lg"> Matrix</span>
                        </div>
                    </div>

                    {/* Hero text */}
                    <div className="flex-1 flex flex-col justify-center max-w-md">
                        <div
                            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 w-fit"
                            style={{ background: "rgba(244,180,0,0.15)", border: "1px solid rgba(244,180,0,0.3)" }}
                        >
                            <Sparkles size={13} color="#F4B400" />
                            <span className="text-xs font-medium" style={{ color: "#F4B400" }}>Trusted by 50,000+ aspirants</span>
                        </div>

                        <h1
                            className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-5"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            Unlock Your<br />
                            <span style={{ color: "#F4B400" }}>Best College</span><br />
                            Choices
                        </h1>

                        <p className="text-base text-white/60 leading-relaxed mb-10 max-w-sm">
                            Analyze JoSAA cutoffs, generate personalized choice lists, and make informed admission decisions — all in one place.
                        </p>

                        {/* Feature cards */}
                        <div className="space-y-3">
                            {FEATURES.map(({ icon: Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="flex items-start gap-4 rounded-2xl p-4 group cursor-default transition-all duration-300 hover:scale-[1.02]"
                                    style={{
                                        background: "rgba(255,255,255,0.06)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                        style={{ background: "rgba(244,180,0,0.2)" }}
                                    >
                                        <Icon size={17} color="#F4B400" strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm mb-0.5">{title}</p>
                                        <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                                    </div>
                                    <ChevronRight size={14} className="ml-auto mt-1 text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom trust badge */}
                    <div className="flex items-center gap-2 mt-8">
                        <Shield size={14} className="text-white/30" />
                        <span className="text-xs text-white/30">Data sourced from official JoSAA portals · 2019–2024</span>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: LOGIN CARD ─────────────────────────────────────────── */}
            <div
                className={`flex-1 flex flex-col items-center justify-center min-h-screen px-5 py-10 sm:px-10 transition-colors duration-300 ${dm ? "bg-gray-950" : "bg-slate-50"}`}
            >
                {/* Dark mode toggle */}
                <button
                    onClick={() => setDarkMode((d) => !d)}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                        background: dm ? "rgba(255,255,255,0.08)" : "rgba(15,76,129,0.08)",
                        border: `1px solid ${dm ? "rgba(255,255,255,0.12)" : "rgba(15,76,129,0.12)"}`,
                    }}
                    aria-label="Toggle dark mode"
                >
                    <span className="text-base">{dm ? "☀️" : "🌙"}</span>
                </button>

                {/* Mobile logo */}
                <div className="flex lg:hidden items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#F4B400" }}>
                        <GraduationCap size={17} color="#0A2540" strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-base" style={{ color: dm ? "#fff" : "#0A2540" }}>JoSAA Advisor</span>
                </div>

                {/* Card */}
                <div
                    className="w-full max-w-105 rounded-3xl p-8 sm:p-9 transition-all duration-700"
                    style={{
                        background: dm ? "#111827" : "#ffffff",
                        border: `1px solid ${dm ? "rgba(255,255,255,0.08)" : "rgba(15,76,129,0.1)"}`,
                        boxShadow: dm
                            ? "0 0 0 1px rgba(255,255,255,0.04), 0 24px 64px rgba(0,0,0,0.5)"
                            : "0 4px 6px rgba(15,76,129,0.04), 0 24px 64px rgba(15,76,129,0.1)",
                        opacity: cardVisible ? 1 : 0,
                        transform: cardVisible ? "translateY(0)" : "translateY(24px)",
                    }}
                >
                    {/* Heading */}
                    <div className="mb-7">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                            style={{ background: "linear-gradient(135deg, #0F4C81, #1565A8)" }}
                        >
                            <BookOpen size={19} color="#fff" strokeWidth={2} />
                        </div>
                        <h2
                            className="text-2xl font-bold mb-1.5 tracking-tight"
                            style={{ color: dm ? "#f1f5f9" : "#0A2540", fontFamily: "'Outfit', sans-serif" }}
                        >
                            Welcome back
                        </h2>
                        <p className="text-sm" style={{ color: dm ? "#94a3b8" : "#64748b" }}>
                            Sign in to continue your counseling journey.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                                style={{ color: dm ? "#94a3b8" : "#475569" }}
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: dm ? "#475569" : "#94a3b8" }}
                                />
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange("email")}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{
                                        background: dm ? "#1e293b" : "#f8fafc",
                                        border: `1.5px solid ${errors.email ? "#ef4444" : dm ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
                                        color: dm ? "#f1f5f9" : "#0f172a",
                                        boxShadow: errors.email
                                            ? "0 0 0 3px rgba(239,68,68,0.12)"
                                            : "none",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.border = `1.5px solid ${errors.email ? "#ef4444" : "#0F4C81"}`;
                                        e.target.style.boxShadow = errors.email
                                            ? "0 0 0 3px rgba(239,68,68,0.12)"
                                            : "0 0 0 3px rgba(15,76,129,0.15)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.border = `1.5px solid ${errors.email ? "#ef4444" : dm ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`;
                                        e.target.style.boxShadow = errors.email ? "0 0 0 3px rgba(239,68,68,0.12)" : "none";
                                    }}
                                />
                            </div>
                            {errors.email && <p className="text-xs mt-1.5 text-red-500">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-semibold uppercase tracking-wider"
                                    style={{ color: dm ? "#94a3b8" : "#475569" }}
                                >
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-xs font-medium transition-colors hover:underline"
                                    style={{ color: "#0F4C81" }}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                    style={{ color: dm ? "#475569" : "#94a3b8" }}
                                />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange("password")}
                                    className="w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                                    style={{
                                        background: dm ? "#1e293b" : "#f8fafc",
                                        border: `1.5px solid ${errors.password ? "#ef4444" : dm ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
                                        color: dm ? "#f1f5f9" : "#0f172a",
                                        boxShadow: errors.password ? "0 0 0 3px rgba(239,68,68,0.12)" : "none",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.border = `1.5px solid ${errors.password ? "#ef4444" : "#0F4C81"}`;
                                        e.target.style.boxShadow = errors.password
                                            ? "0 0 0 3px rgba(239,68,68,0.12)"
                                            : "0 0 0 3px rgba(15,76,129,0.15)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.border = `1.5px solid ${errors.password ? "#ef4444" : dm ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`;
                                        e.target.style.boxShadow = errors.password ? "0 0 0 3px rgba(239,68,68,0.12)" : "none";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                                    style={{ color: dm ? "#475569" : "#94a3b8" }}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs mt-1.5 text-red-500">{errors.password}</p>}
                        </div>

                        {/* Remember me */}
                        <div className="flex items-center gap-2.5 pt-0.5">
                            <button
                                type="button"
                                role="checkbox"
                                aria-checked={rememberMe}
                                onClick={() => setRememberMe((v) => !v)}
                                className="w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all duration-200 shrink-0"
                                style={{
                                    width: 18,
                                    height: 18,
                                    background: rememberMe ? "#0F4C81" : "transparent",
                                    border: `2px solid ${rememberMe ? "#0F4C81" : dm ? "rgba(255,255,255,0.2)" : "#cbd5e1"}`,
                                }}
                            >
                                {rememberMe && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                            <span className="text-sm select-none" style={{ color: dm ? "#94a3b8" : "#64748b" }}>
                                Remember me for 30 days
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl font-semibold text-sm text-white mt-2 transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden"
                            style={{
                                background: isLoading
                                    ? "#1565A8"
                                    : "linear-gradient(135deg, #0A2540 0%, #0F4C81 60%, #1565A8 100%)",
                                boxShadow: "0 4px 14px rgba(15,76,129,0.35)",
                                transform: isLoading ? "scale(0.99)" : "scale(1)",
                            }}
                            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = "scale(1.015)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.015)")}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                <>Sign In <ChevronRight size={15} /></>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px" style={{ background: dm ? "rgba(255,255,255,0.08)" : "#e2e8f0" }} />
                        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: dm ? "#475569" : "#94a3b8" }}>
                            or continue with
                        </span>
                        <div className="flex-1 h-px" style={{ background: dm ? "rgba(255,255,255,0.08)" : "#e2e8f0" }} />
                    </div>

                    {/* Social */}
                    <div className="grid grid-cols-2 gap-3">
                        {AUTH_PROVIDERS.map(({ label, icon }) => (
                            <button
                                key={label}
                                type="button"
                                className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                                style={{
                                    background: dm ? "#1e293b" : "#fff",
                                    border: `1.5px solid ${dm ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
                                    color: dm ? "#cbd5e1" : "#334155",
                                    boxShadow: dm ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = dm
                                        ? "0 4px 12px rgba(0,0,0,0.3)"
                                        : "0 4px 12px rgba(15,76,129,0.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = dm ? "none" : "0 1px 3px rgba(0,0,0,0.06)";
                                }}
                                onClick={() => handleAuthProvider(label.toLowerCase())}
                            >
                                {icon}
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Sign up */}
                    <p className="text-center text-sm mt-6" style={{ color: dm ? "#64748b" : "#94a3b8" }}>
                        Don't have an account?{" "}
                        <button
                            type="button"
                            className="font-semibold transition-colors hover:underline"
                            style={{ color: "#0F4C81" }}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-xs mt-8 text-center" style={{ color: dm ? "#334155" : "#cbd5e1" }}>
                    © 2024 JoSAA Advisor · Privacy · Terms
                </p>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Outfit:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { opacity: 0.4; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        @keyframes pulse { 0%,100% { opacity: 0.08; } 50% { opacity: 0.18; } }
        .animate-pulse { animation: pulse 4s ease-in-out infinite; }
      `}</style>
        </div>
    );
}
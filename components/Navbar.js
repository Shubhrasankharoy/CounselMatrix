"use client"
import { toggleDarkMode } from '@/utils/otherSlice';
import { GraduationCap, Moon, Sun, User } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function Navbar()  {
    const dark = useSelector(state=>state.other.darkMode)
    const dispatch = useDispatch()

    const text = dark ? "text-slate-100" : "text-slate-900";
    const user = useSelector(state=>state.user)

    return (
        <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${dark ? "bg-slate-900/90 border-slate-700" : "bg-white/90 border-slate-200"} shadow-sm`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <div>
                        <span className={`text-base font-bold tracking-tight ${text}`}>Counsel </span>
                        <span className="text-base font-light text-blue-500 ml-1">Matrix</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => dispatch(toggleDarkMode())}
                        className={`p-2 rounded-xl transition-all ${dark ? "bg-slate-700 text-yellow-400 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                        {dark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <div className={`w-9 h-9 rounded-xl ${dark ? "bg-slate-700" : "bg-linear-to-br from-blue-100 to-blue-200"} flex items-center justify-center`}>
                        <User size={16} className={dark ? "text-slate-300" : "text-blue-600"} />
                    </div>
                </div>
            </div>
        </header>
    )
}

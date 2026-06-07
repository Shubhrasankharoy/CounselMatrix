"use client"
import DragItem from '@/components/DragItem'
import Navbar from '@/components/Navbar'
import { removePreference, reorderPreference } from '@/utils/cardSlice'
import { BookOpen, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function Prefences() {
    const dark = useSelector(state => state.other.darkMode);
    const preferences = useSelector(state => state.card.items);
    const dragFrom = useRef(null);
    const dispatch = useDispatch();
    const router = useRouter();
    
    
    const handleRemovePreference = (id) => dispatch(removePreference(id));

    const handleDragStart = (i) => { dragFrom.current = i; };
    const handleDragOver = (i) => {
        if (dragFrom.current === null || dragFrom.current === i) return;
        dispatch(reorderPreference({ fromIndex: dragFrom.current, toIndex: i }));
        dragFrom.current = i;
    };

    const bg = dark ? "bg-slate-900" : "bg-slate-50";
    const card = dark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200";
    const text = dark ? "text-slate-100" : "text-slate-900";
    const sub = dark ? "text-slate-400" : "text-slate-500";
    const head = dark ? "bg-slate-750 text-slate-300 border-slate-700" : "bg-slate-50 text-slate-600 border-slate-200";
    const rowBase = dark ? "border-slate-700/50 text-slate-300 hover:bg-slate-700/40" : "border-slate-100 text-slate-700 hover:bg-blue-50/40";

    return (
        <div className={`w-full h-full min-h-screen ${bg}`}>
            <Navbar />

            <div className="hidden lg:flex flex-col justify-center items-center gap-4 min-w-3xs">
                <div className={`rounded-2xl border shadow-sm w-[70vw] overflow-hidden flex flex-col ${card}`} style={{ maxHeight: "calc(100vh - 120px)" }}>
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
                                    router.push('/preferences/reportgenerator')
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
    )
}

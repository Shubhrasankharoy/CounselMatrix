import React from 'react'
import Badge from './Badge';
import { GripVertical, Trash2 } from 'lucide-react';

export default function DragItem({ item, index, onRemove, onDragStart, onDragOver, onDrop, dark }) {
    return (
        <div
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={e => { e.preventDefault(); onDragOver(index); }}
            onDrop={() => onDrop(index)}
            className={`group flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing
        ${dark
                    ? "bg-slate-800 border-slate-700 hover:border-blue-600/50 hover:bg-slate-750"
                    : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-sm shadow-sm"
                }`}
        >
            <GripVertical size={15} className={`mt-0.5 shrink-0 ${dark ? "text-slate-600" : "text-slate-300"} group-hover:text-blue-400 transition-colors`} />
            <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className={`text-xs font-semibold truncate ${dark ? "text-slate-200" : "text-slate-800"}`}>{item.institute}</p>
                            {item.isNew && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${dark ? "bg-emerald-900 text-emerald-300" : "bg-emerald-100 text-emerald-800"}`}>NEW</span>
                            )}
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{item.program}</p>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                    <Badge dark={dark}>{item.quota}</Badge>
                    <Badge dark={dark}>{item.seatType}</Badge>
                </div>
            </div>
            <button
                onClick={() => onRemove(item.id)}
                className={`p-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100
          ${dark ? "text-slate-500 hover:text-red-400 hover:bg-slate-700" : "text-slate-300 hover:text-red-500 hover:bg-red-50"}`}
            >
                <Trash2 size={13} />
            </button>
        </div>
    );
}
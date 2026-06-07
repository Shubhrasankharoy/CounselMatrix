import { X } from 'lucide-react';
import React from 'react'

export default function Badge({ children, onRemove, dark }) {
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium
      ${dark ? "bg-blue-900/50 text-blue-300 border border-blue-700/50" : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
            {children}
            {onRemove && (
                <button onClick={onRemove} className="hover:text-red-400 transition-colors">
                    <X size={11} />
                </button>
            )}
        </span>
    );
}

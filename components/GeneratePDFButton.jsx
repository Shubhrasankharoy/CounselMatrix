// components/GenerateReportButton.jsx
'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

export default function GeneratePDFButton({
    student,
    preferences,
    config,
    overview,
    considerations,
    wordOfAdvice
}) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            // Dynamically import the function only when needed
            const { generatePDFReport } = await import('@/utils/generatePDFReport');
            await generatePDFReport(student, preferences, config, overview, considerations, wordOfAdvice);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-95"
        >
            {isGenerating ? 
            <span >Generating ... </span>
            :
                <>
                    <Download size={14} />
                    <span className="hidden sm:inline">Generate PDF </span>
                    <span className="sm:hidden">PDF</span>
                </>
            }
        </button>
    );
}
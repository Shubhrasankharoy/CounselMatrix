// generateReport.js (DOCX enhanced version)
import {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    TextRun,
    AlignmentType,
    BorderStyle,
    ShadingType,
} from "docx";

import { saveAs } from "file-saver";
import { DEMO_CONCLUSION } from "@/utils/coonstants"; 

export async function generateDOCReport(student, preferences, config, overview, considerations, wordOfAdvice) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const rows = [
        new TableRow({
            children: [
                createHeaderCell("#"),
                createHeaderCell("Institute"),
                createHeaderCell("Program"),
                createHeaderCell("Quota"),
                createHeaderCell("Seat Type"),
                createHeaderCell("Open"),
                createHeaderCell("Close"),
            ],
        }),
        ...preferences.map((item, index) =>
            new TableRow({
                children: [
                    createCell(String(index + 1), "center"),
                    createCell(item.institute),
                    createCell(item.program),
                    createCell(item.quota, "center"),
                    createCell(item.seatType, "center"),
                    createCell(String(item.openingRank), "right"),
                    createCell(String(item.closingRank), "right"),
                ],
            })
        ),
    ];

    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "mainTitle",
                    name: "Main Title",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 40, bold: true, color: "1a4d8c" },
                    paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 200 } },
                },
                {
                    id: "sectionHeader",
                    name: "Section Header",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: { size: 28, bold: true, color: "1a4d8c" },
                    paragraph: { spacing: { before: 240, after: 120 } },
                },
            ],
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                    },
                },
                children: [
                    // Title
                    new Paragraph({
                        text: "Advised Choice Filling List",
                        style: "mainTitle",
                    }),
                    
                    // Date and Counselor
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Date: ${formattedDate}`, size: 20, color: "666666" }),
                            new TextRun({ text: `\t\t\t\t\t\t\t\t\t\t\t\t\tCounselor: ${config.counselorName || "Gourab Roy"}`, size: 20, color: "666666" }),
                        ],
                    }),
                    
                    new Paragraph({ text: "", spacing: { after: 200 } }),
                    
                    // Student Info Table
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    createInfoCell("STUDENT", student.name),
                                    createInfoCell("GENDER", student.gender || "Male"),
                                    createInfoCell("HOME STATE", student.homeState || "West Bengal"),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    createInfoCell("CATEGORY", student.category),
                                    createInfoCell("CRL RANK", String(student.crlRank)),
                                    createInfoCell("", ""),
                                ],
                            }),
                        ],
                    }),
                    
                    new Paragraph({ text: "", spacing: { after: 200 } }),
                    
                    // OVERVIEW
                    new Paragraph({ text: "OVERVIEW", style: "sectionHeader" }),
                    new Paragraph({ text: overview, spacing: { after: 200 } }),
                    
                    // CONSIDERATIONS
                    new Paragraph({ text: "CONSIDERATIONS", style: "sectionHeader" }),
                    new Paragraph({ text: considerations, spacing: { after: 200 } }),
                    
                    // ADVISED CHOICE FILLING LIST
                    new Paragraph({ text: "ADVISED CHOICE FILLING LIST", style: "sectionHeader" }),
                    
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: rows,
                    }),
                    
                    new Paragraph({ text: "", spacing: { after: 200 } }),
                    
                    // WORD OF ADVICE
                    new Paragraph({ text: "WORD OF ADVICE", style: "sectionHeader" }),
                    ...wordOfAdvice.map(
                        point =>
                            new Paragraph({
                                bullet: { level: 0 },
                                children: [new TextRun({ text: point, size: 22 })],
                            })
                    ),
                    
                    new Paragraph({ text: "", spacing: { after: 200 } }),
                    
                    // Conclusion
                    new Paragraph({
                        border: {
                            top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                        },
                        spacing: { before: 200 },
                    }),
                    new Paragraph({
                        children: [new TextRun({ text: DEMO_CONCLUSION, italics: true, size: 20, color: "555555" })],
                        spacing: { before: 120 },
                    }),
                    
                    // Footer text
                    new Paragraph({
                        children: [
                            new TextRun({ text: `Generated on ${formattedDate}`, size: 16, color: "999999" }),
                        ],
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 400 },
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${student.name.replace(/\s+/g, '_')}_Choice_Filling_List.docx`);
}

// Helper functions for DOCX
function createCell(text, alignment = "left") {
    return new TableCell({
        children: [new Paragraph({ text: String(text), alignment: getAlignment(alignment) })],
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
        },
    });
}

function createHeaderCell(text) {
    return new TableCell({
        children: [new Paragraph({ text: text, alignment: AlignmentType.CENTER, bold: true })],
        shading: { fill: "1a4d8c", type: ShadingType.SOLID },
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "1a4d8c" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "1a4d8c" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "1a4d8c" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "1a4d8c" },
        },
    });
}

function createInfoCell(label, value) {
    return new TableCell({
        children: [
            new Paragraph({ text: label, bold: true, size: 20 }),
            new Paragraph({ text: value, bold: true, size: 24, spacing: { before: 60 } }),
        ],
        borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    });
}

function getAlignment(alignment) {
    switch (alignment) {
        case "center": return AlignmentType.CENTER;
        case "right": return AlignmentType.RIGHT;
        default: return AlignmentType.LEFT;
    }
}
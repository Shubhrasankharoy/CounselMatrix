// utils/generatePDFReport.js
import { DEMO_CONCLUSION } from "@/utils/coonstants"; 

// This function will be called only on the client side
export async function generatePDFReport(student, preferences, config, overview, considerations, wordOfAdvice) {
    try {
        // Dynamically import pdfmake only on client side
        const pdfMakeModule = await import("pdfmake/build/pdfmake");
        const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

        const pdfMake = pdfMakeModule.default;
        const pdfFonts = pdfFontsModule.default;

        // Register fonts correctly
        pdfMake.vfs = pdfFonts.vfs;

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        const agencyName = config.agencyName || "Shubhra Sankha Roy Counselling Helpdesk";
        const counselorName = config.counselorName || "Shubhra Sankha Roy";
        const mentorName = config.mentorName || "Shubhra Sankha Roy";
        const watermarkText = config.watermark || "S S ROY";

        // Build table body — includes "Chance" column
        const tableBody = [
            [
                { text: "#", style: "tableHeader" },
                { text: "Institute", style: "tableHeader" },
                { text: "Program", style: "tableHeader" },
                { text: "Quota", style: "tableHeader" },
                { text: "Seat Type", style: "tableHeader" },
                { text: "Open", style: "tableHeader" },
                { text: "Close", style: "tableHeader" },
                // { text: "Chance", style: "tableHeader" }
            ]
        ];

        preferences.forEach((item, index) => {
            tableBody.push([
                { text: String(index + 1), alignment: "center", fontSize: 9 },
                { text: item.institute, fontSize: 9, bold: true },
                { text: item.program, fontSize: 9 },
                { text: item.quota, alignment: "center", fontSize: 9 },
                { text: item.seatType, alignment: "center", fontSize: 9 },
                { text: item.openingRank ? String(item.openingRank) : "—", alignment: "center", fontSize: 9, color: item.openingRank ? "#007a55" : "#e04040" },
                { text: item.closingRank ? String(item.closingRank) : "—", alignment: "center", fontSize: 9, color: item.closingRank ? "#f54a00" : "#e04040" },
                // {
                //     stack: [
                //         {
                //             text: item.chance || "Unknown",
                //             fontSize: 8,
                //             color: "#1a4d8c",
                //             alignment: "center",
                //             bold: false
                //         }
                //     ],
                //     alignment: "center"
                // }
            ]);
        });

        // Build word of advice bullets
        const adviceBullets = wordOfAdvice.map(point => ({
            text: point,
            fontSize: 10,
            color: "#333333",
            lineHeight: 1.4,
            margin: [0, 3, 0, 3],
            listType: "bullet"
        }));

        const docDefinition = {
            pageSize: "A4",
            pageMargins: [40, 110, 40, 60],

            // Diagonal watermark
            watermark: {
                text: watermarkText,
                color: "#1a4d8c",
                opacity: 0.06,
                bold: true,
                fontSize: 72,
                angle: -45
            },

            // Header: dark navy bar with agency name + CRL rank box
            header: function (currentPage, pageCount) {
                return {
                    margin: [0, 0, 0, 0],
                    stack: [
                        // Dark navy top bar
                        {
                            canvas: [
                                {
                                    type: "rect",
                                    x: 0, y: 0,
                                    w: 595, h: 80,
                                    color: "#1a3a6b"
                                }
                            ]
                        },
                        // Overlay content on the bar
                        {
                            absolutePosition: { x: 40, y: 18 },
                            columns: [
                                // Left: icon placeholder + agency name + title
                                {
                                    width: "*",
                                    stack: [
                                        {
                                            columns: [
                                                {
                                                    width: "*",
                                                    stack: [
                                                        { text:  agencyName.toUpperCase() || "Advised Choice Filling List", fontSize: 16, bold: true, color: "#ffffff", margin: [0, 3, 0, 0] },
                                                        { text: `Date: ${formattedDate}  ·  Counselor: ${counselorName}  ·  Mentor: ${mentorName}`, fontSize: 8, color: "#aac4ee", margin: [0, 3, 0, 0] }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                // Right: CRL Rank box
                                {
                                    width: 110,
                                    margin: [0, 0, 10, 0],
                                    stack: [
                                        {
                                            canvas: [
                                                {
                                                    type: "rect",
                                                    x: 0, y: 0,
                                                    w: 105, h: 58,
                                                    r: 6,
                                                    color: "#0f2a52"
                                                }
                                            ]
                                        },
                                        {
                                            absolutePosition: { x: 450, y: 20 },
                                            width: 105,
                                            stack: [
                                                { text: "CRL Rank", fontSize: 8, color: "#aac4ee", alignment: "center" },
                                                { text: String(student.crlRank || "—"), fontSize: 20, bold: true, color: "#ffffff", alignment: "center", margin: [0, 1, 0, 1] },
                                                {
                                                    text: student.categoryRank
                                                        ? `${student.category} · ${student.categoryRank}`
                                                        : student.category || "",
                                                    fontSize: 8, color: "#aac4ee", alignment: "center"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                };
            },

            footer: function (currentPage, pageCount) {
                return {
                    margin: [40, 0, 40, 15],
                    columns: [
                        { text: `Generated by ${agencyName}`, fontSize: 8, color: "#999999" },
                        { text: `${watermarkText}  ·  CONFIDENTIAL`, fontSize: 8, color: "#999999", alignment: "right" }
                    ]
                };
            },

            content: [
                // ── Student Info Row ──────────────────────────────────────
                {
                    columns: [
                        {
                            width: "30%",
                            stack: [
                                { text: "STUDENT", bold: true, fontSize: 8, color: "#888888", letterSpacing: 1 },
                                { text: student.name, bold: true, fontSize: 13, color: "#1a3a6b", margin: [0, 3, 0, 0] }
                            ]
                        },
                        {
                            width: "18%",
                            stack: [
                                { text: "GENDER", bold: true, fontSize: 8, color: "#888888", letterSpacing: 1 },
                                { text: student.gender || "—", fontSize: 12, color: "#222222", margin: [0, 3, 0, 0] }
                            ]
                        },
                        {
                            width: "27%",
                            stack: [
                                { text: "HOME STATE", bold: true, fontSize: 8, color: "#888888", letterSpacing: 1 },
                                { text: student.homeState || "—", bold: true, fontSize: 12, color: "#222222", margin: [0, 3, 0, 0] }
                            ]
                        },
                        {
                            width: "25%",
                            stack: [
                                { text: "CATEGORY", bold: true, fontSize: 8, color: "#888888", letterSpacing: 1 },
                                { text: student.category || "—", fontSize: 12, color: "#222222", margin: [0, 3, 0, 0] }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 14]
                },

                // Divider
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#dddddd" }], margin: [0, 0, 0, 16] },

                // ── OVERVIEW ─────────────────────────────────────────────
                {
                    columns: [
                        {
                            width: "*",
                            text: "OVERVIEW",
                            style: "sectionHeader"
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#e0e0e0" }], margin: [0, 0, 0, 8] },
                {
                    text: overview,
                    fontSize: 10,
                    lineHeight: 1.5,
                    color: "#444444",
                    margin: [0, 0, 0, 16]
                },

                // ── CONSIDERATIONS ───────────────────────────────────────
                {
                    columns: [
                        {
                            width: "*",
                            text: "CONSIDERATIONS",
                            style: "sectionHeader"
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#e0e0e0" }], margin: [0, 0, 0, 8] },
                {
                    text: considerations,
                    fontSize: 10,
                    lineHeight: 1.5,
                    color: "#444444",
                    margin: [0, 0, 0, 16]
                },

                // ── ADVISED CHOICE FILLING LIST ──────────────────────────
                {
                    columns: [
                        {
                            width: "*",
                            text: "ADVISED CHOICE FILLING LIST",
                            style: "sectionHeader"
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#e0e0e0" }], margin: [0, 0, 0, 8] },

                // Table
                {
                    table: {
                        headerRows: 1,
                        widths: ["5%", "23%", "29%", "8%", "9%", "13%", "13%"],
                        body: tableBody
                    },
                    layout: {
                        hLineWidth: (i) => i === 0 || i === 1 ? 0 : 0.5,
                        vLineWidth: () => 0,
                        hLineColor: () => "#e8e8e8",
                        paddingLeft: () => 6,
                        paddingRight: () => 6,
                        paddingTop: () => 7,
                        paddingBottom: () => 7,
                        fillColor: (rowIndex) => {
                            if (rowIndex === 0) return "#1a3a6b";
                            return rowIndex % 2 === 0 ? "#f5f8ff" : "#ffffff";
                        }
                    },
                    margin: [0, 0, 0, 20]
                },

                // ── WORD OF ADVICE ───────────────────────────────────────
                {
                    columns: [
                        {
                            width: "*",
                            text: "WORD OF ADVICE",
                            style: "sectionHeader"
                        }
                    ],
                    margin: [0, 0, 0, 5]
                },
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#e0e0e0" }], margin: [0, 0, 0, 8] },
                {
                    ul: wordOfAdvice.map(point => ({
                        text: point,
                        fontSize: 10,
                        color: "#444444",
                        lineHeight: 1.4,
                        margin: [0, 2, 0, 2]
                    })),
                    margin: [0, 0, 0, 20]
                },

                // ── Conclusion ───────────────────────────────────────────
                { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: "#dddddd" }], margin: [0, 0, 0, 10] },
                {
                    text: DEMO_CONCLUSION,
                    fontSize: 9,
                    italics: true,
                    color: "#777777",
                    lineHeight: 1.4
                }
            ],

            styles: {
                sectionHeader: {
                    fontSize: 11,
                    bold: true,
                    color: "#1a4d8c",
                    letterSpacing: 0.5
                },
                tableHeader: {
                    bold: true,
                    fontSize: 9,
                    color: "#ffffff",
                    alignment: "center"
                }
            },
            defaultStyle: {
                fontSize: 10,
                font: "Roboto"
            }
        };

        // Generate and download PDF
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        const fileName = `${student.name.replace(/\s+/g, '_')}_Choice_Filling_List.pdf`;
        pdfDocGenerator.download(fileName);

        return Promise.resolve();
    } catch (error) {
        console.error('Error in generatePDFReport:', error);
        throw error;
    }
}
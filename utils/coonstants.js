export const AUTH_PROVIDERS = [
                            {
                                label: "Google",
                                icon: (
                                    <svg width="17" height="17" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                ),
                            },
                            {
                                label: "GitHub",
                                icon: (
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill={ "#24292f"}>
                                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                                    </svg>
                                ),
                            },
                        ]

export const ROWS_PER_PAGE = 8;
export const DATA_API = "/api/csv";
export const DATA_FILE_NAME = "/josaa_2025_round6.csv";
export const DEMO_OVERVIEW = "Please be advised that this document constitutes a final enumeration of choices. The candidate is advised to follow his own conscience and intuition to edit the choices as per his  convenience. We are just here to guide the student, facilitating his counseling process. Make sure you go through each and every word of this document carefully to avoid any misunderstandings. Do check the footnotes in the form of ”Word of Advice” at the end of the document."
export const DEMO_CONSIDERATIONS = "The student has been briefed about the conditions in the colleges mentioned, and this preferential choice filling order has been made with their informed consent."
export const DEMO_WORD_OF_ADVICE = [
    "You can change or edit the preferences as per your convenience, this pdf is given to guide you. It is not advised to follow it blindly.",
    "Make sure you don't skip any single preferences from the above list.",
    "While choice filling might seem a bit easy, it is a tedious process, you have to be sure while filling any choice.",
    "Some of the preferences above are Public Private Partnership, thus it is wise enough to consider their fees while doing choice filling. (lF ANY)",
    "Consider using basic web browsers (say Chrome) to avoid any hindrance while choice filling.",
    "You can refer to videos available on Gourab Bhaiya's channel for further assistance. All the best for these four years, make sure you don't let these years go in vain."
]
export const DEMO_CONFIG = {
    agencyName: "GOURAB ROY Counselling Helpdesk",
    mentorName: "Argha Banik",
    watermark: "GOURAB ROY",
    date: new Date().toISOString().split("T")[0],
    counselorName: "Gourab Roy",
    notes: "",
}

export const DEMO_CONCLUSION = "All the best for your future, make sure you don't let your college life go in vain.";
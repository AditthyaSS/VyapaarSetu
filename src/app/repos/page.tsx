import Link from "next/link";

export default function ReposPage() {
    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl mx-auto text-center">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-atlas-bg-card border border-atlas-border flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-atlas-purple"
                    >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                </div>

                <h1 className="text-3xl font-sans font-bold text-atlas-text-primary mb-3">
                    AI Repos Directory
                </h1>
                <p className="text-atlas-text-secondary mb-2">
                    Trending AI GitHub repositories with growth charts, star history, and community metrics.
                </p>
                <p className="text-sm text-atlas-text-muted mb-8">
                    Coming in AIAtlas v2. Want to help build it?
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/contribute"
                        className="px-5 py-2.5 text-sm font-medium bg-atlas-green/10 text-atlas-green border border-atlas-green/20 rounded-md hover:bg-atlas-green/20 transition-colors"
                    >
                        Suggest a Repo
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 text-sm font-medium text-atlas-text-secondary border border-atlas-border rounded-md hover:border-atlas-border-hover hover:text-atlas-text-primary transition-colors"
                    >
                        View on GitHub
                    </a>
                </div>

                {/* Teaser categories */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["Frameworks", "Models", "Datasets", "Tools"].map((cat) => (
                        <div
                            key={cat}
                            className="p-4 bg-atlas-bg-card border border-atlas-border rounded-lg text-center"
                        >
                            <p className="text-xs font-mono uppercase tracking-wider text-atlas-text-muted">
                                {cat}
                            </p>
                            <p className="mt-1 text-lg font-mono font-bold text-atlas-purple">
                                Soon
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

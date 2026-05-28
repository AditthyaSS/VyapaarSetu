import Link from "next/link";

export default function ToolsPage() {
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
                        className="text-atlas-amber"
                    >
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-sans font-bold text-atlas-text-primary mb-3">
                    AI Tools Directory
                </h1>
                <p className="text-atlas-text-secondary mb-2">
                    A curated collection of AI-powered tools — coding assistants, writing aids, image generators, agents, and more.
                </p>
                <p className="text-sm text-atlas-text-muted mb-8">
                    Coming in AIAtlas v2. Want to help build it?
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Link
                        href="/contribute"
                        className="px-5 py-2.5 text-sm font-medium bg-atlas-green/10 text-atlas-green border border-atlas-green/20 rounded-md hover:bg-atlas-green/20 transition-colors"
                    >
                        Contribute a Tool
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
                    {["Coding", "Writing", "Image Gen", "Agents"].map((cat) => (
                        <div
                            key={cat}
                            className="p-4 bg-atlas-bg-card border border-atlas-border rounded-lg text-center"
                        >
                            <p className="text-xs font-mono uppercase tracking-wider text-atlas-text-muted">
                                {cat}
                            </p>
                            <p className="mt-1 text-lg font-mono font-bold text-atlas-amber">
                                Soon
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

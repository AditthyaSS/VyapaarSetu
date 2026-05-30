"use client";

import { FeedEvent } from "@/types";
import { timeAgo } from "@/lib/utils";

interface FeedTickerProps {
    events: FeedEvent[];
}

const eventIcons: Record<string, string> = {
    model_added: "✦",
    review_posted: "★",
    price_updated: "↻",
    tool_added: "⚡",
};

const eventLabels: Record<string, string> = {
    model_added: "added",
    review_posted: "reviewed",
    price_updated: "pricing updated",
    tool_added: "added",
};

export function FeedTicker({ events }: FeedTickerProps) {
    if (events.length === 0) return null;

    const tickerItems = [...events, ...events];

    return (
        <div className="w-full overflow-hidden bg-atlas-bg-secondary/50 border-b border-atlas-border relative flex items-center h-10">
            {/* Embedded CSS for Auto-Scrolling Marquee */}
            <style>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    animation: scroll-left 40s linear infinite;
                    width: max-content;
                }
                /* Hover karne par scroll ruk jayega taaki user aaram se read kar sake */
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
            `}</style>

            {/* Fixed "Activity" Label pinned to the left */}
            <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-4 bg-atlas-bg-secondary/90 backdrop-blur-sm border-r border-atlas-border/50 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-none">
                <span className="shrink-0 text-[10px] font-mono uppercase tracking-widest text-atlas-text-muted">
                    Activity
                </span>
            </div>

            {/* Scrolling Ticker Tape Content */}
            <div className="flex items-center animate-ticker pl-32">
                {tickerItems.map((event, idx) => (
                    <div
                        key={`${event.id}-${idx}`}
                        className="flex items-center gap-2 shrink-0 text-sm px-4"
                    >
                        {/* Pulse dot */}
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-atlas-green opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-atlas-green" />
                        </span>

                        <span className="font-mono text-xs text-atlas-text-muted">
                            {timeAgo(event.createdAt)}
                        </span>

                        <span className="text-atlas-text-secondary text-xs">
                            <span className="text-atlas-text-primary font-medium">
                                {event.entityName}
                            </span>
                            {" "}
                            {eventLabels[event.eventType] || event.eventType}
                            {event.user && (
                                <>
                                    {" by "}
                                    <span className="text-atlas-purple font-medium">
                                        @{event.user.githubUsername}
                                    </span>
                                </>
                            )}
                        </span>

                        {/* Dot Separator */}
                        <span className="text-atlas-border ml-2">·</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
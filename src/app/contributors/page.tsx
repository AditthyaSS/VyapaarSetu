"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Contributor {
    rank: number;
    username: string;
    xp: number;
    level: number;
    badges: string[];
    joined: string;
    bio: string;
    totalModels: number;
    totalReviews: number;
    avatar: string;
}

const initialContributors: Contributor[] = [
    {
        rank: 1,
        username: "MistryVishwa",
        xp: 125,
        level: 5,
        badges: ["NEW_CONTRIBUTOR", "ACTIVE_CONTRIBUTOR", "TOP_CONTRIBUTOR", "VERIFIED_CONTRIBUTOR"],
        joined: "Jan 2026",
        bio: "Lead developer and chief AIAtlas platform contributor.",
        totalModels: 8,
        totalReviews: 15,
        avatar: "https://avatars.githubusercontent.com/u/9919?v=4"
    },
    {
        rank: 2,
        username: "open-source-fan",
        xp: 67,
        level: 4,
        badges: ["NEW_CONTRIBUTOR", "ACTIVE_CONTRIBUTOR", "TOP_CONTRIBUTOR", "VERIFIED_CONTRIBUTOR"],
        joined: "Mar 2024",
        bio: "Proud promoter of open-weights models and open-source licensing.",
        totalModels: 5,
        totalReviews: 8,
        avatar: "https://avatars.githubusercontent.com/u/120593?v=4"
    },
    {
        rank: 3,
        username: "sarah-dev",
        xp: 42,
        level: 3,
        badges: ["NEW_CONTRIBUTOR", "ACTIVE_CONTRIBUTOR", "TOP_CONTRIBUTOR"],
        joined: "Jun 2024",
        bio: "Full stack ML engineer and open-source enthusiast.",
        totalModels: 3,
        totalReviews: 5,
        avatar: "https://avatars.githubusercontent.com/u/120593?v=4"
    },
    {
        rank: 4,
        username: "ml-enthusiast",
        xp: 18,
        level: 2,
        badges: ["NEW_CONTRIBUTOR", "ACTIVE_CONTRIBUTOR"],
        joined: "Sep 2024",
        bio: "Researching large language models and neural architecture search.",
        totalModels: 1,
        totalReviews: 4,
        avatar: "https://avatars.githubusercontent.com/u/120593?v=4"
    },
    {
        rank: 5,
        username: "techwatch",
        xp: 12,
        level: 2,
        badges: ["NEW_CONTRIBUTOR"],
        joined: "Jan 2025",
        bio: "Tracking the latest AI model updates and releases.",
        totalModels: 1,
        totalReviews: 2,
        avatar: "https://avatars.githubusercontent.com/u/120593?v=4"
    }
];

const BADGE_META: Record<string, { label: string; desc: string; icon: string; style: string }> = {
    NEW_CONTRIBUTOR: {
        label: "New Contributor",
        desc: "Earned first contribution score.",
        icon: "🌟",
        style: "bg-atlas-blue/10 text-atlas-blue border-atlas-blue/20"
    },
    ACTIVE_CONTRIBUTOR: {
        label: "Active Contributor",
        desc: "Reputation score above 15 XP.",
        icon: "🔥",
        style: "bg-atlas-amber/10 text-atlas-amber border-atlas-amber/20"
    },
    TOP_CONTRIBUTOR: {
        label: "Top Contributor",
        desc: "Reached level 3 or above.",
        icon: "🏆",
        style: "bg-atlas-purple/10 text-atlas-purple border-atlas-purple/20"
    },
    VERIFIED_CONTRIBUTOR: {
        label: "Verified Contributor",
        desc: "Vetted member with accurate contributions.",
        icon: "✅",
        style: "bg-atlas-green/10 text-atlas-green border-atlas-green/20"
    }
};

export default function ContributorsLeaderboard() {
    const [searchQuery, setSearchQuery] = useState("");
    const [tooltipActive, setTooltipActive] = useState<string | null>(null);

    const filteredContributors = useMemo(() => {
        if (!searchQuery) return initialContributors;
        const q = searchQuery.toLowerCase();
        return initialContributors.filter((c) =>
            c.username.toLowerCase().includes(q)
        );
    }, [searchQuery]);

    // Top 3 for the podium showcase
    const topThree = useMemo(() => {
        const sorted = [...initialContributors].sort((a, b) => b.xp - a.xp);
        return {
            first: sorted[0],
            second: sorted[1],
            third: sorted[2]
        };
    }, []);

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in font-sans">
            
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-atlas-text-primary mb-2">
                    Community Contributors
                </h1>
                <p className="text-sm text-atlas-text-muted max-w-2xl">
                    Recognizing the elite members maintaining the open ecosystem directory. Earn XP points by submitting models, updating specs, and writing reviews.
                </p>
            </div>

            {/* 🏆 Top 3 Contributors Podium Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end max-w-4xl mx-auto">
                
                {/* 🥈 Rank 2: Silver */}
                {topThree.second && (
                    <div className="order-2 md:order-1 p-6 bg-atlas-bg-card border border-atlas-border hover:border-atlas-border-hover rounded-xl flex flex-col items-center justify-center text-center shadow-lg relative min-h-[220px] transition-all hover:-translate-y-1">
                        <div className="absolute top-3 left-3 font-mono font-bold text-xs text-atlas-text-muted">#2</div>
                        <div className="relative">
                            <img
                                src={topThree.second.avatar}
                                alt={topThree.second.username}
                                className="w-16 h-16 rounded-full border-2 border-slate-300 object-cover shadow"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-slate-300 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                               🥈 Silver
                            </div>
                        </div>
                        <Link href={`/u/${topThree.second.username}`} className="text-base font-bold text-atlas-text-primary mt-4 hover:underline">
                            {topThree.second.username}
                        </Link>
                        <p className="text-xs text-atlas-text-muted mt-1 font-mono">{topThree.second.xp} XP • Level {topThree.second.level}</p>
                        <p className="text-xs text-atlas-text-secondary mt-3 line-clamp-2 max-w-[200px] leading-relaxed">
                            &quot;{topThree.second.bio}&quot;
                        </p>
                    </div>
                )}

                {/* 🥇 Rank 1: Gold */}
                {topThree.first && (
                    <div className="order-1 md:order-2 p-8 bg-atlas-bg-card border-2 border-atlas-amber hover:border-atlas-amber rounded-2xl flex flex-col items-center justify-center text-center shadow-2xl relative min-h-[260px] transition-all hover:-translate-y-1 bg-gradient-to-b from-atlas-amber/5 via-transparent to-transparent">
                        <div className="absolute top-3 left-3 font-mono font-bold text-sm text-atlas-amber">#1</div>
                        <div className="relative">
                            <img
                                src={topThree.first.avatar}
                                alt={topThree.first.username}
                                className="w-20 h-20 rounded-full border-4 border-atlas-amber object-cover shadow-2xl"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-atlas-amber text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                               🥇 Gold
                            </div>
                        </div>
                        <Link href={`/u/${topThree.first.username}`} className="text-lg font-bold text-atlas-text-primary mt-4 hover:underline flex items-center gap-1">
                            {topThree.first.username} 👑
                        </Link>
                        <p className="text-sm text-atlas-amber font-semibold font-mono mt-1">{topThree.first.xp} XP • Level {topThree.first.level}</p>
                        <p className="text-xs text-atlas-text-secondary mt-3 line-clamp-2 max-w-[240px] leading-relaxed italic">
                            &quot;{topThree.first.bio}&quot;
                        </p>
                    </div>
                )}

                {/* 🥉 Rank 3: Bronze */}
                {topThree.third && (
                    <div className="order-3 p-6 bg-atlas-bg-card border border-atlas-border hover:border-atlas-border-hover rounded-xl flex flex-col items-center justify-center text-center shadow-lg relative min-h-[200px] transition-all hover:-translate-y-1">
                        <div className="absolute top-3 left-3 font-mono font-bold text-xs text-atlas-text-muted">#3</div>
                        <div className="relative">
                            <img
                                src={topThree.third.avatar}
                                alt={topThree.third.username}
                                className="w-16 h-16 rounded-full border-2 border-amber-600 object-cover shadow"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-amber-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                               🥉 Bronze
                            </div>
                        </div>
                        <Link href={`/u/${topThree.third.username}`} className="text-base font-bold text-atlas-text-primary mt-4 hover:underline">
                            {topThree.third.username}
                        </Link>
                        <p className="text-xs text-atlas-text-muted mt-1 font-mono">{topThree.third.xp} XP • Level {topThree.third.level}</p>
                        <p className="text-xs text-atlas-text-secondary mt-3 line-clamp-2 max-w-[200px] leading-relaxed">
                            &quot;{topThree.third.bio}&quot;
                        </p>
                    </div>
                )}

            </div>

            {/* Main Interactive Leaderboard & Legends */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* 📊 Leaderboard list */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <input
                                type="text"
                                placeholder="Search contributors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-4 py-1.5 text-sm bg-atlas-bg-secondary border border-atlas-border rounded-md text-atlas-text-primary focus:outline-none focus:border-atlas-green/60"
                            />
                            <svg className="absolute left-2.5 top-2 text-atlas-text-muted w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                        </div>
                        <span className="text-xs font-mono text-atlas-text-muted">
                            {filteredContributors.length} Contributors
                        </span>
                    </div>

                    <div className="w-full overflow-x-auto border border-atlas-border rounded-lg bg-atlas-bg-primary">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-atlas-border bg-atlas-bg-secondary text-left">
                                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-atlas-text-muted w-16 text-center">Rank</th>
                                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-atlas-text-muted">Contributor</th>
                                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-atlas-text-muted text-center w-24">Reputation</th>
                                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-atlas-text-muted text-center w-20">Level</th>
                                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-atlas-text-muted">Earned Badges</th>
                                    <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-atlas-text-muted w-24">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContributors.map((c) => (
                                    <tr
                                        key={c.username}
                                        className="border-b border-atlas-border/50 hover:bg-atlas-bg-tertiary transition-colors"
                                    >
                                        <td className="px-4 py-4 text-center font-mono font-bold">
                                            {c.rank === 1 ? (
                                                <span className="text-atlas-amber">🥇 1</span>
                                            ) : c.rank === 2 ? (
                                                <span className="text-slate-400">🥈 2</span>
                                            ) : c.rank === 3 ? (
                                                <span className="text-amber-700">🥉 3</span>
                                            ) : (
                                                <span className="text-atlas-text-muted">{c.rank}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={c.avatar}
                                                    alt={c.username}
                                                    className="w-8 h-8 rounded-full object-cover border border-atlas-border"
                                                />
                                                <div>
                                                    <Link
                                                        href={`/u/${c.username}`}
                                                        className="font-sans font-semibold text-atlas-text-primary hover:text-atlas-green transition-colors hover:underline"
                                                    >
                                                        {c.username}
                                                    </Link>
                                                    <p className="text-[10px] text-atlas-text-muted mt-0.5 line-clamp-1 max-w-[200px]">
                                                        {c.bio}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center font-mono font-bold text-atlas-green">
                                            {c.xp} XP
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="px-2 py-0.5 rounded bg-atlas-bg-tertiary border border-atlas-border text-xs font-mono text-atlas-text-primary">
                                                Lvl {c.level}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {c.badges.map((badge) => {
                                                    const meta = BADGE_META[badge];
                                                    if (!meta) return null;
                                                    const tooltipKey = `${c.username}-${badge}`;
                                                    return (
                                                        <div
                                                            key={badge}
                                                            className="relative"
                                                            onMouseEnter={() => setTooltipActive(tooltipKey)}
                                                            onMouseLeave={() => setTooltipActive(null)}
                                                        >
                                                            <span className={cn("px-1.5 py-0.5 text-[10px] font-mono rounded border flex items-center gap-0.5 cursor-pointer hover:scale-105 transition-transform", meta.style)}>
                                                                <span>{meta.icon}</span>
                                                                <span className="hidden sm:inline">{meta.label}</span>
                                                            </span>

                                                            {tooltipActive === tooltipKey && (
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-atlas-bg-card border border-atlas-border rounded text-[9px] text-atlas-text-secondary leading-normal z-50 text-center shadow-xl animate-fade-in font-sans">
                                                                    <p className="font-semibold text-atlas-text-primary mb-0.5">{meta.label}</p>
                                                                    {meta.desc}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs font-mono text-atlas-text-secondary">
                                            {c.joined}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🏆 Legend / Scoring System Card */}
                <div className="space-y-6">
                    <div className="p-5 bg-atlas-bg-card border border-atlas-border rounded-xl shadow-sm">
                        <h3 className="font-sans font-bold text-sm text-atlas-text-primary mb-4 flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-atlas-amber" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                            </svg>
                            XP Points System
                        </h3>
                        <p className="text-xs text-atlas-text-secondary mb-4 leading-relaxed">
                            Reputation points (XP) are awarded automatically once a moderator approves your contributions:
                        </p>
                        <ul className="space-y-3 font-mono text-xs border-t border-atlas-border/50 pt-4">
                            <li className="flex justify-between items-center">
                                <span className="text-atlas-text-muted">Add New Model</span>
                                <span className="text-atlas-green font-bold">+10 XP</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-atlas-text-muted">Update Information</span>
                                <span className="text-atlas-green font-bold">+5 XP</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-atlas-text-muted">Submit Review</span>
                                <span className="text-atlas-green font-bold">+2 XP</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-5 bg-atlas-bg-card border border-atlas-border rounded-xl shadow-sm">
                        <h3 className="font-sans font-bold text-sm text-atlas-text-primary mb-3">
                            Reputation Milestones
                        </h3>
                        <ul className="space-y-3 font-mono text-xs">
                            <li className="flex justify-between items-center">
                                <span className="text-atlas-text-muted">Level 1 (Newbie)</span>
                                <span className="text-atlas-text-secondary">0 - 9 XP</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-slate-400">Level 2 (Bronze)</span>
                                <span className="text-atlas-text-secondary">10 - 29 XP</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-slate-300">Level 3 (Silver)</span>
                                <span className="text-atlas-text-secondary">30 - 59 XP</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-atlas-amber font-semibold">Level 4 (Gold)</span>
                                <span className="text-atlas-text-secondary">60 - 99 XP</span>
                            </li>
                            <li className="flex justify-between items-center">
                                <span className="text-atlas-purple font-bold">Level 5 (Apex)</span>
                                <span className="text-atlas-text-secondary">100+ XP</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    );
}

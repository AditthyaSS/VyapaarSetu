"use client";

import { cn, formatPrice, formatContextWindow, formatBenchmark, getBenchmarkColor } from "@/lib/utils";
import { Model } from "@/types";
import Link from "next/link";

interface ModelCardProps {
    model: Model;
    rank?: number;
}

export function ModelCard({ model, rank }: ModelCardProps) {
    return (
        <Link href={`/models/${model.slug}`}>
            <div className="group p-4 bg-atlas-bg-card border border-atlas-border rounded-lg hover:border-atlas-border-hover hover:bg-atlas-bg-tertiary transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {rank !== undefined && (
                            <span className="font-mono text-sm font-bold text-atlas-green">
                                #{rank}
                            </span>
                        )}
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h3 className="font-sans font-medium text-atlas-text-primary group-hover:text-atlas-green transition-colors">
                                    {model.name}
                                </h3>
                                {model.isVerified && (
                                    <span className="text-atlas-green text-xs">✓</span>
                                )}
                            </div>
                            <p className="text-xs text-atlas-text-muted">
                                {model.provider?.name}
                            </p>
                        </div>
                    </div>
                    {model.isOpenSource && (
                        <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-atlas-purple/10 text-atlas-purple border border-atlas-purple/20">
                            OSS
                        </span>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-atlas-text-muted">GPQA</p>
                        <p className={cn("font-mono text-sm font-medium", getBenchmarkColor(model.benchmarkGpqa))}>
                            {formatBenchmark(model.benchmarkGpqa)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-atlas-text-muted">Context</p>
                        <p className="font-mono text-sm text-atlas-text-secondary">
                            {formatContextWindow(model.contextWindow)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-atlas-text-muted">Input</p>
                        <p className="font-mono text-sm text-atlas-text-secondary">
                            {formatPrice(model.inputPricePerMtok)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-atlas-text-muted">Output</p>
                        <p className="font-mono text-sm text-atlas-text-secondary">
                            {formatPrice(model.outputPricePerMtok)}
                        </p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {model.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-atlas-bg-tertiary text-atlas-text-secondary border border-atlas-border/50"
                        >
                            {tag}
                        </span>
                    ))}
                    {model.modalities.map((mod) => (
                        <span
                            key={mod}
                            className="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-atlas-blue/10 text-atlas-blue border border-atlas-blue/20"
                        >
                            {mod}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}

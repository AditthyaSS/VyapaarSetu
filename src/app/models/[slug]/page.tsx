"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatContextWindow, formatBenchmark, getBenchmarkColor, cn } from "@/lib/utils";
import { ReviewSection } from "@/components/models/ReviewSection";
import { ModelDetailSkeleton } from "@/components/ui/Skeletons";
import { Model } from "@/types";

export default function ModelDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [model, setModel] = useState<Model | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        setIsLoading(true);
        setNotFound(false);

        fetch(`/api/models/${encodeURIComponent(slug)}`, { signal: controller.signal })
            .then((res) => {
                if (res.status === 404) {
                    setNotFound(true);
                    return null;
                }
                return res.json();
            })
            .then((json) => {
                if (json?.data) {
                    setModel(json.data as Model);
                }
            })
            .catch((err) => {
                if ((err as Error).name === "AbortError") return;
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [slug]);

    if (isLoading) {
        return <ModelDetailSkeleton />;
    }

    if (!model || notFound) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-2xl font-bold text-atlas-text-primary mb-2">Model not found</h1>
                <p className="text-atlas-text-muted mb-6">
                    The model &quot;{slug}&quot; doesn&apos;t exist in our directory.
                </p>
                <Link href="/models" className="text-atlas-blue hover:underline text-sm">
                    ← Back to Models
                </Link>
            </div>
        );
    }

    const benchmarks = [
        { label: "GPQA", value: model.benchmarkGpqa, max: 100 },
        { label: "MMLU", value: model.benchmarkMmlu, max: 100 },
        { label: "HLE", value: model.benchmarkHle, max: 100 },
    ].filter((b) => b.value !== undefined && b.value !== null);

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-atlas-text-muted">
                    <li>
                        <Link href="/models" className="hover:text-atlas-text-secondary transition-colors">
                            Models
                        </Link>
                    </li>
                    <li>/</li>
                    <li className="text-atlas-text-primary">{model.name}</li>
                </ol>
            </nav>

            {/* Hero */}
            <div className="mb-8 pb-8 border-b border-atlas-border">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-sans font-bold text-atlas-text-primary">
                                {model.name}
                            </h1>
                            {model.isVerified && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-atlas-green/10 text-atlas-green border border-atlas-green/20 rounded">
                                    ✓ Verified
                                </span>
                            )}
                            {model.isOpenSource && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono uppercase tracking-wider bg-atlas-purple/10 text-atlas-purple border border-atlas-purple/20 rounded">
                                    Open Source
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-atlas-text-secondary mb-3">
                            by{" "}
                            <span className="text-atlas-text-primary font-medium">
                                {model.provider?.name}
                            </span>
                        </p>
                        {model.description && (
                            <p className="text-atlas-text-secondary max-w-2xl">
                                {model.description}
                            </p>
                        )}
                    </div>

                    {/* Modality badges */}
                    <div className="flex flex-wrap gap-2">
                        {model.modalities.map((mod) => (
                            <span
                                key={mod}
                                className="px-2 py-1 text-xs font-mono uppercase tracking-wider rounded bg-atlas-blue/10 text-atlas-blue border border-atlas-blue/20"
                            >
                                {mod}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <SpecCard label="Context Window" value={formatContextWindow(model.contextWindow)} />
                <SpecCard label="Speed" value={model.speedToksPerSec ? `${model.speedToksPerSec} t/s` : "—"} />
                <SpecCard 
                    label="Input Price" 
                    value={`${formatPrice(model.inputPricePerMtok)}/M`} 
                    rawValue={model.inputPricePerMtok} 
                />
                <SpecCard 
                    label="Output Price" 
                    value={`${formatPrice(model.outputPricePerMtok)}/M`} 
                    rawValue={model.outputPricePerMtok} 
                />
                <SpecCard label="Parameters" value={model.parameterCount || "—"} />
                <SpecCard label="License" value={model.license || "—"} />
            </div>

            {/* Cost Calculator Section */}
            <div className="mb-10">
                <TokenCostCalculator 
                    inputPrice={model.inputPricePerMtok} 
                    outputPrice={model.outputPricePerMtok} 
                />
            </div>

            {/* Benchmark Scores */}
            {benchmarks.length > 0 && (
                <div className="mb-8">
                    <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-atlas-text-muted mb-4">
                        Benchmark Scores
                    </h2>
                    <div className="space-y-3 max-w-xl">
                        {benchmarks.map((b) => (
                            <div key={b.label} className="flex items-center gap-4">
                                <span className="w-12 text-xs font-mono text-atlas-text-muted text-right">
                                    {b.label}
                                </span>
                                <div className="flex-1 h-6 bg-atlas-bg-secondary rounded-full overflow-hidden border border-atlas-border/50">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            b.value! >= 85
                                                ? "bg-atlas-green/30"
                                                : b.value! >= 70
                                                    ? "bg-atlas-amber/30"
                                                    : "bg-atlas-red/30"
                                        )}
                                        style={{ width: `${(b.value! / b.max) * 100}%` }}
                                    />
                                </div>
                                <span
                                    className={cn(
                                        "w-12 text-sm font-mono font-medium text-right",
                                        getBenchmarkColor(b.value)
                                    )}
                                >
                                    {formatBenchmark(b.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags */}
            {model.tags.length > 0 && (
                <div className="mb-8">
                    <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-atlas-text-muted mb-4">
                        Tags
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {model.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs font-mono uppercase tracking-wider rounded bg-atlas-bg-tertiary text-atlas-text-secondary border border-atlas-border"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Community Reviews */}
            <ReviewSection
                modelId={model.id}
                modelName={model.name}
                initialReviews={model.reviews ?? []}
            />

            {/* Back link */}
            <Link
                href="/models"
                className="inline-flex items-center gap-1 text-sm text-atlas-text-muted hover:text-atlas-text-secondary transition-colors"
            >
                ← Back to Models
            </Link>
        </div>
    );
}

// ---------------------------------------------------------
// Helper Components
// ---------------------------------------------------------

function SpecCard({ label, value, rawValue }: { label: string; value: string; rawValue?: number }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (rawValue === undefined) return;
        navigator.clipboard.writeText(rawValue.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="p-3 bg-atlas-bg-card border border-atlas-border rounded-lg relative">
            <p className="text-[10px] font-mono uppercase tracking-wider text-atlas-text-muted mb-1">
                {label}
            </p>
            <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-sm font-medium text-atlas-text-primary">
                    {value}
                </p>
                {rawValue !== undefined && (
                    <button
                        onClick={handleCopy}
                        className="p-1 rounded hover:bg-atlas-bg-secondary text-atlas-text-muted hover:text-atlas-text-primary transition-all flex-shrink-0"
                        aria-label="Copy value"
                        title="Copy raw value"
                    >
                        {copied ? (
                            <span className="text-atlas-green text-sm font-bold block leading-none">✓</span>
                        ) : (
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

// THE NEW INTERACTIVE COST CALCULATOR
function TokenCostCalculator({ inputPrice, outputPrice }: { inputPrice?: number | null; outputPrice?: number | null }) {
    const [inTokens, setInTokens] = useState<number | "">("");
    const [outTokens, setOutTokens] = useState<number | "">("");

    // Consider it free if both prices are 0, null, or undefined
    const isFree = (!inputPrice && !outputPrice);

    const presets = [
        { label: "Short Chat", in: 1000, out: 500 },
        { label: "Long Article", in: 5000, out: 2000 },
        { label: "Code Gen", in: 10000, out: 4000 },
        { label: "Book Analysis", in: 100000, out: 1000 }
    ];

    const applyPreset = (inVal: number, outVal: number) => {
        setInTokens(inVal);
        setOutTokens(outVal);
    };

    const calculateCost = () => {
        if (isFree) return 0;
        const inCost = ((Number(inTokens) || 0) / 1000000) * (inputPrice || 0);
        const outCost = ((Number(outTokens) || 0) / 1000000) * (outputPrice || 0);
        return inCost + outCost;
    };

    const totalCost = calculateCost();

    return (
        <div className="bg-atlas-bg-card border border-atlas-border rounded-xl p-5 md:p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-5">
                <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-atlas-text-primary">
                    Cost Calculator
                </h2>
                {isFree && (
                    <span className="text-xs font-mono bg-atlas-green/10 text-atlas-green px-2 py-1 rounded">
                        Free / Local
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Inputs Side */}
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-mono text-atlas-text-muted mb-1.5">
                                Input Tokens
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={inTokens}
                                onChange={(e) => setInTokens(e.target.value === "" ? "" : Number(e.target.value))}
                                disabled={isFree}
                                placeholder="e.g. 1000"
                                className="w-full bg-atlas-bg-secondary border border-atlas-border/50 text-atlas-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-atlas-blue focus:ring-1 focus:ring-atlas-blue disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-mono text-atlas-text-muted mb-1.5">
                                Output Tokens
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={outTokens}
                                onChange={(e) => setOutTokens(e.target.value === "" ? "" : Number(e.target.value))}
                                disabled={isFree}
                                placeholder="e.g. 500"
                                className="w-full bg-atlas-bg-secondary border border-atlas-border/50 text-atlas-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-atlas-blue focus:ring-1 focus:ring-atlas-blue disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                            />
                        </div>
                    </div>

                    {/* Presets */}
                    <div>
                        <p className="text-[10px] font-mono text-atlas-text-muted mb-2">Presets</p>
                        <div className="flex flex-wrap gap-2">
                            {presets.map((p) => (
                                <button
                                    key={p.label}
                                    onClick={() => applyPreset(p.in, p.out)}
                                    disabled={isFree}
                                    className="px-2.5 py-1 text-[11px] font-medium bg-atlas-bg-tertiary border border-atlas-border hover:border-atlas-text-muted text-atlas-text-secondary rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Result Side */}
                <div className="flex flex-col items-center justify-center p-6 bg-atlas-bg-secondary/50 border border-atlas-border/30 rounded-lg">
                    <span className="text-xs font-mono text-atlas-text-muted mb-2">Estimated Cost</span>
                    <span className={cn(
                        "text-4xl font-sans font-bold tracking-tight",
                        totalCost > 0 ? "text-atlas-text-primary" : "text-atlas-text-muted"
                    )}>
                        {totalCost === 0 ? "$0.00" : totalCost < 0.0001 ? "<$0.0001" : `$${totalCost.toFixed(4)}`}
                    </span>
                    {!isFree && totalCost > 0 && (
                        <span className="text-[10px] text-atlas-text-muted mt-2">
                            Based on provider&apos;s API pricing
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

const tabs = [
    { id: "model", label: "Add Model" },
    { id: "tool", label: "Add Tool" },
    { id: "update", label: "Update Existing" },
    { id: "report", label: "Report Issue" },
];

interface ModelFormData {
    name: string;
    provider: string;
    description: string;
    contextWindow: string;
    inputPricePerMtok: string;
    outputPricePerMtok: string;
    license: string;
    modalities: string;
    isOpenSource: boolean;
}

const emptyForm: ModelFormData = {
    name: "",
    provider: "",
    description: "",
    contextWindow: "",
    inputPricePerMtok: "",
    outputPricePerMtok: "",
    license: "",
    modalities: "",
    isOpenSource: false,
};

export function ContributeForm() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState("model");
    const [form, setForm] = useState<ModelFormData>(emptyForm);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const update = (key: keyof ModelFormData, value: string | boolean) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session) {
            signIn("github");
            return;
        }

        setStatus("submitting");
        setErrorMsg("");

        // 💡 1. Sanitize text string fields via whitespace trimming
        const sanitizedName = form.name.trim();
        const sanitizedProvider = form.provider.trim();
        const sanitizedDescription = form.description.trim();
        const sanitizedLicense = form.license.trim();

        // 💡 2. Validation Check: Ensure required fields are not bypassed with empty spaces
        if (!sanitizedName || !sanitizedProvider) {
            setStatus("error");
            setErrorMsg("Model Name and Provider are required fields and cannot be empty.");
            return;
        }

        try {
            const res = await fetch("/api/models", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // 💡 3. Map sanitized values into the outbound submission body
                body: JSON.stringify({
                    name: sanitizedName,
                    provider: sanitizedProvider,
                    description: sanitizedDescription || undefined,
                    contextWindow: form.contextWindow ? parseInt(form.contextWindow) : undefined,
                    inputPricePerMtok: form.inputPricePerMtok ? parseFloat(form.inputPricePerMtok) : undefined,
                    outputPricePerMtok: form.outputPricePerMtok ? parseFloat(form.outputPricePerMtok) : undefined,
                    license: sanitizedLicense || undefined,
                    modalities: form.modalities
                        ? form.modalities.split(",").map((s) => s.trim()).filter(Boolean)
                        : ["text"],
                    isOpenSource: form.isOpenSource,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error ?? "Submission failed");
            }

            setStatus("success");
            setForm(emptyForm);
        } catch (err) {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Tabs */}
            <div className="flex border-b border-atlas-border mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                            activeTab === tab.id
                                ? "text-atlas-green"
                                : "text-atlas-text-muted hover:text-atlas-text-secondary"
                        }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-atlas-green" />
                        )}
                    </button>
                ))}
            </div>

            {/* Add Model Form */}
            {activeTab === "model" && (
                <>
                    {/* Auth notice */}
                    {!session && (
                        <div className="mb-4 p-3 rounded-md bg-atlas-amber/10 border border-atlas-amber/20 flex items-center justify-between gap-3">
                            <p className="text-sm text-atlas-amber">
                                Sign in with GitHub to submit contributions.
                            </p>
                            <button
                                onClick={() => signIn("github")}
                                className="shrink-0 px-3 py-1.5 text-xs font-medium bg-atlas-amber/10 text-atlas-amber border border-atlas-amber/20 rounded-md hover:bg-atlas-amber/20 transition-colors"
                            >
                                Sign in
                            </button>
                        </div>
                    )}

                    {/* Success */}
                    {status === "success" && (
                        <div className="mb-4 p-3 rounded-md bg-atlas-green/10 border border-atlas-green/20 text-atlas-green text-sm">
                            ✓ Contribution submitted! It will be reviewed before going live.
                        </div>
                    )}

                    {/* Error */}
                    {status === "error" && (
                        <div className="mb-4 p-3 rounded-md bg-atlas-red/10 border border-atlas-red/20 text-atlas-red text-sm">
                            {errorMsg}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-1.5">
                                    Model Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Claude Sonnet 4"
                                    value={form.name}
                                    onChange={(e) => update("name", e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-1.5">
                                    Provider *
                                </label>
                                <select
                                    required
                                    value={form.provider}
                                    onChange={(e) => update("provider", e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-secondary focus:outline-none focus:ring-1 focus:ring-atlas-green/50"
                                >
                                    <option value="">Select provider</option>
                                    <option value="Anthropic">Anthropic</option>
                                    <option value="OpenAI">OpenAI</option>
                                    <option value="Google DeepMind">Google DeepMind</option>
                                    <option value="Meta AI">Meta AI</option>
                                    <option value="Mistral AI">Mistral AI</option>
                                    <option value="xAI">xAI</option>
                                    <option value="DeepSeek">DeepSeek</option>
                                    <option value="Cohere">Cohere</option>
                                    <option value="other">Other (specify in description)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-1.5">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Brief description of the model's capabilities..."
                                value={form.description}
                                onChange={(e) => update("description", e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-1.5">
                                    Context Window
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 200000"
                                    value={form.contextWindow}
                                    onChange={(e) => update("contextWindow", e.target.value)}
                                    className="w-full px-3 py-2 text-sm font-mono bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-1.5">
                                    Input $/M tokens
                                </label>
                                <input
                                    type="number"
                                    step="0.001"
                                    placeholder="e.g. 3.00"
                                    value={form.inputPricePerMtok}
                                    onChange={(e) => update("inputPricePerMtok", e.target.value)}
                                    className="w-full px-3 py-2 text-sm font-mono bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-1.5">
                                    Output $/M tokens
                                </label>
                                <input
                                    type="number"
                                    step="0.001"
                                    placeholder="e.g. 15.00"
                                    value={form.outputPricePerMtok}
                                    onChange={(e) => update("outputPricePerMtok", e.target.value)}
                                    className="w-full px-3 py-2 text-sm font-mono bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-1.5">
                                    License
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Proprietary, MIT, Apache 2.0"
                                    value={form.license}
                                    onChange={(e) => update("license", e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-1.5">
                                    Modalities
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. text, image, audio"
                                    value={form.modalities}
                                    onChange={(e) => update("modalities", e.target.value)}
                                    className="w-full px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="oss"
                                checked={form.isOpenSource}
                                onChange={(e) => update("isOpenSource", e.target.checked)}
                                className="rounded border-atlas-border"
                            />
                            <label htmlFor="oss" className="text-sm text-atlas-text-secondary cursor-pointer">
                                This model is open source / open weights
                            </label>
                        </div>

                        <div className="pt-4 flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={status === "submitting"}
                                className="px-6 py-2.5 text-sm font-medium bg-atlas-green text-black rounded-md hover:bg-atlas-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === "submitting" ? "Submitting…" : "Submit Contribution"}
                            </button>
                            <p className="text-xs text-atlas-text-muted">
                                {session
                                    ? `Submitting as @${session.user?.name} · Reviewed before going live`
                                    : "Requires GitHub sign-in · Reviewed before going live"}
                            </p>
                        </div>
                    </form>
                </>
            )}

            {/* Other tabs */}
            {activeTab === "tool" && (
                <div className="text-center py-12">
                    <p className="text-atlas-text-muted text-sm">
                        Tool submissions coming in v2. For now, open a{" "}
                        <a href="https://github.com" className="text-atlas-blue hover:underline">
                            GitHub issue
                        </a>
                        .
                    </p>
                </div>
            )}
            {activeTab === "update" && (
                <div className="text-center py-12">
                    <p className="text-atlas-text-muted text-sm">
                        To update existing data, find the model page and click &quot;Suggest Edit&quot;, or open a{" "}
                        <a href="https://github.com" className="text-atlas-blue hover:underline">
                            GitHub PR
                        </a>
                        .
                    </p>
                </div>
            )}
            {activeTab === "report" && (
                <div className="text-center py-12">
                    <p className="text-atlas-text-muted text-sm">
                        Found incorrect data or a bug? Open an{" "}
                        <a href="https://github.com" className="text-atlas-blue hover:underline">
                            issue on GitHub
                        </a>
                        .
                    </p>
                </div>
            )}
        </div>
    );
}
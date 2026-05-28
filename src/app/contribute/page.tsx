import { ContributeForm } from "@/components/contribute/ContributeForm";

export default function ContributePage() {
    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-2xl font-sans font-bold text-atlas-text-primary mb-2">
                    Contribute to AIAtlas
                </h1>
                <p className="text-sm text-atlas-text-muted max-w-lg mx-auto">
                    Help keep the AI ecosystem map accurate and up-to-date. Every contribution
                    earns you credit on your profile.
                </p>
            </div>

            {/* Contribution info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                <div className="p-4 bg-atlas-bg-card border border-atlas-border rounded-lg text-center">
                    <p className="text-2xl font-mono font-bold text-atlas-green mb-1">5 min</p>
                    <p className="text-xs text-atlas-text-muted">Average contribution time</p>
                </div>
                <div className="p-4 bg-atlas-bg-card border border-atlas-border rounded-lg text-center">
                    <p className="text-2xl font-mono font-bold text-atlas-blue mb-1">24h</p>
                    <p className="text-xs text-atlas-text-muted">Average review time</p>
                </div>
                <div className="p-4 bg-atlas-bg-card border border-atlas-border rounded-lg text-center">
                    <p className="text-2xl font-mono font-bold text-atlas-purple mb-1">∞</p>
                    <p className="text-xs text-atlas-text-muted">Community impact</p>
                </div>
            </div>

            {/* Form */}
            <ContributeForm />
        </div>
    );
}

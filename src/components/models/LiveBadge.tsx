import { cn } from "@/lib/utils";

interface LiveBadgeProps {
    className?: string;
    label?: string;
}

export function LiveBadge({ className, label = "LIVE" }: LiveBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-xs uppercase tracking-wider text-atlas-green bg-atlas-green/10 border border-atlas-green/20",
                className
            )}
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atlas-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-atlas-green" />
            </span>
            {label}
        </span>
    );
}

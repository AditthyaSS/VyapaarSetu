"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { timeAgo } from "@/lib/utils";
import { Review } from "@/types";

interface ReviewSectionProps {
    modelId: string;
    modelName: string;
    initialReviews?: Review[];
}

function StarRating({
    value,
    onChange,
    readonly = false,
}: {
    value: number;
    onChange?: (v: number) => void;
    readonly?: boolean;
}) {
    const [hovered, setHovered] = useState(0);
    const display = readonly ? value : hovered || value;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => !readonly && setHovered(0)}
                    className={`text-xl transition-colors ${
                        star <= display
                            ? "text-atlas-amber"
                            : "text-atlas-bg-tertiary"
                    } ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
                    aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
}

export function ReviewSection({ modelId, modelName, initialReviews = [] }: ReviewSectionProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const avgRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) { signIn("github"); return; }
        if (rating === 0) { setErrorMsg("Please select a rating."); return; }

        setStatus("submitting");
        setErrorMsg("");

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ entityType: "model", entityId: modelId, rating, comment }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error ?? "Submission failed");
            }

            const data = await res.json();
            // Optimistically add the review to the list
            const newReview: Review = {
                id: data.data?.id ?? String(Date.now()),
                userId: "me",
                entityType: "model",
                entityId: modelId,
                rating,
                comment: comment || undefined,
                helpfulVotes: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                user: {
                    id: "me",
                    githubUsername: session.user?.name ?? "you",
                    contributionScore: 0,
                    createdAt: new Date().toISOString(),
                },
            };
            setReviews((prev) => [newReview, ...prev]);
            setRating(0);
            setComment("");
            setStatus("success");
        } catch (err) {
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-sans font-semibold text-sm uppercase tracking-widest text-atlas-text-muted">
                    Community Reviews
                </h2>
                {reviews.length > 0 && (
                    <div className="flex items-center gap-2">
                        <StarRating value={Math.round(avgRating)} readonly />
                        <span className="text-sm font-mono text-atlas-text-secondary">
                            {avgRating.toFixed(1)} · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                )}
            </div>

            {/* Submit form */}
            <div className="p-5 bg-atlas-bg-secondary border border-atlas-border rounded-lg mb-4">
                {!session ? (
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-atlas-text-muted">
                            Sign in to leave a review for {modelName}.
                        </p>
                        <button
                            onClick={() => signIn("github")}
                            className="shrink-0 px-3 py-1.5 text-xs font-medium bg-atlas-green/10 text-atlas-green border border-atlas-green/20 rounded-md hover:bg-atlas-green/20 transition-colors"
                        >
                            Sign in with GitHub
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <p className="text-xs font-mono uppercase tracking-wider text-atlas-text-muted mb-2">
                            Your Review
                        </p>

                        <StarRating value={rating} onChange={setRating} />

                        <textarea
                            rows={3}
                            placeholder={`Share your experience with ${modelName}…`}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-atlas-bg-primary border border-atlas-border rounded-md text-atlas-text-primary placeholder:text-atlas-text-muted focus:outline-none focus:ring-1 focus:ring-atlas-green/50 resize-none"
                        />

                        {status === "error" && (
                            <p className="text-xs text-atlas-red">{errorMsg}</p>
                        )}
                        {status === "success" && (
                            <p className="text-xs text-atlas-green">✓ Review submitted!</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === "submitting" || rating === 0}
                            className="px-4 py-2 text-sm font-medium bg-atlas-green text-black rounded-md hover:bg-atlas-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === "submitting" ? "Submitting…" : "Submit Review"}
                        </button>
                    </form>
                )}
            </div>

            {/* Review list */}
            {reviews.length > 0 ? (
                <div className="space-y-3">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-4 bg-atlas-bg-card border border-atlas-border rounded-lg"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-atlas-purple">
                                        @{review.user?.githubUsername ?? "anonymous"}
                                    </span>
                                    <StarRating value={review.rating} readonly />
                                </div>
                                <span className="text-xs font-mono text-atlas-text-muted">
                                    {timeAgo(review.createdAt)}
                                </span>
                            </div>
                            {review.comment && (
                                <p className="text-sm text-atlas-text-secondary">{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-atlas-text-muted">
                    No reviews yet. Be the first to review {modelName}.
                </p>
            )}
        </div>
    );
}

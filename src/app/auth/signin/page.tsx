"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const error = searchParams.get("error");

    const errorMessages: Record<string, string> = {
        OAuthSignin: "Error starting the sign-in flow. Please try again.",
        OAuthCallback: "Error during GitHub callback. Please try again.",
        OAuthAccountNotLinked: "This email is already linked to another account.",
        Default: "An unexpected error occurred. Please try again.",
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <span className="font-mono text-2xl font-bold tracking-tight">
                        AI<span className="text-atlas-green">Atlas</span>
                    </span>
                    <p className="mt-2 text-sm text-atlas-text-muted">
                        Sign in to contribute to the AI ecosystem map
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-md bg-atlas-red/10 border border-atlas-red/20 text-atlas-red text-sm">
                        {errorMessages[error] ?? errorMessages.Default}
                    </div>
                )}

                {/* Card */}
                <div className="p-6 bg-atlas-bg-card border border-atlas-border rounded-xl">
                    <h1 className="text-lg font-sans font-semibold text-atlas-text-primary mb-1">
                        Welcome back
                    </h1>
                    <p className="text-sm text-atlas-text-muted mb-6">
                        Use your GitHub account to sign in. We only request your public profile.
                    </p>

                    <button
                        onClick={() => signIn("github", { callbackUrl })}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-atlas-bg-secondary border border-atlas-border rounded-md text-sm font-medium text-atlas-text-primary hover:border-atlas-border-hover hover:bg-atlas-bg-tertiary transition-colors"
                    >
                        {/* GitHub icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-atlas-text-secondary"
                        >
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        Continue with GitHub
                    </button>

                    <p className="mt-4 text-xs text-atlas-text-muted text-center">
                        By signing in, you agree to contribute accurate information
                        and follow our community guidelines.
                    </p>
                </div>

                {/* Back link */}
                <p className="mt-6 text-center text-sm text-atlas-text-muted">
                    <a href="/" className="hover:text-atlas-text-secondary transition-colors">
                        ← Back to AIAtlas
                    </a>
                </p>
            </div>
        </div>
    );
}

export default function SignInPage() {
    return (
        <Suspense>
            <SignInContent />
        </Suspense>
    );
}

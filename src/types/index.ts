// TypeScript types for AIAtlas
// These mirror the Prisma schema but are used in the frontend

export interface User {
    id: string;
    githubUsername: string;
    avatarUrl?: string;
    bio?: string;
    contributionScore: number;
    createdAt: string;
}

export interface Provider {
    id: string;
    name: string;
    website?: string;
    description?: string;
    hqCountry?: string;
    logoUrl?: string;
    createdAt: string;
}

export interface Model {
    id: string;
    providerId: string;
    name: string;
    slug: string;
    description?: string;
    contextWindow?: number;
    inputPricePerMtok?: number;
    outputPricePerMtok?: number;
    license?: string;
    modalities: string[];
    isOpenSource: boolean;
    parameterCount?: string;
    apiAvailable: boolean;
    tags: string[];
    benchmarkGpqa?: number;
    benchmarkMmlu?: number;
    benchmarkHle?: number;
    speedToksPerSec?: number;
    releasedAt?: string;
    deprecatedAt?: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    provider?: Provider;
    reviews?: Review[];
}

export interface ModelTag {
    id: string;
    modelId: string;
    tag: string;
    category?: string;
}

export interface Tool {
    id: string;
    primaryModelId?: string;
    name: string;
    slug: string;
    description?: string;
    category?: string;
    pricingType?: string;
    websiteUrl?: string;
    avgRating: number;
    reviewCount: number;
    isVerified: boolean;
    addedAt: string;
    updatedAt: string;
    primaryModel?: Model;
}

export interface Repo {
    id: string;
    githubOrg: string;
    githubRepo: string;
    description?: string;
    primaryLanguage?: string;
    stars: number;
    forks: number;
    isTrending: boolean;
    topics: string[];
    lastSyncedAt?: string;
    addedAt: string;
}

export interface Review {
    id: string;
    userId: string;
    entityType: "model" | "tool";
    entityId: string;
    rating: number;
    comment?: string;
    helpfulVotes: number;
    createdAt: string;
    updatedAt: string;
    user?: User;
}

export interface Contribution {
    id: string;
    userId: string;
    entityType: "model" | "tool" | "repo";
    entityId?: string;
    action: "add" | "update" | "review" | "flag";
    diff?: Record<string, unknown>;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
    user?: User;
}

export interface Vote {
    id: string;
    userId: string;
    entityType: string;
    entityId: string;
    value: 1 | -1;
    createdAt: string;
}

export interface FeedEvent {
    id: string;
    userId?: string;
    eventType: string;
    entityType: string;
    entityId: string;
    entityName: string;
    metadata?: Record<string, unknown>;
    createdAt: string;
    user?: User;
}

// Filter/sort types
export interface ModelFilters {
    search?: string;
    provider?: string;
    modality?: string;
    license?: string;
    isOpenSource?: boolean;
    sort?: ModelSortField;
    sortDirection?: "asc" | "desc";
}

export type ModelSortField =
    | "benchmarkGpqa"
    | "name"
    | "contextWindow"
    | "inputPricePerMtok"
    | "outputPricePerMtok"
    | "speedToksPerSec"
    | "releasedAt";

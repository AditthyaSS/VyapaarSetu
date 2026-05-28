import { Model, Provider, FeedEvent } from "@/types";

export const mockProviders: Provider[] = [
    { id: "p1", name: "Anthropic", website: "https://anthropic.com", hqCountry: "US", createdAt: "2024-01-01" },
    { id: "p2", name: "OpenAI", website: "https://openai.com", hqCountry: "US", createdAt: "2024-01-01" },
    { id: "p3", name: "Google DeepMind", website: "https://deepmind.google", hqCountry: "US", createdAt: "2024-01-01" },
    { id: "p4", name: "Meta AI", website: "https://ai.meta.com", hqCountry: "US", createdAt: "2024-01-01" },
    { id: "p5", name: "Mistral AI", website: "https://mistral.ai", hqCountry: "FR", createdAt: "2024-01-01" },
    { id: "p6", name: "xAI", website: "https://x.ai", hqCountry: "US", createdAt: "2024-01-01" },
    { id: "p7", name: "DeepSeek", website: "https://deepseek.com", hqCountry: "CN", createdAt: "2024-01-01" },
    { id: "p8", name: "Cohere", website: "https://cohere.com", hqCountry: "CA", createdAt: "2024-01-01" },
];

export const mockModels: Model[] = [
    {
        id: "m1", providerId: "p2", name: "o3", slug: "o3",
        description: "OpenAI's most powerful reasoning model with unprecedented benchmark performance.",
        contextWindow: 200000, inputPricePerMtok: 10.0, outputPricePerMtok: 40.0,
        license: "Proprietary", modalities: ["text"], isOpenSource: false,
        apiAvailable: true, tags: ["reasoning", "frontier"],
        benchmarkGpqa: 96.7, benchmarkMmlu: 96.1, speedToksPerSec: 42,
        isVerified: true, createdAt: "2025-04-01", updatedAt: "2025-05-28",
        provider: { id: "p2", name: "OpenAI", website: "https://openai.com", createdAt: "2024-01-01" },
    },
    {
        id: "m2", providerId: "p2", name: "GPT-5", slug: "gpt-5",
        description: "The latest flagship model from OpenAI with multimodal capabilities.",
        contextWindow: 128000, inputPricePerMtok: 30.0, outputPricePerMtok: 60.0,
        license: "Proprietary", modalities: ["text", "image"], isOpenSource: false,
        apiAvailable: true, tags: ["multimodal", "frontier"],
        benchmarkGpqa: 92.1, benchmarkMmlu: 93.4, speedToksPerSec: 55,
        isVerified: true, createdAt: "2025-03-01", updatedAt: "2025-05-28",
        provider: { id: "p2", name: "OpenAI", website: "https://openai.com", createdAt: "2024-01-01" },
    },
    {
        id: "m3", providerId: "p1", name: "Claude Opus 4", slug: "claude-opus-4",
        description: "Anthropic's most capable model, excelling at complex analysis and nuanced content.",
        contextWindow: 200000, inputPricePerMtok: 15.0, outputPricePerMtok: 75.0,
        license: "Proprietary", modalities: ["text"], isOpenSource: false,
        apiAvailable: true, tags: ["reasoning", "analysis", "frontier"],
        benchmarkGpqa: 89.3, benchmarkMmlu: 91.2, speedToksPerSec: 38,
        isVerified: true, createdAt: "2025-05-01", updatedAt: "2025-05-28",
        provider: { id: "p1", name: "Anthropic", website: "https://anthropic.com", createdAt: "2024-01-01" },
    },
    {
        id: "m4", providerId: "p6", name: "Grok 3", slug: "grok-3",
        description: "xAI's flagship reasoning model with strong benchmark performance.",
        contextWindow: 131072, inputPricePerMtok: 3.0, outputPricePerMtok: 15.0,
        license: "Proprietary", modalities: ["text", "image"], isOpenSource: false,
        apiAvailable: true, tags: ["reasoning", "multimodal"],
        benchmarkGpqa: 87.5, benchmarkMmlu: 89.7, speedToksPerSec: 60,
        isVerified: true, createdAt: "2025-02-01", updatedAt: "2025-05-28",
        provider: { id: "p6", name: "xAI", website: "https://x.ai", createdAt: "2024-01-01" },
    },
    {
        id: "m5", providerId: "p3", name: "Gemini 2.5 Pro", slug: "gemini-2-5-pro",
        description: "Google's most capable model with 1M token context window and multimodal input.",
        contextWindow: 1000000, inputPricePerMtok: 1.25, outputPricePerMtok: 5.0,
        license: "Proprietary", modalities: ["text", "image", "video", "audio"], isOpenSource: false,
        apiAvailable: true, tags: ["multimodal", "long-context"],
        benchmarkGpqa: 86.4, benchmarkMmlu: 90.8, speedToksPerSec: 75,
        isVerified: true, createdAt: "2025-03-15", updatedAt: "2025-05-28",
        provider: { id: "p3", name: "Google DeepMind", website: "https://deepmind.google", createdAt: "2024-01-01" },
    },
    {
        id: "m6", providerId: "p1", name: "Claude Sonnet 4", slug: "claude-sonnet-4",
        description: "The best balance of performance and speed in the Claude lineup.",
        contextWindow: 200000, inputPricePerMtok: 3.0, outputPricePerMtok: 15.0,
        license: "Proprietary", modalities: ["text", "image"], isOpenSource: false,
        apiAvailable: true, tags: ["balanced", "coding"],
        benchmarkGpqa: 84.1, benchmarkMmlu: 88.5, speedToksPerSec: 72,
        isVerified: true, createdAt: "2025-05-01", updatedAt: "2025-05-28",
        provider: { id: "p1", name: "Anthropic", website: "https://anthropic.com", createdAt: "2024-01-01" },
    },
    {
        id: "m7", providerId: "p2", name: "GPT-4o", slug: "gpt-4o",
        description: "OpenAI's versatile multimodal model with strong all-around performance.",
        contextWindow: 128000, inputPricePerMtok: 2.5, outputPricePerMtok: 10.0,
        license: "Proprietary", modalities: ["text", "image", "audio"], isOpenSource: false,
        apiAvailable: true, tags: ["multimodal", "versatile"],
        benchmarkGpqa: 79.4, benchmarkMmlu: 87.2, speedToksPerSec: 82,
        isVerified: true, createdAt: "2024-05-13", updatedAt: "2025-05-28",
        provider: { id: "p2", name: "OpenAI", website: "https://openai.com", createdAt: "2024-01-01" },
    },
    {
        id: "m8", providerId: "p7", name: "DeepSeek V3", slug: "deepseek-v3",
        description: "Open-source MoE model with exceptional performance-to-cost ratio.",
        contextWindow: 64000, inputPricePerMtok: 0.27, outputPricePerMtok: 1.1,
        license: "MIT", modalities: ["text"], isOpenSource: true, parameterCount: "671B",
        apiAvailable: true, tags: ["open-source", "efficient"],
        benchmarkGpqa: 75.9, benchmarkMmlu: 82.1, speedToksPerSec: 90,
        isVerified: true, createdAt: "2024-12-26", updatedAt: "2025-05-28",
        provider: { id: "p7", name: "DeepSeek", website: "https://deepseek.com", createdAt: "2024-01-01" },
    },
    {
        id: "m9", providerId: "p5", name: "Mistral Large 2", slug: "mistral-large-2",
        description: "Mistral's most capable model with strong multilingual support.",
        contextWindow: 128000, inputPricePerMtok: 2.0, outputPricePerMtok: 6.0,
        license: "MRL", modalities: ["text"], isOpenSource: false, parameterCount: "123B",
        apiAvailable: true, tags: ["multilingual", "enterprise"],
        benchmarkGpqa: 74.9, benchmarkMmlu: 84.0, speedToksPerSec: 68,
        isVerified: true, createdAt: "2024-07-24", updatedAt: "2025-05-28",
        provider: { id: "p5", name: "Mistral AI", website: "https://mistral.ai", createdAt: "2024-01-01" },
    },
    {
        id: "m10", providerId: "p4", name: "Llama 3.1 405B", slug: "llama-3-1-405b",
        description: "Meta's largest open-weight model, competing with proprietary frontier models.",
        contextWindow: 128000, inputPricePerMtok: 5.0, outputPricePerMtok: 16.0,
        license: "Llama Community", modalities: ["text"], isOpenSource: true, parameterCount: "405B",
        apiAvailable: true, tags: ["open-source", "frontier"],
        benchmarkGpqa: 73.1, benchmarkMmlu: 85.9, speedToksPerSec: 25,
        isVerified: true, createdAt: "2024-07-23", updatedAt: "2025-05-28",
        provider: { id: "p4", name: "Meta AI", website: "https://ai.meta.com", createdAt: "2024-01-01" },
    },
    {
        id: "m11", providerId: "p7", name: "DeepSeek R1", slug: "deepseek-r1",
        description: "Reasoning-focused model with chain-of-thought capabilities.",
        contextWindow: 64000, inputPricePerMtok: 0.55, outputPricePerMtok: 2.19,
        license: "MIT", modalities: ["text"], isOpenSource: true, parameterCount: "671B",
        apiAvailable: true, tags: ["reasoning", "open-source"],
        benchmarkGpqa: 73.3, benchmarkMmlu: 79.8, speedToksPerSec: 45,
        isVerified: true, createdAt: "2025-01-20", updatedAt: "2025-05-28",
        provider: { id: "p7", name: "DeepSeek", website: "https://deepseek.com", createdAt: "2024-01-01" },
    },
    {
        id: "m12", providerId: "p4", name: "Llama 3.3 70B", slug: "llama-3-3-70b",
        description: "Efficient open model offering strong performance at a smaller scale.",
        contextWindow: 128000, inputPricePerMtok: 0.59, outputPricePerMtok: 0.79,
        license: "Llama Community", modalities: ["text"], isOpenSource: true, parameterCount: "70B",
        apiAvailable: true, tags: ["open-source", "efficient"],
        benchmarkGpqa: 71.2, benchmarkMmlu: 80.4, speedToksPerSec: 110,
        isVerified: true, createdAt: "2024-12-06", updatedAt: "2025-05-28",
        provider: { id: "p4", name: "Meta AI", website: "https://ai.meta.com", createdAt: "2024-01-01" },
    },
    {
        id: "m13", providerId: "p3", name: "Gemini 2.5 Flash", slug: "gemini-2-5-flash",
        description: "Google's fastest model, optimized for speed and cost efficiency.",
        contextWindow: 1000000, inputPricePerMtok: 0.075, outputPricePerMtok: 0.3,
        license: "Proprietary", modalities: ["text", "image"], isOpenSource: false,
        apiAvailable: true, tags: ["fast", "efficient", "long-context"],
        benchmarkGpqa: 70.5, benchmarkMmlu: 78.2, speedToksPerSec: 150,
        isVerified: true, createdAt: "2025-04-01", updatedAt: "2025-05-28",
        provider: { id: "p3", name: "Google DeepMind", website: "https://deepmind.google", createdAt: "2024-01-01" },
    },
    {
        id: "m14", providerId: "p5", name: "Mistral Small 3", slug: "mistral-small-3",
        description: "Compact open-source model with surprisingly strong performance.",
        contextWindow: 32000, inputPricePerMtok: 0.1, outputPricePerMtok: 0.3,
        license: "Apache 2.0", modalities: ["text"], isOpenSource: true, parameterCount: "24B",
        apiAvailable: true, tags: ["open-source", "compact", "efficient"],
        benchmarkGpqa: 62.1, benchmarkMmlu: 72.5, speedToksPerSec: 130,
        isVerified: true, createdAt: "2025-01-30", updatedAt: "2025-05-28",
        provider: { id: "p5", name: "Mistral AI", website: "https://mistral.ai", createdAt: "2024-01-01" },
    },
    {
        id: "m15", providerId: "p2", name: "GPT-4o mini", slug: "gpt-4o-mini",
        description: "OpenAI's most affordable model with strong capabilities for its price.",
        contextWindow: 128000, inputPricePerMtok: 0.15, outputPricePerMtok: 0.6,
        license: "Proprietary", modalities: ["text", "image"], isOpenSource: false,
        apiAvailable: true, tags: ["efficient", "affordable"],
        benchmarkGpqa: 65.2, benchmarkMmlu: 82.0, speedToksPerSec: 120,
        isVerified: true, createdAt: "2024-07-18", updatedAt: "2025-05-28",
        provider: { id: "p2", name: "OpenAI", website: "https://openai.com", createdAt: "2024-01-01" },
    },
    {
        id: "m16", providerId: "p1", name: "Claude Haiku 3.5", slug: "claude-haiku-3-5",
        description: "Anthropic's fastest and most affordable model, ideal for high-volume tasks.",
        contextWindow: 200000, inputPricePerMtok: 0.25, outputPricePerMtok: 1.25,
        license: "Proprietary", modalities: ["text"], isOpenSource: false,
        apiAvailable: true, tags: ["fast", "affordable"],
        benchmarkGpqa: 60.8, benchmarkMmlu: 75.3, speedToksPerSec: 140,
        isVerified: true, createdAt: "2025-02-01", updatedAt: "2025-05-28",
        provider: { id: "p1", name: "Anthropic", website: "https://anthropic.com", createdAt: "2024-01-01" },
    },
];

export const mockFeedEvents: FeedEvent[] = [
    {
        id: "f1", eventType: "model_added", entityType: "model", entityId: "m3",
        entityName: "Claude Opus 4", createdAt: new Date(Date.now() - 2000).toISOString(),
        user: { id: "u1", githubUsername: "sarah-dev", contributionScore: 42, createdAt: "2024-06-01" },
    },
    {
        id: "f2", eventType: "price_updated", entityType: "model", entityId: "m7",
        entityName: "GPT-4o", metadata: { field: "inputPricePerMtok", oldValue: 5.0, newValue: 2.5 },
        createdAt: new Date(Date.now() - 14000).toISOString(),
    },
    {
        id: "f3", eventType: "review_posted", entityType: "model", entityId: "m5",
        entityName: "Gemini 2.5 Pro", createdAt: new Date(Date.now() - 65000).toISOString(),
        user: { id: "u2", githubUsername: "ml-enthusiast", contributionScore: 18, createdAt: "2024-09-01" },
    },
    {
        id: "f4", eventType: "model_added", entityType: "model", entityId: "m8",
        entityName: "DeepSeek V3", createdAt: new Date(Date.now() - 180000).toISOString(),
        user: { id: "u3", githubUsername: "open-source-fan", contributionScore: 67, createdAt: "2024-03-01" },
    },
    {
        id: "f5", eventType: "model_added", entityType: "model", entityId: "m4",
        entityName: "Grok 3", createdAt: new Date(Date.now() - 3600000).toISOString(),
        user: { id: "u4", githubUsername: "techwatch", contributionScore: 12, createdAt: "2025-01-01" },
    },
];

export function getModelBySlug(slug: string): Model | undefined {
    return mockModels.find((m) => m.slug === slug);
}

export function getUniqueProviders(): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const m of mockModels) {
        const name = m.provider?.name;
        if (name && !seen.has(name)) { seen.add(name); result.push(name); }
    }
    return result;
}

export function getUniqueModalities(): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const m of mockModels) {
        for (const mod of m.modalities) {
            if (!seen.has(mod)) { seen.add(mod); result.push(mod); }
        }
    }
    return result;
}

export function getUniqueLicenses(): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const m of mockModels) {
        const lic = m.license;
        if (lic && !seen.has(lic)) { seen.add(lic); result.push(lic); }
    }
    return result;
}

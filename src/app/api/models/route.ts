import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { mockModels } from "@/lib/mock-data";
import { slugify } from "@/lib/utils";

const DB_ENABLED = !!(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("[password]"));

// GET /api/models — list all models with optional filters
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get("provider");
    const license = searchParams.get("license");
    const modality = searchParams.get("modality");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "benchmarkGpqa";

    // 💡 Robust Pagination Controls & Fallback Guards
    const DEFAULT_LIMIT = 10;
    const MAX_LIMIT = 50;
    const DEFAULT_OFFSET = 0;

    const rawLimit = searchParams.get("limit");
    let limit = rawLimit ? parseInt(rawLimit, 10) : DEFAULT_LIMIT;
    // NaN Guard & Lower Bounds check
    if (isNaN(limit) || limit <= 0) {
        limit = DEFAULT_LIMIT;
    } else if (limit > MAX_LIMIT) {
        limit = MAX_LIMIT; // Enforce a hard maximum ceiling to block database exhaustion
    }

    const rawOffset = searchParams.get("offset");
    let offset = rawOffset ? parseInt(rawOffset, 10) : DEFAULT_OFFSET;
    // NaN Guard & Negative check
    if (isNaN(offset) || offset < 0) {
        offset = DEFAULT_OFFSET;
    }

    if (!DB_ENABLED) {
        // Fallback: filter mock data
        let result = [...mockModels];
        if (provider) result = result.filter((m) => m.provider?.name === provider);
        if (license) result = result.filter((m) => m.license === license);
        if (modality) result = result.filter((m) => m.modalities.includes(modality));
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.provider?.name.toLowerCase().includes(q) ||
                    m.description?.toLowerCase().includes(q)
            );
        }
        result.sort((a, b) => {
            const aVal = (a as unknown as Record<string, unknown>)[sort];
            const bVal = (b as unknown as Record<string, unknown>)[sort];
            if (aVal === undefined || aVal === null) return 1;
            if (bVal === undefined || bVal === null) return -1;
            return (bVal as number) - (aVal as number);
        });
        const total = result.length;
        return NextResponse.json({ data: result.slice(offset, offset + limit), total, limit, offset });
    }

    try {
        // Build Prisma where clause
        const where: Record<string, unknown> = {};
        if (provider) where.provider = { name: provider };
        if (license) where.license = license;
        if (modality) where.modalities = { has: modality };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { provider: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        // Validate sort field against allowed columns
        const allowedSorts = [
            "benchmarkGpqa", "benchmarkMmlu", "name", "contextWindow",
            "inputPricePerMtok", "outputPricePerMtok", "speedToksPerSec", "createdAt",
        ];
        const orderField = allowedSorts.includes(sort) ? sort : "benchmarkGpqa";

        const [models, total] = await Promise.all([
            prisma.model.findMany({
                where,
                include: { provider: true },
                orderBy: { [orderField]: "desc" },
                take: limit, // Safe clean integer guaranteed
                skip: offset, // Safe clean integer guaranteed
            }),
            prisma.model.count({ where }),
        ]);

        return NextResponse.json({ data: models, total, limit, offset });
    } catch (err) {
        console.error("GET /api/models error:", err);
        return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 });
    }
}

// POST /api/models — submit a new model for review
export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await request.json();
        const { name, provider, description, contextWindow, inputPricePerMtok, outputPricePerMtok, license, modalities, isOpenSource } = body;

        if (!name || !provider) {
            return NextResponse.json({ error: "name and provider are required" }, { status: 400 });
        }

        if (!DB_ENABLED) {
            return NextResponse.json(
                { message: "Contribution received (DB not connected — configure DATABASE_URL to persist).", status: "pending" },
                { status: 201 }
            );
        }

        // Upsert provider
        const providerRecord = await prisma.provider.upsert({
            where: { name: provider },
            update: {},
            create: { name: provider },
        });

        // Find or create the user record
        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.upsert({
            where: { githubUsername },
            update: {},
            create: { githubUsername, avatarUrl: session.user.image ?? undefined },
        });

        const slug = slugify(name);

        // Create model with pending status (isVerified: false)
        const model = await prisma.model.create({
            data: {
                name,
                slug,
                providerId: providerRecord.id,
                description,
                contextWindow: contextWindow ? parseInt(String(contextWindow)) : undefined,
                inputPricePerMtok: inputPricePerMtok ? parseFloat(String(inputPricePerMtok)) : undefined,
                outputPricePerMtok: outputPricePerMtok ? parseFloat(String(outputPricePerMtok)) : undefined,
                license,
                modalities: Array.isArray(modalities) ? modalities : ["text"],
                isOpenSource: Boolean(isOpenSource),
                isVerified: false,
            },
        });

        // Record the contribution
        await prisma.contribution.create({
            data: {
                userId: user.id,
                entityType: "model",
                entityId: model.id,
                action: "add",
                status: "pending",
            },
        });

        // Create a feed event
        await prisma.feedEvent.create({
            data: {
                userId: user.id,
                eventType: "model_added",
                entityType: "model",
                entityId: model.id,
                entityName: model.name,
            },
        });

        return NextResponse.json(
            { message: "Model submitted for review.", data: model, status: "pending" },
            { status: 201 }
        );
    } catch (err) {
        console.error("POST /api/models error:", err);
        return NextResponse.json({ error: "Failed to submit model" }, { status: 500 });
    }
}

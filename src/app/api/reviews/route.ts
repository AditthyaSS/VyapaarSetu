import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { getReviewsByEntity } from "@/lib/mock-data";

const DB_ENABLED = !!(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("[password]"));

export async function GET(request: Request) {
    const url = new URL(request.url);
    const entityType = url.searchParams.get("entityType");
    const entityId = url.searchParams.get("entityId");

    if (!entityType || !entityId) {
        return NextResponse.json(
            { error: "entityType and entityId are required" },
            { status: 400 }
        );
    }

    if (!["model", "tool"].includes(entityType)) {
        return NextResponse.json(
            { error: "entityType must be 'model' or 'tool'" },
            { status: 400 }
        );
    }

    if (!DB_ENABLED) {
        return NextResponse.json({ data: getReviewsByEntity(entityType as "model" | "tool", entityId) });
    }

    try {
        const reviews = await prisma.review.findMany({
            where: { entityType, entityId },
            include: { user: true },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ data: reviews });
    } catch (err) {
        console.error("GET /api/reviews error:", err);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}

// POST /api/reviews — submit a review for a model or tool
export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        const body = await request.json();
        const { entityType, entityId, rating, comment } = body;

        if (!entityType || !entityId || !rating) {
            return NextResponse.json(
                { error: "entityType, entityId, and rating are required" },
                { status: 400 }
            );
        }

        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: "Rating must be a number between 1 and 5" },
                { status: 400 }
            );
        }

        if (!["model", "tool"].includes(entityType)) {
            return NextResponse.json(
                { error: "entityType must be 'model' or 'tool'" },
                { status: 400 }
            );
        }

        if (!DB_ENABLED) {
            return NextResponse.json(
                { message: "Review received (DB not connected — configure DATABASE_URL to persist).", status: "pending" },
                { status: 201 }
            );
        }

        // Find or create user
        const githubUsername = (session.user.name ?? session.user.email ?? "unknown").replace(/\s+/g, "-").toLowerCase();
        const user = await prisma.user.upsert({
            where: { githubUsername },
            update: {},
            create: { githubUsername, avatarUrl: session.user.image ?? undefined },
        });

        // Create review
        const review = await prisma.review.create({
            data: {
                userId: user.id,
                entityType,
                entityId,
                rating: Math.round(rating),
                comment: comment ?? undefined,
            },
        });

        // Create feed event
        await prisma.feedEvent.create({
            data: {
                userId: user.id,
                eventType: "review_posted",
                entityType,
                entityId,
                entityName: entityId, // will be enriched client-side
                metadata: { rating },
            },
        });

        return NextResponse.json({ message: "Review submitted.", data: review }, { status: 201 });
    } catch (err) {
        console.error("POST /api/reviews error:", err);
        return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
    }
}

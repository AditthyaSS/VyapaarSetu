import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockFeedEvents } from "@/lib/mock-data";

const DB_ENABLED = !!(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("[password]"));

// GET /api/feed — get recent feed events
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    if (!DB_ENABLED) {
        return NextResponse.json({ data: mockFeedEvents, total: mockFeedEvents.length });
    }

    try {
        const [events, total] = await Promise.all([
            prisma.feedEvent.findMany({
                orderBy: { createdAt: "desc" },
                take: limit,
                include: { user: true },
            }),
            prisma.feedEvent.count(),
        ]);

        return NextResponse.json({ data: events, total });
    } catch (err) {
        console.error("GET /api/feed error:", err);
        return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
    }
}

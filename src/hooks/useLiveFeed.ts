"use client";

import { useState, useEffect } from "react";
import { FeedEvent } from "@/types";
import { subscribeToFeed } from "@/lib/realtime";

/**
 * Fetches the initial feed from the API and then subscribes to
 * Supabase Realtime for live inserts. Falls back gracefully when
 * Supabase env vars are not configured.
 */
export function useLiveFeed(initialEvents: FeedEvent[] = []) {
    const [events, setEvents] = useState<FeedEvent[]>(initialEvents);

    // Fetch initial data from the API
    useEffect(() => {
        fetch("/api/feed?limit=50")
            .then((r) => r.json())
            .then((json) => {
                if (Array.isArray(json.data)) setEvents(json.data as FeedEvent[]);
            })
            .catch(() => {
                // Keep initial events on error
            });
    }, []);

    // Subscribe to realtime inserts
    useEffect(() => {
        const channel = subscribeToFeed((raw) => {
            const event = raw as unknown as FeedEvent;
            setEvents((prev) => [event, ...prev].slice(0, 100));
        });

        return () => {
            channel?.unsubscribe();
        };
    }, []);

    return events;
}

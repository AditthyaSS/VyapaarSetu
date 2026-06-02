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
    const [isLoading, setIsLoading] = useState(initialEvents.length === 0);

    useEffect(() => {
        let active = true;

        fetch("/api/feed?limit=50")
            .then((r) => {
                if (!r.ok) throw new Error("Network error");
                return r.json();
            })
            .then((json) => {
               if (!active) return;
                
                // Support for both { data: [...] } and direct [...] JSON responses
                const fetchedEvents = Array.isArray(json.data) ? json.data : Array.isArray(json) ? json : [];
                
                // FIX: Only overwrite the events if the API actually returned new data.
                // This prevents the ticker from vanishing if the DB is currently empty.
                if (fetchedEvents.length > 0) {
                    setEvents(fetchedEvents as FeedEvent[]);
                }
            })
            .catch((err) => {
                console.error("Live feed fetch error:", err);
                // Keep initial events on error
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        const channel = subscribeToFeed((raw) => {
            const event = raw as unknown as FeedEvent;
            setEvents((prev) => [event, ...prev].slice(0, 100));
        });

        return () => {
            channel?.unsubscribe();
        };
    }, []);

    return { events, isLoading };
}

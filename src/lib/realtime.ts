import { getSupabaseBrowserClient } from "./supabase";

// Subscribe to new models being added
export function subscribeToModels(callback: (model: Record<string, unknown>) => void) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;

    return supabase
        .channel("models-changes")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "models" },
            (payload) => callback(payload.new as Record<string, unknown>)
        )
        .subscribe();
}

// Subscribe to the live feed
export function subscribeToFeed(callback: (event: Record<string, unknown>) => void) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;

    return supabase
        .channel("feed-events")
        .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "feed_events" },
            (payload) => callback(payload.new as Record<string, unknown>)
        )
        .subscribe();
}

// Subscribe to price updates
export function subscribeToModelUpdates(callback: (model: Record<string, unknown>) => void) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return null;

    return supabase
        .channel("models-updates")
        .on(
            "postgres_changes",
            { event: "UPDATE", schema: "public", table: "models" },
            (payload) => callback(payload.new as Record<string, unknown>)
        )
        .subscribe();
}

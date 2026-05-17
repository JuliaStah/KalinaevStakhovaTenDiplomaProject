import { getSupabaseBrowserClient } from "./supabase/client";
import { getSupabaseServerClient } from "./supabase/server";

export async function getDb() {
    // Определяем, где выполняется код
    if (typeof window === "undefined") return await getSupabaseServerClient();
    return getSupabaseBrowserClient();
}

// Пример использования: const supabase = await getDb();
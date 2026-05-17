"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabaseBrowserClient } from "./supabase/client";

export function useSession() {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const mountedRef = useRef(false);

    const fetchProfile = useCallback(async (email) => {
        if (!email) return null;
        try {
            const supabase = getSupabaseBrowserClient();
            const { data } = await supabase
                .from("пользователи")
                .select("фио, email, phone, роль:роли(название), заблокирован")
                .eq("email", email)
                .single();
            return data;
        } catch { return null; }
    }, []);

    useEffect(() => {
        if (mountedRef.current) return; // Фикс для React StrictMode (двойной вызов)
        mountedRef.current = true;

        const supabase = getSupabaseBrowserClient();
        let timeout;

        // Подписываемся на все события auth (включая INITIAL_SESSION при загрузке)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (event === 'SIGNED_OUT') {
                setSession(null); setProfile(null); setLoading(false);
                return;
            }

            setSession(newSession);
            if (newSession?.user) {
                const p = await fetchProfile(newSession.user.email);
                if (p) setProfile(p);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        // Фоллбэк: если Supabase зависает на 2 сек, всё равно снимаем загрузку
        timeout = setTimeout(() => setLoading(false), 2000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeout);
            mountedRef.current = false;
        };
    }, [fetchProfile]);

    const userName = profile?.фио || session?.user?.email?.split("@")[0] || "";
    const initials = userName.trim().substring(0, 2).toUpperCase() || "Г";
    const roleName = profile?.роль?.название || "Гость";

    return {
        session, profile, loading, userName, initials, roleName,
        isBlocked: profile?.заблокирован, userEmail: session?.user?.email
    };
}
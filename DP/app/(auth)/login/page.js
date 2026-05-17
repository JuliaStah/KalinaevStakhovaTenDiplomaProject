"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const supabase = getSupabaseBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError(err.message || "Неверный email или пароль");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <a href="/" className="logo" style={{ justifyContent: "center" }}>
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ flexShrink: 0 }}>
                            <rect x="4" y="8" width="14" height="24" rx="2" fill="#ec9428" opacity="0.9" />
                            <rect x="10" y="6" width="14" height="24" rx="2" fill="#f6ca7d" opacity="0.9" />
                            <rect x="16" y="10" width="14" height="24" rx="2" fill="#4f7e4f" opacity="0.9" />
                        </svg>
                        Библиотека<span>Будущего</span>
                    </a>
                </div>

                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Вход в систему</h2>
                <p className="auth-subtitle">Цифровой кабинет читателя</p>

                <form onSubmit={handleLogin} className="auth-form">
                    {error && (
                        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, color: "var(--red-400)", fontSize: 13 }}>
                            {error}
                        </div>
                    )}

                    <label>
                        <span>Email</span>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="name@example.com" />
                    </label>

                    <label>
                        <span>Пароль</span>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
                    </label>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? "Проверка..." : "Войти"}
                    </button>
                </form>

                <a href="/catalog" className="auth-link">Продолжить как гость →</a>
            </div>
        </div>
    );
}
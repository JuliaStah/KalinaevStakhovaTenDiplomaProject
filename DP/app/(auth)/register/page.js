"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    const [form, setForm] = useState({ fio: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        // Проверка паролей
        if (form.password !== form.confirm) {
            return setError("Пароли не совпадают");
        }
        if (form.password.length < 6) {
            return setError("Пароль должен быть не менее 6 символов");
        }

        setLoading(true);
        try {
            const supabase = getSupabaseBrowserClient();

            // Регистрируем пользователя и передаём ФИО в метаданные (для триггера)
            const { error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: { фио: form.fio }
                }
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err) {
            setError(err.message || "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>📧</div>
                    <h2>Проверьте почту</h2>
                    <p style={{ color: "var(--ink-400)", margin: "12px 0 24px" }}>
                        Мы отправили письмо для подтверждения на <strong>{form.email}</strong>.<br />
                        Подтвердите аккаунт, чтобы войти.
                    </p>
                    <button className="btn btn-secondary btn-block" onClick={() => router.push("/login")}>
                        Вернуться ко входу
                    </button>
                </div>
            </div>
        );
    }

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

                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Создать аккаунт</h2>
                <p className="auth-subtitle">Присоединяйтесь к системе</p>

                <form onSubmit={handleRegister} className="auth-form">
                    {error && (
                        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 12, color: "var(--red-400)", fontSize: 13 }}>
                            {error}
                        </div>
                    )}

                    <label>
                        <span>ФИО *</span>
                        <input value={form.fio} onChange={e => setForm({ ...form, fio: e.target.value })} required placeholder="Иванов Иван Иванович" />
                    </label>

                    <label>
                        <span>Email *</span>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="name@example.com" />
                    </label>

                    <label>
                        <span>Пароль *</span>
                        <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required placeholder="Минимум 6 символов" minLength="6" />
                    </label>

                    <label>
                        <span>Подтвердите пароль *</span>
                        <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
                    </label>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? "Создание..." : "Зарегистрироваться"}
                    </button>
                </form>

                <a href="/login" className="auth-link">Уже есть аккаунт? Войти →</a>
            </div>
        </div>
    );
}
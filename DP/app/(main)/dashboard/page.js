"use client";
import { useState, useEffect, useTransition } from "react";
import Header from "@/components/Header";
import AboutModal from "@/components/AboutModal";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/auth";
import { updateProfile, changePassword } from "@/actions/profile";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("loans");
    const [showAbout, setShowAbout] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [history, setHistory] = useState({ loans: [], reservations: [], fines: [] });
    const [settings, setSettings] = useState({ фио: "", phone: "" });

    const { session, userName, initials, roleName, userEmail, loading, refreshProfile } = useSession();
    const supabase = getSupabaseBrowserClient();

    useEffect(() => {
        if (!session?.user || loading) return;

        const fetchData = async () => {
            const { data: profile } = await supabase
                .from("пользователи")
                .select("id, фио, phone")
                .eq("email", session.user.email)
                .single();

            if (!profile) return;
            setSettings({ фио: profile.фио, phone: profile.phone || "" });

            const userId = profile.id;
            const [loansRes, resRes, finesRes] = await Promise.all([
                supabase.from("выдачи").select(`id, дата_выдачи, дата_должна_вернуть, дата_возврата, количество_продлений, статус_выдачи, физическая_книга:физическая_книга(книга:книги(название))`).eq("пользователь_id", userId).order("дата_выдачи", { ascending: false }),
                supabase.from("бронирования").select(`id, дата_бронирования, дата_истечения, статус_бронирования, очередь_позиция, книга:книги(название)`).eq("пользователь_id", userId).order("дата_бронирования", { ascending: false }),
                supabase.from("штраф").select(`id, сумма, причина, статус, дата_выдачи, выдача:выдачи(физическая_книга:физическая_книга(книга:книги(название)))`).eq("выдача_пользователь_id", userId).order("дата_выдачи", { ascending: false })
            ]);

            setHistory({
                loans: loansRes?.data || [],
                reservations: resRes?.data || [],
                fines: finesRes?.data || []
            });
        };
        fetchData();
    }, [session, loading]);

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        startTransition(async () => {
            const res = await updateProfile(new FormData(e.target));
            if (res.success) { await refreshProfile(); alert("✅ Сохранено"); } else alert("❌ " + res.message);
        });
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString("ru-RU") : "—";
    const statusMap = {
        active: ["Активна", "st-active"], returned: ["Возвращена", "st-returned"],
        ready: ["Готова", "st-ready"], waiting: ["В очереди", "st-waiting"],
        unpaid: ["Не оплачен", "st-unpaid"], paid: ["Оплачен", "st-paid"]
    };

    if (loading) {
        return (
            <div style={{textAlign:'center',padding:100,color:'var(--ink-400)'}}>
                ⏳ Проверка сессии...
            </div>
        );
    }
    if (!session) return <div style={{textAlign:'center',padding:100}}>Пожалуйста, войдите в систему.</div>;

    return (
        <>
            <Header />
            <div className="account-header">
                <div className="account-container" style={{padding:0}}>
                    <div className="account-profile">
                        <div className="account-avatar">{initials}</div>
                        <div>
                            <div className="account-name">{userName}</div>
                            <div className="account-ticket">Билет №2026-0421 • {roleName}</div>
                            <div className="account-status">✅ Аккаунт верифицирован</div>
                        </div>
                    </div>
                    <div className="account-grid">
                        <div className="account-stat-card"><div className="account-stat-icon">📚</div><div><div className="account-stat-value">{history.loans.length}</div><div className="account-stat-label">Всего выдач</div></div></div>
                        <div className="account-stat-card"><div className="account-stat-icon">✅</div><div><div className="account-stat-value">{history.loans.filter(l=>l.статус_выдачи==='Возвращена').length}</div><div className="account-stat-label">Возвращено вовремя</div></div></div>
                        <div className="account-stat-card"><div className="account-stat-icon">📌</div><div><div className="account-stat-value">{history.reservations.length}</div><div className="account-stat-label">Активных броней</div></div></div>
                        <div className="account-stat-card"><div className="account-stat-icon">💰</div><div><div className="account-stat-value">0 ₽</div><div className="account-stat-label">Задолженность</div></div></div>
                    </div>
                </div>
            </div>

            <div className="account-container">
                <div className="tabs">
                    {["loans","reservations","fines","settings"].map(id => (
                        <button key={id} className={`tab ${activeTab===id?'active':''}`} onClick={()=>setActiveTab(id)}>
                            {id==="loans"?"📋 История выдач":id==="reservations"?"📌 Активные бронирования":id==="fines"?"⚠️ Штрафы":"⚙️ Настройки"}
                        </button>
                    ))}
                </div>

                {activeTab==="loans" && <div className="table-wrap"><table><thead><tr><th>Книга</th><th>Дата выдачи</th><th>Вернуть до</th><th>Дата возврата</th><th>Продлений</th><th>Статус</th></tr></thead><tbody>{history.loans.map(l=>(<tr key={l.id}><td>{l.физическая_книга?.книга?.название||"—"}</td><td>{formatDate(l.дата_выдачи)}</td><td>{formatDate(l.дата_должна_вернуть)}</td><td>{formatDate(l.дата_возврата)}</td><td>{l.количество_продлений||0}</td><td><span className={`status-badge ${statusMap[l.статус_выдачи]?.[1]||''}`}><span className="dot"></span>{statusMap[l.статус_выдачи]?.[0]||l.статус_выдачи}</span></td></tr>))}{history.loans.length===0&&<tr><td colSpan="6" className="empty-row">История пуста</td></tr>}</tbody></table></div>}

                {activeTab==="reservations" && <div className="table-wrap"><table><thead><tr><th>Книга</th><th>Дата</th><th>Позиция</th><th>Срок до</th><th>Статус</th><th>Действия</th></tr></thead><tbody>{history.reservations.map(r=>(<tr key={r.id}><td>{r.книга?.название||"—"}</td><td>{formatDate(r.дата_бронирования)}</td><td>#{r.очередь_позиция||"—"}</td><td>{formatDate(r.дата_истечения)}</td><td><span className={`status-badge ${statusMap[r.статус_бронирования]?.[1]||''}`}><span className="dot"></span>{statusMap[r.статус_бронирования]?.[0]||r.статус_бронирования}</span></td><td><button className="btn btn-sm btn-danger">Отменить</button></td></tr>))}{history.reservations.length===0&&<tr><td colSpan="6" className="empty-row">Нет бронирований</td></tr>}</tbody></table></div>}

                {activeTab==="fines" && <div className="table-wrap"><table><thead><tr><th>Причина</th><th>Сумма</th><th>Дата</th><th>Статус</th></tr></thead><tbody>{history.fines.map(f=>(<tr key={f.id}><td>{f.причина}</td><td>{f.сумма} ₽</td><td>{formatDate(f.дата_выдачи)}</td><td><span className={`status-badge ${statusMap[f.статус]?.[1]||''}`}><span className="dot"></span>{f.статус}</span></td></tr>))}{history.fines.length===0&&<tr><td colSpan="4" className="empty-row">Штрафов нет 🎉</td></tr>}</tbody></table></div>}

                {activeTab==="settings" && (
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24}}>
                        <div className="table-wrap"><h3 style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>👤 Личные данные</h3>
                            <form onSubmit={handleSaveSettings} style={{padding:20,display:'grid',gap:16}}>
                                <label><span style={{fontSize:12,color:'var(--ink-400)'}}>ФИО</span><input name="фио" defaultValue={settings.фио} className="search-input"/></label>
                                <label><span style={{fontSize:12,color:'var(--ink-400)'}}>Email</span><input className="search-input" value={userEmail} disabled style={{opacity:0.6}}/></label>
                                <label><span style={{fontSize:12,color:'var(--ink-400)'}}>Телефон</span><input name="телефон" defaultValue={settings.phone} className="search-input"/></label>
                                <button type="submit" disabled={isPending} className="btn btn-primary">{isPending?"Сохранение...":"Сохранить изменения"}</button>
                            </form>
                        </div>
                        <div className="table-wrap"><h3 style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>🔒 Безопасность</h3>
                            <form onSubmit={async e=>{e.preventDefault(); startTransition(async()=>{const res=await changePassword(new FormData(e.target)); alert(res.success?"✅ Готово":"❌ "+res.message)})}} style={{padding:20,display:'grid',gap:16}}>
                                <label><span style={{fontSize:12,color:'var(--ink-400)'}}>Новый пароль</span><input name="новый_пароль" type="password" className="search-input" minLength="6" required/></label>
                                <button type="submit" disabled={isPending} className="btn btn-secondary">{isPending?"Изменение...":"Изменить пароль"}</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            {showAbout && <AboutModal onClose={()=>setShowAbout(false)} />}
        </>
    );
}
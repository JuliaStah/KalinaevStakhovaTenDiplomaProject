"use client";
import { useState, useEffect, useTransition } from "react";
import Header from "@/components/Header";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { addBook, addAuthor, addGenre, addUser, createLoan, createReservation, addFine } from "@/actions/library";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [subTab, setSubTab] = useState("books");
    const [filter, setFilter] = useState("Все");
    const [modal, setModal] = useState(null);
    const [isPending, startTransition] = useTransition();
    const [data, setData] = useState({
        stats: { users: 0, books: 0, loans: 0, fines: 0, finesPaid: 0, finesTotal: 0 },
        logs: [], users: [], roles: [], books: [], authors: [], genres: [], copies: [], places: [],
        loans: [], reservations: [], fines: [], notifications: [], audit: []
    });

    const supabase = getSupabaseBrowserClient();

    useEffect(() => {
        const fetchAll = async () => {
            const [u, b, l, f, logs, audit, users, roles, books, auth, genres, copies, places, reservations, fines, notifs] = await Promise.all([
                supabase.from("пользователи").select("id", { count: "exact", head: true }),
                supabase.from("книги").select("id", { count: "exact", head: true }),
                supabase.from("выдачи").select("id", { count: "exact", head: true }).eq("статус_выдачи", "Активна"),
                supabase.from("штраф").select("id", { count: "exact", head: true }).eq("статус", "Не оплачен"),
                supabase.from("журнал_аудит").select(`id, пользователь:пользователи(фио), тип_действия, предмет_действия, ip_адрес, дата_создания`).order("дата_создания", { ascending: false }).limit(4),
                supabase.from("журнал_аудит").select(`id, пользователь:пользователи(фио), тип_действия, предмет_действие, предмет_взаимодействия_id, ip_адрес, дата_создания`).order("дата_создания", { ascending: false }),
                supabase.from("пользователи").select("id, фио, email, phone, роль:роли(название), заблокирован, дата_создания"),
                supabase.from("роли").select("id, название"),
                supabase.from("книги").select("id, название, isbn, издательство, год_издания, язык, количество_страниц, всего_экземпляров, доступно_экземпляров"),
                supabase.from("авторы").select("id, фио, страна, год_рождения, год_смерти"),
                supabase.from("жанр").select("id, название, описание"),
                supabase.from("физическая_книга").select("id, инвентарный_номер, штрихкод, книга:книги(название), место:место(название), статус, состояние"),
                supabase.from("место").select("id, название, зал, секция, шкаф, полка"),
                supabase.from("бронирования").select("id, пользователь:пользователи(фио), книга:книги(название), статус_бронирования, очередь_позиция, дата_бронирования, дата_истечения"),
                supabase.from("штраф").select("id, выдача_id, сумма, причина, статус, дата_выдачи, дата_оплаты"),
                supabase.from("уведомления").select("id, пользователь:пользователи(фио), заголовок, сообщение, тип, прочитано, отправлено_через, дата_отправления")
            ]);

            setData({
                stats: {
                    users: u.count || 0, books: b.count || 0, loans: l.count || 0, fines: f.count || 0,
                    finesPaid: fines?.filter(x => x.статус === "Оплачен").length || 0,
                    finesTotal: fines?.length || 0
                },
                logs: logs || [], audit: audit || [], users: users || [], roles: roles || [],
                books: books || [], authors: auth || [], genres: genres || [],
                copies: copies || [], places: places || [], loans: [], reservations: reservations || [],
                fines: fines || [], notifications: notifs || []
            });
        };
        fetchAll();
    }, []);

    const openModal = (type) => setModal(type);
    const closeModal = () => setModal(null);
    const handleSubmit = async (e, action) => {
        e.preventDefault();
        startTransition(async () => {
            const res = await action(new FormData(e.target));
            if (res?.success) closeModal();
        });
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    const formatShortDate = (d) => d ? new Date(d).toLocaleDateString("ru-RU") : "—";

    const navLinks = [
        { label: "Дашборд", href: "/admin" }, { label: "Пользователи", href: "/admin?tab=users" },
        { label: "Каталог", href: "/admin?tab=catalog" }, { label: "Экземпляры", href: "/admin?tab=copies" },
        { label: "Выдачи", href: "/admin?tab=loans" }, { label: "Бронирования", href: "/admin?tab=reservations" },
        { label: "Штрафы", href: "/admin?tab=fines" }, { label: "Уведомления", href: "/admin?tab=notifications" },
        { label: "Аудит", href: "/admin?tab=audit" }, { label: "Личный кабинет", href: "/admin?tab=profile" }
    ];

    return (
        <>
            <Header navLinks={navLinks} user={{ name: "Алексей Д.", initials: "АД", role: "Администратор", email: "admin@lib.ru" }} notifCount={3} />
            <div className="admin-container">
                <div className="page-header">
                    <h1>Панель администратора</h1>
                    <p>Системный обзор — 21 апреля 2026</p>
                </div>

                {/* DASHBOARD */}
                {activeTab === "dashboard" && (
                    <>
                        <div className="stats-grid">
                            <div className="stat-card"><div className="stat-value" style={{color:'var(--cyan-400)'}}>{data.stats.users.toLocaleString()}</div><div className="stat-label">Пользователей <span style={{color:'var(--green-400)'}}>+15%</span></div></div>
                            <div className="stat-card"><div className="stat-value">{data.stats.books.toLocaleString()}</div><div className="stat-label">Книг в фонде <span style={{color:'var(--green-400)'}}>+8%</span></div></div>
                            <div className="stat-card"><div className="stat-value" style={{color:'var(--library-400)'}}>{data.stats.loans}</div><div className="stat-label">Активных выдач</div></div>
                            <div className="stat-card"><div className="stat-value" style={{color:'var(--red-400)'}}>₽45,200</div><div className="stat-label">Неоплаченных штрафов</div></div>
                        </div>
                        <div style={{display:'flex',gap:12,marginBottom:24,flexWrap:'wrap'}}>
                            <span className="server-badge st-ready">Основной сервер<br/><small>Uptime: 99.97%</small></span>
                            <span className="server-badge st-ready">База данных<br/><small>Загрузка: 42%</small></span>
                            <span className="server-badge st-waiting">Резервный сервер<br/><small>Синхронизация...</small></span>
                        </div>
                        <div className="table-wrap">
                            <h3 style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>📜 Системный журнал (журнал_аудит)</h3>
                            <table>
                                <thead><tr><th>Действие</th><th>Пользователь</th><th>IP</th><th>Время</th></tr></thead>
                                <tbody>{data.logs.map(l=>(
                                    <tr key={l.id}><td>{l.тип_действия} «{l.предмет_действия}»</td><td>{l.пользователь?.фио||"Система"}</td><td>{l.ip_адрес||"—"}</td><td>{formatDate(l.дата_создания)}</td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* USERS */}
                {activeTab === "users" && (
                    <div className="table-wrap">
                        <div className="table-header"><h3>👥 Пользователи</h3><button className="btn btn-primary btn-sm" onClick={()=>openModal("addUser")}>Добавить</button></div>
                        <div style={{display:'flex',gap:8,padding:'0 20px',marginBottom:12}}>
                            {["Все","Читатели","Библиотекари","Администраторы","Заблокированные"].map(f=>(
                                <button key={f} className={`btn ${filter===f?'btn-primary':'btn-ghost'} btn-sm`} onClick={()=>setFilter(f)}>{f}</button>
                            ))}
                        </div>
                        <table>
                            <thead><tr><th>ID</th><th>ФИО</th><th>Email</th><th>Телефон</th><th>Роль</th><th>Заблокирован</th><th>Дата создания</th><th>Действия</th></tr></thead>
                            <tbody>{data.users.map(u=>(
                                <tr key={u.id}><td>{u.id}</td><td>{u.фио}</td><td>{u.email}</td><td>{u.phone||"—"}</td><td>{u.роль?.название}</td><td>{u.заблокирован?"Да":"Нет"}</td><td>{formatShortDate(u.дата_создания)}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}

                {/* CATALOG */}
                {activeTab === "catalog" && (
                    <>
                        <div className="table-header" style={{padding:0,borderBottom:'none',marginBottom:16}}>
                            <h3>📚 Каталог книг</h3>
                            <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
                                {[{id:'books',label:'📚 Книги'},{id:'authors',label:'✍️ Авторы'},{id:'genres',label:'🏷️ Жанры'}].map(t=>(
                                    <button key={t.id} className={`btn ${subTab===t.id?'btn-primary':'btn-ghost'} btn-sm`} onClick={()=>setSubTab(t.id)}>{t.label}</button>
                                ))}
                                <button className="btn btn-primary btn-sm" onClick={()=>openModal(subTab==='books'?'addBook':subTab==='authors'?'addAuthor':'addGenre')}>Добавить</button>
                            </div>
                        </div>
                        {subTab==='books' && (
                            <div className="table-wrap"><table>
                                <thead><tr><th>ID</th><th>Название</th><th>ISBN</th><th>Издательство</th><th>Год</th><th>Язык</th><th>Страниц</th><th>Всего</th><th>Доступно</th><th>Действия</th></tr></thead>
                                <tbody>{data.books.map(b=>(
                                    <tr key={b.id}><td>{b.id}</td><td>{b.название}</td><td>{b.isbn}</td><td>{b.издательство||"—"}</td><td>{b.год_издания||"—"}</td><td>{b.язык||"Русский"}</td><td>{b.количество_страниц||"—"}</td><td>{b.всего_экземпляров}</td><td>{b.доступно_экземпляров}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                                ))}</tbody>
                            </table></div>
                        )}
                        {subTab==='authors' && (
                            <div className="table-wrap"><table>
                                <thead><tr><th>ID</th><th>ФИО</th><th>Страна</th><th>Год рождения</th><th>Год смерти</th><th>Действия</th></tr></thead>
                                <tbody>{data.authors.map(a=>(
                                    <tr key={a.id}><td>{a.id}</td><td>{a.фио}</td><td>{a.страна||"—"}</td><td>{a.год_рождения||"—"}</td><td>{a.год_смерти||"—"}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                                ))}</tbody>
                            </table></div>
                        )}
                        {subTab==='genres' && (
                            <div className="table-wrap"><table>
                                <thead><tr><th>ID</th><th>Название</th><th>Описание</th><th>Действия</th></tr></thead>
                                <tbody>{data.genres.map(g=>(
                                    <tr key={g.id}><td>{g.id}</td><td>{g.название}</td><td>{g.описание||"—"}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                                ))}</tbody>
                            </table></div>
                        )}
                    </>
                )}

                {/* COPIES & PLACES */}
                {activeTab === "copies" && (
                    <>
                        <div className="table-header" style={{padding:0,borderBottom:'none',marginBottom:16}}>
                            <h3>📖 Физические книги</h3>
                            <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
                                <button className={`btn ${subTab==='copies'?'btn-primary':'btn-ghost'} btn-sm`} onClick={()=>setSubTab('copies')}>📖 Экземпляры</button>
                                <button className={`btn ${subTab==='places'?'btn-primary':'btn-ghost'} btn-sm`} onClick={()=>setSubTab('places')}>📍 Места хранения</button>
                                <button className="btn btn-primary btn-sm" onClick={()=>openModal(subTab==='copies'?'addCopy':'addPlace')}>Добавить</button>
                            </div>
                        </div>
                        {subTab==='copies' && (
                            <div className="table-wrap"><table>
                                <thead><tr><th>ID</th><th>Инв. номер</th><th>Штрихкод</th><th>Книга</th><th>Место</th><th>Статус</th><th>Состояние</th><th>Действия</th></tr></thead>
                                <tbody>{data.copies.map(c=>(
                                    <tr key={c.id}><td>{c.id}</td><td>{c.инвентарный_номер}</td><td>{c.штрихкод||"—"}</td><td>{c.книга?.название}</td><td>{c.место?.название||"—"}</td><td>{c.статус}</td><td>{c.состояние||"—"}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                                ))}</tbody>
                            </table></div>
                        )}
                        {subTab==='places' && (
                            <div className="table-wrap"><table>
                                <thead><tr><th>ID</th><th>Название</th><th>Зал</th><th>Секция</th><th>Шкаф</th><th>Полка</th><th>Действия</th></tr></thead>
                                <tbody>{data.places.map(p=>(
                                    <tr key={p.id}><td>{p.id}</td><td>{p.название}</td><td>{p.зал||"—"}</td><td>{p.секция||"—"}</td><td>{p.шкаф||"—"}</td><td>{p.полка||"—"}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                                ))}</tbody>
                            </table></div>
                        )}
                    </>
                )}

                {/* LOANS */}
                {activeTab === "loans" && (
                    <div className="table-wrap">
                        <div className="table-header"><h3>📋 Выдачи</h3><button className="btn btn-primary btn-sm" onClick={()=>openModal("issueBook")}>Оформить</button></div>
                        <div style={{display:'flex',gap:8,padding:'0 20px',marginBottom:12}}>
                            {["Все","Активные","Возвращённые","Просроченные"].map(f=>(
                                <button key={f} className={`btn ${filter===f?'btn-primary':'btn-ghost'} btn-sm`} onClick={()=>setFilter(f)}>{f}</button>
                            ))}
                        </div>
                        <table>
                            <thead><tr><th>ID</th><th>Пользователь</th><th>Физ. книга</th><th>Дата выдачи</th><th>Вернуть до</th><th>Дата возврата</th><th>Продлений</th><th>Статус</th><th>Действия</th></tr></thead>
                            <tbody><tr><td colSpan="9" className="empty-row">Показано 0 из 0</td></tr></tbody>
                        </table>
                    </div>
                )}

                {/* RESERVATIONS */}
                {activeTab === "reservations" && (
                    <div className="table-wrap">
                        <div className="table-header"><h3>📌 Бронирования</h3><button className="btn btn-primary btn-sm" onClick={()=>openModal("createRes")}>Создать</button></div>
                        <table>
                            <thead><tr><th>ID</th><th>Пользователь</th><th>Книга</th><th>Статус</th><th>Очередь</th><th>Дата бронирования</th><th>Дата истечения</th><th>Действия</th></tr></thead>
                            <tbody>{data.reservations.map(r=>(
                                <tr key={r.id}><td>{r.id}</td><td>{r.пользователь?.фио||"Гость"}</td><td>{r.книга?.название||"Без книги"}</td><td>{r.статус_бронирования}</td><td>{r.очередь_позиция||"—"}</td><td>{formatDate(r.дата_бронирования)}</td><td>{formatDate(r.дата_истечения)}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}

                {/* FINES */}
                {activeTab === "fines" && (
                    <>
                        <div className="table-header"><h3>💰 Штрафы</h3><button className="btn btn-primary btn-sm" onClick={()=>openModal("addFine")}>Начислить</button></div>
                        <div className="stats-grid" style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                            <div className="stat-card" style={{padding:12}}><div className="stat-value" style={{color:'var(--red-400)',fontSize:18}}>₽{data.stats.finesPaid.toLocaleString()}</div><div className="stat-label">Неоплаченных</div></div>
                            <div className="stat-card" style={{padding:12}}><div className="stat-value" style={{color:'var(--green-400)',fontSize:18}}>₽{data.stats.finesTotal.toLocaleString()}</div><div className="stat-label">Оплачено</div></div>
                            <div className="stat-card" style={{padding:12}}><div className="stat-value" style={{fontSize:18}}>{data.fines.length}</div><div className="stat-label">Всего штрафов</div></div>
                        </div>
                        <table>
                            <thead><tr><th>ID</th><th>Выдача</th><th>Сумма</th><th>Причина</th><th>Статус</th><th>Дата выдачи</th><th>Дата оплаты</th><th>Действия</th></tr></thead>
                            <tbody>{data.fines.map(f=>(
                                <tr key={f.id}><td>{f.id}</td><td>#{f.выдача_id}</td><td>{f.сумма} ₽</td><td>{f.причина}</td><td>{f.статус}</td><td>{formatDate(f.дата_выдачи)}</td><td>{formatDate(f.дата_оплаты)}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                            ))}</tbody>
                        </table>
                    </>
                )}

                {/* NOTIFICATIONS & AUDIT */}
                {activeTab === "notifications" && (
                    <div className="table-wrap">
                        <div className="table-header"><h3>🔔 Уведомления</h3><button className="btn btn-secondary btn-sm">Отправить тест</button></div>
                        <table>
                            <thead><tr><th>ID</th><th>Пользователь</th><th>Заголовок</th><th>Сообщение</th><th>Тип</th><th>Прочитано</th><th>Отправлено через</th><th>Действия</th></tr></thead>
                            <tbody>{data.notifications.map(n=>(
                                <tr key={n.id}><td>{n.id}</td><td>{n.пользователь?.фио||"Система"}</td><td>{n.заголовок}</td><td>{n.сообщение}</td><td>{n.тип}</td><td>{n.прочитано?"Да":"Нет"}</td><td>{n.отправлено_через||"—"}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}
                {activeTab === "audit" && (
                    <div className="table-wrap">
                        <div className="table-header"><h3>🛡️ Журнал аудит</h3><button className="btn btn-secondary btn-sm">Экспорт</button></div>
                        <table>
                            <thead><tr><th>ID</th><th>Пользователь</th><th>Тип действия</th><th>Предмет действия</th><th>Предмет ID</th><th>IP адрес</th><th>Дата создания</th></tr></thead>
                            <tbody>{data.audit.map(a=>(
                                <tr key={a.id}><td>{a.id}</td><td>{a.пользователь?.фио||"Система"}</td><td>{a.тип_действия}</td><td>{a.предмет_действие||"—"}</td><td>{a.предмет_взаимодействия_id||"—"}</td><td>{a.ip_адрес||"—"}</td><td>{formatDate(a.дата_создания)}</td></tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}

                {/* PROFILE / SETTINGS */}
                {activeTab === "profile" && (
                    <>
                        <div className="table-wrap" style={{padding:24,marginBottom:24}}>
                            <h3 style={{marginBottom:16}}>👤 Настройки профиля</h3>
                            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24}}>
                                <div>
                                    <h4 style={{marginBottom:12}}>Личные данные</h4>
                                    <label style={{display:'block',marginBottom:12}}><span style={{fontSize:12,color:'var(--ink-400)'}}>ФИО</span><input className="search-input" defaultValue="Алексей Дмитриев" style={{width:'100%'}} /></label>
                                    <label style={{display:'block',marginBottom:12}}><span style={{fontSize:12,color:'var(--ink-400)'}}>Email</span><input className="search-input" defaultValue="admin@lib.ru" style={{width:'100%'}} /></label>
                                    <label style={{display:'block'}}><span style={{fontSize:12,color:'var(--ink-400)'}}>Телефон</span><input className="search-input" defaultValue="+7 (900) 000-00-00" style={{width:'100%'}} /></label>
                                    <button className="btn btn-primary" style={{marginTop:12}}>Сохранить изменения</button>
                                </div>
                                <div>
                                    <h4 style={{marginBottom:12}}>🔒 Безопасность</h4>
                                    <label style={{display:'block',marginBottom:12}}><span style={{fontSize:12,color:'var(--ink-400)'}}>Текущий пароль</span><input type="password" className="search-input" style={{width:'100%'}} /></label>
                                    <label style={{display:'block'}}><span style={{fontSize:12,color:'var(--ink-400)'}}>Новый пароль</span><input type="password" className="search-input" style={{width:'100%'}} /></label>
                                    <button className="btn btn-secondary" style={{marginTop:12}}>Изменить пароль</button>
                                </div>
                            </div>
                        </div>
                        <div className="table-wrap">
                            <div className="table-header"><h3>📋 Роли (таблица «роли»)</h3></div>
                            <table>
                                <thead><tr><th>ID</th><th>Название</th><th>Кол-во пользователей</th></tr></thead>
                                <tbody>{data.roles.map(r=>(
                                    <tr key={r.id}><td>{r.id}</td><td>{r.название}</td><td>{data.users.filter(u=>u.роль?.название===r.название).length}</td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* MODALS */}
            {modal && (
                <div className="modal-overlay show" onClick={closeModal}>
                    <div className="modal" onClick={e=>e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>✕</button>
                        <div className="modal-hero"><h2 className="modal-title">
                            {{addUser:"Добавить пользователя",addBook:"Добавить книгу",addAuthor:"Добавить автора",addGenre:"Добавить жанр",addCopy:"Добавить экземпляр",addPlace:"Добавить место",issueBook:"Оформить выдачу",createRes:"Создать бронирование",addFine:"Начислить штраф"}[modal]}
                        </h2></div>
                        <div className="modal-body">
                            {modal==="addUser" && <form onSubmit={e=>handleSubmit(e,addUser)} style={{display:'grid',gap:16}}>
                                <label><span>ФИО *</span><input name="фио" required /></label>
                                <label><span>Email *</span><input type="email" name="email" required /></label>
                                <label><span>Телефон</span><input type="tel" name="телефон" /></label>
                                <label><span>Роль *</span><select name="роль">{data.roles.map(r=>(<option key={r.id} value={r.название}>{r.название}</option>))}</select></label>
                                <label><span>Заблокирован</span><select name="заблокирован"><option>Нет</option><option>Да</option></select></label>
                                <label><span>Причина блокировки</span><input name="причина" /></label>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Сохранение...":"Сохранить"}</button>
                            </form>}
                            {modal==="addBook" && <form onSubmit={e=>handleSubmit(e,addBook)} style={{display:'grid',gap:16}}>
                                <label><span>Название *</span><input name="название" required /></label>
                                <label><span>ISBN *</span><input name="isbn" required /></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Год издания</span><input type="number" name="год" /></label><label><span>Издательство</span><input name="издательство" /></label></div>
                                <label><span>Язык</span><select name="язык"><option>Русский</option><option>Английский</option><option>Французский</option><option>Немецкий</option></select></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Количество страниц</span><input type="number" name="страниц" /></label><label><span>Всего экземпляров *</span><input type="number" name="всего" defaultValue="1" required /></label></div>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Сохранение...":"Сохранить"}</button>
                            </form>}
                            {modal==="addAuthor" && <form onSubmit={e=>handleSubmit(e,addAuthor)} style={{display:'grid',gap:16}}>
                                <label><span>ФИО *</span><input name="фио" required /></label>
                                <label><span>Страна</span><input name="страна" /></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Год рождения</span><input type="number" name="год_рожд" /></label><label><span>Год смерти</span><input type="number" name="год_смерти" placeholder="Если жив — пусто" /></label></div>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Сохранение...":"Сохранить"}</button>
                            </form>}
                            {modal==="addGenre" && <form onSubmit={e=>handleSubmit(e,addGenre)} style={{display:'grid',gap:16}}>
                                <label><span>Название *</span><input name="название" required /></label>
                                <label><span>Описание</span><textarea name="описание" rows="3" /></label>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Сохранение...":"Сохранить"}</button>
                            </form>}
                            {modal==="addCopy" && <form style={{display:'grid',gap:16}}>
                                <label><span>Книга *</span><select>{data.books.map(b=>(<option key={b.id} value={b.id}>{b.название}</option>))}</select></label>
                                <label><span>Инвентарный номер *</span><input /></label>
                                <label><span>Штрихкод *</span><input /></label>
                                <label><span>Место хранения</span><select>{data.places.map(p=>(<option key={p.id} value={p.id}>{p.название}</option>))}</select></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Статус</span><select><option>Доступен</option><option>Выдан</option><option>Забронирован</option><option>Повреждён</option></select></label><label><span>Состояние</span><select><option>Отличное</option><option>Хорошее</option><option>Удовлетворительное</option><option>Требует ремонта</option></select></label></div>
                                <button className="btn btn-primary btn-block">Сохранить</button>
                            </form>}
                            {modal==="addPlace" && <form style={{display:'grid',gap:16}}>
                                <label><span>Название *</span><input /></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Зал</span><input /></label><label><span>Секция</span><input /></label></div>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Шкаф</span><input /></label><label><span>Полка</span><input /></label></div>
                                <label><span>Описание</span><textarea rows="2" /></label>
                                <button className="btn btn-primary btn-block">Сохранить</button>
                            </form>}
                            {modal==="issueBook" && <form onSubmit={e=>handleSubmit(e,createLoan)} style={{display:'grid',gap:16}}>
                                <label><span>Пользователь *</span><select name="пользователь_id">{data.users.map(u=>(<option key={u.id} value={u.id}>{u.фио}</option>))}</select></label>
                                <label><span>Физическая книга *</span><select name="экземпляр_id">{data.copies.map(c=>(<option key={c.id} value={c.id}>{c.инвентарный_номер} ({c.книга?.название})</option>))}</select></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Дата выдачи *</span><input type="date" name="дата_выдачи" /></label><label><span>Вернуть до *</span><input type="date" name="вернуть_до" /></label></div>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Оформление...":"Оформить"}</button>
                            </form>}
                            {modal==="createRes" && <form onSubmit={e=>handleSubmit(e,createReservation)} style={{display:'grid',gap:16}}>
                                <label><span>Пользователь *</span><select name="пользователь_id">{data.users.map(u=>(<option key={u.id} value={u.id}>{u.фио}</option>))}</select></label>
                                <label><span>Книга *</span><select name="книга_id">{data.books.map(b=>(<option key={b.id} value={b.id}>{b.название}</option>))}</select></label>
                                <label><span>Статус бронирования</span><select name="статус"><option>Ожидает</option><option>Активно</option><option>Завершено</option><option>Отменено</option></select></label>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Создание...":"Забронировать"}</button>
                            </form>}
                            {modal==="addFine" && <form onSubmit={e=>handleSubmit(e,addFine)} style={{display:'grid',gap:16}}>
                                <label><span>Выдача *</span><select name="выдача_id"><option>#1001 — Война и мир</option><option>#1003 — 1984</option></select></label>
                                <label><span>Сумма (₽) *</span><input type="number" name="сумма" /></label>
                                <label><span>Статус</span><select name="статус"><option>Не оплачен</option><option>Оплачен</option></select></label>
                                <label><span>Причина *</span><input name="причина" /></label>
                                <label><span>Комментарий</span><textarea name="комментарий" rows="2" /></label>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Начисление...":"Начислить"}</button>
                            </form>}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary btn-block" onClick={closeModal}>Отмена</button>
                            <button className="btn btn-primary btn-block" disabled={isPending}>Сохранить</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
"use client";
import { useState, useEffect, useTransition } from "react";
import Header from "@/components/Header";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { addBook, addCopy, addAuthor, addGenre, createLoan, createReservation } from "@/actions/library";

export default function LibrarianPage() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [catalogSubTab, setCatalogSubTab] = useState("books");
    const [loanFilter, setLoanFilter] = useState("Все");
    const [modal, setModal] = useState(null);
    const [isPending, startTransition] = useTransition();

    const [data, setData] = useState({
        stats: { books: 0, users: 0, loans: 0, overdue: 0, added: 12, processed: 89, reserved: 24, copies: 45 },
        books: [], copies: [], authors: [], genres: [], users: [], loans: [], reservations: [], logs: [], activity: []
    });

    const supabase = getSupabaseBrowserClient();

    useEffect(() => {
        const fetchAll = async () => {
            const [b, u, l, c, auth, gen, copies, logs] = await Promise.all([
                supabase.from("книги").select("id, название, isbn, издательство, год_издания, язык, всего_экземпляров, доступно_экземпляров"),
                supabase.from("пользователи").select("id, фио, email, phone, роль:роли(название), заблокирован, дата_создания"),
                supabase.from("выдачи").select("id, пользователь:пользователи(фио), книга:книги(название), дата_выдачи, дата_должна_вернуть, дата_возврата, количество_продлений, статус_выдачи"),
                supabase.from("бронирования").select("id, пользователь:пользователи(фио), книга:книги(название), статус_бронирования, очередь_позиция, дата_бронирования, дата_истечения"),
                supabase.from("авторы").select("id, фио, страна, год_рождения, год_смерти"),
                supabase.from("жанр").select("id, название, описание"),
                supabase.from("физическая_книга").select("id, инвентарный_номер, штрихкод, книга:книги(название), место:место(название), статус, состояние"),
                supabase.from("журнал_аудит").select(`id, пользователь:пользователи(фио), тип_действия, предмет_действия, дата_создания`).order("дата_создания", { ascending: false }).limit(6)
            ]);

            setData({
                ...data,
                books: b || [],
                users: u || [],
                loans: l || [],
                reservations: c || [],
                authors: auth || [],
                genres: gen || [],
                copies: copies || [],
                logs: logs || []
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
            else alert("Ошибка: " + res.message);
        });
    };

    const formatDate = (d) => d ? new Date(d).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    const formatShort = (d) => d ? new Date(d).toLocaleDateString("ru-RU") : "—";

    const navLinks = [
        { label: "Дашборд", href: "/librarian" },
        { label: "Каталог", href: "/librarian" },
        { label: "Выдачи", href: "/librarian" },
        { label: "Бронирования", href: "/librarian" },
        { label: "Личный кабинет", href: "/librarian" },
    ];

    return (
        <>
            <Header
                navLinks={navLinks}
                user={{ name: "Иван П.", initials: "ИП", role: "Старший библиотекарь • Колледж «Царицино»", email: "ivan.p@lib.ru" }}
                notifCount={5}
            />

            <div className="admin-container">
                {/* DASHBOARD */}
                {activeTab === "dashboard" && (
                    <>
                        <div className="page-header">
                            <h1>Панель управления</h1>
                            <p>Обзор библиотеки на сегодня — 21 апреля 2026</p>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card"><div className="stat-value" style={{color:'var(--cyan-400)'}}>{data.stats.books}</div><div className="stat-label">Всего книг <span style={{color:'var(--green-400)'}}>+12%</span></div></div>
                            <div className="stat-card"><div className="stat-value">{data.stats.users}</div><div className="stat-label">Читателей <span style={{color:'var(--green-400)'}}>+8%</span></div></div>
                            <div className="stat-card"><div className="stat-value" style={{color:'var(--library-400)'}}>{data.stats.loans}</div><div className="stat-label">Активных выдач <span style={{color:'var(--green-400)'}}>+3</span></div></div>
                            <div className="stat-card"><div className="stat-value" style={{color:'var(--red-400)'}}>{data.stats.overdue}</div><div className="stat-label">Просроченных</div></div>
                        </div>
                        <div className="quick-actions">
                            <button className="btn btn-primary btn-sm" onClick={()=>openModal("addBook")}>📚 Добавить книгу</button>
                            <button className="btn btn-secondary btn-sm" onClick={()=>openModal("addBook")}>📥 Внести в каталог</button>
                            <button className="btn btn-secondary btn-sm" onClick={()=>openModal("issueBook")}>🔄 Оформить выдачу</button>
                            <button className="btn btn-secondary btn-sm" onClick={()=>openModal("createRes")}>📌 Создать бронь</button>
                            <button className="btn btn-secondary btn-sm" onClick={()=>openModal("addCopy")}>📖 Добавить экземпляр</button>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:24,marginTop:32}}>
                            <div className="table-wrap">
                                <h3 style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>📊 Выдачи за неделю</h3>
                                <div style={{padding:32,color:'var(--ink-400)',textAlign:'center',height:200,display:'flex',alignItems:'center',justifyContent:'center'}}>📈 График загрузок (подключи Chart.js)</div>
                            </div>
                            <div className="table-wrap">
                                <h3 style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>🕒 Последние действия</h3>
                                <ul style={{listStyle:'none',padding:0}}>
                                    {data.logs.map((l,i)=>(
                                        <li key={i} style={{padding:'12px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)',color:'var(--ink-300)',fontSize:13,display:'flex',justifyContent:'space-between'}}>
                                            <span>{l.пользователь?.фио||'Система'}: {l.тип_действия} «{l.предмет_действия}»</span>
                                            <span style={{color:'var(--ink-500)'}}>{formatDate(l.дата_создания)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </>
                )}

                {/* CATALOG */}
                {activeTab === "catalog" && (
                    <>
                        <div className="page-header"><h1>Каталог библиотеки</h1><p>Управление книжным фондом и экземплярами</p></div>
                        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
                            {[{id:'books',label:'📚 Книги'},{id:'copies',label:'📖 Экземпляры'},{id:'authors',label:'✍️ Авторы'},{id:'genres',label:'🏷️ Жанры'}].map(t=>(
                                <button key={t.id} className={`btn ${catalogSubTab===t.id?'btn-primary':'btn-ghost'} btn-sm`} onClick={()=>setCatalogSubTab(t.id)}>{t.label}</button>
                            ))}
                            <button className="btn btn-primary btn-sm" onClick={()=>openModal(catalogSubTab==='books'?'addBook':catalogSubTab==='copies'?'addCopy':catalogSubTab==='authors'?'addAuthor':'addGenre')}>Добавить</button>
                        </div>
                        {catalogSubTab==='books' && <div className="table-wrap"><table>
                            <thead><tr><th>Название</th><th>ISBN</th><th>Издательство</th><th>Год</th><th>Язык</th><th>Всего</th><th>Дост.</th><th>Действия</th></tr></thead>
                            <tbody>{data.books.map(b=>(<tr key={b.id}><td>{b.название}</td><td>{b.isbn}</td><td>{b.издательство||'—'}</td><td>{b.год_издания}</td><td>{b.язык||'Русский'}</td><td>{b.всего_экземпляров}</td><td>{b.доступно_экземпляров}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>))}</tbody>
                        </table></div>}
                        {catalogSubTab==='copies' && <div className="table-wrap"><table>
                            <thead><tr><th>Инв. номер</th><th>Штрих-код</th><th>Книга</th><th>Место</th><th>Статус</th><th>Состояние</th><th>Действия</th></tr></thead>
                            <tbody>{data.copies.map(c=>(<tr key={c.id}><td>{c.инвентарный_номер}</td><td>{c.штрихкод||'—'}</td><td>{c.книга?.название}</td><td>{c.место?.название||'—'}</td><td>{c.статус}</td><td>{c.состояние||'—'}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>))}</tbody>
                        </table></div>}
                        {catalogSubTab==='authors' && <div className="table-wrap"><table>
                            <thead><tr><th>ФИО</th><th>Страна</th><th>Год рожд.</th><th>Год смерти</th><th>Действия</th></tr></thead>
                            <tbody>{data.authors.map(a=>(<tr key={a.id}><td>{a.фио}</td><td>{a.страна||'—'}</td><td>{a.год_рождения||'—'}</td><td>{a.год_смерти||'—'}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>))}</tbody>
                        </table></div>}
                        {catalogSubTab==='genres' && <div className="table-wrap"><table>
                            <thead><tr><th>Название</th><th>Описание</th><th>Действия</th></tr></thead>
                            <tbody>{data.genres.map(g=>(<tr key={g.id}><td>{g.название}</td><td>{g.описание||'—'}</td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>))}</tbody>
                        </table></div>}
                    </>
                )}

                {/* LOANS */}
                {activeTab === "loans" && (
                    <>
                        <div className="page-header"><h1>Управление выдачами</h1><p>Выдача, возврат, продление и изменение статусов</p></div>
                        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
                            {["Все","Активные","Просроченные","Возвращённые"].map(f=>(
                                <button key={f} className={`btn ${loanFilter===f?'btn-primary':'btn-ghost'} btn-sm`} onClick={()=>setLoanFilter(f)}>{f}</button>
                            ))}
                            <button className="btn btn-primary btn-sm" onClick={()=>openModal("issueBook")}>Оформить</button>
                        </div>
                        <div className="table-wrap">
                            <table>
                                <thead><tr><th>ID</th><th>Читатель</th><th>Книга</th><th>Дата выдачи</th><th>Вернуть до</th><th>Продлений</th><th>Статус</th><th>Действия</th></tr></thead>
                                <tbody>{data.loans.map(l=>(<tr key={l.id}><td>{l.id}</td><td>{l.пользователь?.фио||'—'}</td><td>{l.книга?.название||'—'}</td><td>{formatShort(l.дата_выдачи)}</td><td>{formatShort(l.дата_должна_вернуть)}</td><td>{l.количество_продлений||0}</td><td><span className={`status-badge ${l.статус_выдачи==='Активна'?'st-active':'st-returned'}`}><span className="dot"></span>{l.статус_выдачи}</span></td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>))}</tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* RESERVATIONS */}
                {activeTab === "reservations" && (
                    <>
                        <div className="page-header"><h1>Бронирования читателей</h1><p>Управление очередью бронирований</p></div>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                            <span className="btn btn-ghost btn-sm">Активные бронирования</span>
                            <button className="btn btn-primary btn-sm" onClick={()=>openModal("createRes")}>Создать</button>
                        </div>
                        <div className="table-wrap">
                            <table>
                                <thead><tr><th>ID</th><th>Читатель</th><th>Книга</th><th>Дата</th><th>Очередь</th><th>Срок до</th><th>Статус</th><th>Действия</th></tr></thead>
                                <tbody>{data.reservations.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.пользователь?.фио||'—'}</td><td>{r.книга?.название||'—'}</td><td>{formatDate(r.дата_бронирования)}</td><td>#{r.очередь_позиция||'—'}</td><td>{formatDate(r.дата_истечения)}</td><td><span className={`status-badge ${r.статус_бронирования==='Готова'?'st-ready':'st-waiting'}`}><span className="dot"></span>{r.статус_бронирования}</span></td><td><button className="btn btn-ghost btn-sm">✏️</button></td></tr>))}</tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* PROFILE */}
                {activeTab === "profile" && (
                    <>
                        <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:24}}>
                            <div className="avatar" style={{width:80,height:80,fontSize:24,borderRadius:20,background:'linear-gradient(135deg, var(--sage-500), var(--sage-400))'}}>ИП</div>
                            <div>
                                <h2 style={{fontSize:24,marginBottom:4}}>Иван Петров</h2>
                                <p style={{color:'var(--ink-400)'}}>Старший библиотекарь • Колледж «Царицино»</p>
                                <span className="status-badge st-ready" style={{marginTop:8}}><span className="dot"></span> Аккаунт активен</span>
                            </div>
                        </div>
                        <div className="stats-grid" style={{marginBottom:32}}>
                            <div className="stat-card"><div className="stat-value">{data.stats.added}</div><div className="stat-label">Книг добавлено</div></div>
                            <div className="stat-card"><div className="stat-value">{data.stats.processed}</div><div className="stat-label">Выдач оформлено</div></div>
                            <div className="stat-card"><div className="stat-value">{data.stats.reserved}</div><div className="stat-label">Бронирований</div></div>
                            <div className="stat-card"><div className="stat-value">{data.stats.copies}</div><div className="stat-label">Экземпляров</div></div>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(400px,1fr))',gap:24}}>
                            <div className="table-wrap"><h3 style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>👤 Личные данные</h3>
                                <div style={{padding:20,display:'grid',gap:16}}>
                                    <label><span style={{fontSize:12,color:'var(--ink-400)'}}>ФИО</span><input className="search-input" defaultValue="Иван Петров" style={{width:'100%'}} /></label>
                                    <label><span style={{fontSize:12,color:'var(--ink-400)'}}>Email</span><input className="search-input" defaultValue="ivan.p@lib.ru" style={{width:'100%'}} /></label>
                                    <label><span style={{fontSize:12,color:'var(--ink-400)'}}>Телефон</span><input className="search-input" defaultValue="+7 (916) 123-45-67" style={{width:'100%'}} /></label>
                                    <button className="btn btn-primary">Сохранить изменения</button>
                                </div>
                            </div>
                            <div className="table-wrap"><h3 style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>🔒 Безопасность</h3>
                                <div style={{padding:20,display:'grid',gap:16}}>
                                    <label><span style={{fontSize:12,color:'var(--ink-400)'}}>Текущий пароль</span><input type="password" className="search-input" style={{width:'100%'}} /></label>
                                    <label><span style={{fontSize:12,color:'var(--ink-400)'}}>Новый пароль</span><input type="password" className="search-input" style={{width:'100%'}} /></label>
                                    <button className="btn btn-secondary">Изменить пароль</button>
                                </div>
                            </div>
                            <div className="table-wrap" style={{gridColumn:'1/-1'}}><h3 style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>📋 Моя активность</h3>
                                <table>
                                    <thead><tr><th>Действие</th><th>Объект</th><th>Дата</th></tr></thead>
                                    <tbody>
                                    <tr><td>Добавлена книга</td><td>«Мастер и Маргарита»</td><td>20.04.2026 14:30</td></tr>
                                    <tr><td>Выдача оформлена</td><td>«1984» → Д. Сидоров</td><td>20.04.2026 11:15</td></tr>
                                    <tr><td>Возврат принят</td><td>«Война и мир» ← А. Ковалёва</td><td>20.04.2026 10:00</td></tr>
                                    <tr><td>Изменён статус</td><td>INV-2024-008 → Требует ремонта</td><td>19.04.2026 16:45</td></tr>
                                    </tbody>
                                </table>
                            </div>
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
                            {{addBook:"Добавить книгу",addCopy:"Добавить экземпляр",addAuthor:"Добавить автора",addGenre:"Добавить жанр",issueBook:"Оформить выдачу",createRes:"Создать бронирование",changeStatus:"Изменить статус"}[modal]}
                        </h2></div>
                        <div className="modal-body">
                            {modal==="addBook" && <form onSubmit={e=>handleSubmit(e,addBook)} style={{display:'grid',gap:16}}>
                                <label><span>Название книги *</span><input name="название" required /></label>
                                <label><span>ISBN *</span><input name="isbn" required /></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Год издания *</span><input type="number" name="год" required /></label><label><span>Издательство</span><input name="издательство" /></label></div>
                                <label><span>Автор</span><select name="автор_id">{data.authors.map(a=>(<option key={a.id} value={a.id}>{a.фио}</option>))}</select></label>
                                <label><span>Жанр</span><select name="жанр_id">{data.genres.map(g=>(<option key={g.id} value={g.id}>{g.название}</option>))}</select></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Количество страниц</span><input type="number" name="страниц" /></label><label><span>Всего экземпляров *</span><input type="number" name="всего" defaultValue="1" required /></label></div>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Сохранение...":"Сохранить"}</button>
                            </form>}
                            {modal==="addCopy" && <form onSubmit={e=>handleSubmit(e,addCopy)} style={{display:'grid',gap:16}}>
                                <label><span>Книга *</span><select name="книга_id">{data.books.map(b=>(<option key={b.id} value={b.id}>{b.название}</option>))}</select></label>
                                <label><span>Инвентарный номер *</span><input name="инвентарный_номер" required /></label>
                                <label><span>Штрих-код *</span><input name="штрихкод" required /></label>
                                <label><span>Место хранения</span><select name="место_id">{data.places?.map(p=>(<option key={p.id} value={p.id}>{p.название}</option>))||<option>Без места</option>}</select></label>
                                <label><span>Состояние</span><select name="состояние"><option>Отличное</option><option>Хорошее</option><option>Удовлетворительное</option><option>Требует ремонта</option></select></label>
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
                            {modal==="issueBook" && <form onSubmit={e=>handleSubmit(e,createLoan)} style={{display:'grid',gap:16}}>
                                <label><span>Читатель *</span><select name="пользователь_id">{data.users.map(u=>(<option key={u.id} value={u.id}>{u.фио}</option>))}</select></label>
                                <label><span>Физическая книга *</span><select name="экземпляр_id">{data.copies.map(c=>(<option key={c.id} value={c.id}>{c.инвентарный_номер} ({c.книга?.название})</option>))}</select></label>
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><label><span>Дата выдачи *</span><input type="date" name="дата_выдачи" /></label><label><span>Вернуть до *</span><input type="date" name="вернуть_до" /></label></div>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Оформление...":"Оформить"}</button>
                            </form>}
                            {modal==="createRes" && <form onSubmit={e=>handleSubmit(e,createReservation)} style={{display:'grid',gap:16}}>
                                <label><span>Читатель *</span><select name="пользователь_id">{data.users.map(u=>(<option key={u.id} value={u.id}>{u.фио}</option>))}</select></label>
                                <label><span>Книга *</span><select name="книга_id">{data.books.map(b=>(<option key={b.id} value={b.id}>{b.название}</option>))}</select></label>
                                <button type="submit" disabled={isPending} className="btn btn-primary btn-block">{isPending?"Создание...":"Забронировать"}</button>
                            </form>}
                            {modal==="changeStatus" && <form style={{display:'grid',gap:16}}>
                                <label><span>Новый статус *</span><select><option>Доступен</option><option>Выдан</option><option>Забронирован</option><option>Повреждён</option><option>Списан</option></select></label>
                                <label><span>Комментарий</span><textarea rows="2" /></label>
                                <button className="btn btn-primary btn-block">Применить</button>
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
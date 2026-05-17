"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useSession } from "@/lib/auth";

export default function CatalogPage() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [selectedBook, setSelectedBook] = useState(null);

    const { session, userName, initials } = useSession();
    const supabase = getSupabaseBrowserClient();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data, error } = await supabase
                    .from("книги")
                    .select(`
            id, название, isbn, издательство, год_издания, язык, количество_страниц,
            всего_экземпляров, доступно_экземпляров, url_изображения_книги,
            авторы:книга_автор(автор:авторы(фио)),
            жанры:книга_жанр(жанр:жанр(название))
          `)
                    .order("название", { ascending: true });

                if (error) throw error;

                if (data) {
                    setBooks(data.map(b => ({
                        id: b.id, title: b.название, isbn: b.isbn, publisher: b.издательство,
                        year: b.год_издания, lang: b.язык, pages: b.количество_страниц,
                        total: b.всего_экземпляров, available: b.доступно_экземпляров, image: b.url_изображения_книги,
                        author: b.авторы?.[0]?.автор?.фио || "Неизвестен",
                        genre: b.жанры?.[0]?.жанр?.название || "Без жанра",
                    })));
                }
            } catch (err) {
                console.error("Ошибка загрузки каталога:", err);
                // Фоллбэк, чтобы страница не ломалась при ошибке RLS
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    const filtered = books.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === "all" || b.genre.toLowerCase().includes(category.toLowerCase());
        return matchSearch && matchCat;
    });

    const categories = [
        { id: "all", label: "📚 Все книги" }, { id: "художественная", label: "📖 Художественная" },
        { id: "научная", label: "🔬 Научная" }, { id: "история", label: "🏛️ История" },
        { id: "технологии", label: "💻 Технологии" }, { id: "детская", label: "🧸 Детская" },
    ];

    return (
        <>
            <Header />
            <div className="hero">
                <h1>Электронный <span>фонд</span></h1>
                <p>Каталог изданий — {loading ? "загрузка..." : `${filtered.length} книг в вашей библиотеке`}</p>
            </div>

            <div className="container">
                {/* Профиль показывается ТОЛЬКО если пользователь вошёл */}
                {session && (
                    <div className="profile-card">
                        <div className="avatar large">{initials}</div>
                        <div className="profile-info">
                            <div className="profile-name">{userName}</div>
                            <div className="profile-ticket">Билет №2026-0421 • Читатель</div>
                            <div className="profile-verified">✅ Аккаунт верифицирован</div>
                        </div>
                        <div className="profile-stats">
                            <div className="profile-stat"><div className="profile-stat-value" style={{color:'var(--library-400)'}}>3</div><div className="profile-stat-label">Активных выдач</div></div>
                            <div className="profile-stat"><div className="profile-stat-value" style={{color:'var(--purple-400)'}}>2</div><div className="profile-stat-label">Бронирований</div></div>
                            <div className="profile-stat"><div className="profile-stat-value" style={{color:'var(--green-400)'}}>0 ₽</div><div className="profile-stat-label">Штрафы</div></div>
                        </div>
                    </div>
                )}

                <div className="search-bar">
                    <div className="search-input-wrap">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"><circle cx="7" cy="7" r="5"/><path d="M11 11L15 15"/></svg>
                        <input className="search-input" placeholder="Поиск по названию, автору, ISBN..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="category-bar">
                    {categories.map(cat => (
                        <button key={cat.id} className={`category-btn ${category === cat.id ? 'active' : ''}`} onClick={() => setCategory(cat.id)}>{cat.label}</button>
                    ))}
                </div>

                {loading ? (
                    <div style={{textAlign:'center', padding:40, color:'var(--ink-400)'}}>Загрузка каталога...</div>
                ) : (
                    <>
                        <div className="books-grid">
                            {filtered.map(book => (
                                <div key={book.id} className="book-card" onClick={() => setSelectedBook(book)}>
                                    <div className="book-cover">
                                        <div className={`book-badge ${book.available > 0 ? 'badge-available' : 'badge-unavailable'}`}>
                                            {book.available > 0 ? `Доступно: ${book.available}` : 'Нет в наличии'}
                                        </div>
                                        <div className="book-cover-inner" style={{background:`linear-gradient(135deg, #334e68, #486581)`}}>
                                            <div className="book-cover-title">{book.title}</div>
                                            <div className="book-cover-author">{book.author.split(' ').slice(-1)[0]}</div>
                                        </div>
                                    </div>
                                    <div className="book-info">
                                        <div className="book-title">{book.title}</div>
                                        <div className="book-author">{book.author}</div>
                                        <div className="book-meta">
                                            <span className="book-genre">{book.genre}</span>
                                            <span className="book-available"><span className={`num ${book.available === 0 ? 'zero' : ''}`}>{book.available}</span> / {book.total}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {filtered.length === 0 && (
                            <div className="empty-state"><div className="empty-state-icon">📚</div><h3>Книги не найдены</h3></div>
                        )}
                    </>
                )}
            </div>

            {selectedBook && (
                <div className="modal-overlay show" onClick={() => setSelectedBook(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedBook(null)}>✕</button>
                        <div className="modal-hero">
                            <div className="modal-book-cover" style={{background:`linear-gradient(135deg, #334e68, #486581)`}}>
                                <div className="modal-book-title">{selectedBook.title}</div>
                                <div className="modal-book-author">{selectedBook.author.split(' ').slice(-1)[0]}</div>
                            </div>
                            <div className="modal-title">{selectedBook.title}</div>
                            <div className="modal-author">{selectedBook.author}</div>
                        </div>
                        <div className="modal-body">
                            <div className="modal-detail-grid">
                                <div className="modal-detail"><div className="modal-detail-label">Категория</div><div className="modal-detail-value">{selectedBook.genre}</div></div>
                                <div className="modal-detail"><div className="modal-detail-label">ISBN</div><div className="modal-detail-value" style={{fontFamily:'monospace'}}>{selectedBook.isbn}</div></div>
                                <div className="modal-detail"><div className="modal-detail-label">Год издания</div><div className="modal-detail-value">{selectedBook.year}</div></div>
                                <div className="modal-detail"><div className="modal-detail-label">Доступно</div><div className="modal-detail-value" style={{color: selectedBook.available > 0 ? 'var(--green-400)' : 'var(--red-400)'}}>{selectedBook.available} / {selectedBook.total}</div></div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary btn-block" onClick={() => setSelectedBook(null)}>Закрыть</button>
                            <button className="btn btn-primary btn-block">📅 Забронировать</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
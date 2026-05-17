"use client";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();

    const handleCategory = (cat) => {
        // Переход в каталог с фильтром по жанру
        router.push(`/catalog?category=${cat}`);
    };

    return (
        <aside className="sidebar">
            <div className="user-card">
                <div className="avatar large">АК</div>
                <h3>Анна Ковалёва</h3>
                <p className="ticket">Билет №2026-0421 • Читатель</p>
                <span className="verified">Аккаунт верифицирован</span>
            </div>

            <div className="stats-grid">
                <div className="stat-box">
                    <strong>3</strong>
                    <span>Активных выдач</span>
                </div>
                <div className="stat-box">
                    <strong>2</strong>
                    <span>Бронирований</span>
                </div>
                <div className="stat-box">
                    <strong>0 ₽</strong>
                    <span>Штрафы</span>
                </div>
            </div>

            <nav className="categories">
                <button className="category-link" onClick={() => handleCategory('all')}>📚 Все книги</button>
                <button className="category-link" onClick={() => handleCategory('fiction')}>📖 Художественная</button>
                <button className="category-link" onClick={() => handleCategory('science')}>🔬 Научная</button>
                <button className="category-link" onClick={() => handleCategory('history')}>🏛️ История</button>
                <button className="category-link" onClick={() => handleCategory('tech')}>💻 Технологии</button>
                <button className="category-link" onClick={() => handleCategory('kids')}>🧸 Детская</button>
            </nav>
        </aside>
    );
}
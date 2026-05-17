export default function LandingPage() {
    return (
        <main className="landing">
            <div className="landing-hero">
                <h1>Библиотека<span>Будущего</span></h1>
                <p>Цифровая экосистема для современной библиотеки: каталог, выдача, аналитика и аудит в одном месте.</p>
                <div className="landing-actions">
                    <a href="/login" className="btn btn-primary">Войти в систему</a>
                    <a href="/catalog" className="btn btn-secondary">Открыть каталог</a>
                </div>
            </div>

            <div className="landing-features">
                <div className="feature-card">📚 Электронный фонд</div>
                <div className="feature-card">🔄 Автоматизация выдачи</div>
                <div className="feature-card">📊 Аналитика и аудит</div>
                <div className="feature-card">🛡️ Безопасность данных</div>
            </div>
        </main>
    );
}
export default function AboutModal({ onClose }) {
    return (
        <div className="modal-overlay show" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="modal-hero">
                    <h2 className="modal-title">📌 О проекте</h2>
                    <p style={{color:'var(--ink-400)', marginTop:8}}>Информационная система для цифровой трансформации библиотечного обслуживания</p>
                </div>

                <div className="modal-body">
                    <p>Данный проект представляет собой дипломную работу студентов <strong>Колледжа «Царицино»</strong>. Он разработан для демонстрации возможностей цифровой трансформации библиотечной системы с использованием современных веб-технологий.</p>
                    <p style={{marginTop:12}}>Проект включает в себя три основных компонента: стартовую страницу системы, кабинет библиотекаря для управления библиотечными процессами и личный кабинет читателя для удобного взаимодействия с библиотечным фондом.</p>

                    <h3>👨‍🎓 Команда авторов</h3>
                    <p>Над проектом работали студенты Колледжа «Царицино»:</p>
                    <div className="team-grid">
                        <div className="team-card">
                            <div className="team-avatar" style={{background:'linear-gradient(135deg,#ec9428,#f6ca7d)'}}>СТ</div>
                            <div className="team-name">Стахова Юлия</div>
                            <div className="team-role">Страница Пользователя</div>
                        </div>
                        <div className="team-card">
                            <div className="team-avatar" style={{background:'linear-gradient(135deg,#4f7e4f,#6a9a6a)'}}>ТВ</div>
                            <div className="team-name">Тен Владислав</div>
                            <div className="team-role">Страница Библиотекаря</div>
                        </div>
                        <div className="team-card">
                            <div className="team-avatar" style={{background:'linear-gradient(135deg,#334e68,#627d98)'}}>КМ</div>
                            <div className="team-name">Калинаев Максим</div>
                            <div className="team-role">Страница Администратора</div>
                        </div>
                    </div>

                    <h3>💡 Зачем нужен этот сайт?</h3>
                    <div className="about-why">
                        <div className="about-why-icon">🚀</div>
                        <div>
                            <h3 style={{marginBottom:8}}>Для облегчения работы библиотеки</h3>
                            <p>Главная цель проекта — <strong style={{color:'white'}}>облегчить</strong> и автоматизировать работу библиотечного персонала и читателей. Система позволяет:</p>
                            <ul className="goals-list" style={{listStyle:'none', margin:'10px 0'}}>
                                <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Упростить каталогизацию и поиск книг</li>
                                <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Автоматизировать выдачу и возврат изданий</li>
                                <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Облегчить бронирование книг онлайн</li>
                                <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Упростить учёт штрафов и задолженностей</li>
                                <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Сделать библиотечные услуги доступными 24/7</li>
                                <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Снизить нагрузку на библиотечный персонал</li>
                            </ul>
                        </div>
                    </div>

                    <h3>🛠️ Технологии</h3>
                    <p>Проект реализован с использованием следующих технологий:</p>
                    <ul style={{listStyle:'none', margin:'12px 0'}}>
                        <li style={{padding:'6px 0', color:'var(--ink-300)'}}>HTML5, CSS3, JavaScript (ванильный)</li>
                        <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Адаптивная вёрстка для всех устройств</li>
                        <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Проектирование реляционной базы данных</li>
                        <li style={{padding:'6px 0', color:'var(--ink-300)'}}>Модульная архитектура приложения</li>
                    </ul>
                </div>

                <div className="modal-footer" style={{borderTop:'1px solid rgba(255,255,255,0.06)', paddingTop:20, textAlign:'center'}}>
                    <div style={{fontSize:16, color:'var(--ink-300)', fontWeight:600, marginBottom:4}}>Колледж «Царицино»</div>
                    <span style={{fontSize:13, color:'var(--ink-500)'}}>Дипломный проект • 2026</span><br/>
                    <span style={{fontSize:13, color:'var(--ink-500)'}}>Стахова Ю. • Тен В. • Калинаев М.</span>
                </div>

                <div style={{padding:'0 32px 28px'}}>
                    <button className="btn btn-primary btn-block" onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
}
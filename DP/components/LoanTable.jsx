export default function LoanTable() {
    const data = [
        { book: "Мастер и Маргарита", issued: "10.04.2026", due: "10.05.2026", returned: "—", ext: 1, status: "Активна" },
        { book: "Основы JavaScript", issued: "25.03.2026", due: "25.04.2026", returned: "24.04.2026", ext: 0, status: "Возвращена" },
    ];
    return (
        <div className="table-wrapper">
            <table>
                <thead><tr><th>Книга</th><th>Дата выдачи</th><th>Вернуть до</th><th>Дата возврата</th><th>Продлений</th><th>Статус</th></tr></thead>
                <tbody>{data.map((r, i) => (
                    <tr key={i}><td>{r.book}</td><td>{r.issued}</td><td>{r.due}</td><td>{r.returned}</td><td>{r.ext}</td><td><span className={`status ${r.status === 'Активна' ? 'active' : 'returned'}`}>{r.status}</span></td></tr>
                ))}</tbody>
            </table>
        </div>
    );
}
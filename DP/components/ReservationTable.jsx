export default function ReservationTable() {
    const data = [{ book: "1984", date: "01.05.2026", pos: 2, expiry: "15.05.2026", status: "Ожидание" }];
    return (
        <div className="table-wrapper">
            <table>
                <thead><tr><th>Книга</th><th>Дата бронирования</th><th>Позиция в очереди</th><th>Срок брони</th><th>Статус</th><th>Действия</th></tr></thead>
                <tbody>{data.map((r, i) => (
                    <tr key={i}><td>{r.book}</td><td>{r.date}</td><td>#{r.pos}</td><td>{r.expiry}</td><td><span className="status pending">{r.status}</span></td><td><button className="btn btn-sm">📅 Забронировать</button></td></tr>
                ))}</tbody>
            </table>
        </div>
    );
}
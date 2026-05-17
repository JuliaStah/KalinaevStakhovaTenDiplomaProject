export default function FinesTable() {
    return (
        <div className="table-wrapper">
            <table>
                <thead><tr><th>Причина</th><th>Сумма</th><th>Дата</th><th>Книга</th><th>Статус</th></tr></thead>
                <tbody><tr><td colSpan="5" className="empty-row">Задолженность отсутствует</td></tr></tbody>
            </table>
        </div>
    );
}
"use client";
import { useState } from "react";

export default function SettingsForm() {
    const [form, setForm] = useState({ name: "Анна Ковалёва", email: "anna.k@mail.ru", phone: "+7 900 123 45 67" });
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); alert("Данные сохранены"); };

    return (
        <form onSubmit={handleSubmit} className="settings-form">
            <h3>Личные данные</h3>
            <label>ФИО<input name="name" value={form.name} onChange={handleChange} /></label>
            <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} /></label>
            <label>Телефон<input name="phone" value={form.phone} onChange={handleChange} /></label>
            <button type="submit" className="btn">Сохранить изменения</button>
        </form>
    );
}
'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ✅ Книги
export async function addBook(formData) {
    const supabase = await getSupabaseServerClient();
    const total = parseInt(formData.get('всего')) || 0;
    const { error } = await supabase.from('книги').insert({
        название: formData.get('название'),
        isbn: formData.get('isbn'),
        издательство: formData.get('издательство'),
        год_издания: parseInt(formData.get('год')),
        язык: formData.get('язык') || 'Русский',
        количество_страниц: parseInt(formData.get('страниц')) || null,
        всего_экземпляров: total,
        доступно_экземпляров: total,
    });
    if (error) return { success: false, message: error.message };
    revalidatePath('/admin');
    revalidatePath('/librarian');
    return { success: true };
}

// ✅ Авторы
export async function addAuthor(formData) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from('авторы').insert({
        фио: formData.get('фио'),
        страна: formData.get('страна'),
        год_рождения: parseInt(formData.get('год_рожд')) || null,
        год_смерти: parseInt(formData.get('год_смерти')) || null,
    });
    if (error) return { success: false, message: error.message };
    revalidatePath('/admin');
    revalidatePath('/librarian');
    return { success: true };
}

// ✅ Жанры
export async function addGenre(formData) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from('жанр').insert({
        название: formData.get('название'),
        описание: formData.get('описание'),
    });
    if (error) return { success: false, message: error.message };
    revalidatePath('/admin');
    revalidatePath('/librarian');
    return { success: true };
}

// ✅ Пользователи
export async function addUser(formData) {
    const supabase = await getSupabaseServerClient();
    // ⚠️ Замени ID ролей на те, что в твоей таблице `роли`
    const roleMap = { 'Читатель': 4, 'Библиотекарь': 3, 'Старший библиотекарь': 2, 'Администратор': 1 };
    const { error } = await supabase.from('пользователи').insert({
        фио: formData.get('фио'),
        email: formData.get('email'),
        phone: formData.get('телефон') || null,
        роль_id: roleMap[formData.get('роль')] || 4,
        заблокирован: formData.get('заблокирован') === 'Да',
        причина_блокировки: formData.get('причина') || null,
    });
    if (error) return { success: false, message: error.message };
    revalidatePath('/admin');
    return { success: true };
}

// ✅ Выдачи
export async function createLoan(formData) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from('выдачи').insert({
        пользователь_id: formData.get('пользователь_id'),
        физическая_книга_id: formData.get('экземпляр_id'),
        дата_выдачи: formData.get('дата_выдачи'),
        дата_должна_вернуть: formData.get('вернуть_до'),
        статус_выдачи: 'Активна',
    });
    if (error) return { success: false, message: error.message };
    revalidatePath('/librarian');
    return { success: true };
}

// ✅ Бронирования
export async function createReservation(formData) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from('бронирования').insert({
        пользователь_id: formData.get('пользователь_id'),
        книга_id: formData.get('книга_id'),
        статус_бронирования: formData.get('статус') || 'Ожидает',
        очередь_позиция: 1,
        дата_истечения: formData.get('срок_до'),
    });
    if (error) return { success: false, message: error.message };
    revalidatePath('/librarian');
    return { success: true };
}

// ✅ Штрафы
export async function addFine(formData) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.from('штраф').insert({
        выдача_id: formData.get('выдача_id'),
        сумма: parseFloat(formData.get('сумма')),
        причина: formData.get('причина'),
        статус: formData.get('статус') || 'Не оплачен',
    });
    if (error) return { success: false, message: error.message };
    revalidatePath('/admin');
    return { success: true };
}
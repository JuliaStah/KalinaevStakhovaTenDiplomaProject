'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData) {
    const supabase = await getSupabaseServerClient();

    // Получаем текущего пользователя
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Не авторизован" };

    const { error } = await supabase
        .from("пользователи")
        .update({
            фио: formData.get("фио"),
            phone: formData.get("телефон") || null,
            дата_обновления: new Date().toISOString()
        })
        .eq("email", user.email);

    if (error) return { success: false, message: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/librarian");
    return { success: true };
}

export async function changePassword(formData) {
    const supabase = await getSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({
        password: formData.get("новый_пароль")
    });

    if (error) return { success: false, message: error.message };
    return { success: true };
}
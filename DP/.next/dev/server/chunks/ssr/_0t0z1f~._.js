module.exports = [
"[project]/lib/supabase/server.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSupabaseServerClient",
    ()=>getSupabaseServerClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function getSupabaseServerClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://gkkduebznxlnbfboubui.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_8DdkxjPx4YKRFPPP6o784A_OISW6x_W"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // Игнорируем ошибки при SSG/статической генерации
                }
            }
        }
    });
}
}),
"[project]/actions/library.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"401b4a8e2816cf68b93dde8c2f3ce2bbe47eae0027":{"name":"addBook"},"407ef1aa14c513f9ff536c28f484ea14dcea11c6e5":{"name":"addFine"},"40999200b76c6b70c038de8b60db7f927e18e96db4":{"name":"addAuthor"},"40afd4f52c68ca8de33ab8e267ef705ae606927a11":{"name":"addGenre"},"40b6ffab3b686a5bcd24182f81612d9e98fe8c1c83":{"name":"createReservation"},"40be6c91b2ae67b77dfd16668aaaf82820bd60df40":{"name":"addUser"},"40e8611a3a4a15abdde68c881923d4294e45d5ebad":{"name":"createLoan"}},"actions/library.js",""] */ __turbopack_context__.s([
    "addAuthor",
    ()=>addAuthor,
    "addBook",
    ()=>addBook,
    "addFine",
    ()=>addFine,
    "addGenre",
    ()=>addGenre,
    "addUser",
    ()=>addUser,
    "createLoan",
    ()=>createLoan,
    "createReservation",
    ()=>createReservation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function addBook(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSupabaseServerClient"])();
    const total = parseInt(formData.get('всего')) || 0;
    const { error } = await supabase.from('книги').insert({
        название: formData.get('название'),
        isbn: formData.get('isbn'),
        издательство: formData.get('издательство'),
        год_издания: parseInt(formData.get('год')),
        язык: formData.get('язык') || 'Русский',
        количество_страниц: parseInt(formData.get('страниц')) || null,
        всего_экземпляров: total,
        доступно_экземпляров: total
    });
    if (error) return {
        success: false,
        message: error.message
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/librarian');
    return {
        success: true
    };
}
async function addAuthor(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSupabaseServerClient"])();
    const { error } = await supabase.from('авторы').insert({
        фио: formData.get('фио'),
        страна: formData.get('страна'),
        год_рождения: parseInt(formData.get('год_рожд')) || null,
        год_смерти: parseInt(formData.get('год_смерти')) || null
    });
    if (error) return {
        success: false,
        message: error.message
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/librarian');
    return {
        success: true
    };
}
async function addGenre(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSupabaseServerClient"])();
    const { error } = await supabase.from('жанр').insert({
        название: formData.get('название'),
        описание: formData.get('описание')
    });
    if (error) return {
        success: false,
        message: error.message
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/librarian');
    return {
        success: true
    };
}
async function addUser(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSupabaseServerClient"])();
    // ⚠️ Замени ID ролей на те, что в твоей таблице `роли`
    const roleMap = {
        'Читатель': 4,
        'Библиотекарь': 3,
        'Старший библиотекарь': 2,
        'Администратор': 1
    };
    const { error } = await supabase.from('пользователи').insert({
        фио: formData.get('фио'),
        email: formData.get('email'),
        phone: formData.get('телефон') || null,
        роль_id: roleMap[formData.get('роль')] || 4,
        заблокирован: formData.get('заблокирован') === 'Да',
        причина_блокировки: formData.get('причина') || null
    });
    if (error) return {
        success: false,
        message: error.message
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
    return {
        success: true
    };
}
async function createLoan(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSupabaseServerClient"])();
    const { error } = await supabase.from('выдачи').insert({
        пользователь_id: formData.get('пользователь_id'),
        физическая_книга_id: formData.get('экземпляр_id'),
        дата_выдачи: formData.get('дата_выдачи'),
        дата_должна_вернуть: formData.get('вернуть_до'),
        статус_выдачи: 'Активна'
    });
    if (error) return {
        success: false,
        message: error.message
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/librarian');
    return {
        success: true
    };
}
async function createReservation(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSupabaseServerClient"])();
    const { error } = await supabase.from('бронирования').insert({
        пользователь_id: formData.get('пользователь_id'),
        книга_id: formData.get('книга_id'),
        статус_бронирования: formData.get('статус') || 'Ожидает',
        очередь_позиция: 1,
        дата_истечения: formData.get('срок_до')
    });
    if (error) return {
        success: false,
        message: error.message
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/librarian');
    return {
        success: true
    };
}
async function addFine(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getSupabaseServerClient"])();
    const { error } = await supabase.from('штраф').insert({
        выдача_id: formData.get('выдача_id'),
        сумма: parseFloat(formData.get('сумма')),
        причина: formData.get('причина'),
        статус: formData.get('статус') || 'Не оплачен'
    });
    if (error) return {
        success: false,
        message: error.message
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin');
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    addBook,
    addAuthor,
    addGenre,
    addUser,
    createLoan,
    createReservation,
    addFine
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addBook, "401b4a8e2816cf68b93dde8c2f3ce2bbe47eae0027", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addAuthor, "40999200b76c6b70c038de8b60db7f927e18e96db4", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addGenre, "40afd4f52c68ca8de33ab8e267ef705ae606927a11", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addUser, "40be6c91b2ae67b77dfd16668aaaf82820bd60df40", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createLoan, "40e8611a3a4a15abdde68c881923d4294e45d5ebad", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createReservation, "40b6ffab3b686a5bcd24182f81612d9e98fe8c1c83", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addFine, "407ef1aa14c513f9ff536c28f484ea14dcea11c6e5", null);
}),
"[project]/.next-internal/server/app/(admin)/admin/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/library.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/library.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/(admin)/admin/page/actions.js { ACTIONS_MODULE0 => \"[project]/actions/library.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "401b4a8e2816cf68b93dde8c2f3ce2bbe47eae0027",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addBook"],
    "407ef1aa14c513f9ff536c28f484ea14dcea11c6e5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addFine"],
    "40999200b76c6b70c038de8b60db7f927e18e96db4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addAuthor"],
    "40afd4f52c68ca8de33ab8e267ef705ae606927a11",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addGenre"],
    "40b6ffab3b686a5bcd24182f81612d9e98fe8c1c83",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createReservation"],
    "40be6c91b2ae67b77dfd16668aaaf82820bd60df40",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addUser"],
    "40e8611a3a4a15abdde68c881923d4294e45d5ebad",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createLoan"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$admin$292f$admin$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(admin)/admin/page/actions.js { ACTIONS_MODULE0 => "[project]/actions/library.js [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$actions$2f$library$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/actions/library.js [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_0t0z1f~._.js.map
import '@/styles/globals.css';

export const metadata = {
    title: 'БиблиотекаБудущего',
    description: 'Информационная система для цифровой трансформации библиотечного обслуживания',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
        <body suppressHydrationWarning={true}>{children}</body>
        </html>
    );
}
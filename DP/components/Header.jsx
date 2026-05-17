"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function Header() {
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const headerRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();
    const { session, userName, initials, roleName, userEmail, loading } = useSession();
    const supabase = getSupabaseBrowserClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login"; // Прямой редирект надёжнее очищает состояние
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (headerRef.current && !headerRef.current.contains(e.target)) {
                setNotifOpen(false); setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) return <header className="header" style={{background:'rgba(10,25,41,0.9)', height:64}} />;

    const isAuth = !!session;
    const navItems = [
        { label: "Главная", href: "/" },
        { label: "Каталог", href: "/catalog" },
        ...(isAuth ? [{ label: "Личный кабинет", href: "/dashboard" }] : [])
    ];

    return (
        <header className="header" ref={headerRef}>
            <a href="/" className="logo" onClick={e => { e.preventDefault(); router.push("/"); }}>
                <svg width="36" height="36" viewBox="0 0 40 40" fill="none" style={{flexShrink:0}}>
                    <rect x="4" y="8" width="14" height="24" rx="2" fill="#ec9428" opacity="0.9"/>
                    <rect x="10" y="6" width="14" height="24" rx="2" fill="#f6ca7d" opacity="0.9"/>
                    <rect x="16" y="10" width="14" height="24" rx="2" fill="#4f7e4f" opacity="0.9"/>
                </svg>
                Библиотека<span>Будущего</span>
            </a>

            <nav className="nav">
                {navItems.map(link => (
                    <button key={link.href} className={`nav-link ${pathname === link.href ? 'active' : ''}`} onClick={() => router.push(link.href)}>
                        {link.label}
                    </button>
                ))}
            </nav>

            <div className="header-right">
                {isAuth ? (
                    <>
                        <div className="dropdown">
                            <button className="icon-btn" onClick={() => {setNotifOpen(!notifOpen); setProfileOpen(false);}}>🔔<span className="badge">3</span></button>
                            {notifOpen && <div className="dropdown-menu"><div className="dropdown-header">🔔 Уведомления</div><button className="dropdown-item">Прочитать все</button></div>}
                        </div>
                        <div className={`dropdown ${profileOpen ? 'open' : ''}`}>
                            <button className="user-btn" onClick={() => {setProfileOpen(!profileOpen); setNotifOpen(false);}}>
                                <div className="avatar">{initials}</div>
                                <div style={{textAlign:'left', marginLeft:6}}>
                                    <div className="user-name">{userName} ▼</div>
                                    <div style={{fontSize:11,color:'var(--ink-400)'}}>{roleName}</div>
                                </div>
                            </button>
                            <div className="dropdown-menu">
                                <div className="dropdown-header">
                                    <div className="dropdown-header-name">{userName}</div>
                                    <div className="dropdown-header-email">{userEmail}</div>
                                </div>
                                <button className="dropdown-item" onClick={() => router.push("/dashboard")}>👤 Личный кабинет</button>
                                <div className="dropdown-divider"/>
                                <button className="dropdown-item danger" onClick={handleLogout}>🚪 Выйти</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => router.push("/login")}>Войти</button>
                )}
            </div>
        </header>
    );
}
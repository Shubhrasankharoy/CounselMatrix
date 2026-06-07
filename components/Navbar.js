"use client"
import { useEffect, useRef, useState } from 'react';
import { toggleDarkMode } from '@/utils/otherSlice';
import { GraduationCap, Moon, Sun, User, Bookmark, Trash2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { AUTH } from '@/firebase';
import { clearUser } from '@/utils/userSlice';
import { removePreference } from '@/utils/cardSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const dark = useSelector(state => state.other.darkMode);
    const dispatch = useDispatch();
    const router = useRouter();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [cardOpen, setCardOpen] = useState(false);
    const dropdownRef = useRef(null);


    const bg = dark ? "bg-slate-900" : "bg-slate-50";
    const card = dark ? "bg-slate-800/80 border-slate-700" : "bg-white border-slate-200";
    const text = dark ? "text-slate-100" : "text-slate-900";
    const sub = dark ? "text-slate-400" : "text-slate-500";
    const head = dark ? "bg-slate-750 text-slate-300 border-slate-700" : "bg-slate-50 text-slate-600 border-slate-200";
    const rowBase = dark ? "border-slate-700/50 text-slate-300 hover:bg-slate-700/40" : "border-slate-100 text-slate-700 hover:bg-blue-50/40";


    const userDetails = useSelector(state => state.userDetails);
    const cardItems = useSelector(state => state.card.items);
    const cardCount = cardItems.length;
    const isLoggedIn = Boolean(userDetails?.isLoggedIn && userDetails?.user);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setUserMenuOpen(false);
                setCardOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleUserMenu = () => {
        setCardOpen(false);
        setUserMenuOpen(prev => !prev);
    };

    const handleToggleCard = () => {
        setUserMenuOpen(false);
        setCardOpen(prev => !prev);
    };

    const handleLogin = () => {
        setUserMenuOpen(false);
        router.push('/login');
    };

    const handleLogout = async () => {
        try {
            await signOut(AUTH);
            dispatch(clearUser());
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setUserMenuOpen(false);
        }
    };

    return (
        <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${dark ? "bg-slate-900/90 border-slate-700" : "bg-white/90 border-slate-200"} shadow-sm`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <div onClick={() => { router.push('/') }} className="flex items-center gap-3 cursor-pointer">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <div>
                        <span className={`text-base font-bold tracking-tight ${text}`}>Counsel </span>
                        <span className="text-base font-light text-blue-500 ml-1">Matrix</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative" ref={dropdownRef}>
                    <Link href="/filter" className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${dark ? "bg-slate-700 text-slate-100 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                        Filter
                    </Link>

                    <button
                        onClick={handleToggleCard}
                        className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all focus:outline-none ${dark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                        aria-label="Toggle preference card"
                    >
                        <Bookmark size={18} className={dark ? "text-slate-200" : "text-blue-600"} />
                        {cardCount > 0 && (
                            <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                                {cardCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => dispatch(toggleDarkMode())}
                        className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all focus:outline-none ${dark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                        aria-label="Toggle preference card"
                    >
                        {dark ? <Moon size={18} /> : <Sun className="text-black" size={18} />}
                    </button>

                    <button
                        onClick={handleToggleUserMenu}
                        className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all focus:outline-none ${dark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                        aria-label="Toggle user menu"
                    >
                        {isLoggedIn && userDetails.user.photoURL ? (
                            <Image
                                src={userDetails.user.photoURL}
                                alt="User avatar"
                                width={36}
                                height={36}
                                className="rounded-full"
                            />
                        ) : (
                            <User size={18} className={dark ? "text-slate-300" : "text-blue-600"} />
                        )}
                    </button>

                    {cardOpen && (
                        <div className={`absolute right-24 top-full mt-2 w-80 rounded-3xl border p-4 shadow-xl ${dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Bookmark size={16} className="text-blue-500" />
                                    <span className="text-sm font-semibold">Preference Card</span>
                                </div>
                                    <div onClick={()=>{router.push('/preferences')}} className={`w-8 h-8 rounded-xl ${dark ? "bg-slate-700" : "bg-slate-100"} flex items-center justify-center cursor-pointer`}>
                                        <ExternalLink size={14} className="text-blue-500"/>
                                    </div>
                            </div>
                            {cardCount === 0 ? (
                                <p className="text-sm text-slate-500">No saved preferences yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {cardItems.map(item => (
                                        <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border p-3 bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold">{item.institute || 'Unknown institute'}</p>
                                                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{item.program || 'No program selected'}</p>
                                            </div>
                                            <button
                                                onClick={() => dispatch(removePreference(item.id))}
                                                className="text-slate-400 hover:text-red-500"
                                                aria-label="Remove preference"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {userMenuOpen && (
                        <div className={`absolute right-0 top-full mt-2 w-72 rounded-3xl border p-4 shadow-xl ${dark ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-200 bg-white text-slate-900"}`}>
                            {isLoggedIn ? (
                                <>
                                    <div className="flex items-center gap-3">
                                        {userDetails.user.photoURL ? (
                                            <Image
                                                src={userDetails.user.photoURL}
                                                alt="User avatar"
                                                width={48}
                                                height={48}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                <User size={20} />
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">
                                                {userDetails.user.displayName || 'User'}
                                            </p>
                                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                                {userDetails.user.email || 'No email provided'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t pt-4">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                                        >
                                            Log out
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">Guest user</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Please login to see your profile.</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t pt-4">
                                        <button
                                            onClick={handleLogin}
                                            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        >
                                            Login
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

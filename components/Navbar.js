"use client"
import { useEffect, useRef, useState } from 'react';
import { toggleDarkMode } from '@/utils/otherSlice';
import { GraduationCap, Moon, Sun, User } from 'lucide-react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { AUTH } from '@/firebase';
import { clearUser } from '@/utils/userSlice';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const dark = useSelector(state => state.other.darkMode)
    const dispatch = useDispatch()
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const text = dark ? "text-slate-100" : "text-slate-900";
    const userDetails = useSelector(state => state.userDetails)
    const isLoggedIn = Boolean(userDetails?.isLoggedIn && userDetails?.user)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleMenu = () => setMenuOpen((prev) => !prev);
    const handleLogin = () => {
        setMenuOpen(false);
        router.push('/login');
    };

    const handleLogout = async () => {
        try {
            await signOut(AUTH);
            dispatch(clearUser());
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            setMenuOpen(false);
        }
    };

    return (
        <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${dark ? "bg-slate-900/90 border-slate-700" : "bg-white/90 border-slate-200"} shadow-sm`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <GraduationCap size={18} className="text-white" />
                    </div>
                    <div>
                        <span className={`text-base font-bold tracking-tight ${text}`}>Counsel </span>
                        <span className="text-base font-light text-blue-500 ml-1">Matrix</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 relative" ref={dropdownRef}>
                    <button
                        onClick={() => dispatch(toggleDarkMode())}
                        className={`p-2 rounded-xl transition-all ${dark ? "bg-slate-700 text-yellow-400 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    >
                        {dark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>

                    <button
                        onClick={handleToggleMenu}
                        className={`relative flex items-center justify-center w-9 h-9 rounded-xl transition-all focus:outline-none ${dark ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
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
                            <User size={16} className={dark ? "text-slate-300" : "text-blue-600"} />
                        )}
                    </button>

                    {menuOpen && (
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

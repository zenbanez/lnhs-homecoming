import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';

interface HeaderProps {
    onToggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export default function Header({ onToggleSidebar, isSidebarOpen }: HeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user, userData } = useAuth();

    const isDashboardRoute = location.pathname.startsWith('/dashboard');

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Program', path: '/program' },
        { name: 'Gala Night', path: '/gala' },
        { name: 'May Fun Run', path: '/funrun' },
        { name: 'Memory Album', path: '/album' },
        { name: 'In Memoriam', path: '/memoriam' },
    ];

    const handleLogout = () => {
        signOut(auth);
    };

    return (
        <header className="sticky top-0 z-50 bg-anniversary-black/80 backdrop-blur-md border-b border-anniversary-gold/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        {isDashboardRoute && (
                            <button
                                onClick={onToggleSidebar}
                                className="lg:hidden p-2 text-anniversary-gold hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        )}
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tighter text-white">
                                LNHS<span className="text-anniversary-gold">'76</span>
                            </span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-anniversary-gold ${location.pathname === link.path ? 'text-anniversary-gold' : 'text-gray-400'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                to="/dashboard"
                                className="text-sm font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-anniversary-gold to-yellow-500 text-black hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                            >
                                Dashboard
                            </Link>
                        )}
                        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10 uppercase tracking-widest text-[10px] font-black">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-white font-medium">{userData?.displayName || user.email?.split('@')[0]}</div>
                                        <div className="flex gap-2 justify-end mt-0.5">
                                            <Link to="/profile" className="bg-gradient-to-r from-anniversary-gold to-yellow-500 text-black hover:opacity-90 flex items-center gap-1 text-[9px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
                                                Profile
                                            </Link>
                                            <button onClick={handleLogout} className="text-red-500 hover:text-red-400 flex items-center gap-1 text-[9px] uppercase font-bold">
                                                <LogOut size={10} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Link to="/login" className="bg-anniversary-gold text-black px-4 py-1.5 rounded-full hover:bg-yellow-500 transition-colors">
                                    Login
                                </Link>
                            )}
                        </div>
                    </nav>

                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-400 hover:text-anniversary-gold transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden bg-anniversary-black border-b border-white/10 p-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-lg font-medium text-gray-300 hover:text-anniversary-gold"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            to="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block text-lg font-bold bg-gradient-to-r from-anniversary-gold to-yellow-500 text-black px-4 py-2 rounded-lg text-center shadow-md"
                        >
                            Dashboard
                        </Link>
                    )}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                        {user ? (
                            <>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-anniversary-gold font-bold flex items-center gap-2"
                                >
                                    <UserIcon size={20} /> My Profile
                                </Link>
                                <button onClick={handleLogout} className="text-red-500 font-bold flex items-center gap-2">
                                    <LogOut size={20} /> Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-anniversary-gold font-bold">
                                Login / Join
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

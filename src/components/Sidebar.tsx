import { Link, useLocation } from 'react-router-dom';
import { Users, ClipboardList, Banknote, UtensilsCrossed, Shirt, Package } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { name: 'Alumni Tracker', path: '/dashboard/alumni', icon: Users },
    { name: 'Secretariat View', path: '/dashboard/secretariat', icon: ClipboardList },
    { name: 'Finance (Ways & Means)', path: '/dashboard/finance', icon: Banknote },
    { name: 'Venue & Food', path: '/dashboard/venue', icon: UtensilsCrossed },
    { name: 'T-Shirt Orders', path: '/dashboard/tshirts', icon: Shirt },
    { name: 'Resource Inventory', path: '/dashboard/inventory', icon: Package },
];

export default function Sidebar({ isOpen, closeSidebar }: { isOpen: boolean, closeSidebar: () => void }) {
    const location = useLocation();

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeSidebar} />
            )}
            <aside className={clsx(
                "fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-black border-r border-anniversary-gold/20 transform transition-transform duration-300 z-50 md:translate-x-0 overflow-y-auto",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <nav className="p-4 space-y-1">
                    <div className="text-xs uppercase font-bold text-gray-500 mb-4 tracking-wider">Committees</div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                                    isActive
                                        ? "bg-anniversary-gold/10 text-anniversary-gold"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <Icon size={18} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </aside>
        </>
    );
}

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <div className="min-h-screen flex flex-col bg-anniversary-black">
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
            <div className="flex flex-1 overflow-hidden">
                {isDashboard && (
                    <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
                )}
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-[calc(100vh-4rem-12rem)]">
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
}

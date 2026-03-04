import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Users, DollarSign, Calendar, Music, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardHome() {
    const { userData } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalAlumni: 0,
        confirmed: 0,
        totalCollected: 0,
        pendingPayments: 0,
        galaAttendees: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            // Fetch total alumni & confirmed
            const alumniSnapshot = await getDocs(collection(db, 'classmates'));
            const total = alumniSnapshot.size;
            const confirmedCount = alumniSnapshot.docs.filter(d => d.data().status === 'Confirmed').length;

            // Fetch payments stats
            const paymentsSnapshot = await getDocs(collection(db, 'payments'));
            const collected = paymentsSnapshot.docs
                .filter(d => d.data().status === 'Approved')
                .reduce((acc, d) => acc + (d.data().amount || 0), 0);
            const pending = paymentsSnapshot.docs.filter(d => d.data().status === 'Pending').length;

            // Fetch Gala stats
            const galaSnapshot = await getDocs(collection(db, 'gala_registrations'));
            const totalGala = galaSnapshot.size;

            setStats({
                totalAlumni: total,
                confirmed: confirmedCount,
                totalCollected: collected,
                pendingPayments: pending,
                galaAttendees: totalGala
            });
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    // Homecoming Countdown (July 2, 2026)
    const calculateCountdown = () => {
        const target = new Date('2026-07-02T00:00:00');
        const now = new Date();
        const diff = target.getTime() - now.getTime();
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    };

    const QuickAction = ({ icon: Icon, title, desc, path, color }: any) => (
        <button
            onClick={() => navigate(path)}
            className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-anniversary-gold/30 hover:bg-white/10 transition-all text-left relative overflow-hidden"
        >
            <div className={`p-3 rounded-lg ${color} w-fit mb-4`}>
                <Icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
            <ArrowRight className="absolute right-6 bottom-6 text-gray-600 group-hover:text-anniversary-gold transition-colors" size={20} />
        </button>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                    <Loader2 className="animate-spin text-anniversary-gold" size={48} />
                    <p className="italic font-medium">Syncing Coordination Stats...</p>
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-black to-[#0a0a0a] border border-white/10 p-8 md:p-12">
                        <div className="relative z-10 max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                                Welcome back, <span className="text-anniversary-gold">{userData?.displayName?.split(' ')[0] || 'Batchmate'}</span>.
                            </h1>
                            <p className="text-lg text-gray-400 leading-relaxed font-medium">
                                You are in the <span className="text-white italic">Coordination Hub</span> for LNHS Class of '76.
                                We are tracking progress as we approach our historic Golden Jubilee.
                            </p>
                        </div>

                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                            <div className="absolute inset-0 bg-anniversary-gold blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-black border border-white/10 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-blue-900/30 text-blue-400 rounded-lg"><Calendar size={20} /></div>
                                <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded">GOAL: JULY 2</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{calculateCountdown()}</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Days to Homecoming</div>
                        </div>

                        <div className="bg-black border border-white/10 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-green-900/30 text-green-400 rounded-lg"><Users size={20} /></div>
                                <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded">Confirmed: {stats.confirmed}</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.totalAlumni}</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Batchmates Tracked</div>
                        </div>

                        <div className="bg-black border border-white/10 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-anniversary-gold/20 text-anniversary-gold rounded-lg"><DollarSign size={20} /></div>
                                {stats.pendingPayments > 0 && (
                                    <span className="text-xs font-bold text-yellow-500 animate-pulse bg-yellow-900/30 px-2 py-1 rounded">
                                        {stats.pendingPayments} PENDING
                                    </span>
                                )}
                            </div>
                            <div className="text-3xl font-bold text-white">₱{stats.totalCollected.toLocaleString()}</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Total Funds Verified</div>
                        </div>

                        <div className="bg-black border border-white/10 p-6 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-purple-900/30 text-purple-400 rounded-lg"><Music size={20} /></div>
                                <span className="text-xs font-bold text-purple-400 bg-purple-900/20 px-2 py-1 rounded">Live Count</span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stats.galaAttendees}</div>
                            <div className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">Gala Attendees</div>
                        </div>
                    </div>

                    {/* Hub Highlights / Actions */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">Coordination Highlights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <QuickAction
                                icon={Users}
                                title="Alumni Tracker"
                                desc="Manage batchmate records, attendance status, and verified payments."
                                path="/dashboard/alumni"
                                color="bg-green-900/40 text-green-400"
                            />
                            <QuickAction
                                icon={DollarSign}
                                title="Finance Dashboard"
                                desc="Verify collection status, approve P500 fees, and track contributions."
                                path="/dashboard/finance"
                                color="bg-anniversary-gold/20 text-anniversary-gold"
                            />
                            <QuickAction
                                icon={Calendar}
                                title="Program Planning"
                                desc="Coordinate event schedules, venue details, and anniversary programs."
                                path="/program"
                                color="bg-blue-900/40 text-blue-400"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

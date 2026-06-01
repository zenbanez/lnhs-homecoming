import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, Search, Filter, Trash2, CheckCircle2, XCircle, DollarSign, Users, Award, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface ShirtOrder {
    size: string;
    quantity: number;
}

interface Registration {
    id: string;
    name: string;
    email: string;
    category: string;
    shirts: ShirtOrder[];
    paymentMethod: 'GCash' | 'Cash';
    refNumber: string;
    paymentStatus: 'Pending' | 'Paid';
    userId: string;
    amountPaid: number;
    timestamp: any;
}

export default function FunRunRegistrations() {
    const { userData } = useAuth();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter and Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [methodFilter, setMethodFilter] = useState('All');

    const isCommittee = userData?.role === 'admin' || userData?.role === 'committee';

    useEffect(() => {
        const q = query(collection(db, 'funrun_registrations'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Registration[] = [];
            snapshot.forEach((d) => {
                data.push({ id: d.id, ...d.data() } as Registration);
            });
            setRegistrations(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching funrun registrations:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleUpdatePaymentStatus = async (regId: string, currentStatus: 'Pending' | 'Paid') => {
        if (!isCommittee) return;
        const newStatus = currentStatus === 'Pending' ? 'Paid' : 'Pending';
        try {
            const regRef = doc(db, 'funrun_registrations', regId);
            await updateDoc(regRef, {
                paymentStatus: newStatus
            });
        } catch (error) {
            console.error("Error updating payment status:", error);
            alert("Failed to update payment status.");
        }
    };

    const handleDeleteRegistration = async (reg: Registration) => {
        if (!isCommittee) return;
        if (!window.confirm(`Are you sure you want to cancel the registration for "${reg.name}"?`)) return;

        try {
            await deleteDoc(doc(db, 'funrun_registrations', reg.id));
        } catch (error) {
            console.error("Error deleting registration:", error);
            alert("Failed to delete registration.");
        }
    };

    // Calculations for statistics
    const totalCount = registrations.length;
    const paidCount = registrations.filter(r => r.paymentStatus === 'Paid').length;
    const pendingCount = totalCount - paidCount;

    // Calculate dynamic fee collection
    const totalRevenueExpected = registrations.reduce((acc, r) => {
        return acc + (r.amountPaid || 450);
    }, 0);
    const totalRevenueCollected = registrations
        .filter(r => r.paymentStatus === 'Paid')
        .reduce((acc, r) => acc + (r.amountPaid || 450), 0);

    // Calculate shirt sizes breakdown
    const shirtBreakdown: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    registrations.forEach(r => {
        if (Array.isArray(r.shirts)) {
            r.shirts.forEach(s => {
                const size = s.size || 'L';
                shirtBreakdown[size] = (shirtBreakdown[size] || 0) + (s.quantity || 0);
            });
        }
    });

    const categoryBreakdown = {
        '3K': registrations.filter(r => r.category === '3K').length,
        '5K': registrations.filter(r => r.category === '5K').length,
        '10K': registrations.filter(r => r.category === '10K').length,
    };

    // Filter registrations based on active selections
    const filteredRegistrations = registrations.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (r.refNumber && r.refNumber.includes(searchTerm));
        const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
        const matchesStatus = statusFilter === 'All' || r.paymentStatus === statusFilter;
        const matchesMethod = methodFilter === 'All' || r.paymentMethod === methodFilter;

        return matchesSearch && matchesCategory && matchesStatus && matchesMethod;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                        <Activity size={32} /> June Fun Run Registration Hub
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Real-time tracking of public & classmates signups, t-shirt sizes, and collections.
                    </p>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card variant="flat" className="p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-blue-900/30 text-blue-400 rounded-xl"><Users size={22} /></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Registrations</span>
                            <span className="text-2xl font-bold text-white mt-1">{totalCount}</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 border-t border-white/5 pt-3 mt-4 flex justify-between">
                        <span>Paid: <strong className="text-green-400 font-semibold">{paidCount}</strong></span>
                        <span>Pending: <strong className="text-yellow-500 font-semibold">{pendingCount}</strong></span>
                    </div>
                </Card>

                <Card variant="flat" className="p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-green-900/30 text-green-400 rounded-xl"><DollarSign size={22} /></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Collections Verified</span>
                            <span className="text-2xl font-bold text-green-400 mt-1">₱{totalRevenueCollected.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 border-t border-white/5 pt-3 mt-4 flex justify-between">
                        <span>Expected: ₱{totalRevenueExpected.toLocaleString()}</span>
                        <span className="text-yellow-500 font-medium">₱{(totalRevenueExpected - totalRevenueCollected).toLocaleString()} Pending</span>
                    </div>
                </Card>

                <Card variant="flat" className="p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-anniversary-gold/20 text-anniversary-gold rounded-xl"><Award size={22} /></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Runner Categories</span>
                            <div className="flex gap-2 mt-1">
                                <span className="text-xs font-bold text-white bg-blue-900/40 px-1.5 py-0.5 rounded">3K: {categoryBreakdown['3K']}</span>
                                <span className="text-xs font-bold text-white bg-green-900/40 px-1.5 py-0.5 rounded">5K: {categoryBreakdown['5K']}</span>
                                <span className="text-xs font-bold text-white bg-purple-900/40 px-1.5 py-0.5 rounded">10K: {categoryBreakdown['10K']}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-500 border-t border-white/5 pt-3 mt-4 text-center">
                        Total Distance Registered: <span className="text-white font-bold">{(categoryBreakdown['3K'] * 3 + categoryBreakdown['5K'] * 5 + categoryBreakdown['10K'] * 10)} KM</span>
                    </div>
                </Card>

                <Card variant="flat" className="p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-purple-900/30 text-purple-400 rounded-xl"><Activity size={22} /></div>
                        <div className="flex flex-col items-end w-full">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest self-end">T-Shirt Inventory Sizes</span>
                            <div className="flex flex-wrap gap-1 justify-end mt-2">
                                {Object.entries(shirtBreakdown).map(([size, qty]) => (
                                    <span key={size} className="text-[10px] font-bold bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-300">
                                        {size}: <strong className="text-white">{qty}</strong>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 border-t border-white/5 pt-3 mt-4 text-center">
                        Total T-shirts to procure: <strong className="text-white">{Object.values(shirtBreakdown).reduce((a, b) => a + b, 0)}</strong>
                    </div>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <Card className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4">
                <Input
                    placeholder="Search by name, email, ref..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={18} />}
                />

                <div className="relative w-full">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-anniversary-gold transition-colors appearance-none"
                    >
                        <option value="All">All Categories</option>
                        <option value="3K">3K Category</option>
                        <option value="5K">5K Category</option>
                        <option value="10K">10K Category</option>
                    </select>
                </div>

                <div className="relative w-full">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-anniversary-gold transition-colors appearance-none"
                    >
                        <option value="All">All Payments</option>
                        <option value="Paid">Verified Paid</option>
                        <option value="Pending">Pending Payment</option>
                    </select>
                </div>

                <div className="relative w-full">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                        value={methodFilter}
                        onChange={e => setMethodFilter(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-anniversary-gold transition-colors appearance-none"
                    >
                        <option value="All">All Methods</option>
                        <option value="GCash">GCash Ahead</option>
                        <option value="Cash">Cash on Day</option>
                    </select>
                </div>
            </Card>

            {/* Registrations Ledger Table */}
            <Card className="p-0 overflow-hidden" variant="flat">
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <h2 className="font-bold text-lg">Registrants Ledger</h2>
                    <span className="text-xs text-gray-500">Showing {filteredRegistrations.length} entries</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500 italic">Syncing registrations ledger...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                                    <th className="p-4 font-semibold text-sm">Runner / Contact</th>
                                    <th className="p-4 font-semibold text-sm">Category</th>
                                    <th className="p-4 font-semibold text-sm">Shirts Ordered</th>
                                    <th className="p-4 font-semibold text-sm">Payment Details</th>
                                    <th className="p-4 font-semibold text-sm">Total Fee</th>
                                    <th className="p-4 font-semibold text-sm">Status</th>
                                    {isCommittee && <th className="p-4 font-semibold text-sm text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-gray-500">No registrations found matching filters.</td>
                                    </tr>
                                ) : (
                                    filteredRegistrations.map((reg) => (
                                        <tr key={reg.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                                            <td className="p-4">
                                                <div className="font-semibold text-white">{reg.name}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{reg.email}</div>
                                                {reg.userId === 'public' ? (
                                                    <span className="inline-block mt-1 text-[8px] tracking-wide font-extrabold uppercase bg-white/5 border border-white/10 px-1 rounded text-gray-400">Public Signup</span>
                                                ) : (
                                                    <span className="inline-block mt-1 text-[8px] tracking-wide font-extrabold uppercase bg-anniversary-gold/10 border border-anniversary-gold/20 px-1 rounded text-anniversary-gold">Classmate Signup</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded ${
                                                    reg.category === '3K' ? 'bg-blue-900/40 text-blue-300 border border-blue-500/20' :
                                                    reg.category === '5K' ? 'bg-green-900/40 text-green-300 border border-green-500/20' :
                                                    'bg-purple-900/40 text-purple-300 border border-purple-500/20'
                                                }`}>
                                                    {reg.category}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs">
                                                <div className="space-y-0.5 text-gray-300">
                                                    {Array.isArray(reg.shirts) ? (
                                                        reg.shirts.map((s, i) => (
                                                            <div key={i}>Size: <strong className="text-white">{s.size}</strong> × <strong className="text-white">{s.quantity}</strong></div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-600">None</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {reg.paymentMethod === 'GCash' ? (
                                                    <div className="space-y-1">
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-blue-900/20 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                                                            GCASH AHEAD
                                                        </span>
                                                        {reg.refNumber && (
                                                            <div className="font-mono text-xs text-gray-400 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded w-fit">
                                                                Ref: {reg.refNumber}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-yellow-900/20 text-yellow-500 border border-yellow-500/20 px-1.5 py-0.5 rounded">
                                                            CASH ON DAY
                                                        </span>
                                                        <div className="text-[10px] text-gray-600 italic mt-0.5">Pay at Secretariat</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 font-bold text-white">₱{reg.amountPaid || 450}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${
                                                    reg.paymentStatus === 'Paid'
                                                        ? 'bg-green-950 text-green-400 border border-green-500/20'
                                                        : 'bg-yellow-950 text-yellow-500 border border-yellow-500/20 animate-pulse'
                                                }`}>
                                                    {reg.paymentStatus.toUpperCase()}
                                                </span>
                                            </td>
                                            {isCommittee && (
                                                <td className="p-4 text-right">
                                                    <div className="flex justify-end gap-1.5">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleUpdatePaymentStatus(reg.id, reg.paymentStatus)}
                                                            className={reg.paymentStatus === 'Paid' ? 'text-yellow-500 hover:bg-yellow-500/20' : 'text-green-500 hover:bg-green-500/20'}
                                                            title={reg.paymentStatus === 'Paid' ? 'Revert to Pending' : 'Verify Paid'}
                                                        >
                                                            {reg.paymentStatus === 'Paid' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleDeleteRegistration(reg)}
                                                            className="text-red-500 hover:bg-red-500/20"
                                                            title="Delete Registration"
                                                        >
                                                            <Trash2 size={18} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Admin Warning Info */}
            <div className="bg-[#121212] border border-white/10 p-4 rounded-xl flex gap-3 items-start">
                <ShieldAlert size={20} className="text-anniversary-gold shrink-0 mt-0.5" />
                <div className="text-xs text-gray-400 leading-normal">
                    <strong>Coordination Policy:</strong> Please verify GCash transactions using the 13-digit reference number via the official treasurer account statement before checking off entries as <strong className="text-green-400">PAID</strong>. 
                    Unauthenticated registrations do not affect batchmate attendance ledgers.
                </div>
            </div>
        </div>
    );
}

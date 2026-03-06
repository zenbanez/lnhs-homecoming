import { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, updateDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { DollarSign, CheckCircle2, TrendingUp, AlertCircle, XCircle, CheckCircle } from 'lucide-react';

interface Payment {
    id: string;
    userId: string;
    userName: string;
    userSection: string;
    type: string;
    amount: number;
    method: string;
    refNumber: string;
    status: 'Pending' | 'Approved' | 'Flagged';
    createdAt: any;
}

export default function Finance() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const data: Payment[] = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() } as Payment);
            });
            setPayments(data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (payment: Payment, newStatus: 'Approved' | 'Flagged') => {
        try {
            const paymentRef = doc(db, 'payments', payment.id);
            await updateDoc(paymentRef, {
                status: newStatus,
                verifiedAt: Timestamp.now()
            });

            // If it's a Registration Fee and being approved, update the classmate record
            if (payment.type === 'Registration Fee' && newStatus === 'Approved') {
                const classmateRef = doc(db, 'classmates', payment.userId);
                // Check if classmate exists before updating
                await updateDoc(classmateRef, {
                    paymentStatus: 'Paid',
                    confirmedAt: Timestamp.now()
                }).catch(() => console.log("Classmate record not found, user might not have completed onboarding."));
            }

            fetchPayments();
        } catch (error) {
            console.error("Error updating payment status:", error);
            alert("Failed to update status.");
        }
    };

    const stats = {
        fees: payments.filter(p => p.type === 'Registration Fee' && p.status === 'Approved').reduce((acc, p) => acc + p.amount, 0),
        contributions: payments.filter(p => p.type === 'Section Contribution' && p.status === 'Approved').reduce((acc, p) => acc + p.amount, 0),
        donations: payments.filter(p => p.type === 'Donation' && p.status === 'Approved').reduce((acc, p) => acc + p.amount, 0),
        pending: payments.filter(p => p.status === 'Pending').length
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                    <DollarSign size={32} /> Finance (Ways & Means)
                </h1>
                <div className="flex gap-2">
                    <span className="bg-yellow-900/40 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                        {stats.pending} PENDING VERIFICATIONS
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-900/40 to-green-900/10 border border-green-500/30 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="text-green-400 mb-2"><TrendingUp size={24} /></div>
                        <h3 className="text-gray-300 font-medium">Registration Fees</h3>
                    </div>
                    <div className="text-4xl font-bold text-white mt-4">₱{stats.fees.toLocaleString()}</div>
                </div>

                <div className="bg-gradient-to-br from-anniversary-gold/20 to-yellow-900/10 border border-anniversary-gold/30 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="text-anniversary-gold mb-2"><CheckCircle2 size={24} /></div>
                        <h3 className="text-gray-300 font-medium">Section Contributions</h3>
                    </div>
                    <div className="text-4xl font-bold text-white mt-4">₱{stats.contributions.toLocaleString()}</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/10 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="text-blue-400 mb-2"><AlertCircle size={24} /></div>
                        <h3 className="text-gray-300 font-medium">Total Special Donations</h3>
                    </div>
                    <div className="text-4xl font-bold text-white mt-4">₱{stats.donations.toLocaleString()}</div>
                </div>
            </div>

            <div className="bg-black border border-white/10 rounded-xl overflow-hidden mt-8">
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <h2 className="font-bold text-lg">Recent Payment Submissions</h2>
                    <button onClick={fetchPayments} className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors">Refresh</button>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500 italic">Loading payments...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                                    <th className="p-4 font-semibold">User / Section</th>
                                    <th className="p-4 font-semibold">Type</th>
                                    <th className="p-4 font-semibold">Amount</th>
                                    <th className="p-4 font-semibold">Reference</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-gray-500">No payment records found.</td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium text-white">{payment.userName}</div>
                                                <div className="text-xs text-gray-500">Section {payment.userSection}</div>
                                            </td>
                                            <td className="p-4 text-gray-300">{payment.type}</td>
                                            <td className="p-4 font-bold text-white">₱{payment.amount}</td>
                                            <td className="p-4">
                                                <div className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10 inline-block font-mono">
                                                    {payment.refNumber}
                                                </div>
                                                <div className="text-[10px] text-gray-600 mt-1">{payment.method}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${payment.status === 'Approved' ? 'bg-green-900/30 text-green-400' :
                                                    payment.status === 'Flagged' ? 'bg-red-900/30 text-red-400' :
                                                        'bg-yellow-900/30 text-yellow-400'
                                                    }`}>
                                                    {payment.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                {payment.status === 'Pending' && (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(payment, 'Approved')}
                                                            className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(payment, 'Flagged')}
                                                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                                            title="Flag / Reject"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                                {payment.status !== 'Pending' && (
                                                    <span className="text-xs text-gray-600 italic">Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}


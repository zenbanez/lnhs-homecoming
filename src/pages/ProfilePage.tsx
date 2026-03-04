import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { User, Save, ArrowLeft, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const SECTIONS = [
    'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo',
    'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Venus', 'Mars'
];

interface Payment {
    id: string;
    type: string;
    amount: number;
    method: string;
    refNumber: string;
    status: 'Pending' | 'Approved' | 'Flagged';
    createdAt: any;
}

export default function ProfilePage() {
    const { user, userData, refreshUserData } = useAuth();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [payments, setPayments] = useState<Payment[]>([]);

    const [formData, setFormData] = useState({
        section: '',
        gender: '',
        contactNumber: '',
        status: ''
    });

    const [paymentForm, setPaymentForm] = useState({
        type: 'Registration Fee',
        amount: 500,
        method: 'GCash',
        refNumber: ''
    });

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'payments'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Payment[] = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() } as Payment);
            });
            // Sort client-side to avoid composite index requirement
            data.sort((a, b) => {
                const dateA = a.createdAt?.seconds || Date.now() / 1000;
                const dateB = b.createdAt?.seconds || Date.now() / 1000;
                return dateB - dateA;
            });
            setPayments(data);
        }, (error) => {
            console.error("Error listening to payments:", error);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (userData) {
            setFormData({
                section: userData.section || 'Aquarius',
                gender: userData.gender || 'Female',
                contactNumber: userData.contactNumber || '',
                status: userData.status || 'Attend'
            });
        }
    }, [userData]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);

        try {
            // Update users collection
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                ...formData,
                updatedAt: Timestamp.now()
            });

            // Update classmates collection to keep data in sync
            const classmateRef = doc(db, 'classmates', user.uid);
            const classmateDoc = await getDoc(classmateRef);

            if (classmateDoc.exists()) {
                await updateDoc(classmateRef, {
                    section: formData.section,
                    gender: formData.gender,
                    contactNumber: formData.contactNumber,
                    status: formData.status === 'Attend' ? 'Confirmed' : 'No Contact'
                });
            }

            await refreshUserData();
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!paymentForm.refNumber) return alert('Reference number is required');

        setIsSubmittingPayment(true);
        try {
            await addDoc(collection(db, 'payments'), {
                userId: user.uid,
                userName: userData?.displayName || user.email,
                userSection: userData?.section || 'N/A',
                ...paymentForm,
                status: 'Pending',
                createdAt: Timestamp.now()
            });

            setPaymentForm({ ...paymentForm, refNumber: '' });
            alert('Payment submitted for verification!');
        } catch (error) {
            console.error(error);
            alert('Failed to submit payment');
        } finally {
            setIsSubmittingPayment(false);
        }
    };

    if (!userData) return <div className="min-h-screen flex items-center justify-center text-anniversary-gold">Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-anniversary-gold transition-colors mb-4 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/5 p-8 rounded-2xl border border-anniversary-gold/20 backdrop-blur-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-16 w-16 bg-anniversary-gold rounded-full flex items-center justify-center text-black">
                                <User size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight">{userData.displayName || user?.email?.split('@')[0]}</h1>
                                <p className="text-gray-400">{user?.email}</p>
                                {userData.lastLogin && (
                                    <p className="text-xs text-anniversary-gold mt-1 opacity-70 italic">
                                        Last Login: {new Date(userData.lastLogin.seconds * 1000).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Section</label>
                                    <select
                                        value={formData.section}
                                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold"
                                    >
                                        {SECTIONS.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold"
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Contact Number</label>
                                    <input
                                        type="text"
                                        value={formData.contactNumber}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold"
                                        placeholder="Optional"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Attendance Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold"
                                    >
                                        <option value="Attend">I will Attend</option>
                                        <option value="Support">I will Support</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-anniversary-gold hover:bg-yellow-500 focus:outline-none transition-colors disabled:opacity-50"
                                >
                                    <Save size={18} />
                                    {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Payment History */}
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Clock className="text-anniversary-gold" size={24} /> Payment History
                        </h2>

                        {payments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                                No payment submissions yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {payments.map(payment => (
                                    <div key={payment.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                                        <div>
                                            <p className="font-semibold text-white">{payment.type}</p>
                                            <p className="text-sm text-gray-400">₱{payment.amount} via {payment.method} • Ref: {payment.refNumber}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">
                                                {payment.createdAt?.seconds ? new Date(payment.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'Approved' ? 'bg-green-900/30 text-green-400' :
                                                payment.status === 'Flagged' ? 'bg-red-900/30 text-red-400' :
                                                    'bg-yellow-900/30 text-yellow-400'
                                                }`}>
                                                {payment.status === 'Approved' ? <CheckCircle size={12} /> :
                                                    payment.status === 'Flagged' ? <AlertCircle size={12} /> :
                                                        <Clock size={12} />}
                                                {payment.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Payment Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-b from-anniversary-gold/20 to-transparent p-6 rounded-2xl border border-anniversary-gold/30">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <CreditCard className="text-anniversary-gold" size={24} /> Submit Payment
                        </h3>
                        <p className="text-sm text-gray-300 mb-6">
                            Report your registration fee or contribution here. Our finance committee will verify your reference number.
                        </p>

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Payment Type</label>
                                <select
                                    value={paymentForm.type}
                                    onChange={e => setPaymentForm({ ...paymentForm, type: e.target.value })}
                                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-anniversary-gold outline-none"
                                >
                                    <option value="Registration Fee">P500 Registration Fee</option>
                                    <option value="Section Contribution">Section Contribution (P5000)</option>
                                    <option value="Donation">Special Donation</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Amount (₱)</label>
                                <input
                                    type="number"
                                    value={paymentForm.amount}
                                    onChange={e => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-anniversary-gold outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Method</label>
                                <select
                                    value={paymentForm.method}
                                    onChange={e => setPaymentForm({ ...paymentForm, method: e.target.value })}
                                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-anniversary-gold outline-none"
                                >
                                    <option value="GCash">GCash</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cash">Cash / On-site</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Reference Number</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. GCash Ref ID"
                                    value={paymentForm.refNumber}
                                    onChange={e => setPaymentForm({ ...paymentForm, refNumber: e.target.value })}
                                    className="w-full bg-black border border-gray-800 rounded-lg p-2.5 text-white text-sm focus:border-anniversary-gold outline-none placeholder:text-gray-700"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmittingPayment}
                                className="w-full py-3 bg-anniversary-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-anniversary-gold/10"
                            >
                                {isSubmittingPayment ? 'Submitting...' : 'Submit Records'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl">
                        <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2">
                            <AlertCircle size={16} /> Need help?
                        </h4>
                        <p className="text-xs text-blue-200/70 leading-relaxed">
                            If you encounter any issues with your payment submission, please contact our Ways & Means committee directly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


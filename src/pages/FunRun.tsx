import { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, Medal, Plus, X, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import funRunBanner from '../assets/fun-run-banner.png';

export default function FunRun() {
    const { user, userData } = useAuth();
    
    interface ShirtOrder {
        size: string;
        quantity: number;
    }
    
    interface FormData {
        name: string;
        email: string;
        category: string;
        shirts: ShirtOrder[];
    }

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        category: '5K',
        shirts: [{ size: 'L', quantity: 1 }],
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                name: userData.displayName || prev.name,
                email: userData.email || prev.email
            }));
        }
    }, [userData]);

    const handleAddShirt = () => {
        setFormData(prev => ({ ...prev, shirts: [...prev.shirts, { size: 'L', quantity: 1 }] }));
    };

    const handleRemoveShirt = (index: number) => {
        if (formData.shirts.length > 1) {
            setFormData(prev => ({ ...prev, shirts: prev.shirts.filter((_, i) => i !== index) }));
        }
    };

    const handleShirtChange = (index: number, field: keyof ShirtOrder, value: string | number) => {
        const newShirts = [...formData.shirts];
        newShirts[index] = { ...newShirts[index], [field]: value as any };
        setFormData(prev => ({ ...prev, shirts: newShirts }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        setSuccessMessage('');
        try {
            await addDoc(collection(db, 'funrun_registrations'), {
                ...formData,
                userId: user.uid,
                paymentStatus: 'Pending',
                timestamp: Timestamp.now()
            });
            setSuccessMessage('Successfully registered for the May Fun Run!');
            setFormData({ 
                name: userData?.displayName || '', 
                email: userData?.email || '', 
                category: '5K', 
                shirts: [{ size: 'L', quantity: 1 }] 
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error registering. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-black border border-white/10 rounded-2xl max-w-2xl mx-auto shadow-2xl mt-12">
                <Lock size={64} className="text-anniversary-gold mb-6 opacity-80" />
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Authentication Required</h2>
                <p className="text-gray-400 mb-8 max-w-md text-center text-lg">
                    You must be logged in to register for the Fun Run. Please log in or create an account to secure your spot.
                </p>
                <Link to="/login" className="bg-anniversary-gold text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors">
                    Go to Login
                </Link>
            </div>
        );
    }

    const totalFee = 450; // Registration fee per runner
    // If they order extra shirts we might charge them, but the prompt only asked to "change the registration fee to 450. they can also order multiple shirts".
    // I will specify the base registration fee is 450, and their shirts are part of their package or additional.

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                <Activity size={32} /> May Fun Run Registration
            </h1>
            
            <div className="w-full rounded-2xl overflow-hidden border border-white/10">
                <img src={funRunBanner} alt="Fun Run Banner" className="w-full h-auto object-cover max-h-96" />
            </div>

            <div className="bg-gradient-to-r from-anniversary-gold/20 to-black border border-anniversary-gold/30 p-8 rounded-2xl flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Medal className="text-anniversary-gold" /> Run for a Cause
                    </h2>
                    <p className="text-gray-300">
                        Join the LNHS Class of '76 Fundraising 5km Run this coming May! Proceeds go to our section contributions and the school's scholarship fund.
                    </p>
                    <div className="text-xl font-bold text-anniversary-gold">Registration Fee: ₱450</div>
                </div>

                <div className="w-full md:w-96 min-w-0 bg-black border border-white/10 p-6 rounded-xl relative">
                    {successMessage ? (
                        <div className="absolute inset-0 bg-black/95 flex items-center justify-center p-6 text-center rounded-xl border border-green-500/50 z-10">
                            <div>
                                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                                <p className="text-green-400 font-bold text-lg">{successMessage}</p>
                                <button onClick={() => setSuccessMessage('')} className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                                    Register another runner
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4 border-b border-white/10 pb-5">
                            <h3 className="font-semibold text-white">Participant Details</h3>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-anniversary-gold" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email / Contact Number</label>
                                <input required type="text" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-anniversary-gold" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-anniversary-gold">
                                    <option value="3K">3K Walk/Run</option>
                                    <option value="5K">5K Run</option>
                                    <option value="10K">10K Run</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-white">Shirt Orders</h3>
                                <button type="button" onClick={handleAddShirt} className="text-sm flex items-center gap-1 text-anniversary-gold hover:text-yellow-400">
                                    <Plus size={16} /> Add Shirt
                                </button>
                            </div>
                            
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {formData.shirts.map((shirt, index) => (
                                    <div key={index} className="flex gap-2 items-center bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Size</label>
                                            <select value={shirt.size} onChange={e => handleShirtChange(index, 'size', e.target.value)} className="w-full bg-[#121212] border border-gray-700 rounded text-sm p-1.5 text-white outline-none focus:border-anniversary-gold">
                                                <option value="S">Small</option>
                                                <option value="M">Medium</option>
                                                <option value="L">Large</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </select>
                                        </div>
                                        <div className="w-20">
                                            <label className="block text-xs text-gray-500 mb-1">Qty</label>
                                            <input type="number" min="1" value={shirt.quantity} onChange={e => handleShirtChange(index, 'quantity', parseInt(e.target.value) || 1)} className="w-full bg-[#121212] border border-gray-700 rounded text-sm p-1.5 text-white outline-none focus:border-anniversary-gold" />
                                        </div>
                                        {formData.shirts.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveShirt(index)} className="text-gray-500 hover:text-red-400 mt-5 p-1">
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button disabled={submitting} type="submit" className="w-full bg-anniversary-gold text-black font-bold py-3.5 rounded-lg hover:bg-yellow-500 transition-colors mt-6 disabled:opacity-50">
                            {submitting ? 'Processing...' : `Reserve Slot (₱${totalFee})`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

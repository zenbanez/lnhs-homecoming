import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, Medal } from 'lucide-react';

export default function FunRun() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: '5K',
        shirtSize: 'L',
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        try {
            await addDoc(collection(db, 'funrun_registrations'), {
                ...formData,
                paymentStatus: 'Pending',
                timestamp: new Date()
            });
            setSuccessMessage('Successfully registered for the May Fun Run!');
            setFormData({ name: '', email: '', category: '5K', shirtSize: 'L' });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error registering. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                <Activity size={32} /> May Fun Run Registration
            </h1>

            <div className="bg-gradient-to-r from-anniversary-gold/20 to-black border border-anniversary-gold/30 p-8 rounded-2xl flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Medal className="text-anniversary-gold" /> Run for a Cause
                    </h2>
                    <p className="text-gray-300">
                        Join the LNHS Class of '76 Fundraising 5km Run this coming May! Proceeds go to our section contributions and the school's scholarship fund.
                    </p>
                    <div className="text-xl font-bold text-anniversary-gold">Registration Fee: ₱300</div>
                </div>

                <div className="w-full md:w-96 bg-black border border-white/10 p-6 rounded-xl relative">
                    {successMessage ? (
                        <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-6 text-center rounded-xl border border-green-500/50">
                            <div>
                                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                                <p className="text-green-400 font-bold text-lg">{successMessage}</p>
                                <button onClick={() => setSuccessMessage('')} className="mt-4 text-sm text-gray-400 underline hover:text-white">Register another runner</button>
                            </div>
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-anniversary-gold" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email / Contact Number</label>
                            <input required type="text" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-anniversary-gold" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-anniversary-gold">
                                    <option value="3K">3K Walk/Run</option>
                                    <option value="5K">5K Run</option>
                                    <option value="10K">10K Run</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Shirt Size</label>
                                <select value={formData.shirtSize} onChange={e => setFormData({ ...formData, shirtSize: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-anniversary-gold">
                                    <option value="S">Small</option>
                                    <option value="M">Medium</option>
                                    <option value="L">Large</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                            </div>
                        </div>
                        <button disabled={submitting} type="submit" className="w-full bg-anniversary-gold text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors mt-2 disabled:opacity-50">
                            {submitting ? 'Processing...' : 'Reserve Slot'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Inline import for success state
import { CheckCircle2 } from 'lucide-react';

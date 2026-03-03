import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { UserPlus, CheckCircle } from 'lucide-react';

const SECTIONS = [
    'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo',
    'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Venus', 'Mars'
];

export default function OnboardingPage() {
    const { user, refreshUserData } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        section: 'Aquarius',
        gender: 'Female',
        contactNumber: '',
        status: 'Attend' // Attend or Support
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            await setDoc(doc(db, 'users', user.uid), {
                ...formData,
                email: user.email,
                displayName: user.displayName || '',
                onboarded: true,
                role: 'user', // Default role
                updatedAt: new Date()
            });

            // Also add to the main classmates collection if not already there
            await setDoc(doc(db, 'classmates', user.uid), {
                name: user.displayName || user.email?.split('@')[0] || 'Unknown',
                section: formData.section,
                status: formData.status === 'Attend' ? 'Confirmed' : 'No Contact', // Mapping Attend to Confirmed for simplicity
                gender: formData.gender,
                contactNumber: formData.contactNumber,
            });

            await refreshUserData();
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-2xl border border-anniversary-gold/20 backdrop-blur-sm">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-anniversary-gold rounded-full flex items-center justify-center text-black mb-4">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Complete your profile</h2>
                    <p className="mt-2 text-sm text-gray-400">Tell us how you'll be part of the celebration</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Your Section</label>
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
                                <label className="block text-sm font-medium text-gray-300 mb-1">Contact Number (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. +63 917 123 4567"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold"
                                />
                            </div>

                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300 mb-1">Your Participation</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'Attend' })}
                                    className={`py-3 px-4 rounded-lg border flex flex-col items-center justify-center transition-all ${formData.status === 'Attend'
                                        ? 'border-anniversary-gold bg-anniversary-gold/20 text-white'
                                        : 'border-gray-700 bg-black text-gray-500 hover:border-gray-600'
                                        }`}
                                >
                                    <CheckCircle size={20} className={`mb-1 ${formData.status === 'Attend' ? 'opacity-100' : 'opacity-20'}`} />
                                    <span className="font-bold">I will Attend</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: 'Support' })}
                                    className={`py-3 px-4 rounded-lg border flex flex-col items-center justify-center transition-all ${formData.status === 'Support'
                                        ? 'border-anniversary-gold bg-anniversary-gold/20 text-white'
                                        : 'border-gray-700 bg-black text-gray-500 hover:border-gray-600'
                                        }`}
                                >
                                    <CheckCircle size={20} className={`mb-1 ${formData.status === 'Support' ? 'opacity-100' : 'opacity-20'}`} />
                                    <span className="font-bold">I will Support</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-anniversary-gold hover:bg-yellow-500 focus:outline-none transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving Profile...' : 'Finalize Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}

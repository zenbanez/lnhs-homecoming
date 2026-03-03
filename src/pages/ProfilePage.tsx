import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { User, Save, ArrowLeft } from 'lucide-react';

const SECTIONS = [
    'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo',
    'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Venus', 'Mars'
];

export default function ProfilePage() {
    const { user, userData, refreshUserData } = useAuth();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        section: '',
        gender: '',
        contactNumber: '',
        status: ''
    });

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSaving(true);

        try {
            // Update users collection
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                ...formData,
                updatedAt: new Date()
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

    if (!userData) return <div className="min-h-screen flex items-center justify-center text-anniversary-gold">Loading Profile...</div>;

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-anniversary-gold transition-colors mb-8 group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back
            </button>

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

                <form onSubmit={handleSubmit} className="space-y-6">
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
        </div>
    );
}

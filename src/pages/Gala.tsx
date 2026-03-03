import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Clock, Users, Music } from 'lucide-react';

export default function Gala() {
    const [formData, setFormData] = useState({
        name: '',
        section: 'Aquarius',
        guests: 0,
        presenting: false,
        presentationTitle: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [stats, setStats] = useState({ attendees: 0, guests: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const q = query(collection(db, 'gala_registrations'));
                const snapshot = await getDocs(q);
                let attendees = 0;
                let guests = 0;
                snapshot.forEach(doc => {
                    attendees += 1;
                    guests += (doc.data().guests || 0);
                });
                setStats({ attendees, guests });
            } catch (e) {
                console.error(e);
            }
        };
        fetchStats();
    }, [successMessage]);

    const sections = [
        'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo',
        'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Venus', 'Mars'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        try {
            await addDoc(collection(db, 'gala_registrations'), {
                ...formData,
                timestamp: new Date()
            });
            setSuccessMessage('Successfully registered for the Gala!');
            setFormData({ name: '', section: 'Aquarius', guests: 0, presenting: false, presentationTitle: '' });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error registering. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-12 py-8 max-w-6xl mx-auto">
            <section className="text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-anniversary-gold to-yellow-200 bg-clip-text text-transparent">
                    Homecoming Night Gala
                </h1>
                <p className="text-xl text-gray-300">July 2, 2026 • 5:00 PM - 11:00 PM</p>

                <div className="flex justify-center gap-8 mt-8">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-anniversary-gold">{stats.attendees}</div>
                        <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">Batchmates</div>
                    </div>
                    <div className="h-10 w-px bg-white/10"></div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-anniversary-gold">{stats.guests}</div>
                        <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">Extra Guests</div>
                    </div>
                    <div className="h-10 w-px bg-white/10"></div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-anniversary-gold text-green-500">{stats.attendees + stats.guests}</div>
                        <div className="text-xs uppercase tracking-widest text-gray-500 font-bold">Total Pax</div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Schedule Section */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold border-b border-anniversary-gold/20 pb-4">Evening Schedule</h2>

                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-anniversary-gold/30 before:to-transparent">

                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-anniversary-gold bg-black text-anniversary-gold shrink-0 z-10 shadow ml-0.5 md:mx-auto">
                                <Users size={20} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-anniversary-gold/10">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-anniversary-gold">5:00 PM</span>
                                </div>
                                <div className="text-gray-200 font-semibold">Registration & Cocktails</div>
                                <div className="text-sm text-gray-400 mt-1">Welcome drinks, mingling, and photo opportunities.</div>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-anniversary-gold bg-black text-anniversary-gold shrink-0 z-10 shadow ml-0.5 md:mx-auto">
                                <Clock size={20} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-anniversary-gold/10">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-anniversary-gold">7:00 PM</span>
                                </div>
                                <div className="text-gray-200 font-semibold">Dinner is Served</div>
                                <div className="text-sm text-gray-400 mt-1">Enjoy a curated menu prepared for this golden night.</div>
                            </div>
                        </div>

                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-anniversary-gold bg-black text-anniversary-gold shrink-0 z-10 shadow ml-0.5 md:mx-auto">
                                <Music size={20} />
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-anniversary-gold/10">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-anniversary-gold">8:30 PM</span>
                                </div>
                                <div className="text-gray-200 font-semibold">Section Presentations & Dancing</div>
                                <div className="text-sm text-gray-400 mt-1">Performances from the sections, followed by open dance floor.</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Registration Form */}
                <div className="bg-white/5 border border-anniversary-gold/20 p-6 md:p-8 rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6">Register for the Gala</h2>

                    {successMessage ? (
                        <div className="p-4 bg-green-900/40 border border-green-500/50 text-green-200 rounded-lg text-center">
                            {successMessage}
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                                    placeholder="e.g. Maria Clara"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Section</label>
                                <select
                                    value={formData.section}
                                    onChange={e => setFormData({ ...formData, section: e.target.value })}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                                >
                                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Number of Extra Guests</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    value={formData.guests}
                                    onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                                />
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.presenting}
                                        onChange={e => setFormData({ ...formData, presenting: e.target.checked })}
                                        className="w-5 h-5 rounded border-gray-700 text-anniversary-gold focus:ring-anniversary-gold bg-black"
                                    />
                                    <span className="text-gray-300 font-medium">Are you/your section performing?</span>
                                </label>
                            </div>

                            {formData.presenting && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Presentation Title/Type</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.presentationTitle}
                                        onChange={e => setFormData({ ...formData, presentationTitle: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                                        placeholder="e.g. Dance Number to 70s Disco"
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-anniversary-gold hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition-colors mt-6 disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Complete Gala Registration'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

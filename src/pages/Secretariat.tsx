import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { FileText, Save } from 'lucide-react';

interface Note {
    id: string;
    classmateName: string;
    notes: string;
    updatedAt: any;
}

export default function Secretariat() {
    const [notesList, setNotesList] = useState<Note[]>([]);
    const [formData, setFormData] = useState({ classmateName: '', notes: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const q = query(collection(db, 'secretariat_notes'), orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            const data: Note[] = [];
            snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Note));
            setNotesList(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, 'secretariat_notes'), {
                ...formData,
                updatedAt: new Date()
            });
            setFormData({ classmateName: '', notes: '' });
            fetchNotes();
        } catch (e) {
            console.error(e);
            alert('Error saving note.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                <FileText size={32} /> Secretariat: Whereabouts Updates
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Log New Contact Info</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Classmate Name</label>
                                <input required type="text" value={formData.classmateName} onChange={e => setFormData({ ...formData, classmateName: e.target.value })} className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Whereabouts / Contact Details</label>
                                <textarea required rows={4} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white"></textarea>
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-anniversary-gold text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                                <Save size={18} /> {loading ? 'Saving...' : 'Save Record'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-black border border-white/10 p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Recent Updates log</h2>
                        <div className="space-y-4">
                            {notesList.map(note => (
                                <div key={note.id} className="p-4 border border-white/5 bg-white/5 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-lg text-white">{note.classmateName}</span>
                                        <span className="text-xs text-gray-500">{note.updatedAt?.toDate().toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-300">{note.notes}</p>
                                </div>
                            ))}
                            {notesList.length === 0 && <p className="text-gray-500">No updates logged yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

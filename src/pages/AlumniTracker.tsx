import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Filter, Plus, Users, Upload } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import CSVImporter from '../components/CSVImporter';
import { useAuth } from '../context/AuthContext';

import type { Classmate } from '../types';

const SECTIONS = [
    'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo',
    'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Venus', 'Mars'
];

export default function AlumniTracker() {
    const [classmates, setClassmates] = useState<Classmate[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSection, setFilterSection] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterPayment, setFilterPayment] = useState('All');

    // Add new modal state
    const [isAdding, setIsAdding] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [newPerson, setNewPerson] = useState({ name: '', section: 'Aquarius', status: 'Confirmed', gender: 'Female' });

    const { userData } = useAuth();
    const isAdmin = userData?.role === 'admin' || userData?.role === 'committee';

    useEffect(() => {
        fetchClassmates();
    }, []);

    const fetchClassmates = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'classmates'), orderBy('name', 'asc'));
            const snapshot = await getDocs(q);
            const data: Classmate[] = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() } as Classmate);
            });
            setClassmates(data);
        } catch (error) {
            console.error("Error fetching classmates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPerson = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'classmates'), newPerson);
            setIsAdding(false);
            setNewPerson({ name: '', section: 'Aquarius', status: 'Confirmed', gender: 'Female' });
            fetchClassmates(); // Refresh list
        } catch (error) {
            console.error("Error adding person:", error);
            alert("Failed to add record.");
        }
    };

    const handleBatchImport = async (data: any[]) => {
        // Map CSV data to Classmate schema
        const classmatesToAdd = data.map(item => ({
            name: item.name || 'Unknown',
            section: item.section || 'Aquarius',
            gender: item.gender || 'Female',
            status: item.status || 'No Contact',
            contactNumber: item.contactnumber || item['contact number'] || '',
            paymentStatus: 'Unpaid',
            createdAt: new Date()
        }));

        // In a real app we'd use writeBatch, but for simplicity and smaller sets:
        const promises = classmatesToAdd.map(person => addDoc(collection(db, 'classmates'), person));
        await Promise.all(promises);
        fetchClassmates();
    };



    const filtered = classmates.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSection = filterSection === 'All' || c.section === filterSection;
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
        const matchesPayment = filterPayment === 'All' ||
            (filterPayment === 'Paid' && c.paymentStatus === 'Paid') ||
            (filterPayment === 'Unpaid' && c.paymentStatus !== 'Paid');
        return matchesSearch && matchesSection && matchesStatus && matchesPayment;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                        <Users size={32} /> Alumni Tracker
                    </h1>
                    <p className="text-gray-400 mt-1">Total Records: {classmates.length} | Confirmed: {classmates.filter(c => c.status === 'Confirmed').length}</p>
                </div>
                <div className="flex gap-2">
                    {isAdmin && (
                        <>
                            <Button 
                                variant="secondary" 
                                onClick={() => setIsImporting(!isImporting)} 
                                leftIcon={<Upload className={isImporting ? 'rotate-180 transition-all' : 'transition-all'} size={18} />}
                            >
                                {isImporting ? 'Cancel Import' : 'Batch Import'}
                            </Button>
                            <Button onClick={() => setIsAdding(true)} leftIcon={<Plus size={18} />}>
                                Add Record
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {isImporting && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <CSVImporter 
                        expectedHeaders={['Name', 'Section', 'Gender', 'Status', 'Contact Number']}
                        onImport={handleBatchImport}
                    />
                </div>
            )}

            <Card className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4">
                <Input
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={18} />}
                />

                <div className="relative w-full">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                        value={filterSection}
                        onChange={e => setFilterSection(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-anniversary-gold transition-colors appearance-none"
                    >
                        <option value="All">All Sections</option>
                        {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="relative w-full">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-anniversary-gold transition-colors appearance-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="No Contact">No Contact</option>
                        <option value="Deceased">Deceased</option>
                    </select>
                </div>

                <div className="relative w-full">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                        value={filterPayment}
                        onChange={e => setFilterPayment(e.target.value)}
                        className="w-full bg-black border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-anniversary-gold transition-colors appearance-none"
                    >
                        <option value="All">All Payments</option>
                        <option value="Paid">Paid</option>
                        <option value="Unpaid">Unpaid</option>
                    </select>
                </div>
            </Card>

            <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading records...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Section</th>
                                    <th className="p-4 font-semibold">Gender</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Payment</th>
                                    <th className="p-4 font-semibold">Last Login</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(person => (
                                    <tr key={person.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">{person.name}</td>
                                        <td className="p-4 text-gray-400">{person.section}</td>
                                        <td className="p-4 text-gray-400">{person.gender}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${person.status === 'Confirmed' ? 'bg-green-900/50 text-green-400' :
                                                person.status === 'No Contact' ? 'bg-yellow-900/50 text-yellow-500' :
                                                    'bg-gray-800 text-gray-400'
                                                }`}>
                                                {person.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {person.paymentStatus === 'Paid' ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-green-900/40 text-green-400 border border-green-500/20">
                                                    PAID
                                                </span>
                                            ) : (
                                                <span className="text-[10px] text-gray-600">Pending</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {person.lastLogin ? new Date(person.lastLogin.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">No records matching filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <Card className="w-full max-w-md p-6" variant="glass">
                        <h2 className="text-2xl font-bold mb-6 text-white">Add Classmate Record</h2>
                        <form onSubmit={handleAddPerson} className="space-y-4">
                            <Input
                                label="Full Name"
                                required
                                value={newPerson.name}
                                onChange={e => setNewPerson({ ...newPerson, name: e.target.value })}
                                placeholder="Enter classmate name"
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Section</label>
                                    <select
                                        value={newPerson.section}
                                        onChange={e => setNewPerson({ ...newPerson, section: e.target.value })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                                    >
                                        {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>
                                    <select
                                        value={newPerson.gender}
                                        onChange={e => setNewPerson({ ...newPerson, gender: e.target.value as any })}
                                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                <select
                                    value={newPerson.status}
                                    onChange={e => setNewPerson({ ...newPerson, status: e.target.value as any })}
                                    className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                                >
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="No Contact">No Contact</option>
                                    <option value="Deceased">Deceased</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Save Record
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}

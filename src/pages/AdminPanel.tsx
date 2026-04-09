import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Shield, Search, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import type { UserProfile } from '../types';

const ROLES = ['admin', 'committee', 'user'] as const;
const COMMITTEES = ['Secretariat', 'Finance', 'Ways & Means', 'Venue', 'Program', 'T-Shirts', 'None'];

export default function AdminPanel() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'users'), orderBy('displayName', 'asc'));
            const snapshot = await getDocs(q);
            const data: UserProfile[] = [];
            snapshot.forEach(doc => {
                data.push({ uid: doc.id, ...doc.data() } as UserProfile);
            });
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (uid: string, role: string) => {
        setUpdatingId(uid);
        try {
            await updateDoc(doc(db, 'users', uid), { role });
            setUsers(users.map(u => u.uid === uid ? { ...u, role: role as any } : u));
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role.");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleUpdateCommittee = async (uid: string, committee: string) => {
        setUpdatingId(uid);
        try {
            await updateDoc(doc(db, 'users', uid), { committee });
            setUsers(users.map(u => u.uid === uid ? { ...u, committee } : u));
        } catch (error) {
            console.error("Error updating committee:", error);
            alert("Failed to update committee.");
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(u => 
        u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                        <Shield size={32} /> Admin Panel
                    </h1>
                    <p className="text-gray-400 mt-1">Manage user permissions and committee assignments.</p>
                </div>
            </div>

            <Card className="p-4">
                <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    leftIcon={<Search size={18} />}
                />
            </Card>

            <div className="bg-black border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                                    <th className="p-4 font-semibold">User</th>
                                    <th className="p-4 font-semibold">Email</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Committee</th>
                                    <th className="p-4 font-semibold text-right">Registered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.uid} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-anniversary-gold/20 rounded-full flex items-center justify-center text-anniversary-gold font-bold text-xs">
                                                    {user.displayName?.[0] || user.email?.[0] || '?'}
                                                </div>
                                                <span className="font-medium text-white">{user.displayName || 'No Name'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{user.email}</td>
                                        <td className="p-4">
                                            <select
                                                value={user.role || 'user'}
                                                disabled={updatingId === user.uid}
                                                onChange={e => handleUpdateRole(user.uid, e.target.value)}
                                                className="bg-black border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-anniversary-gold disabled:opacity-50"
                                            >
                                                {ROLES.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={user.committee || 'None'}
                                                disabled={updatingId === user.uid || user.role !== 'committee'}
                                                onChange={e => handleUpdateCommittee(user.uid, e.target.value)}
                                                className="bg-black border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-anniversary-gold disabled:opacity-50"
                                            >
                                                {COMMITTEES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs text-right">
                                            {user.updatedAt ? new Date(user.updatedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">No users matching search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex gap-3 items-start">
                <Info size={20} className="text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-200/70 leading-relaxed">
                    <strong>Note:</strong> Promoting a user to ADMIN gives them full access to all data and this panel. 
                    COMMITTEE members can only be assigned to a committee if their role is set to "COMMITTEE".
                </p>
            </div>
        </div>
    );
}

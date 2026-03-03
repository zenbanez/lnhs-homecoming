import { useState, useEffect } from 'react';
import { collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Shirt, Plus, X } from 'lucide-react';

interface Order {
    id: string;
    name: string;
    size: string;
    quantity: number;
    paymentStatus: string;
}

export default function TShirts() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        size: 'L',
        quantity: 1,
        paymentStatus: 'Unpaid'
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'tshirt_orders'), orderBy('name', 'asc'));
            const snapshot = await getDocs(q);
            const data: Order[] = [];
            snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() } as Order));
            setOrders(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'tshirt_orders'), formData);
            setFormData({ name: '', size: 'L', quantity: 1, paymentStatus: 'Unpaid' });
            setIsAdding(false);
            fetchOrders();
        } catch (e) {
            console.error(e);
            alert('Failed to save order');
        }
    };

    const totalShirts = orders.reduce((acc, curr) => acc + curr.quantity, 0);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                    <Shirt size={32} /> T-Shirt Ordering System
                </h1>
                <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-anniversary-gold text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2">
                    <Plus size={18} /> New Order
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-200 border border-gray-300 p-6 rounded-2xl flex items-center gap-8 relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 text-black/5 opacity-50"><Shirt size={200} /></div>
                    <div className="relative z-10 w-32 h-32 bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-center">
                        <div>
                            <div className="text-anniversary-gold font-black uppercase leading-tight text-xl">LNHS<br />Class '76</div>
                            <div className="text-black font-black text-3xl mt-1">50</div>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black text-black mb-1">Design Specs</h3>
                        <ul className="text-gray-800 space-y-1 font-medium text-sm">
                            <li>• Base: White Shirt</li>
                            <li>• Letters: Gold ("LNHS Class '76")</li>
                            <li>• Numbers: Black ("50th Anniversary")</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-black border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                    <h3 className="text-gray-400 font-medium mb-2">Total Shirts Ordered</h3>
                    <div className="text-5xl font-bold text-white tracking-widest leading-none">{totalShirts}</div>
                </div>
                <div className="bg-black border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                    <h3 className="text-gray-400 font-medium mb-2">Total Revenue Expected</h3>
                    <div className="text-5xl font-bold text-anniversary-gold tracking-widest leading-none">₱{totalShirts * 350}</div>
                </div>
            </div>

            <div className="bg-black border border-white/10 rounded-xl overflow-hidden mt-8">
                <div className="p-4 border-b border-white/10 bg-white/5 font-bold">Orders Ledger</div>
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading orders...</div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Size</th>
                                <th className="p-4 font-semibold">Quantity</th>
                                <th className="p-4 font-semibold">Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{o.name}</td>
                                    <td className="p-4 text-gray-300">{o.size}</td>
                                    <td className="p-4 text-gray-300">{o.quantity}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${o.paymentStatus === 'Paid' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-500'
                                            }`}>
                                            {o.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No orders found.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {isAdding && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1a1a1a] p-6 rounded-2xl w-full max-w-md border border-white/10 relative">
                        <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={20} /></button>
                        <h2 className="text-xl font-bold mb-6">Log New Order</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-anniversary-gold" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Size</label>
                                    <select value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-anniversary-gold">
                                        {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                                    <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })} className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-anniversary-gold" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Payment Status</label>
                                <select value={formData.paymentStatus} onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })} className="w-full bg-black border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-anniversary-gold">
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Paid">Paid</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full mt-6 bg-anniversary-gold text-black font-semibold py-3 rounded-lg hover:bg-yellow-500 transition-colors">Save Order</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

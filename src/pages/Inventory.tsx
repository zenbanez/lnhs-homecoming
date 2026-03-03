import { useState, useEffect } from 'react';
import { collection, doc, updateDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Box, Droplet, Candy, Flag, Plus, Minus } from 'lucide-react';

export default function Inventory() {
    const [inventory, setInventory] = useState({
        water: 0,
        chocolate: 0,
        streamers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'inventory'));
            if (snapshot.empty) {
                // Initialize if empty
                await setDoc(doc(db, 'inventory', 'main'), inventory);
            } else {
                setInventory(snapshot.docs[0].data() as any);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const syncUpdate = async (key: string, value: number) => {
        const newVal = Math.max(0, inventory[key as keyof typeof inventory] + value);
        const newInventory = { ...inventory, [key]: newVal };
        setInventory(newInventory);
        try {
            await updateDoc(doc(db, 'inventory', 'main'), { [key]: newVal });
        } catch (e) {
            console.error("Failed to sync inventory", e);
        }
    };

    const cards = [
        { key: 'water', title: 'Bottled Water', icon: Droplet, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-900/10' },
        { key: 'chocolate', title: 'Chocolate Bars', icon: Candy, color: 'text-amber-600', border: 'border-amber-600/30', bg: 'bg-amber-900/10' },
        { key: 'streamers', title: 'Streamers & Banners', icon: Flag, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-900/10' },
    ];

    if (loading) return <div className="text-anniversary-gold">Loading Inventory...</div>;

    return (
        <div className="space-y-8 max-w-5xl">
            <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                <Box size={32} /> Resource Inventory
            </h1>

            <p className="text-gray-400">Track physical resources needed across the 3 days.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map(c => {
                    const Icon = c.icon;
                    const val = inventory[c.key as keyof typeof inventory];
                    return (
                        <div key={c.key} className={`${c.bg} border ${c.border} p-6 rounded-2xl flex flex-col items-center text-center`}>
                            <Icon size={40} className={`${c.color} mb-4`} />
                            <h3 className="text-gray-300 font-bold mb-6">{c.title}</h3>

                            <div className="flex items-center gap-6">
                                <button
                                    onClick={() => syncUpdate(c.key, -1)}
                                    className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <div className="text-4xl font-black text-white w-16">{val}</div>
                                <button
                                    onClick={() => syncUpdate(c.key, 1)}
                                    className="w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

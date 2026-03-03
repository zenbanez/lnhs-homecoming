import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Classmate {
    id: string;
    name: string;
    section: string;
    status: string;
}

export default function InMemoriam() {
    const [deceased, setDeceased] = useState<Classmate[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDeceased = async () => {
            setLoading(true);
            try {
                const q = query(
                    collection(db, 'classmates'),
                    where('status', 'in', ['Deceased', 'In Heaven'])
                );
                const querySnapshot = await getDocs(q);
                const fetchedData: Classmate[] = [];
                querySnapshot.forEach((doc) => {
                    fetchedData.push({ id: doc.id, ...doc.data() } as Classmate);
                });

                if (fetchedData.length > 0) {
                    setDeceased(fetchedData);
                }
            } catch (error) {
                console.error("Error fetching deceased classmates: ", error);
                // Fallback to mock data on error (e.g. permission denied or missing collection)
            } finally {
                setLoading(false);
            }
        };

        fetchDeceased();
    }, []);

    return (
        <div className="space-y-12 py-8 max-w-5xl mx-auto">
            <section className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-200">
                    In Memoriam
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto italic">
                    "To live in hearts we leave behind is not to die."
                </p>
                <p className="text-gray-500">
                    Remembering our dear classmates from the LNHS Class of '76 who are already in heaven.
                </p>
            </section>

            {loading ? (
                <div className="text-center text-anniversary-gold">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deceased.map((person) => (
                        <div key={person.id} className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col items-center text-center hover:bg-white/10 transition-colors">
                            <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-anniversary-gold/50 flex items-center justify-center mb-4">
                                <span className="text-3xl text-gray-500">{person.name.charAt(0)}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-200">{person.name}</h3>
                            <p className="text-anniversary-gold mt-1">Section {person.section}</p>
                        </div>
                    ))}

                    {deceased.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-12">
                            No records found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

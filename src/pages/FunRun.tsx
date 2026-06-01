import { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Activity, Medal, Plus, X, CheckCircle2, Image as ImageIcon, Map, QrCode, Banknote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import funRunBanner from '../assets/fun-run-banner.png';

export default function FunRun() {
    const { user, userData } = useAuth();
    
    interface ShirtOrder {
        size: string;
        quantity: number;
    }
    
    interface FormData {
        name: string;
        email: string;
        category: string;
        shirts: ShirtOrder[];
        paymentMethod: 'GCash' | 'Cash';
        refNumber: string;
    }

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        category: '5K',
        shirts: [{ size: 'L', quantity: 1 }],
        paymentMethod: 'GCash',
        refNumber: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [showRouteMap, setShowRouteMap] = useState(false);
    const [showPoster, setShowPoster] = useState(false);

    useEffect(() => {
        if (userData) {
            setFormData(prev => ({
                ...prev,
                name: userData.displayName || prev.name,
                email: userData.email || prev.email
            }));
        }
    }, [userData]);

    const handleAddShirt = () => {
        setFormData(prev => ({ ...prev, shirts: [...prev.shirts, { size: 'L', quantity: 1 }] }));
    };

    const handleRemoveShirt = (index: number) => {
        if (formData.shirts.length > 1) {
            setFormData(prev => ({ ...prev, shirts: prev.shirts.filter((_, i) => i !== index) }));
        }
    };

    const handleShirtChange = (index: number, field: keyof ShirtOrder, value: string | number) => {
        const newShirts = [...formData.shirts];
        newShirts[index] = { ...newShirts[index], [field]: value as any };
        setFormData(prev => ({ ...prev, shirts: newShirts }));
    };

    const totalShirts = formData.shirts.reduce((acc, curr) => acc + curr.quantity, 0);
    const totalFee = 450 + Math.max(0, totalShirts - 1) * 350; // 450 base registration (includes 1 shirt) + 350 per extra shirt

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMessage('');
        try {
            await addDoc(collection(db, 'funrun_registrations'), {
                ...formData,
                userId: user ? user.uid : 'public',
                paymentStatus: 'Pending',
                timestamp: Timestamp.now(),
                amountPaid: totalFee
            });
            setSuccessMessage('Successfully registered for the June Fun Run!');
            setFormData({ 
                name: userData?.displayName || '', 
                email: userData?.email || '', 
                category: '5K', 
                shirts: [{ size: 'L', quantity: 1 }],
                paymentMethod: 'GCash',
                refNumber: '',
            });
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Error registering. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                <Activity size={32} /> Pre-Reunion 5KM Fun Run (June 6, 2026)
            </h1>
            
            <div className="w-full rounded-2xl overflow-hidden border border-white/10">
                <img src={funRunBanner} alt="Fun Run Banner" className="w-full h-auto object-cover max-h-96" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <button 
                    onClick={() => setShowPoster(!showPoster)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 text-anniversary-gold py-4 rounded-xl font-semibold transition-colors"
                >
                    <ImageIcon size={20} />
                    {showPoster ? 'Hide Event Poster' : 'View Event Poster'}
                </button>
                <button 
                    onClick={() => setShowRouteMap(!showRouteMap)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] border border-white/10 text-anniversary-gold py-4 rounded-xl font-semibold transition-colors"
                >
                    <Map size={20} />
                    {showRouteMap ? 'Hide Route Map' : 'View Route Map'}
                </button>
            </div>

            {showPoster && (
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#121212] animate-in fade-in slide-in-from-top-4 duration-300">
                    <img src="/assets/funrun_poster_v2.jpg" alt="Fun Run Poster" className="w-full h-auto object-contain" />
                </div>
            )}

            {showRouteMap && (
                <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#121212] animate-in fade-in slide-in-from-top-4 duration-300">
                    <img src="/assets/routemap_v2.jpg" alt="Fun Run Route Map" className="w-full h-auto object-contain" />
                </div>
            )}

            <div className="bg-gradient-to-r from-anniversary-gold/20 to-black border border-anniversary-gold/30 p-8 rounded-2xl flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Medal className="text-anniversary-gold" /> Run for a Cause
                    </h2>
                    <p className="text-gray-300">
                        Sponsored fundraising promoting <strong>"Healthy seniors in their golden years."</strong><br /><br />
                        LNHS Class of '76 Members must help to recruit participants by selling t-shirts as 'tickets' and qualify them to win. A Learning Session on 'promoting health of seniors' will follow the run.
                    </p>
                    
                    <div className="space-y-2 mt-4">
                        <div className="text-xl font-bold text-anniversary-gold">Runner Participation Fee: ₱450</div>
                        <div className="text-sm text-gray-400">Includes T-shirt/singlet, Bottled Water, 1 bar chocolate.</div>
                    </div>

                    <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <h3 className="text-anniversary-gold font-bold mb-2">Prizes</h3>
                        <ul className="text-gray-300 text-sm space-y-1">
                            <li><strong>1st:</strong> ₱5,000</li>
                            <li><strong>2nd:</strong> ₱3,000</li>
                            <li><strong>3rd:</strong> ₱1,500</li>
                        </ul>
                    </div>
                </div>

                <div className="w-full md:w-96 min-w-0 bg-black border border-white/10 p-6 rounded-xl relative">
                    {successMessage ? (
                        <div className="absolute inset-0 bg-black/95 flex items-center justify-center p-6 text-center rounded-xl border border-green-500/50 z-10">
                            <div>
                                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                                <p className="text-green-400 font-bold text-lg">{successMessage}</p>
                                <button onClick={() => setSuccessMessage('')} className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                                    Register another runner
                                </button>
                            </div>
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4 border-b border-white/10 pb-5">
                            <h3 className="font-semibold text-white">Participant Details</h3>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-anniversary-gold" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Email / Contact Number</label>
                                <input required type="text" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-anniversary-gold" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Category</label>
                                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2.5 text-white outline-none focus:border-anniversary-gold">
                                    <option value="3K">3K Walk/Run</option>
                                    <option value="5K">5K Run</option>
                                    <option value="10K">10K Run</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 border-b border-white/10 pb-5">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-white">Shirt Orders</h3>
                                <button type="button" onClick={handleAddShirt} className="text-sm flex items-center gap-1 text-anniversary-gold hover:text-yellow-400">
                                    <Plus size={16} /> Add Shirt
                                </button>
                            </div>
                            
                            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                                {formData.shirts.map((shirt, index) => (
                                    <div key={index} className="flex gap-2 items-center bg-[#1a1a1a] p-3 rounded-lg border border-white/5">
                                        <div className="flex-1">
                                            <label className="block text-xs text-gray-500 mb-1">Size</label>
                                            <select value={shirt.size} onChange={e => handleShirtChange(index, 'size', e.target.value)} className="w-full bg-[#121212] border border-gray-700 rounded text-sm p-1.5 text-white outline-none focus:border-anniversary-gold">
                                                <option value="S">Small</option>
                                                <option value="M">Medium</option>
                                                <option value="L">Large</option>
                                                <option value="XL">XL</option>
                                                <option value="XXL">XXL</option>
                                            </select>
                                        </div>
                                        <div className="w-20">
                                            <label className="block text-xs text-gray-500 mb-1">Qty</label>
                                            <input type="number" min="1" value={shirt.quantity} onChange={e => handleShirtChange(index, 'quantity', parseInt(e.target.value) || 1)} className="w-full bg-[#121212] border border-gray-700 rounded text-sm p-1.5 text-white outline-none focus:border-anniversary-gold" />
                                        </div>
                                        {formData.shirts.length > 1 && (
                                            <button type="button" onClick={() => handleRemoveShirt(index)} className="text-gray-500 hover:text-red-400 mt-5 p-1">
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold text-white">Payment Method</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, paymentMethod: 'GCash' })}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                                        formData.paymentMethod === 'GCash'
                                            ? 'border-anniversary-gold bg-anniversary-gold/10 text-white'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    <QrCode size={20} className="mb-1 text-anniversary-gold" />
                                    <span className="text-xs font-bold block">GCash Ahead</span>
                                    <span className="text-[9px] text-gray-500 mt-0.5">Pre-pay & log Ref</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, paymentMethod: 'Cash', refNumber: '' })}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                                        formData.paymentMethod === 'Cash'
                                            ? 'border-anniversary-gold bg-anniversary-gold/10 text-white'
                                            : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                                >
                                    <Banknote size={20} className="mb-1 text-anniversary-gold" />
                                    <span className="text-xs font-bold block">Cash on Day</span>
                                    <span className="text-[9px] text-gray-500 mt-0.5">Pay at the venue</span>
                                </button>
                            </div>

                            {formData.paymentMethod === 'GCash' && (
                                <div className="space-y-3 p-3 bg-white/5 border border-white/10 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="text-xs text-gray-300 space-y-1">
                                        <div className="text-anniversary-gold font-bold mb-1">GCash Account Details:</div>
                                        <div>Name: <strong className="text-white">Maria Santos (Treasurer)</strong></div>
                                        <div>Number: <strong className="text-white font-mono">0917-123-4567</strong></div>
                                        <div>Amount to send: <strong className="text-anniversary-gold">₱{totalFee}</strong></div>
                                    </div>
                                    
                                    {/* Mock QR Code Box */}
                                    <div className="flex items-center gap-3 bg-black/60 p-2.5 rounded-lg border border-white/5">
                                        <div className="w-14 h-14 bg-white/10 rounded border border-white/20 flex flex-col items-center justify-center text-center shrink-0">
                                            <QrCode size={24} className="text-anniversary-gold opacity-80" />
                                            <span className="text-[7px] text-gray-400 font-bold uppercase mt-1">GCash QR</span>
                                        </div>
                                        <div className="text-[9px] text-gray-400 leading-normal">
                                            Scan QR to transfer instantly. Please enter the 13-digit reference number below.
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">GCash 13-Digit Ref Number</label>
                                        <input
                                            required
                                            type="text"
                                            pattern="[0-9]{13}"
                                            maxLength={13}
                                            value={formData.refNumber}
                                            onChange={e => setFormData({ ...formData, refNumber: e.target.value.replace(/[^0-9]/g, '') })}
                                            placeholder="e.g. 2026123456789"
                                            className="w-full bg-[#121212] border border-gray-700 rounded-lg p-2 text-xs text-white font-mono outline-none focus:border-anniversary-gold"
                                        />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'Cash' && (
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-[11px] text-gray-400 leading-normal animate-in fade-in slide-in-from-top-2 duration-300">
                                    <span className="text-anniversary-gold font-bold block mb-1">On-Day Cash Payment Instructions:</span>
                                    Please prepare exactly <strong className="text-white">₱{totalFee}</strong> to pay at the Fun Run Secretariat Booth on June 6, 2026 before the event starts.
                                </div>
                            )}
                        </div>

                        <button disabled={submitting} type="submit" className="w-full bg-anniversary-gold text-black font-bold py-3.5 rounded-lg hover:bg-yellow-500 transition-colors mt-6 disabled:opacity-50">
                            {submitting ? 'Processing...' : `Reserve Slot (₱${totalFee})`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

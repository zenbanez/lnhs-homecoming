import { DollarSign, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

export default function Finance() {
    // Static mock for Finance view demonstrating layout required by prompt
    const feeStatus = [
        { section: 'Aquarius', paid: 45, pending: 5, totalContributions: 5000 },
        { section: 'Leo', paid: 30, pending: 12, totalContributions: 5000 },
        { section: 'Virgo', paid: 25, pending: 20, totalContributions: 2500 },
        { section: 'Taurus', paid: 40, pending: 2, totalContributions: 5000 }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                <DollarSign size={32} /> Finance (Ways & Means)
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-900/40 to-green-900/10 border border-green-500/30 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="text-green-400 mb-2"><TrendingUp size={24} /></div>
                        <h3 className="text-gray-300 font-medium">Total P500 Fees Collected</h3>
                    </div>
                    <div className="text-4xl font-bold text-white mt-4">₱70,000</div>
                </div>

                <div className="bg-gradient-to-br from-anniversary-gold/20 to-yellow-900/10 border border-anniversary-gold/30 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="text-anniversary-gold mb-2"><CheckCircle2 size={24} /></div>
                        <h3 className="text-gray-300 font-medium">Section P5000 Contributions</h3>
                    </div>
                    <div className="text-4xl font-bold text-white mt-4">₱45,000</div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/10 border border-blue-500/30 p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                        <div className="text-blue-400 mb-2"><AlertCircle size={24} /></div>
                        <h3 className="text-gray-300 font-medium">Donation Letters Sent</h3>
                    </div>
                    <div className="text-4xl font-bold text-white mt-4">120</div>
                </div>
            </div>

            <div className="bg-black border border-white/10 rounded-xl overflow-hidden mt-8">
                <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                    <h2 className="font-bold text-lg">Section Payment Tracking</h2>
                    <button className="text-sm bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors">Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                                <th className="p-4 font-semibold w-1/4">Section</th>
                                <th className="p-4 font-semibold">P500 Fee (Paid/Pending)</th>
                                <th className="p-4 font-semibold">Base Contribution</th>
                                <th className="p-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {feeStatus.map((s, i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{s.section}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-green-400 font-bold">{s.paid}</span>
                                            <span className="text-gray-500">/ {s.paid + s.pending}</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-1.5 mt-2">
                                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(s.paid / (s.paid + s.pending)) * 100}%` }}></div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-300 font-medium">₱{s.totalContributions.toLocaleString()}</td>
                                    <td className="p-4 text-right">
                                        {s.totalContributions >= 5000 ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-green-900/40 text-green-400">
                                                <CheckCircle2 size={12} /> CLEARED
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-yellow-900/40 text-yellow-500">
                                                PENDING
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

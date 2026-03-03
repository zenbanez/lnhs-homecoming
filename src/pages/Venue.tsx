import { MapPin, Utensils, Check, X } from 'lucide-react';

export default function Venue() {
    const options = [
        {
            name: "Madison Hotel",
            type: "Hotel Grand Ballroom",
            costPerHead: 950,
            capacity: 350,
            pros: ["Central Location", "Air-conditioned", "Premium Plated Service", "Includes Sound System"],
            cons: ["Higher cost", "Strict corkage fees"],
            recommended: false
        },
        {
            name: "Sofia's Way",
            type: "Garden Events Place",
            costPerHead: 650,
            capacity: 250,
            pros: ["Affordable", "Beautiful outdoor ambiance", "Relaxed atmosphere", "Low corkage"],
            cons: ["Dependent on weather", "Further from city center", "Basic sound system only"],
            recommended: true
        },
        {
            name: "LNHS Gymnasium",
            type: "School Facility",
            costPerHead: 400, // catering only
            capacity: 800,
            pros: ["Nostalgic", "Zero venue rental cost", "Huge capacity"],
            cons: ["No air-conditioning", "Requires extensive styling", "Need to hire external caterer completely"],
            recommended: false
        }
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                <MapPin size={32} /> Venue & Food Comparison
            </h1>

            <p className="text-gray-400 max-w-3xl">
                Review the shortlisted venues for the July 2nd Homecoming Night Gala. The cost per head includes the venue rental, standard styling, and the suggested buffet/plated menu.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {options.map((opt, idx) => (
                    <div key={idx} className={`relative bg-black border p-6 rounded-2xl flex flex-col ${opt.recommended ? 'border-anniversary-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-white/10'}`}>
                        {opt.recommended && (
                            <div className="absolute top-0 right-6 -translate-y-1/2 bg-anniversary-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                                Steering Committee Choice
                            </div>
                        )}

                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-white">{opt.name}</h2>
                            <p className="text-sm text-gray-500">{opt.type}</p>
                        </div>

                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-4xl font-black text-anniversary-gold">₱{opt.costPerHead}</span>
                            <span className="text-gray-500 mb-1">/ head</span>
                        </div>

                        <div className="mb-6 flex items-center gap-2 text-sm text-gray-300 bg-white/5 p-3 rounded-lg">
                            <Utensils size={16} className="text-gray-500" /> Capacity: <strong>Up to {opt.capacity} pax</strong>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pros</h4>
                                <ul className="space-y-2">
                                    {opt.pros.map((pro, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-200">
                                            <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                                            <span>{pro}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Cons</h4>
                                <ul className="space-y-2">
                                    {opt.cons.map((con, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                            <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            <span>{con}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button className={`w-full mt-8 py-3 rounded-lg font-bold transition-colors ${opt.recommended
                                ? 'bg-anniversary-gold hover:bg-yellow-500 text-black'
                                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                            }`}>
                            Select Venue
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

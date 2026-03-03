import { CalendarDays, MapPin, Clock } from 'lucide-react';

export default function Program() {
    const itinerary = [
        {
            day: "Day 1: July 2, 2026",
            title: "Homecoming & Gala",
            events: [
                { time: "8:00 AM", event: "Thanksgiving Mass", venue: "LNHS Main Chapel", color: "border-blue-500" },
                { time: "9:30 AM", event: "Grand Motorcade", venue: "City Center Route", color: "border-green-500" },
                { time: "11:00 AM", event: "Brunch Fellowship", venue: "LNHS Gymnasium", color: "border-yellow-500" },
                { time: "5:00 PM", event: "Homecoming Night Gala", venue: "TBD", color: "border-anniversary-gold" },
            ]
        },
        {
            day: "Day 2: July 3, 2026",
            title: "Optional Tours",
            events: [
                { time: "7:00 AM", event: "Assembly for Tours", venue: "Hotel Lobby", color: "border-purple-500" },
                { time: "8:00 AM", event: "Heritage City Tour", venue: "Various Landmarks", color: "border-pink-500" },
                { time: "12:00 NN", event: "Lunch by the Sea", venue: "Coastal Restobar", color: "border-orange-500" },
                { time: "7:00 PM", event: "Free Evening / Section Dinners", venue: "Various", color: "border-gray-500" },
            ]
        },
        {
            day: "Day 3: July 4, 2026",
            title: "Farewell & Forward",
            events: [
                { time: "9:00 AM", event: "Farewell Breakfast", venue: "Main Hotel", color: "border-teal-500" },
                { time: "11:00 AM", event: "Closing Remarks & 55th Prep", venue: "Function Hall", color: "border-indigo-500" },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                    <CalendarDays size={32} /> Program Itinerary
                </h1>
                <button className="px-4 py-2 bg-anniversary-gold text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                    Print Schedule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {itinerary.map((day, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-1">{day.day}</h2>
                        <h3 className="text-sm font-medium text-anniversary-gold mb-6 uppercase tracking-wider">{day.title}</h3>

                        <div className="space-y-4">
                            {day.events.map((ev, i) => (
                                <div key={i} className={`bg-black p-4 rounded-xl border-l-4 ${ev.color} border-t border-t-white/5 border-r border-r-white/5 border-b border-b-white/5`}>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                        <Clock size={14} />
                                        <span>{ev.time}</span>
                                    </div>
                                    <div className="font-semibold text-gray-200 mb-2">{ev.event}</div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <MapPin size={14} />
                                        <span>{ev.venue}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

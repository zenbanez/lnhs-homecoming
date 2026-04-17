import { CalendarDays, MapPin, Clock } from 'lucide-react';

export default function Program() {
    const itinerary = [
        {
            day: "Day 1: July 2, 2026",
            title: "Homecoming & Gala",
            events: [
                { time: "8:00 AM", event: "Thanksgiving Mass", venue: "LNHS Main Chapel", color: "border-blue-500" },
                { time: "9:00 AM", event: "Registration & Fellowship Brunch", venue: "Madison Hotel", color: "border-green-500" },
                { time: "11:00 AM", event: "Trip Down Memory Lane", venue: "LNHS Gymnasium", color: "border-yellow-500" },
                { time: "5:00 PM", event: "Homecoming Night Gala", venue: "1.5 Degrees Celsius", color: "border-anniversary-gold" },
            ]
        },
        {
            day: "Day 2: July 3, 2026",
            title: "Outdoor Fun",
            events: [
                { time: "9:00 AM", event: "Registration & Gathering", venue: "Hotel Lobby", color: "border-purple-500" },
                { time: "10:00 AM", event: "Travel to Venue", venue: "TBA", color: "border-pink-500" },
                { time: "12:00 NN", event: "Lunch by the Sea", venue: "TBA", color: "border-orange-500" },
                { time: "7:00 PM", event: "Free Evening / Section Dinners", venue: "Various Venues", color: "border-gray-500" },
            ]
        },
        {
            day: "Day 3: July 4, 2026",
            title: "Optional Tours",
            events: [
                { time: "9:00 AM", event: "Assemble for Farm Tours", venue: "Hotel Lobby", color: "border-teal-500" },
                { time: "12:00 NN", event: "Lunch at Selected Farm", venue: "Various Venues", color: "border-indigo-500" },
                { time: "5:00 PM", event: "Closing & Planning for Next Reunion", venue: "Hotel", color: "border-indigo-500" },
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

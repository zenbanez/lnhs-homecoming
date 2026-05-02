import { CalendarDays, MapPin, Clock, Download } from 'lucide-react';

export default function Program() {
    const itinerary = [
        {
            day: "Day 1: July 2, 2026",
            title: "Morning & Afternoon",
            events: [
                { time: "8:30 AM", event: "Thanksgiving Mass", venue: "St. Roch the Healer Parish, Manlurip", color: "border-blue-500" },
                { time: "09:45 AM", event: "Optional Brunch", venue: "Madison Hotel (Buffet P300/pax or a la carte w/ SC discount)", color: "border-green-500" },
                { time: "11:30 AM", event: "Motorcade to LNHS", venue: "From Madison Hotel", color: "border-yellow-500" },
                { time: "1:00 PM", event: "'Walk Down Memory Lane'", venue: "Tour of LNHS", color: "border-orange-500" },
                { time: "2:00 PM", event: "Free Time", venue: "Various Locations", color: "border-gray-500" },
                { time: "5:00 PM", event: "Gala Night", venue: "1.5 Degrees Celcius, Magsaysay Blvd.", color: "border-red-500" },
            ]
        },
        {
            day: "Day 2: July 3, 2026",
            title: "Outdoor Swimming Party",
            events: [
                { time: "9:00 AM", event: "Meet up at Port Royale", venue: "Manlurip, San Jose", color: "border-teal-500" },
                { time: "10:00 AM", event: "Outdoor Swimming Party", venue: "Entrance Fee: 240/pax. Bring food to share - per section", color: "border-blue-400" },
            ]
        },
        {
            day: "Day 3: July 4, 2026",
            title: "Optional Farm Tours",
            events: [
                { time: "9:00 AM", event: "Meet up at Madison Hotel Lobby", venue: "Manlurip, San Jose", color: "border-teal-500" },
                { time: "10:00 AM", event: "Travel to Farm Venue", venue: "Cost to be Announced", color: "border-blue-400" },
            ]
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-anniversary-gold flex items-center gap-3">
                    <CalendarDays size={32} /> Program Itinerary
                </h1>
                <button onClick={() => window.print()} className="px-4 py-2 bg-anniversary-gold text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
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

            <section className="max-w-4xl mx-auto px-4 mt-16 text-center space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="bg-anniversary-gold w-2 h-6 rounded-full inline-block"></span>
                        Official Event Poster
                    </h2>
                    <a 
                        href="/assets/poster.png" 
                        download="LNHS_Class76_Homecoming_Poster.png"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        <Download size={18} />
                        Download Poster
                    </a>
                </div>
                
                <div className="rounded-3xl overflow-hidden border-2 border-anniversary-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-black">
                    <img 
                        src="/assets/poster.png" 
                        alt="Homecoming Reunion Poster" 
                        className="w-full h-auto object-contain bg-white"
                    />
                </div>
            </section>
        </div>
    );
}

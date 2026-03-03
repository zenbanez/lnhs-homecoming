export default function LandingPage() {
    return (
        <div className="space-y-16 py-8">
            <section className="relative h-[500px] w-full overflow-hidden rounded-3xl border border-white/10 group">
                <img
                    src="/assets/lnhs_old.jpg"
                    alt="LNHS Building Sketch"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anniversary-black via-anniversary-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-anniversary-gold to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl">
                        Welcome Home, Class of '76
                    </h1>
                    <p className="text-xl md:text-2xl text-white font-medium max-w-2xl drop-shadow-md">
                        Join us in celebrating our 50th Anniversary Golden Jubilee.
                    </p>
                    <div className="pt-4">
                        <span className="px-6 py-2 bg-anniversary-gold text-black font-black rounded-full uppercase tracking-widest text-sm">
                            July 2-4, 2026
                        </span>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-anniversary-gold mb-12">
                    Purpose of our Golden Jubilee
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "Celebrate", img: "/assets/purpose-1.png", text: "Mark 50 years since graduation, celebrate life, and enjoy each other's company." },
                        { title: "Reconnect", img: "/assets/purpose-2.png", text: "Meet and greet batchmates while we have the strength and opportunity." },
                        { title: "Relieve Stress", img: "/assets/purpose-3.png", text: "A joyous escape from the daily grind and a chance to laugh like old times." },
                        { title: "United Together", img: "/assets/purpose-4.png", text: "A time to get together, be united, and strengthen our collective bond." },
                        { title: "Deeper Connection", img: "/assets/purpose-5.png", text: "A chance to connect and get to know each other even better after all these years." },
                        { title: "Future Avenues", img: "/assets/purpose-6.png", text: "Setting the stage for future endeavors to help and learn from each other." }
                    ].map((item, i) => (
                        <div key={i} className="group bg-white/5 border border-anniversary-gold/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-anniversary-gold/30 transition-all duration-500 hover:-translate-y-2">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-anniversary-black via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-anniversary-gold text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                        Purpose 0{i + 1}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-anniversary-gold font-bold text-xl mb-3 group-hover:text-white transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

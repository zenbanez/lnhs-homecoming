export default function Footer() {
    return (
        <footer className="bg-black py-8 border-t border-anniversary-gold/20 text-center text-sm text-gray-400">
            <div className="max-w-4xl mx-auto px-4">
                <h3 className="text-lg font-semibold text-anniversary-gold mb-4">Contact Us</h3>
                <p className="mb-2">Steering Committee Head: <span className="text-white">Nancy Elona Villablanca</span></p>
                <p className="mb-6">For inquiries, contact the Secretariat or appropriate committee leads.</p>
                <p>&copy; {new Date().getFullYear()} LNHS Class of '76. All rights reserved.</p>
            </div>
        </footer>
    );
}

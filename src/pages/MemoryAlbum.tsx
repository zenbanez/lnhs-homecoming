import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Camera, Image as ImageIcon, Upload, X, Loader2, Trash2 } from 'lucide-react';

interface Photo {
    id: string;
    url: string;
    caption: string;
    uploaderName: string;
    uploaderId: string;
    category: string;
    storagePath?: string;
    createdAt: any;
}

const CATEGORIES = ['Memories', 'Places', 'People', 'Other'];

export default function MemoryAlbum() {
    const { user, userData } = useAuth();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    // Upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('Memories');
    const [filterCategory, setFilterCategory] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const q = query(collection(db, 'photos'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const photoData: Photo[] = [];
            snapshot.forEach((doc) => {
                photoData.push({ id: doc.id, ...doc.data() } as Photo);
            });
            setPhotos(photoData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching photos:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File is too large. Maximum size is 5MB.');
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile || !user) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // 1. Upload to Firebase Storage
            const storageRef = ref(storage, `memory_album/${Date.now()}_${selectedFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(Math.round(progress));
                },
                (error) => {
                    console.error("Upload error:", error);
                    alert("Upload failed. Please ensure Firebase Storage is enabled and rules allow writes.");
                    setIsUploading(false);
                },
                async () => {
                    // 2. Get Download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // 3. Save to Firestore
                    await addDoc(collection(db, 'photos'), {
                        url: downloadURL,
                        caption: caption || 'Golden Memories',
                        category: category,
                        uploaderName: userData?.displayName || user.email?.split('@')[0] || 'Batchmate',
                        uploaderId: user.uid,
                        storagePath: uploadTask.snapshot.ref.fullPath,
                        createdAt: serverTimestamp()
                    });

                    // Reset
                    setIsUploading(false);
                    setCaption('');
                    setCategory('Memories');
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            );
        } catch (error) {
            console.error(error);
            setIsUploading(false);
        }
    };

    const handleDelete = async (photo: Photo) => {
        if (!window.confirm("Are you sure you want to delete this photo?")) return;

        try {
            // 1. Delete from Firestore
            await deleteDoc(doc(db, 'photos', photo.id));

            // 2. Delete from Storage (if path exists)
            if (photo.storagePath) {
                const photoRef = ref(storage, photo.storagePath);
                await deleteObject(photoRef).catch(console.error);
            }

            if (selectedPhoto?.id === photo.id) setSelectedPhoto(null);
        } catch (error) {
            console.error("Error deleting photo:", error);
            alert("Failed to delete photo.");
        }
    };

    return (
        <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <section className="text-center space-y-6">
                <div className="mx-auto h-16 w-16 bg-anniversary-gold/20 rounded-full flex items-center justify-center text-anniversary-gold mb-6">
                    <Camera size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Homecoming <span className="text-anniversary-gold">Memory Album</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    A collection of nostalgic moments from our high school days and past reunions.
                </p>
            </section>

            {/* Upload Section (Authenticated Users Only) */}
            {user && (
                <div className="bg-white/5 border border-anniversary-gold/20 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Upload size={20} className="text-anniversary-gold" /> Add to Album
                    </h3>
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Add a short description..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                disabled={isUploading}
                                className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={isUploading}
                                className="bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1 flex w-full">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    ref={fileInputRef}
                                    className="hidden"
                                    id="photo-upload"
                                    disabled={isUploading}
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-colors cursor-pointer text-center border-2 border-dashed
                                        ${isUploading
                                            ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                                            : 'border-anniversary-gold/50 text-anniversary-gold hover:border-anniversary-gold hover:bg-anniversary-gold/10'}`}
                                >
                                    <ImageIcon size={20} />
                                    {selectedFile ? selectedFile.name : 'Select Image'}
                                </label>
                            </div>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-8 rounded-lg font-bold transition-colors shadow-none
                                    ${!selectedFile || isUploading
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-anniversary-gold hover:bg-yellow-500 text-black shadow-lg shadow-yellow-900/20'}`}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        {uploadProgress}%
                                    </>
                                ) : (
                                    <>
                                        <Upload size={20} /> Upload
                                    </>
                                )}
                            </button>
                        </div>
                        {selectedFile && (
                            <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
                                <span>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-red-400 hover:text-red-300">
                                    Change Selection
                                </button>
                            </div>
                        )}
                        <p className="text-xs text-gray-500 text-center">Max size: 5MB. Formats: JPG, PNG, WEBP.</p>
                    </div>

                    {/* Progress Bar */}
                    {isUploading && (
                        <div className="w-full bg-gray-800 rounded-full h-1.5 mt-4 overflow-hidden">
                            <div className="bg-anniversary-gold h-1.5 transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}
                </div>
            )}

            {!user && (
                <div className="text-center text-sm text-gray-400 bg-black/40 py-4 rounded-lg border border-white/5">
                    Login to upload your own golden memories.
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                <button
                    onClick={() => setFilterCategory(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!filterCategory ? 'bg-anniversary-gold text-black' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                    All Photos
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterCategory === cat ? 'bg-anniversary-gold text-black' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-anniversary-gold" size={40} />
                </div>
            ) : photos.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl">
                    <ImageIcon size={48} className="mx-auto text-gray-700 mb-4" />
                    <h3 className="text-xl font-bold text-gray-500">The album is empty.</h3>
                    <p className="text-gray-600">Be the first to share a memory!</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {photos
                        .filter(photo => !filterCategory || photo.category === filterCategory)
                        .map((photo) => (
                            <div
                                key={photo.id}
                                onClick={() => setSelectedPhoto(photo)}
                                className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden bg-black border border-white/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-anniversary-gold/10"
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.caption}
                                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="inline-block px-2 py-0.5 bg-anniversary-gold/20 text-anniversary-gold text-[10px] font-bold uppercase rounded w-fit mb-2">
                                        {photo.category || 'Memory'}
                                    </span>
                                    <p className="text-white font-medium text-lg leading-tight mb-2 line-clamp-3">{photo.caption}</p>
                                    <p className="text-anniversary-gold text-sm font-bold flex items-center gap-2">
                                        <UserIcon size={14} /> {photo.uploaderName}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {/* Lightbox Modal */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex-1 overflow-hidden rounded-t-xl bg-black/50 flex items-center justify-center">
                            <img
                                src={selectedPhoto.url}
                                alt={selectedPhoto.caption}
                                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl"
                            />
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-b-xl border-t border-white/10">
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <p className="text-white text-xl font-medium">{selectedPhoto.caption}</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-anniversary-gold/20 text-anniversary-gold text-xs font-bold uppercase rounded whitespace-nowrap">
                                        {selectedPhoto.category || 'Memory'}
                                    </span>
                                    {user?.uid === selectedPhoto.uploaderId && (
                                        <button
                                            onClick={() => handleDelete(selectedPhoto)}
                                            className="p-1.5 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors"
                                            title="Delete Photo"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="text-anniversary-gold font-bold flex items-center gap-1">
                                    Shared by {selectedPhoto.uploaderName}
                                </span>
                                {selectedPhoto.createdAt && (
                                    <span>
                                        • {new Date(selectedPhoto.createdAt.seconds * 1000).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Ensure UserIcon is imported for the hover state
import { User as UserIcon } from 'lucide-react';

import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { FileText, Save, Upload, Loader2, Download, Trash2, File as FileIcon, Image as ImageIcon } from 'lucide-react';

interface DocumentRecord {
    id: string;
    title: string;
    category: string;
    url: string;
    storagePath: string;
    uploaderName: string;
    uploaderId: string;
    fileType: string;
    createdAt: any;
}

const CATEGORIES = [
    'Meeting Minutes',
    'Official Letters',
    'Financial Reports',
    'Sponsorships',
    'Vendors & Contracts',
    'Other'
];

export default function Secretariat() {
    const { user, userData } = useAuth();
    const [documents, setDocuments] = useState<DocumentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string | null>(null);

    // Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const q = query(collection(db, 'documents'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docData: DocumentRecord[] = [];
            snapshot.forEach((d) => {
                docData.push({ id: d.id, ...d.data() } as DocumentRecord);
            });
            setDocuments(docData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching documents:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        // Allow PDFs and Images
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a PDF or Image file (JPG/PNG/WEBP).');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File is too large. Maximum size is 10MB.');
            return;
        }

        setSelectedFile(file);
        if (!title) {
            // Auto-fill title from filename if empty
            setTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !user || !title) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const storageRef = ref(storage, `secretariat_docs/${Date.now()}_${selectedFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, selectedFile);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(Math.round(progress));
                },
                (error) => {
                    console.error("Upload error:", error);
                    alert("Upload failed. Check console for details.");
                    setIsUploading(false);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    await addDoc(collection(db, 'documents'), {
                        title: title,
                        category: category,
                        url: downloadURL,
                        storagePath: uploadTask.snapshot.ref.fullPath,
                        fileType: selectedFile.type,
                        uploaderName: userData?.displayName || user.email?.split('@')[0] || 'Committee Member',
                        uploaderId: user.uid,
                        createdAt: serverTimestamp()
                    });

                    setIsUploading(false);
                    setTitle('');
                    setCategory(CATEGORIES[0]);
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                }
            );
        } catch (error) {
            console.error(error);
            setIsUploading(false);
        }
    };

    const handleDelete = async (docRecord: DocumentRecord) => {
        if (!window.confirm(`Are you sure you want to delete "${docRecord.title}"?`)) return;

        try {
            await deleteDoc(doc(db, 'documents', docRecord.id));
            if (docRecord.storagePath) {
                const fileRef = ref(storage, docRecord.storagePath);
                await deleteObject(fileRef).catch(console.error);
            }
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Failed to delete document.");
        }
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return <FileText className="text-red-400" size={24} />;
        if (fileType.includes('image')) return <ImageIcon className="text-blue-400" size={24} />;
        return <FileIcon className="text-gray-400" size={24} />;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <FileText className="text-anniversary-gold" size={36} /> Secretariat Archive
                </h1>
                <p className="text-gray-400 text-lg">
                    Digital document management for meeting minutes, letters, and planning resources.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Section */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 rounded-2xl sticky top-24">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Upload className="text-anniversary-gold" size={20} /> Upload Document
                        </h2>

                        <form onSubmit={handleUpload} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Document Title</label>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-anniversary-gold transition-colors placeholder:text-gray-600"
                                    placeholder="e.g. March Board Meeting Minutes"
                                    disabled={isUploading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-anniversary-gold transition-colors"
                                    disabled={isUploading}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">File</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,image/jpeg,image/png,image/webp"
                                        onChange={handleFileSelect}
                                        ref={fileInputRef}
                                        className="hidden"
                                        id="doc-upload"
                                        disabled={isUploading}
                                        required
                                    />
                                    <label
                                        htmlFor="doc-upload"
                                        className={`w-full flex items-center justify-between border-2 border-dashed px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer text-sm
                                            ${isUploading
                                                ? 'border-gray-700 text-gray-500 cursor-not-allowed bg-black/50'
                                                : 'border-gray-600 text-gray-300 hover:border-anniversary-gold hover:text-white bg-black/50 hover:bg-white/5'}`}
                                    >
                                        <span className="truncate max-w-[80%]">
                                            {selectedFile ? selectedFile.name : 'Select PDF or Image...'}
                                        </span>
                                        <Upload size={16} className={selectedFile ? 'text-anniversary-gold' : 'text-gray-500'} />
                                    </label>
                                </div>
                                {selectedFile && (
                                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                        <span>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                        <button type="button" onClick={() => { setSelectedFile(null); setTitle(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-red-400 hover:text-red-300">
                                            Clear
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                disabled={!selectedFile || isUploading || !title}
                                type="submit"
                                className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2
                                    ${(!selectedFile || isUploading || !title)
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-anniversary-gold to-yellow-500 text-black hover:opacity-90 shadow-[0_0_15px_rgba(234,179,8,0.2)]'}`}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Uploading {uploadProgress}%
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Save Document
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Document List Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterCategory(null)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${!filterCategory ? 'bg-anniversary-gold border-anniversary-gold text-black' : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'}`}
                        >
                            All Documents
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${filterCategory === cat ? 'bg-anniversary-gold border-anniversary-gold text-black' : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
                        {loading ? (
                            <div className="flex justify-center items-center py-20 text-gray-500">
                                <Loader2 className="animate-spin text-anniversary-gold mb-2" size={32} />
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <FileText size={48} className="mx-auto text-gray-700 mb-4" />
                                <h3 className="text-xl font-bold text-gray-400 mb-2">Archive is Empty</h3>
                                <p className="text-gray-500 text-sm">Upload meeting minutes or official documents to get started.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {documents
                                    .filter(doc => !filterCategory || doc.category === filterCategory)
                                    .map(docRecord => (
                                        <div key={docRecord.id} className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl shrink-0">
                                                    {getFileIcon(docRecord.fileType)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-lg font-bold text-white truncate mb-1">{docRecord.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                                                        <span className="text-anniversary-gold font-medium">{docRecord.category}</span>
                                                        <span className="text-gray-600 hidden sm:inline">•</span>
                                                        <span className="text-gray-400 truncate">Uploaded by {docRecord.uploaderName}</span>
                                                        <span className="text-gray-600 hidden sm:inline">•</span>
                                                        <span className="text-gray-500 text-xs">
                                                            {docRecord.createdAt ? new Date(docRecord.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-white/5">
                                                <a
                                                    href={docRecord.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
                                                >
                                                    <Download size={16} /> View / Download
                                                </a>
                                                {/* Allow deletion if user is uploader OR if they are part of the secretariat (mocked via generic auth for now) */}
                                                {user?.uid === docRecord.uploaderId && (
                                                    <button
                                                        onClick={() => handleDelete(docRecord)}
                                                        className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 hover:border-red-500"
                                                        title="Delete Document"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {documents.filter(doc => !filterCategory || doc.category === filterCategory).length === 0 && (
                                    <div className="text-center py-12 text-gray-500 italic">
                                        No documents found in this category.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

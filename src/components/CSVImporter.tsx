import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';

interface CSVImporterProps {
    onImport: (data: any[]) => Promise<void>;
    expectedHeaders: string[];
}

export default function CSVImporter({ onImport, expectedHeaders }: CSVImporterProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                setError('Please select a valid CSV file.');
                return;
            }
            setFile(selectedFile);
            setError(null);
            setSuccess(false);
        }
    };

    const parseCSV = (text: string) => {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length < 2) throw new Error('CSV file is empty or missing data.');

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Validate headers
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h.toLowerCase()));
        if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }

        const data = lines.slice(1).map((line) => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((header, i) => {
                obj[header] = values[i] || '';
            });
            return obj;
        });

        return data;
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsParsing(true);
        setError(null);

        try {
            const text = await file.text();
            const data = parseCSV(text);
            
            setIsParsing(false);
            setIsUploading(true);
            
            await onImport(data);
            
            setSuccess(true);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err: any) {
            setError(err.message || 'Failed to parse or upload CSV.');
            console.error(err);
        } finally {
            setIsParsing(false);
            setIsUploading(false);
        }
    };

    return (
        <Card className="p-6 border-dashed border-2 border-white/10 bg-white/5" variant="flat">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-12 w-12 bg-anniversary-gold/20 rounded-full flex items-center justify-center text-anniversary-gold">
                    <FileText size={24} />
                </div>
                
                <div>
                    <h3 className="text-lg font-bold text-white">Batch Import Classmates</h3>
                    <p className="text-sm text-gray-400 mt-1 max-w-sm">
                        Upload a CSV file with headers: <span className="text-gray-300 font-mono">{expectedHeaders.join(', ')}</span>
                    </p>
                </div>

                <div className="w-full max-w-xs pt-2">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="hidden"
                        id="csv-upload"
                        disabled={isParsing || isUploading}
                    />
                    <label
                        htmlFor="csv-upload"
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all border border-gray-700 cursor-pointer bg-black hover:bg-gray-900 text-white
                            ${(isParsing || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Upload size={18} />
                        {file ? file.name : 'Select CSV File'}
                    </label>
                </div>

                {file && !success && (
                    <Button
                        onClick={handleUpload}
                        isLoading={isParsing || isUploading}
                        className="w-full max-w-xs"
                    >
                        Start Import
                    </Button>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg w-full">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 p-3 rounded-lg w-full">
                        <CheckCircle size={16} />
                        <span>Import completed successfully!</span>
                    </div>
                )}
            </div>
        </Card>
    );
}

import { Timestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'committee' | 'admin';

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string;
    photoURL?: string;
    role: UserRole;
    onboarded: boolean;
    section?: string;
    gender?: 'Male' | 'Female';
    contactNumber?: string;
    status?: 'Attend' | 'Support';
    committee?: string;
    lastLogin?: Timestamp;
    updatedAt?: Timestamp;
}

export interface Classmate {
    id: string; // Often matches User uid if registered
    name: string;
    section: string;
    gender: 'Male' | 'Female';
    status: 'Confirmed' | 'No Contact' | 'Deceased';
    contactNumber?: string;
    paymentStatus?: 'Paid' | 'Unpaid';
    lastLogin?: Timestamp;
    confirmedAt?: Timestamp;
}

export interface Payment {
    id: string;
    userId: string;
    userName: string;
    userSection: string;
    type: 'Registration Fee' | 'Section Contribution' | 'Donation' | 'T-Shirt' | string;
    amount: number;
    method: string;
    refNumber: string;
    status: 'Pending' | 'Approved' | 'Flagged';
    createdAt: Timestamp;
    verifiedAt?: Timestamp;
}

export interface DocumentRecord {
    id: string;
    title: string;
    category: 'Meeting Minutes' | 'Official Letters' | 'Financial Reports' | 'Sponsorships' | 'Vendors & Contracts' | 'Other' | string;
    url: string;
    storagePath: string;
    fileType: string;
    uploaderName: string;
    uploaderId: string;
    createdAt: Timestamp;
}

export interface Photo {
    id: string;
    url: string;
    caption: string;
    category: 'Memories' | 'Places' | 'People' | 'Other' | string;
    uploaderName: string;
    uploaderId: string;
    storagePath?: string;
    createdAt: Timestamp;
}

export interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    location?: string;
    updatedAt: Timestamp;
}

export interface EventRegistration {
    id: string;
    userId: string;
    userName: string;
    type: 'Gala' | 'FunRun';
    status: 'Registered' | 'Attended' | 'Cancelled';
    createdAt: Timestamp;
}

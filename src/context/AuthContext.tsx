import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userData: any | null;
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUserData = async () => {
        if (auth.currentUser) {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                setUserData(null);
            }
        } else {
            setUserData(null);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setLoading(true);
            }
            setUser(user);
            if (user) {
                // Update last login
                try {
                    const now = Timestamp.now();
                    const userRef = doc(db, 'users', user.uid);
                    await updateDoc(userRef, {
                        lastLogin: now
                    });

                    // Sync to classmates collection if record exists
                    const classmateRef = doc(db, 'classmates', user.uid);
                    const classmateDoc = await getDoc(classmateRef);
                    if (classmateDoc.exists()) {
                        await updateDoc(classmateRef, {
                            lastLogin: now
                        });
                    }
                } catch (e) {
                    console.error("Failed to update last login", e);
                }
                await refreshUserData();
            } else {
                setUserData(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, userData, refreshUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

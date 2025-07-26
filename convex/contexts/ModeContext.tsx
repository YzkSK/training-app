import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ModeContextType {
    currentMode: 'trainer' | 'dieter' | null;
    setAndStoreMode: (mode: 'trainer' | 'dieter') => Promise<void>;
    isLoading: boolean;
}

export const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentMode, setCurrentMode] = useState<'trainer' | 'dieter' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMode = async () => {
            try {
                const storedMode = await AsyncStorage.getItem('appMode');
                if (storedMode === 'trainer' || storedMode === 'dieter') {
                    setCurrentMode(storedMode);
                }
            } catch (error) {
                console.error("Failed to load mode from AsyncStorage", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadMode();
    }, []);

    const setAndStoreMode = async (mode: 'trainer' | 'dieter') => {
        try {
            await AsyncStorage.setItem('appMode', mode);
            setCurrentMode(mode);
        } catch (error) {
            console.error("Failed to save mode to AsyncStorage", error);
        }
    };

    return (
        <ModeContext.Provider value={{ currentMode, setAndStoreMode, isLoading }}>
            {children}
        </ModeContext.Provider>
    );
};

export const useMode = () => {
    const context = useContext(ModeContext);
    if (context === undefined) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
};
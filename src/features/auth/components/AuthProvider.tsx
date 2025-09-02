'use client';

import React, { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/shared/utils/lib/firebase';
import { AuthService } from '../services/authService';
import { AuthContextType, User } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        const user = AuthService.convertFirebaseUser(firebaseUser);
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = AuthService.signInWithEmail;
  const signUp = AuthService.signUp;
  const signInWithGoogle = AuthService.signInWithGoogle;
  const logout = AuthService.signOut;
  const resetPassword = AuthService.resetPassword;

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    await AuthService.updateUserProfile(displayName, photoURL);
    // Update local state
    setUser(prev =>
      prev
        ? { ...prev, displayName, photoURL: photoURL || prev.photoURL }
        : null
    );
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

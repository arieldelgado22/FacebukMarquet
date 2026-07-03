/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from '../../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setProfile(null);

      if (currentUser) {
        const profileSnapshot = await getDoc(doc(db, 'usuarios', currentUser.uid));
        if (profileSnapshot.exists()) {
          setProfile(profileSnapshot.data());
        } else {
          const usersSnapshot = await getDocs(query(collection(db, 'usuarios'), limit(1)));
          const role = usersSnapshot.empty ? 'admin' : 'cliente';
          const userProfile = {
            email: currentUser.email,
            role,
            createdAt: serverTimestamp(),
          };

          await setDoc(doc(db, 'usuarios', currentUser.uid), userProfile);
          setProfile(userProfile);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const register = async (email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const usersSnapshot = await getDocs(query(collection(db, 'usuarios'), limit(1)));
    const role = usersSnapshot.empty ? 'admin' : 'cliente';
    const userProfile = {
      email: credential.user.email,
      role,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'usuarios', credential.user.uid), userProfile);
    setProfile(userProfile);

    return credential.user;
  };

  const logout = () => signOut(auth);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: profile?.role === 'admin',
      login,
      logout,
      register,
    }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}

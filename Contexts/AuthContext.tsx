"use client";

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  updateEmail,
  updatePassword,
  User,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../Firebase/firebase";

interface Props {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signUp(
    email: string,
    password: string,
    newDisplayName: string
  ) {
    await createUserWithEmailAndPassword(auth, email, password);
    if (currentUser) {
      try {
        const date = Date.now;
        const docRef = await addDoc(collection(db, "userData"), {
          currentSession: date,
          sessions: [date],
        });
        console.log(docRef.id);
      } catch (e) {
        console.log(e);
      }
    }
    //try to find user docs
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
    return;
  }

  function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signOut() {
    return auth.signOut();
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserEmail(email: string) {
    if (currentUser) {
      return updateEmail(currentUser, email);
    }
  }

  function updateUserPassword(password: string) {
    if (currentUser) {
      return updatePassword(currentUser, password);
    }
  }

  function updateUserDisplayName(newDisplayName: string) {
    if (currentUser) {
      return updateProfile(currentUser, { displayName: newDisplayName });
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (loading) {
        setLoading(false);
      }
    });
  }, []);

  const value = {
    currentUser,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserEmail,
    updateUserPassword,
    updateUserDisplayName,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;

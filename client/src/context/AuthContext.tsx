/*
Adapted from:
"React + Firebase: A Simple Context-Based Authentication Provider"
by David Chowitz
https://dev.to/dchowitz/react-firebase-a-simple-context-based-authentication-provider-1ool?utm_source=chatgpt.com

"Building a React App with Firebase Authentication Using AuthContext"
by Yogesh Mule
https://medium.com/%40yogeshmulecraft/building-a-react-app-with-firebase-authentication-using-authcontext-c749886678b2
*/


import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Contstructs the type for the AuthContext
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
}

// creates the AuthContext with its default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
});

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // useEffect to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

        // Set the user state and log change to the user state
        console.log('[AuthContext] Firebase user state changed:', firebaseUser)
        setUser(firebaseUser);

        // If the user is authenticated, set the ID token
        if (firebaseUser) {
        try {
            const idToken = await firebaseUser.getIdToken();
            setToken(idToken);
        
        // handle error getting token
        } catch (error) {
          console.error('[AuthContext] Error getting token:', error);
          setToken(null);
        } finally {
            // Set loading to false so page can render
            setLoading(false);
        }

        // handle no user logged in
        } else {
            console.log('[AuthContext] No user logged in.');
            setToken(null);
        }

        // Set loading to false after checking authentication state
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

// Return the AuthContext provider with user, token, and loading state
  return (
    <AuthContext.Provider value={{ user, token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the AuthContext
export const useAuth = () => useContext(AuthContext);
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import './Navbar.css';

const Navbar: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(() => auth.currentUser);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    const navLinks = [
        { path: '/pantry', label: 'Pantry' },
        { path: '/recipes', label: 'Recipes' },
        { path: '/about', label: 'About' },
    ];

// Links to the pages: Home, Recipes, About, and Logout
    return (
        <div className="navbar">
            {navLinks
            .filter(link => link.path !== location.pathname)
            .map(link => (
                <a key={link.path} href={link.path}>
                    {link.label}
                </a>
            ))
        }
        {user && ( 
            <button className="logout-button" onClick={handleLogout}>
                Logout
                </button>
        )}
        </div>
    );
};

export default Navbar;

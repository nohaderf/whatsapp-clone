import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { AuthContext } from "../context/auth";

function Navbar() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleSignout = async () => {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
            isOnline: false,
        });
        await signOut(auth);
        navigate('/login')
    }

  return (
    <nav>
        <h3>
            <Link to="/">
                <img
                    className="whatsapp_logo"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/598px-WhatsApp.svg.png"
                    alt=""
                />
            </Link>
        </h3>
        <div>
            {user ? (
                <>
                    <Link to="/profile">Profile</Link>
                    <button className="logout-btn" onClick={handleSignout}>
                        Logout
                    </button>
                </> 
            ) : (
                <>
                    <Link to="/register">Register</Link>
                    <Link to="/login">Login</Link>
                </>
            )}
        </div>
    </nav>
  );
};

export default Navbar
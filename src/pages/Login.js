import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";

function Login() {
    const [data, setData] = useState({
        email: "",
        password: "",
        error: null,
        loading: false,
    });

    const { email, password, error, loading } = data

    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if ( !email || !password) {
            setData({ ...data, error: "All fields are required" });
        }
        try {
            const result = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            await updateDoc(doc(db, "users", result.user.uid), {
                isOnline: true,
            });
            setData({
                email: "",
                password: "",
                error: null,
                loading: false,
            })
        } catch (err) {
            setData({...data, error: err.message, loading: false})
        }
        navigate('/')
    };

    return (
        <section>
            <div className="auth-container">
                <img
                    className="whatsapp-logo-lg"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/598px-WhatsApp.svg.png"
                    alt=""
                />
                <h3>Sign in to WhatsApp</h3>
                <div className="auth-div">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input_container">
                            <label>Email</label>
                            <input 
                                type="text" 
                                name="email" 
                                value={email} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div className="input_container">
                            <label>Password</label>
                            <input 
                                type="password" 
                                name="password"
                                value={password} 
                                onChange={handleChange}  
                            />
                        </div>
                        { error ? <p className="error">{error}</p> : null }
                        <button 
                            type="submit" 
                            className="register-btn" 
                            disabled={loading}
                        >
                            { loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login;
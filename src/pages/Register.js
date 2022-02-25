import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";

function Register() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
    });

    const { name, email, password, error, loading } = data

    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({ ...data, error: null, loading: true });
        if (!name || !email || !password) {
            setData({ ...data, error: "All fields are required" });
        }
        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            await setDoc(doc(db, "users", result.user.uid), {
                uid: result.user.uid,
                name,
                email,
                createdAt: Timestamp.fromDate(new Date()),
                isOnline: true,
            });
            setData({
                name: "",
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
                {/* <span className="close-btn" onClick={onClose}>&times;</span> */}
                <img
                    className="whatsapp-logo-lg"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/598px-WhatsApp.svg.png"
                    alt=""
                />
                <h3>Create An Account</h3>
                <div className="auth-div">
                    <form className="form" onSubmit={handleSubmit}>
                        <div className="input_container">
                            <label>Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={name} 
                                onChange={handleChange} 
                            />
                        </div>
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
                        <button type="submit" className="register-btn" disabled={loading}>
                            { loading ? "Creating..." : "Register"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
  )
}

export default Register
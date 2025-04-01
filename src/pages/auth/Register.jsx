import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            alert("Registration successful!");
            navigate('/login');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;

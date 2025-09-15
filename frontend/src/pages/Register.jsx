import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSubmitting(true);
    try {
      await register({ name, email, password });
      setMsg('Registration successful. Please log in.');
      setTimeout(() => nav('/login', { replace: true }), 800);
    } catch (error) {
      setErr(error?.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-gradient px-4">
      <div className="ocean-card max-w-md w-full p-8">
        <h1 className="text-2xl font-semibold mb-2">Create account</h1>
        <p className="text-gray-600 mb-6">Join the Wildlife Tracking platform.</p>
        {err && <div className="mb-4 text-error text-sm">{err}</div>}
        {msg && <div className="mb-4 text-green-600 text-sm">{msg}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="ocean-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="ocean-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="ocean-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button disabled={submitting} className="ocean-btn-primary w-full">
            {submitting ? 'Creating...' : 'Register'}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

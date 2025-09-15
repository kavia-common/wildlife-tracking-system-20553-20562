import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    try {
      await login(email, password);
      nav('/dashboard', { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-gradient px-4">
      <div className="ocean-card max-w-md w-full p-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-gray-600 mb-6">Sign in to continue tracking wildlife.</p>
        {err && <div className="mb-4 text-error text-sm">{err}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="ocean-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="ocean-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button disabled={submitting} className="ocean-btn-primary w-full">
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  );
}

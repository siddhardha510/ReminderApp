import React, { useState } from 'react';
import { apiClient } from '../api/client'; // or '../services/api' depending on where apiClient lives

interface AuthPageProps {
    onAuthSuccess: (token: string) => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
    const [isRegister, setIsRegister] = useState(false);
    const [identifier, setIdentifier] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isRegister) {
                // Calls POST /api/auth/register via Vite proxy
                const res = await apiClient.post('/auth/register', {
                    email,
                    phoneNumber,
                    password,
                });

                const token = res.data.accessToken;
                if (token) {
                    localStorage.setItem('accessToken', token);
                    onAuthSuccess(token);
                }
            } else {
                // Calls POST /api/auth/login via Vite proxy
                const res = await apiClient.post('/auth/login', {
                    identifier,
                    password,
                });

                const token = res.data.accessToken;
                if (token) {
                    localStorage.setItem('accessToken', token);
                    onAuthSuccess(token);
                }
            }
        } catch (err: any) {
            const serverMsg =
                err.response?.data?.message ||
                err.response?.data?.title ||
                'Authentication failed. Please check your credentials.';
            setError(serverMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className= "min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12" >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8" >
        {/* Brand Header */ }
            < div className = "text-center mb-8" >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl mb-3 text-2xl font-bold" >
            🔔
    </div>
        < h1 className = "text-2xl font-extrabold text-gray-900 tracking-tight" >
            ReminderApp
            </h1>
            < p className = "text-sm text-gray-500 mt-1" >
            {
                isRegister
                ? 'Create an account to manage bills & warranties'
                    : 'Sign in to access your reminders & uploads'
            }
                </p>
                </div>

    {/* Tab Toggle */ }
    <div className="flex bg-gray-100 p-1 rounded-xl mb-6" >
        <button
            type="button"
    onClick = {() => {
        setIsRegister(false);
        setError(null);
    }
}
className = {`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isRegister
        ? 'bg-white text-gray-900 shadow-sm'
        : 'text-gray-500 hover:text-gray-800'
    }`}
          >
    Sign In
        </button>
        < button
type = "button"
onClick = {() => {
    setIsRegister(true);
    setError(null);
}}
className = {`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isRegister
        ? 'bg-white text-gray-900 shadow-sm'
        : 'text-gray-500 hover:text-gray-800'
    }`}
          >
    Register
    </button>
    </div>

{/* Error Alert */ }
{
    error && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl" >
        { error }
            </div>
        )
}

{/* Auth Form */ }
<form onSubmit={ handleSubmit } className = "space-y-4" >
    {!isRegister ? (
        <div>
        <label className= "block text-xs font-bold uppercase text-gray-600 mb-1" >
        Email or Phone Number
            </label>
            < input
type = "text"
required
value = { identifier }
onChange = {(e) => setIdentifier(e.target.value)}
placeholder = "test@example.com or phone"
className = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
    />
    </div>
          ) : (
    <>
    <div>
    <label className= "block text-xs font-bold uppercase text-gray-600 mb-1" >
    Email Address
        </label>
        < input
type = "email"
required
value = { email }
onChange = {(e) => setEmail(e.target.value)}
placeholder = "name@example.com"
className = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
    />
    </div>

    < div >
    <label className="block text-xs font-bold uppercase text-gray-600 mb-1" >
        Mobile Number
            </label>
            < input
type = "tel"
required
value = { phoneNumber }
onChange = {(e) => setPhoneNumber(e.target.value)}
placeholder = "7095834571"
className = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
    />
    </div>
    </>
          )}

<div>
    <label className="block text-xs font-bold uppercase text-gray-600 mb-1" >
        Password
        </label>
        < input
type = "password"
required
value = { password }
onChange = {(e) => setPassword(e.target.value)}
placeholder = "••••••••"
className = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
    />
    </div>

    < button
type = "submit"
disabled = { loading }
className = "w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
{ loading? 'Authenticating...': isRegister ? 'Create Account' : 'Sign In' }
    </button>
    </form>
    </div>
    </div>
  );
}
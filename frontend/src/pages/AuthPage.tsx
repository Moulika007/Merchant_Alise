import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const res = login(email, password);
            if (res.success) {
                // Route based on what the role actually is
                const currentUserStr = localStorage.getItem('activeUser');
                if (currentUserStr) {
                    const parsedUser = JSON.parse(currentUserStr);
                    navigate(parsedUser.role === 'seller' ? '/seller' : '/');
                }
            } else {
                setError(res.message);
            }
        } else {
            const res = register(name, email, password, role);
            if (res.success) {
                navigate(role === 'seller' ? '/seller' : '/');
            } else {
                setError(res.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-black selection:text-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-primary text-white p-2 rounded-sm">
                        <ShoppingBag size={24} strokeWidth={2.5} />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
                    {isLogin ? "Sign in to ViralPulse" : "Create an account"}
                </h2>
                <p className="mt-2 text-center text-sm text-accent">
                    {isLogin ? "Or " : "Already have an account? "}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="font-medium text-primary hover:underline underline-offset-4"
                    >
                        {isLogin ? "create a new account" : "sign in here"}
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 border border-border sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-sm font-medium">
                                {error}
                            </div>
                        )}

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-1">Full Name</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2.5 border border-border placeholder-accent/50 text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm bg-[#fafafa]"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Email address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2.5 border border-border placeholder-accent/50 text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm bg-[#fafafa]"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-primary mb-1">Password</label>
                            <div className="mt-1 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2.5 border border-border placeholder-accent/50 text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm bg-[#fafafa]"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-accent hover:text-primary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-semibold text-primary mb-2">I am registering as a:</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setRole('buyer')}
                                        className={`py-2 text-sm font-semibold border ${role === 'buyer' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-border hover:border-accent'}`}
                                    >
                                        Buyer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole('seller')}
                                        className={`py-2 text-sm font-semibold border ${role === 'seller' ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-border hover:border-accent'}`}
                                    >
                                        Seller
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold text-white bg-primary hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors group"
                            >
                                {isLogin ? "Sign In" : "Create Account"}
                                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>

                    {isLogin && (
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-accent">Demo Accounts</span>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col gap-2">
                                <button
                                    onClick={() => { setEmail('seller@demo.com'); setPassword('password123'); }}
                                    className="w-full flex justify-center py-2 px-4 border border-border text-xs font-semibold text-primary bg-[#fafafa] hover:bg-muted transition-colors"
                                >
                                    Prefill Demo Seller
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

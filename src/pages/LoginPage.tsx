import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            setErrorMsg('Google login failed: ' + error.message);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full p-8" variant="glass">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-anniversary-gold/20 rounded-full flex items-center justify-center text-anniversary-gold mb-6">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">
                        {isRegistering ? 'Create your account' : 'Welcome back'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {isRegistering ? 'Join our golden celebration' : 'Login to reach our coordination hub'}
                    </p>
                </div>

                <Button
                    onClick={handleGoogleLogin}
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-3 py-3"
                    aria-label="Continue with Google"
                    leftIcon={
                        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                    }
                >
                    Continue with Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#121212] text-gray-500 italic">or use email</span>
                    </div>
                </div>

                {errorMsg && (
                    <div className="mt-4 p-3 bg-red-900/40 border border-red-500/50 text-red-200 rounded-lg text-sm text-center">
                        {errorMsg}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleEmailAuth}>
                    <Input
                        label="Email address"
                        type="email"
                        required
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="Password"
                        type="password"
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        className="w-full py-3 mt-6"
                        isLoading={loading}
                    >
                        {loading ? 'Processing...' : (isRegistering ? 'Create Account' : 'Sign In')}
                    </Button>
                </form>

                <div className="text-center pt-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-anniversary-gold hover:text-yellow-400"
                    >
                        {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}

import React, { useState } from 'react';
import { NodeField } from './NodeField';
import { Network, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { apiClient, errorMessage, API_URL } from '@/apiClient';
import { setToken } from '@/lib/auth';
import { AlertMessage } from './Alert';
import { useNavigate } from 'react-router-dom';


export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post('/api/signin', { email, password });
      setToken(res.data.token);
      navigate('/main');
    } catch (err) {
      setError(errorMessage(err, 'Sign in failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background dot-grid">
      <NodeField />
      <nav className="fixed w-full z-40 backdrop-blur-sm bg-background border-b border-input">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="relative">
                  <Network className="w-7 h-7 sm:w-8 sm:h-8 text-foreground transform rotate-45" />
                  <Network className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground absolute top-0 left-0 transform rotate-90" />
                </div>
                <span className="text-lg sm:text-xl font-semibold text-foreground">
                  Brainly
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border bg-card border-input">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center text-foreground">
              Welcome Back
            </h2>
            <p className="text-center mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground">
              Access Your Second Brain
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {['email', 'password'].map((field) => (
                <div key={field} className="relative">
                  <label 
                    htmlFor={field} 
                    className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-muted-foreground"
                  >
                    {field === 'email' ? 'Email Address' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={field === 'password' ? (showPassword ? 'text' : 'password') : field}
                      id={field}
                      value={field === 'email' ? email : password}
                      onChange={(e) => 
                        field === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)
                      }
                      required
                      className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-muted border-input text-foreground"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {field === 'email' ? (
                        <Mail className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>
                    {field === 'password' && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {error && <AlertMessage message={error} />}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl hover:opacity-90 transition-colors font-semibold shadow-md bg-primary text-primary-foreground active:scale-[0.99]"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="relative flex items-center py-4 text-muted-foreground">
                <div className="flex-grow border-t"></div>
                <span className="flex-shrink mx-4 text-sm">or continue with</span>
                <div className="flex-grow border-t"></div>
              </div>

              <button
                type="button"
                onClick={() => { window.location.href = `${API_URL}/api/google-signin`; }}
                className="w-full flex items-center justify-center space-x-3 px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border transition-colors font-medium bg-background hover:bg-accent text-foreground"
              >
                <span>Continue with Google</span>
              </button>
            </form>

            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="/signup-page" className="text-foreground font-semibold hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

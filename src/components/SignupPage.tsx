import React, { useState } from 'react';
import { Network, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { AlertMessage } from './Alert';
import { useNavigate } from 'react-router-dom';


export function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous error message
    setError(null);

    try {
      const response = await axios.post('https://brainly-wzoi.onrender.com/api/signup', {
        email: email,
        password: password,
        name: name,
      }).then((res)=>{
        localStorage.setItem("jwtKey",res.data?.jwtKey)
        console.log(res.data?.jwtKey)
        navigate('/main')

      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Axios error:', err.response?.data || err.message);
        setError(err.response?.data.message || 'Something went wrong');
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-black text-white">
      <nav className="fixed w-full z-40 backdrop-blur-sm bg-black border-b border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => (window.location.href = '/')}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <Network className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                <span className="text-lg sm:text-xl font-semibold">Brainly</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border bg-black border-gray-700">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center">
              Join Brainly
            </h2>
            <p className="text-center mb-6 sm:mb-8 text-sm sm:text-base text-gray-400">
              Create your account to unlock a world of learning
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {['name', 'email', 'password'].map((field) => (
                <div key={field} className="relative">
                  <label
                    htmlFor={field}
                    className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium"
                  >
                    {field === 'name' ? 'Full Name' : field === 'email' ? 'Email Address' : 'Password'}
                  </label>
                  <input
                    type={field === 'password' ? (showPassword ? 'text' : 'password') : field}
                    id={field}
                    value={field === 'name' ? name : field === 'email' ? email : password}
                    onChange={(e) =>
                      field === 'name'
                        ? setName(e.target.value)
                        : field === 'email'
                        ? setEmail(e.target.value)
                        : setPassword(e.target.value)
                    }
                    required
                    className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-white bg-black border-gray-700 text-white"
                  />
                  {field === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-[34px] sm:top-[38px] p-1 rounded-md hover:bg-gray-700 text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </button>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl hover:opacity-90 transition-colors font-semibold shadow-md bg-gray-700 text-white"
              >
                Create Account
              </button>
            </form>
            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/sign-in-page" className="text-gray-200 font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </section>
      {error && <AlertMessage message={error} />}
    </div>
  );
}

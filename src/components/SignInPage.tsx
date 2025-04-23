import React, { useState } from 'react';
import { Network, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
   const navigate = useNavigate();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log(email)
    console.log(password)
    console.log(localStorage.getItem("token"))
    try{
      await axios.post('https://brainly-wzoi.onrender.com/api/signin',{
        email:email,
        password:password,
        JWT:localStorage.getItem("token")
      }).then((res)=>{
        navigate('/main')
        console.log(res)
      })
    }catch(err){
      console.log(err)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-800">
      <nav className="fixed w-full z-40 backdrop-blur-sm bg-black border-b border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="relative">
                  <Network className="w-7 h-7 sm:w-8 sm:h-8 text-white transform rotate-45" />
                  <Network className="w-7 h-7 sm:w-8 sm:h-8 text-gray-500 absolute top-0 left-0 transform rotate-90" />
                </div>
                <span className="text-lg sm:text-xl font-semibold text-white">
                  Brainly
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto p-6 sm:p-10 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border bg-gray-800 border-gray-700">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center text-white">
              Welcome Back
            </h2>
            <p className="text-center mb-6 sm:mb-8 text-sm sm:text-base text-gray-400">
              Access Your Second Brain
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {['email', 'password'].map((field) => (
                <div key={field} className="relative">
                  <label 
                    htmlFor={field} 
                    className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300"
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
                      className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-700 border-gray-600 text-white"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-600 text-gray-300"
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

              <button
                type="submit"
                className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl hover:opacity-90 transition-colors font-semibold shadow-md bg-gray-600 text-white"
              >
                Sign In
              </button>

              <div className="relative flex items-center py-4 text-gray-400">
                <div className="flex-grow border-t"></div>
                <span className="flex-shrink mx-4 text-sm">or continue with</span>
                <div className="flex-grow border-t"></div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center space-x-3 px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl border transition-colors font-medium bg-gray-700 hover:bg-gray-600 text-white"
              >
                <span>Google</span>
              </button>
            </form>

            <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="/signup-page" className="text-white font-semibold hover:underline">Sign up</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

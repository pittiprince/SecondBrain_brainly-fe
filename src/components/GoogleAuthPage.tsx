import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '@/lib/auth';

// The API sends the user here after Google sign-in with the token in the URL fragment: #token=...
export function GoogleAuthPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = new URLSearchParams(window.location.hash.slice(1)).get('token');
    if (token) {
      setToken(token);
      // remove the token from the address bar and history
      window.history.replaceState(null, '', '/google-auth');
      navigate('/main', { replace: true });
    } else {
      navigate('/sign-in-page', { replace: true });
    }
  }, [navigate]);
  return <div className="min-h-screen bg-black text-white flex items-center justify-center">Signing you in...</div>;
}

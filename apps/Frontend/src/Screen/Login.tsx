import { useRef, useState } from "react"
import { Button } from "../Components/Button"
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { userAtom } from '@repo/store/userAtom';


const BACKEND_URL = 'http://localhost:5000'
  // import.meta.env.VITE_APP_BACKEND_URL ?? 'http://localhost:5000';

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const guestName = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null)
  const [_, setUser] = useRecoilState(userAtom);


  const handleGuestLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Add guest login logic here
      console.log('Guest login initiated')
       const response = await fetch(`${BACKEND_URL}/api/auth/guest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: (guestName.current && guestName.current.value) || '',
      }),
    });
    const user = await response.json();
    setUser(user);
    navigate('/game');
    } catch (err) {
      setError('Failed to login as guest')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Add Google OAuth logic here
      console.log('Google login initiated')
      window.open(`${BACKEND_URL}/api/auth/google`, '_self');
    } catch (err) {
      setError('Failed to login with Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-slate-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Chess</h1>
          <p className="text-slate-400">Choose your login method</p>
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-6 text-red-200 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <input
            type="text"
            ref={guestName}
            placeholder="Username"
            className="border px-4 py-2 rounded-md mb-4 w-full md:w-64"
          />
          <Button 
            onClick={handleGuestLogin}
            // disabled={isLoading}
            // classN ame="w-full py-3 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Connecting...
              </div>
            ) : (
              <>🎮 Play as Guest</>
            )}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-800 px-2 text-slate-400">or</span>
            </div>
          </div>
          
          <Button 
            onClick={handleGoogleLogin}
            // disabled={isLoading}
            // className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Connecting...
              </div>
            ) : (
              <>🔐 Continue with Google</>
            )}
          </Button>
        </div>
        
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>By continuing, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  )
}

export default Login
import { useRef, useState } from "react"
import { Button } from "../components/Button"
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
      console.log('checking user details after loing', user)
      setUser(user);
      navigate('/game/random_id');
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

  return  (
    <div className="flex flex-col items-center justify-center h-screen text-textMain">
      <h1 className="text-4xl font-bold mb-8 text-center text-green-500 drop-shadow-lg">
        Enter the Game World
      </h1>
      <div className="bg-bgAuxiliary2 rounded-lg shadow-lg p-8 flex flex-col md:flex-row">
        <div className="mb-8 md:mb-0 md:mr-8 justify-center flex flex-col">
          <div
            className="flex items-center justify-center px-4 py-2 rounded-md mb-4 cursor-pointer transition-colors hover:bg-gray-600 duration-300"
            onClick={()=>handleGoogleLogin()}
          >
            <img src="google.svg" alt="" className="w-6 h-6 mr-2" />
            Sign in with Google
          </div>
          {/* <div
            className="flex items-center justify-center px-4 py-2 rounded-md cursor-pointer hover:bg-gray-600 transition-colors duration-300"
            onClick={github}
          >
            <img src="github.svg" alt="" className="w-6 h-6 mr-2" />
            Sign in with Github
          </div> */}
        </div>
        <div className="flex flex-col items-center md:ml-8">
          <div className="flex items-center mb-4">
            <div className="bg-gray-600 h-1 w-12 mr-2"></div>
            <span className="text-gray-400">OR</span>
            <div className="bg-gray-600 h-1 w-12 ml-2"></div>
          </div>
          <input
            type="text"
            ref={guestName}
            placeholder="Username"
            className="border px-4 py-2 rounded-md mb-4 w-full md:w-64"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
            onClick={() => handleGuestLogin()}
          >
            Enter as guest
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
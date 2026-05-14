import { UserPlus, Mail, Lock, User } from 'lucide-react'
import React, {useState} from 'react'
import axios from 'axios'; 

const InputWrapper = ({ label, children }) => (
    <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
        {children}
    </div>
)

const API_URL = "http://localhost:4001"
  const INITIAL_FORM = { name: "", email:"", password:"" }

  const FIELDS = [  
    { name: "name", type: "text", placeholder: "Full Name", icons: User },
    { name: "email", type: "email", placeholder: "Email Address", icons: Mail },
    { name: "password", type: "password", placeholder: "Password", icons: Lock },
]

const MESSAGE_SUCCESS = 'bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100 mb-4'
const MESSAGE_ERROR = 'bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100 mb-4'
const BUTTONCLASSES = 'w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60'


const SignUp = ({ onSwitchMode }) => {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [loading, setLoading] = useState(false)
    const[message, setMessage] = useState({ text: "", type:"" })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: "", type:"" })

        try {
            const {data} = await axios.post(`${API_URL}/api/user/register`, formData)
            console.log("Signup Sucessfull", data)
            setMessage({text: "Registration successful! You can now log in.", type:"success"})
            setFormData(INITIAL_FORM)
        }
        catch (err) {
            console.error("Signup error:",err)
            setMessage({text: err.response?.data?.message || "An error occoured. Please try again", type:"error"})
        }
        finally {
          setLoading(false)
        }
    }

  return (
    <div className=' max-w-md w-full bg-white shadow-lg border-purple-100 rounded-xl p-8'>
        <div className=' mb-6 text-center'>
          <div className=' w-16 h-16 bg-linear-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4'>
              <UserPlus className='w-8 h-8 text-white' />
          </div>
          <h2 className=' text-2xl font-bold text-gray-800'>
            Create Account
          </h2>
          <p className=' text-gray-500 text-sm mt-1'>Join TaskFlow to manage your tasks</p>
        </div>

        {message.text && (
            <div className={message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
              {message.text}
            </div>
        )}

        <form onSubmit={handleSubmit} className=' space-y-4' >
          {FIELDS.map(({ name, type, placeholder, icons: Icon }) => (
              <div key={name} className='flex items-center border border-gray-200 rounded-lg px-3 py-2'>
                  <Icon className=' text-purple-500 w-5 h-5 mr-2' />

                  <input type={type} placeholder={placeholder} value={formData[name]}
                      onChange={(e) => setFormData({...formData, [name]: e.target.value})}
                      className=' w-full focus:outline-none text-sm text-gray-700' required />
              </div>
          ))}

          <button type='submit' className={BUTTONCLASSES} disabled={loading}>
              {loading ? "Signing Up..." :<><UserPlus className=' w-4 h-4' />Sign Up</>}
          </button>
        </form>
         
         <p className=' text-center text-sm text-gray-600 mt-6'>
            Already have an account?{' '}
            <button onClick={onSwitchMode} className=' text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors'>
                Login
            </button>
         </p>
    </div>
  )
}

export default SignUp
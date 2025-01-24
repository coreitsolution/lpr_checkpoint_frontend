import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { RootState } from "../../app/store"
import { useSelector } from "react-redux"
import { useAppDispatch } from '../../app/hooks'
import { useNavigate } from 'react-router-dom'

// API
import { login, clearError } from '../../features/auth/authSlice'

// Image
import LogoImage from '/images/Logo.jpg'

// Pop-up
import { PopupMessage } from "../../utils/popupMessage"

// Icons
import { FaEye, FaEyeSlash } from "react-icons/fa"

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const { authData, status, error } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(clearError())
    dispatch(login({ username, password }))
  }

  useEffect(() => {
    if (error) {
      PopupMessage("มีข้อผิดพลาดเกิดขึ้น", error, "error")
    }
  }, [error])

  useEffect(() => {
    if (authData && authData.isAuthenticated) {
      navigate('/checkpoint')
    }
  }, [authData, navigate])

  return (
    <div id='login' className="flex items-center justify-center min-h-screen">
      <motion.div
        className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border-dodgerBlue border-[1px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex mb-[60px]"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-cover bg-center w-full h-[95px]" style={{ backgroundImage: `url(${LogoImage})` }}></div>
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            <div className='mb-[25px]'>
              <input
                type="username"
                className="w-full text-black px-4 py-2 border border-linkWater2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className='mb-[25px] relative'>
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                className="w-full text-black px-4 py-2 border border-linkWater2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className='mt-[50px] text-center w-full'>
              <motion.button
                type="submit"
                className={`mr-[10px] h-[50px] w-full text-white rounded-lg shadow transition ${
                  status === 'loading' ? 'bg-gray-400' : 'bg-dodgerBlue hover:bg-blue-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Logging in...' : 'Login'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-[8px] text-start text-sm text-gray-500"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="text-black hover:underline"
          >
            ลืมรหัสผ่านหรือไม่?
          </button>
        </motion.div>

        <div className='flex justify-center mt-[50px]'>
          <div className='w-[230px] text-center border-x-[1px] border-linkWater'>
            <label
              className="text-dodgerBlue"
            >
              <span className='font-bold text-[15px]'>License Plate Recognition</span>
            </label>
          </div>
        </div>

        <div className='flex justify-center mt-[10px]'>
          <label
            className="text-greyChateau"
          >
            <span className='text-[15px]'>Ver 1.0.0</span>
          </label>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginPage
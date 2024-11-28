import React from 'react'
import LogoImage from '../../assets/img/Logo.jpg';
import { motion } from 'framer-motion'

const LoginPage = () => {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  }

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
          {/* <div className='w-full h-full justify-center items-start'>
            <img src={LogoImage} alt="Logo" className='w-full h-[120px]' />
          </div> */}
        </motion.div>

        {/* Form Fields */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form>
            <div className='mb-[25px]'>
              <input
                type="username"
                className="w-full text-black px-4 py-2 border border-linkWater2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Username"
              />
            </div>
            <div className='mb-[25px]'>
              <input
                type="password"
                className="w-full text-black px-4 py-2 border border-linkWater2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Password"
              />
            </div>
            <div className='mt-[50px] text-center w-full'>
              <motion.button
                type="submit"
                className="mr-[10px] h-[50px] w-full text-white bg-dodgerBlue rounded-lg shadow hover:bg-blue-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className='text-[18px] text-center font-bold'>Login</span>
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
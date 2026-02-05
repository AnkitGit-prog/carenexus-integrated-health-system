import React from 'react'
import { useContext } from 'react';
import { assets } from '../assets/assets_admin/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const { aToken, setToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    // Clear admin token
    if (aToken) {
      setToken('');
      localStorage.removeItem('aToken');
    }
    // Clear doctor token
    if (dToken) {
      setDToken('');
      localStorage.removeItem('dToken');
    }
    // Reload page to show login
    window.location.reload();
  }



  return (
    <div className='w-full h-16 bg-white shadow-md flex justify-between items-center px-6'>
      <div className='flex items-center gap-4 text-xs'>

        <img className='w-36 sm:w-48 cursor-pointer h-8' src={assets.admin_logo} alt='' />
        <p className=' border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 font-semibold'>{aToken ? "Admin" : "Doctor"}</p>



      </div>
      <button className='bg-primary text-white px-4 py-2 rounded-md' onClick={logout}>Logout</button>
      <button className='bg-primary text-white px-4 py-2 rounded-md' onClick={() => { }}>Settings</button>

    </div>
  )
}

export default Navbar

import React from 'react'
import { NavLink } from 'react-router-dom';
import { assets }from '../assets/assets_admin/assets';

import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext';
const sidebar = () => {
    const { aToken } = useContext(AdminContext);
    const { dToken } = useContext(DoctorContext);
  return (
    <div className='min-h-screen bg-white w-64 shadow-md pt-0 px-4 flex flex-col justify-start'>
        {
            aToken && <ul className="mt-0 p-0 flex flex-col gap-2">

                <NavLink className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-5 rounded-lg font-medium text-gray-700 transition-colors duration-200 shadow-sm hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600 shadow-md' : ''}`
                } to={'/admin-dashboard'}>
                  <img src={assets.home_icon} alt='' className="w-6 h-6" />
                  <p className ='hidden md:block'>Dashboard</p>
                </NavLink>

                <NavLink className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-5 rounded-lg font-medium text-gray-700 transition-colors duration-200 shadow-sm hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600 shadow-md' : ''}`
                } to={'/all-appointments'}>
                  <img src={assets.appointment_icon} alt='' className="w-6 h-6" />
                  <p className ='hidden md:block'>Appointments</p>
                </NavLink>

                <NavLink className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-5 rounded-lg font-medium text-gray-700 transition-colors duration-200 shadow-sm hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600 shadow-md' : ''}`
                } to={'/add-doctor'}>
                  <img src={assets.add_icon} alt='' className="w-6 h-6" />
                  <p className ='hidden md:block'>Add Doctor</p>
                </NavLink>

                <NavLink className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-5 rounded-lg font-medium text-gray-700 transition-colors duration-200 shadow-sm hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600 shadow-md' : ''}`
                } to={'/doctor-list'}>
                  <img src={assets.people_icon} alt='' className="w-6 h-6" />
                  <p className ='hidden md:block'>Doctors List</p>
                </NavLink>

            </ul>
        }
         {
            dToken && <ul className="mt-0 p-0 flex flex-col gap-2">

                <NavLink className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-5 rounded-lg font-medium text-gray-700 transition-colors duration-200 shadow-sm hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600 shadow-md' : ''}`
                } to={'/doctor-dashboard'}>
                  <img src={assets.home_icon} alt='' className="w-6 h-6" />
                  <p className ='hidden md:block'>Dashboard</p>
                </NavLink>

                <NavLink className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-5 rounded-lg font-medium text-gray-700 transition-colors duration-200 shadow-sm hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600 shadow-md' : ''}`
                } to={'/doctor-appointments'}>
                  <img src={assets.appointment_icon} alt='' className="w-6 h-6" />
                  <p className ='hidden md:block'>Appointments</p>
                </NavLink>

                

                <NavLink className={({ isActive }) =>
                  `flex items-center gap-4 py-3 px-5 rounded-lg font-medium text-gray-700 transition-colors duration-200 shadow-sm hover:bg-blue-100 hover:text-blue-700 ${isActive ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-600 shadow-md' : ''}`
                } to={'/doctor-profile'}>
                  <img src={assets.people_icon} alt='' className="w-6 h-6" />
                  <p className ='hidden md:block' >Profile</p>
                
                </NavLink>

            </ul>
        }
    </div>
  )
}

export default sidebar

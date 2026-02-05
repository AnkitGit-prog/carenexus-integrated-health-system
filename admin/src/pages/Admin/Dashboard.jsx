import React from 'react'
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets_admin/assets';

const Dashboard = () => {
  const { aToken, getDashData, dashData, cancelAppointment } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);

  // Cancel handler
  const handleCancelAppointment = (appointmentId) => {
    cancelAppointment(appointmentId);
  };

  // See all handler
  const handleSeeAll = () => {
    navigate('/all-appointments');
  };

  // Defensive: handle missing dashData or latestAppointments
  if (!dashData) return null;

  return (

    <div className="bg-[#f7f9fc] min-h-screen p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Replace these cards with real data from backend */}
        <div className="bg-white rounded-xl shadow flex items-center gap-4 p-6">
          <img src={assets.doctor_icon}alt="Doctor Icon" className="text-4xl"  />
          <div>
           <p>{dashData.doctors}</p>
           <p>Doctors</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow flex items-center gap-4 p-6">
          <div className="text-4xl">📅</div>
          <div>
            <div className="text-2xl font-bold text-blue-700">{dashData.appointments}</div>
            <div className="text-gray-500 font-medium">Appointments</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow flex items-center gap-4 p-6">
          <div className="text-4xl">🧑</div>
          <div>
            <div className="text-2xl font-bold text-blue-700">{dashData.patients}</div>
            <div className="text-gray-500 font-medium">Patients</div>
          </div>
        </div>``

      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center mb-4">
          <span className="text-lg font-semibold text-blue-700 mr-2">Latest Appointment</span>
          <button className="ml-auto text-sm text-blue-600 hover:underline" onClick={handleSeeAll}>See all</button>
        </div>
        {/* Map your real latestAppointments data here */}
        <ul className="divide-y divide-gray-100">
          {/* Example: latestAppointments.map((a, idx) => ( ... )) */}
          {(dashData.latestAppointments || []).map((appointment, idx) => (
            <div key={idx} className="flex items-center gap-4 py-2">
              <img src={appointment.docData?.image} alt="Appointment" className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-semibold">{appointment.docData?.name}</div>
                <div>{appointment.slotDate} at {appointment.slotTime}</div>
                <div>Patient: {appointment.userData?.name}</div>
                <div>Fees: ${appointment.amount}</div>
              </div>
              {appointment.cancelled
                ? <span className='text-red-500 font-semibold'>Cancelled</span>
                : <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
              }
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard

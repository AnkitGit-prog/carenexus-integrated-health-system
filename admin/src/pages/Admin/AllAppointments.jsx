import React, { useCallback } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useEffect, useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';
import { toast } from 'react-toastify';

const AllAppointments = () => {
  const { aToken, Appointments, getAllappointments } = useContext(AdminContext)
  const { calulateAge } = useContext(AppContext);

  // Handler for cancelling appointment
  const handleCancelAppointment = useCallback(async (appointmentId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/cancel-appointment/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          aToken,
        },
        body: JSON.stringify({ appointmentId }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Appointment cancelled successfully');
        getAllappointments();
      } else {
        toast.error(data.message || 'Failed to cancel appointment');
      }
    } catch (error) {
      toast.error('Error cancelling appointment');
    }
  }, [aToken, getAllappointments]);

  useEffect(() => {
    if (aToken) {
      getAllappointments()
    }
  }, [aToken, getAllappointments])


  return (
    <div className="max-w-5xl mx-auto mt-3 p-8 bg-white rounded-xl shadow-2xl border border-gray-100">
      <p className="text-3xl font-extrabold text-blue-800 mb-8 text-center tracking-wide">All Appointments</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="py-3 px-4 text-left font-semibold">#</th>
              <th className="py-3 px-4 text-left font-semibold">Image</th>
              <th className="py-3 px-4 text-left font-semibold">Patient</th>
              <th className="py-3 px-4 text-left font-semibold">Age</th>
              <th className="py-3 px-4 text-left font-semibold">Date &amp; Time</th>
              <th className="py-3 px-4 text-left font-semibold">Doctor</th>
              <th className="py-3 px-4 text-left font-semibold">Fees</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Example row, replace with dynamic data */}

            {/* Map appointments here for real data */}

            {(Array.isArray(Appointments) ? Appointments : []).map((appointment, index) => (
              <tr key={index} className="hover:bg-blue-50 transition duration-150">
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">
                  <img src={appointment.userData?.image || '/default-user.png'} alt="Patient" className="w-8 h-8 rounded-full object-cover" />
                </td>
                <td className="py-2 px-4 border-b">{appointment.userData?.name || 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  {
                    (() => {
                      const age = calulateAge(appointment.userData?.dob);
                      return (typeof age === 'number' && !isNaN(age)) ? age : 'N/A';
                    })()
                  }
                </td>
                <td className="py-2 px-4 border-b">{appointment.slotDate} {appointment.slotTime}</td>
                <td className="py-2 px-4 border-b flex items-center gap-2">
                  <img src={appointment.docData?.image || '/default-doctor.png'} alt="Doctor" className="w-8 h-8 rounded-full object-cover" />
                  <span>{appointment.docData?.name || 'N/A'}</span>
                </td>
                <td className="py-2 px-4 border-b">${appointment.amount}</td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">View</button>
                  {appointment.cancelled
                    ? <span className='text-red-500 font-semibold'>Cancelled</span>
                    : appointment.isCompleted
                      ? <span className='text-green-500 font-semibold'>Completed</span>
                      : <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition" onClick={() => handleCancelAppointment(appointment._id)}>Cancel</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllAppointments

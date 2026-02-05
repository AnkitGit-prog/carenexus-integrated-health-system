import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets_admin/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeApointment, cancleApointment } = useContext(DoctorContext);
  const { calculateAge } = useContext(AppContext);

  useEffect(() => {
    console.log('🔍 Doctor Appointments - useEffect triggered');
    console.log('dToken:', dToken ? 'Present ✅' : 'Missing ❌');

    if (dToken) {
      console.log('📞 Calling getAppointments...');
      getAppointments();
    } else {
      console.warn('⚠️ No dToken found - user needs to login as doctor');
    }
  }, [dToken, getAppointments]);

  // Log appointments whenever they change
  useEffect(() => {
    console.log('📊 Current appointments state:', appointments);
    console.log('📈 Number of appointments:', appointments?.length || 0);
  }, [appointments]);

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      {!dToken ? (
        <div className="bg-white border rounded text-center py-16 px-4">
          <p className="text-gray-600 text-xl mb-4">Please login as a doctor to view appointments</p>
          <p className="text-gray-500">Go to login page and select "Doctor" to continue</p>
        </div>
      ) : (
        <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll">

          <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
            <p>#</p>
            <p>Patient</p>
            <p>Payment</p>
            <p>Age</p>
            <p>Date & Time</p>
            <p>Fees</p>
            <p>Action</p>
          </div>

          {!appointments || appointments.length === 0 ? (
            <div className="text-center py-16 px-4">
              <p className="text-gray-500 text-lg mb-2">No appointments found</p>
              <p className="text-gray-400 text-sm">Appointments booked by patients will appear here</p>
            </div>
          ) : (
            appointments.slice().reverse().map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              >
                <p className='max-sm:hidden'>{index + 1}</p>

                <div className="flex items-center gap-2">
                  <img src={item.userData?.image} alt="" className="w-8 rounded-full" />
                  <p>{item.userData?.name}</p>
                </div>

                <div>
                  <p className='text-xs inline border border-primary px-2 rounded-full'>
                    {item.payment ? 'Online' : 'CASH'}
                  </p>
                </div>

                <p className='max-sm:hidden'>
                  {item.userData?.dob && item.userData.dob !== 'Not selected'
                    ? calculateAge(item.userData.dob)
                    : 'N/A'}
                </p>
                <p>{item.slotDate}, {item.slotTime}</p>
                <p>${item.amount}</p>

                {
                  item.cancelled
                    ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                    : item.isCompleted
                      ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                      : <div className='flex gap-2'>
                        <img
                          onClick={() => cancleApointment(item._id)}
                          className='w-10 cursor-pointer'
                          src={assets.cancel_icon}
                          alt="Cancel"
                        />
                        <img
                          onClick={() => completeApointment(item._id)}
                          className='w-10 cursor-pointer'
                          src={assets.tick_icon}
                          alt="Complete"
                        />
                      </div>
                }
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default DoctorAppointments;

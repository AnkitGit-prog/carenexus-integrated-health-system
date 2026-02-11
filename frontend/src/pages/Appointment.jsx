import React, { useContext, useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
//import { format } from 'date-fns';
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'



function Appointment() {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const navigate = useNavigate()
  const { userData } = useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')



  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)



  }
  const getAvailableSlots = async () => {
    // setDocInfo(docInfo)
    if (!docInfo || !docInfo.slots_booked) return;

    // get current date and time
    let today = new Date();
    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i)
      // setting nd time of date with index
      let endTime = new Date()
      endTime.setUTCDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)
      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }
      else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      let timeSlots = []
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()


        const slotDate = day + '-' + month + '-' + year
        const slotTime = formattedTime
        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true
        if (isSlotAvailable) {

          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          })
        }

        // add slots to array

        // increase 30 mins current time ko increase karro
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prevSlots => ([...prevSlots, timeSlots]))

    }
  }



  // create one arrow function to book appoimtment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment")
      return navigate('/login')
    }
    try {
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + '-' + month + '-' + year


      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        {
          userId: userData._id,  // ✅ REQUIRED for backend
          docId,
          slotDate,
          slotTime
        },
        { headers: { token } }
      );



      if (data.success) {
        toast.success(data.message);
        getDoctorsData()

        navigate('/my-appointements');
      } else {
        toast.error(data.message);
      }



    } catch (error) {
      console.log(error)
      toast.error(error.message)

    }
  }
  useEffect(() => {
    fetchDocInfo()
  }, [docId, doctors])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])

  return docInfo && (
    <div>
      {/*------Doctor details-----*/}
      <div className=" flex flex-col sm:flex-row gap-4">
        <div >
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo?.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px]sm:mt-0'>
          {/*-----Doc info ,name ,degree,fee-----*/}
          <p className='flex items-center  gap-2 text-2xl font-medium text-gray-900'>
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>
          <div className=" flex items-center gap-2 mt-1 text-sm text-gray-600">


            <p>{docInfo?.degree}-{docInfo?.speciality}</p>
            <button className="experience">{docInfo?.experience}</button>

          </div>
          {/*-----Doc About-----*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" />
            </p>
            <p className=' text-sm  text-gray-500 max-w-[-700px] mt-1'>{docInfo?.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo?.fees}</span>
          </p>
        </div>
      </div>
      {/*----- Booking slots---------*/}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-auto mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => (setSlotIndex(index))} className={` text-center py-2 px-3 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p> {item[0] && item[0].datetime.getDate()}</p>
              </div>

            ))
          }
        </div>
        <div className='flex items-center gap-3 overflow-x-auto mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : ' text-gray-400 border border-gray-200'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
      </div>
      {/*--- Listing related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}></RelatedDoctors>
    </div>

  )

}
export default Appointment




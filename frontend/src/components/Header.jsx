import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20'>
      {/* ---------Left side--------- */}
      <div className='md:w-1/2 flex flex-col  items-startjustify-center gap-4 py-10 m-auto md:py=[10vw] md:mb-[-30px]' >
        <p className='text-white text-3xl md:text-4xl lg:text-5xl  font-semibold leading-tight md:leading-tight lg:leading-tight'>
          Book Appointment <br /> With Trusted Indian Doctors
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light md:text-base ">

          <img className="w-28" src={assets.group_profiles} alt="" />
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Esse nemo totam hic doloremque
            numquam cupiditate omnis iusto voluptates? Sequi velit ea
            architecto libero minima omnis
            dolore vitae provident, consectetur quasi? <br className='hidden sm:block' /></p>
        </div>
        <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 m-auto  md:m-0 hover:scale-105 transition-all duration-300'>
          Book appointment <img className='w-3' src={assets.arrow_icon} alt='' />
        </a>
      </div>
      {/*----- Right Side -----*/}
      <div className='md:w-1/2 ' >
        <img className='w-full  h-auto ' src={assets.header_img} alt="" />

      </div>
    </div>

  )
}


export default Header

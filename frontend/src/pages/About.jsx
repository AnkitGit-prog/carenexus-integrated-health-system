import React from 'react'
import { assets } from '../assets/assets_frontend/assets'
const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className ='text-gray-700 font-medium'>US</span></p>

      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
      <img  className='w-full md:max-w-[360px]' src={assets.about_image} alt=''/>
      <div className=' flex flex-col justify-center gao-6 md:w-2/4 text-sm text-gray-600'>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ex, voluptate doloremque ducimus qui neque itaque debitis velit illum nisi accusantium earum dolor unde quia exercitationem!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum dolore quasi veritatis possimus non suscipit, natus dolorum ut soluta iusto.</p>
        <b className='text-gray-800'>Our vision</b>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Deserunt commodi ad fuga incidunt voluptate error aspernatur porro, ipsum consequatur, soluta quam beatae delectus ut repudiandae sed ipsa aut vero hic!</p>
      </div>
      </div>
      <div className='text-xl my-4'>
        <p>
          WHY <span className='text-gray-700 font-semibold'> CHOOSE US</span>
        </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-16 flex flex-col gap-5 text=[15x] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>Efficiency:</b>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Temporibus, quas!</p>
        </div>
        <div  className='border px-10 md:px-16 py-16 flex flex-col gap-5 text=[15x] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>convenience:</b>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum explicabo harum, et ab aperiam quibusdam!</p>

        </div>
        <div  className='border px-10 md:px-16 py-16 flex flex-col gap-5 text=[15x] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>
   personalization:
          </b>
          <p>
Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit tenetur omnis nesciunt nulla modi dolore animi, saepe doloremque commodi maiores?
          </p>
        </div>
      </div>
    </div>
  )
}

export default About

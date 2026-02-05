import React, {useState,useContext}from 'react'
import { assets } from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
const login = () => {
    const [state, setState] = useState('Admin')
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const {setToken, backendUrl} =useContext(AdminContext);
      const {setDToken} = useContext(DoctorContext);
      
       

      const onSubmithandler = async(e) =>{
        e.preventDefault();
        try{
          if(state === 'Admin'){
            const {data }= await axios.post(backendUrl +'/api/admin/login',{
              email,
              password
            });
                
            if(data.success){
              console.log(data.token);
              localStorage.setItem('aToken',data.token);
              setToken(data.token);
              alert('Admin logged in successfully');
            }
          else {
            toast.error(data.message);
          }
          }
        else if(state === 'Doctor'){
       
            const {data }= await axios.post(backendUrl +'/api/doctor/login',{
              email,
              password
            });
            if(data.success){
             localStorage.setItem('dToken',data.token);
              setDToken(data.token);
              console.log(data.token);
              alert('Doctor logged in successfully');
            }
        
          else{
            toast.error(data.message);
          }
        }
      }
        catch(error){
          console.log(error);
        }
      }
      
      

  return (
  <form  onSubmit={onSubmithandler} className='min-h-[80vh] flex flex-col justify-center items-center gap-6'>
    <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px]  sm:min-w-96  rounded-xl border border-gray-300 text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'> <span className='text-primary'>{state}</span> Login</p>
               
    <div className='w-full'>
      <p>Email</p>
      <input  onChange={(e)=>setEmail(e.target.value)} className='border border-gray-300 p-2 rounded-md w-full  mt-1' type="email" placeholder='Enter your email' />
    </div>  
    <div className='w-full'>
      <p>Password</p>
      <input  onChange={(e)=>setPassword(e.target.value)} className='border border-gray-300 p-2 rounded-md w-full  mt-1' type="password" placeholder='Enter your password' />
    </div>
    
      <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
    
    </div>
    {state === 'Admin' ? <p className='text-sm'>Login as Doctor? <span onClick={()=>setState('Doctor')} className='text-primary cursor-pointer'>Click here</span></p> :
    <p className='text-sm'>Login as Admin? <span onClick={()=>setState('Admin')} className='text-primary cursor-pointer'>Click here</span></p>
    }
  </form>
  )
}

export default login

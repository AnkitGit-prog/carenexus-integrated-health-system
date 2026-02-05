import React from 'react'
import { assets } from '../../assets/assets_admin/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
const AddDoctor = () => {

const[docImg,setDocImg]=React.useState(null);
const [name,setName]=React.useState('');
const [email,setEmail]=React.useState('');
const [password,setPassword]=React.useState('');
const [experience,setExperience]=React.useState('1 year');
const [fees,setFees]=React.useState('');
const[about,setAbout]=React.useState('');
const [speciality,setSpeciality]=React.useState('General Physician');
const[degree,setDegree]=React.useState('');
const[address1,setAddress1]=React.useState('');
const[address2,setAddress2]=React.useState('');



const{backendUrl,aToken}=React.useContext(AdminContext);
const onSubmitHandler =async(e) =>{
    e.preventDefault();

    try{
        if (!docImg){
        return toast.error('Please upload doctor image');
    }
    const formData = new FormData();
        // backend expects field name 'docImg' (route uses uplode.single('docImg'))
        formData.append('docImg', docImg);
    formData.append('name',name);
    formData.append('email',email);
    formData.append('password',password);
    formData.append('experience',experience);
    formData.append('fees',fees);
    formData.append('about',about);
    formData.append('speciality',speciality);
    formData.append('degree',degree);
formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));
    formData.forEach((value,key)=>{
       console.log(`${key}: ${value}`);
    });

    const {data}= await axios.post('http://localhost:4000/api/admin/add-doctor',formData,{
        headers:{aToken}
    });
    if(data.success){
        toast.success('Doctor added successfully');
        setDocImg(false);
        setName('');
        setEmail('');
        setPassword('');
        setExperience('1 year');
        setFees('');
        setAbout('');
        setSpeciality('General Physician');
        setDegree('');
        setAddress1('');
        setAddress2('');
    }else{
        toast.error(data.message);
    }
}catch(error){
    console.log(error);
        return toast.error(error.message);
    }
    }


  return (

      <form onSubmit={onSubmitHandler} className='m-5 w-full'>
        <p className='mb-3 text-lg font-medium'>Add Doctor</p>
        <div className=' bg-white py-8 px-8  border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll '>
            <div className='  flex items-center  gap-4 mb-8 text-gray-500'>
          <label htmlFor='doc-img'> <img className='w-16 bg-gray-100 rounded-full cursor-pointer'src={ docImg ? URL.createObjectURL(docImg) :assets.upload_area} alt=''></img> </label> <input onChange={(e)=>setDocImg(e.target.files[0])} type='file' id="doc-img" hidden></input> <p>Upload Doctor <br /> picture</p>

            </div>
        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
        <div className=' w-full lg:flex-1 flex flex-col gap-6'>

            <div className='flex-1 flex-col gap-1'>
                <p>your name</p>
                <input  onChange={(e)=>setName(e.target.value)} value={name} className='border rounded px-3 py-2' type='text' id="doc-name" placeholder='Enter Doctor Name'></input>
            </div>

            <div className='flex-1 flex-col gap-1'>
                <p>Doctor Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type='text' id="doc-email" placeholder='Enter Doctor Email'></input>
            </div>

            <div className='flex-1 flex-col gap-1'>
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border rounded px-3 py-2'   type='password' id="doc-password" placeholder='Enter Password'></input>
            </div>

            <div className='flex-1 flex-col gap-1'>
                <p>Experience</p>
                <select onChange={(e)=>setExperience(e.target.value)} value={experience}  className='border rounded px-3 py-2' id="doc-experience">
                    <option value='1'>1 Year</option>
                    <option value='2'>2 Years</option>
                    <option value='3'>3 Years</option>
                    <option value='4'>4 Years</option>
                    <option value='5'>5 Years</option>
                    <option value='6'>6 Years</option>
                    <option value='7'>7 Years</option>
                    <option value='8'>8 Years</option>
                    <option value='9'>9 Years</option>
                    <option value='10'>10+ Years</option>


                </select>
            </div>

            <div className='flex-1 flex-col gap-1'>
                <p>Fees</p>
                <input onChange={(e)=>setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type='number' id="doc-fees" placeholder='Enter Doctor Fees'></input>
            </div>

            </div>
            <div className='w-full lg:flex-1 flex flex-col gap-4'>

                <div className='flex-1 flex-col gap-1'>
                    <p>Specialization</p>
                    <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' id="doc-specialization">
                        <option value='General Physician'>General Physician</option>
                        <option value='Gynecologist'>Gynecologist</option>
                        <option value='Dermatologist'>Dermatologist</option>
                        <option value='Pediatrician'>Pediatrician</option>
                        <option value='Neurologist'>Neurologist</option>
                        <option value='Gastroenterologist'>Gastroenterologist</option>
                        
                    </select>
                </div>

                <div className='flex-1 flex-col gap-1'>
                <p>Education</p>
                <input onChange={(e)=>setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type='text' id="doc-education" placeholder='Enter Doctor Education'></input>
            </div>
                        

                <div className='flex-1 flex-col gap-1'>
                    <p>Address</p>
                    <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type='text' id="doc-address" placeholder='Enter Doctor Address 1'></input>
                    <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type='text' id="doc-address2" placeholder='Enter Doctor Address 2'></input>
                </div>

            </div>
            </div>
         
         
                <div>
                    <p>About</p>
                    <textarea onChange={(e)=>setAbout(e.target.value)} value={about} id="doc-about" placeholder='write about doctor' rows ={5}></textarea>
                </div>

                <button className='bg-primary px-10 py-3 mt-4 text-white rounded-full' type='submit'>Add Doctor</button>
                </div>
        
      </form>


  )
}

export default AddDoctor

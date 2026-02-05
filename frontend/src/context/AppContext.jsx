
/* eslint-disable react-refresh/only-export-components */
import { createContext,useEffect, } from "react";

import axios from "axios";
import {toast}  from 'react-toastify'
 import { useState } from "react";
 
export const AppContext = createContext(null);

const AppContextProvider=(props)=>{
    const currencySymbol ='$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [token,setToken] =useState(localStorage.getItem('token')?localStorage.getItem('token'):false )

    const [userData, setUserData] = useState({
  name: "",
  email: "",
  phone: "",
  image: "",
  gender: "",
  dob: "",
  address: {
    line1: "",
    line2: ""
  }
});

    

 const getDoctorsData=async()=>{
    try {
        const {data} = await axios.get(backendUrl+'/api/doctor/list');
        if(data.success){
            setDoctors(data.doctors);
        }
        else{
            toast.error("Failed to fetch doctors data");
        }
    } catch (error) {
        console.error("Error fetching doctors data:", error);
        toast.error("Failed to fetch doctors data");
    }
}

const loadUserProfileData=async()=>{
    try{
        const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } });

        if(data.success){
           setUserData(data.userData)

        }else{
            toast.error(data.message)
        }
    
        } catch (error) {
  console.error(error);
  toast.error(error.message);

    }
}
const value ={
    doctors,getDoctorsData,
    currencySymbol,
    backendUrl,
    token,setToken,
    userData,
    setUserData,
    loadUserProfileData

 }
useEffect(()=>{
    getDoctorsData();
},[])

useEffect(()=>{
if(token){
    loadUserProfileData()
}else{
    setUserData({})
}
},[token])
return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider >
     
)
}
export default AppContextProvider
import React,{useContext}from 'react'
import Login from './pages/login'
import { ToastContainer } from 'react-toastify';
import { AdminContext } from './context/AdminContext';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import DoctorsList from './pages/Admin/DoctorsList';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
//import AppContextProvider from './context/AppContextProvider';
import DoctorProfile from './pages/Doctor/DoctorProfile';
const App = () => {
  const {aToken} =useContext(AdminContext);
  const {dToken } =useContext(DoctorContext);
   return aToken || dToken ? (
    <div className='bg-white'>

      <ToastContainer/>
      <Navbar/>
      <div className='flex items-center'>

        <Sidebar/>

        <Routes>
          {/*Admin route*/}
          <Route path='/' element ={<></>}/>
          <Route path='/admin-dashboard' element ={<Dashboard/>}/>
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          {/*doctor route*/}
          
           <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
   ):(
    <>
    <div>
      <h1>Please log in</h1>
      <Login/>
      <ToastContainer/>
    </div>
    </>
   )

  
}

export default App

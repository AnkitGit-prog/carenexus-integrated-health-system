/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  // 🔹 Step 1: load token from localStorage when component mounts
  const [aToken, setToken] = useState(() => localStorage.getItem("aToken") ? localStorage.getItem("aToken") : '');
  const [doctors, setDoctors] = useState([]);
  const [Appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  // 🔹 Step 2: backend URL from .env
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, {
        headers: { aToken }
      });

      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        console.log("❌ API returned error:", data.message);
        toast.error(data.message);

      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Failed to fetch doctors");
    }

  };
  //api to change doctor's availability
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, {
        headers: { aToken }
      });

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        console.log("❌ API returned error:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error changing availability:", error);
      toast.error(error.message);
    }
  };




  const getAllappointments = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
      if (data.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments)
      } else {
        toast.error(data.message || 'No appointments found')
      }

    } catch (error) {
      toast.error(error.message)

    }
  }
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(backendUrl + `/api/admin/cancel-appointment/${appointmentId}`, {}, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        getAllappointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [aToken, backendUrl]);

  const value = {
    aToken,
    setToken,
    backendUrl,
    getAllDoctors,
    doctors
    , changeAvailability, Appointments, setAppointments,
    getAllappointments, cancelAppointment, dashData, getDashData


  };


  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}


export default AdminContextProvider;







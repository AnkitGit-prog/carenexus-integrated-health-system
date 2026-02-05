/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
export const DoctorContext = createContext();
const DoctorContextProvider = ({ children }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '');
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const getAppointments = useCallback(async () => {
        try {
            if (!dToken) {
                console.log('⚠️ No doctor token found. Please login as a doctor.');
                return;
            }
            console.log('🔄 Fetching appointments from:', backendUrl + '/api/doctor/appointments');
            const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
                headers: { token: dToken }
            });
            if (data.success) {
                setAppointments(data.appointments);

                console.log('✅ Appointments fetched successfully:', data.appointments);
                console.log('📊 Total appointments:', data.appointments.length);
            }
            else {
                console.error("❌ API returned error:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("❌ Error fetching appointments:", error);
            if (error.response?.status === 401) {
                toast.error('Authentication failed. Please login as a doctor.');
            } else {
                toast.error(error.message);
            }
        }
    }, [dToken, backendUrl]);
    const completeApointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, {
                headers: { token: dToken }
            });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                setDashData(false)
                getDashData()
            }
            else {
                console.error("❌ API returned error:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.error("Error fetching appointments:", error);
        }
    }

    const cancleApointment = async (appointmentId) => {
        try {
            console.log('🚫 Cancelling appointment:', appointmentId);
            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {
                appointmentId
            }, { headers: { token: dToken } });
            console.log('📥 Cancel response:', data);
            if (data.success) {
                toast.success(data.message);
                getAppointments();
                setDashData(false)
                getDashData()
            }
            else {
                console.error("❌ API returned error:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { token: dToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { token: dToken } })
            if (data.success) {
                setProfileData(data.profileData)
                console.log(data.profileData)

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }
    const value = {
        // Add your context data here

        backendUrl,
        dToken,
        setDToken,
        appointments,
        getAppointments,
        completeApointment,
        cancleApointment,
        dashData,
        setDashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
    }
    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    )
}
export default DoctorContextProvider;
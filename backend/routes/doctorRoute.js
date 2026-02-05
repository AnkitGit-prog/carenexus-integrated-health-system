import express from 'express'
import { doctorList, loginDoctor, appointmentDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js';
const doctorRouter = express.Router()

// GET /api/doctor/list - returns list of doctors
doctorRouter.get('/list', doctorList)
// POST /api/doctor/login - doctor login
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentDoctor)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.get('/dashboard', authDoctor, doctorDashboard)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile)
export default doctorRouter

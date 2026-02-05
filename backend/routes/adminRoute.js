import express from 'express'
import {addDoctor,loginAdmin,allDoctors,appointmentAdmin, cancelAppointmentAdmin,adminDashboard} from '../controllers/adminController.js'
import uplode from  '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/doctorController.js'
const adminRouter =express.Router()

adminRouter.post('/add-doctor',authAdmin, uplode.single('docImg'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors',authAdmin, allDoctors)
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentAdmin)
adminRouter.post('/cancel-appointment/:id', authAdmin, cancelAppointmentAdmin)
adminRouter.get('/dashboard', authAdmin, adminDashboard)

export default adminRouter
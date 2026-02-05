
import validator from 'validator';
import bcrypt from 'bcrypt'
//import cloudinary from '../config/cloudinary.js';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';
import { v2 as cloudinary } from "cloudinary";
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';

//APi for adding doctor

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file
        // console.log( {name,email,password,speciality,degree,experience,about,fees,address},imageFile)
        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.json({ success: false, message: "Missing details" })
        }

        // validating email format 
        if (validator.isEmail(email) === false) {
            return res.json({ success: false, message: "Invalid email format" })
        }

        // validating strong password
        if (password.length < 8 || /[A-Z]/.test(password) === false || /[a-z]/.test(password) === false || /[0-9]/.test(password) === false || /[!@#$%^&*]/.test(password) === false) {
            return res.json({ success: false, message: "Password is not strong" })
        }
        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        // creating doctor document and saving it to database
        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            // address may be sent as JSON string (from form-data) or as an object
            address: typeof address === 'string' ? JSON.parse(address) : address,
            date: Date.now(),
            image: imageUrl
        };

        // creating new doctor document and saving it to database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        return res.json({ success: true, message: "Doctor added successfully" });
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: "Error adding doctor" });
    }
}

// api for the admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Generate JWT token
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, message: "Admin logged in successfully", token });
        } else {
            res.json({ success: false, message: "Invalid email or password" });

        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error in admin login" });
    }
}

//Api to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching doctors" });
    }
};
// api toget  all appi list
const appointmentAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });

    }
}


/*
// Cancel appointment controller
const cancelAppointmentAdmin = async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' });
        }
        appointment.cancelled = true;
        await appointment.save();
        res.json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.json({ success: false, message: 'Error cancelling appointment' });
    }
};
*/
// API for appointment cancellation by admin
// API for appointment cancellation by admin
const cancelAppointmentAdmin = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const userId = req.userId

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData
        const doctorData = await doctorModel.findById(docId)
        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            const slots_booked = doctorData.slots_booked
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
            await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        }

        return res.json({ success: true, message: 'Appointment cancelled' })
    } catch (error) {
        console.log(error)
        return res.json({ success: false, message: error.message })
    }
}
// API to get dashboard data
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }
        res.json({
            success: true,
            dashData
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching dashboard data" });
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentAdmin, cancelAppointmentAdmin, adminDashboard };
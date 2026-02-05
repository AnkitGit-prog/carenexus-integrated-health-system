import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;


    const docData = await doctorModel.findById(docId)
    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });
    res.json({ success: true, message: "Availability status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating availability status" });
  }
}

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email']);
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching doctors" });
  }
};

// api for doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }
    const isMatch = await bcrypt.compare(password, doctor.password);
    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ success: true, message: "Doctor logged in successfully", token });
    } else {
      return res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error logging in doctor" });
  }
};
// Api to get all doctors list for admin panel
const appointmentDoctor = async (req, res) => {
  try {
    const docId = req.docId;

    console.log('🔍 Doctor Appointments API called');
    console.log('👨‍⚕️ Doctor ID from token:', docId);

    const appointments = await appointmentModel.find({ docId }).populate('userData').populate('docData');

    console.log('📊 Query results - Total appointments found:', appointments.length);
    if (appointments.length > 0) {
      console.log('✅ Sample appointment:', JSON.stringify(appointments[0], null, 2));
    } else {
      console.log('⚠️ No appointments found for doctor ID:', docId);
      // Let's also check total appointments in database
      const totalAppointments = await appointmentModel.countDocuments();
      console.log('📈 Total appointments in database:', totalAppointments);

      // Check if there are appointments with different docId format
      const allAppointments = await appointmentModel.find({}).limit(5);
      if (allAppointments.length > 0) {
        console.log('🔍 Sample appointment docIds in database:', allAppointments.map(a => ({
          id: a._id,
          docId: a.docId,
          docIdType: typeof a.docId
        })));
      }
    }

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching appointments" });
  }
};





// API to cancel appointment (Doctor Panel)
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;

    // Find appointment by ID
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Check appointment exists and belongs to doctor
    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found"
      });
    }

    if (appointmentData.docId.toString() !== docId) {
      return res.json({
        success: false,
        message: "Unauthorized cancellation"
      });
    }

    // Cancel appointment
    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { cancelled: true },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};
// API to mark appointment as completed (Doctor Panel)
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;

    // Find appointment
    const appointmentData = await appointmentModel.findById(appointmentId);

    // Check appointment exists
    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found"
      });
    }

    // Check appointment belongs to doctor
    if (appointmentData.docId.toString() !== docId) {
      return res.json({
        success: false,
        message: "Unauthorized action"
      });
    }

    // Mark appointment as completed
    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: true },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Appointment completed successfully"
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    let patients = [];

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
      if (!patients.includes(item.userId)) {
        patients.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5)
    }

    res.json({ success: true, dashData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}




// API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const profileData = await doctorModel.findById(docId).select('-password');
    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, available } = req.body;

    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: 'Profile updated' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { changeAvailability, doctorList, loginDoctor, appointmentDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile };
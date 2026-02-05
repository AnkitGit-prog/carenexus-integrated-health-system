import mongoose from 'mongoose';
import 'dotenv/config';
import appointmentModel from './models/appointmentModel.js';
import doctorModel from './models/doctorModel.js';

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Database Connected');
    } catch (error) {
        console.log('❌ Database connection failed:', error);
        process.exit(1);
    }
};

const checkData = async () => {
    await connectDB();

    console.log('\n📊 ========== DATABASE DIAGNOSTIC ==========\n');

    // Check total appointments
    const totalAppointments = await appointmentModel.countDocuments();
    console.log(`📈 Total Appointments in Database: ${totalAppointments}`);

    if (totalAppointments === 0) {
        console.log('\n⚠️ NO APPOINTMENTS FOUND IN DATABASE!');
        console.log('You need to create appointments first from the frontend or admin panel.\n');
    } else {
        // Get all appointments with doctor info
        const appointments = await appointmentModel.find({})
            .populate('docData', 'name email speciality')
            .populate('userData', 'name email');

        console.log(`\n✅ Found ${appointments.length} appointments:\n`);

        // Group by doctor
        const byDoctor = {};
        appointments.forEach(apt => {
            const docId = apt.docId.toString();
            if (!byDoctor[docId]) {
                byDoctor[docId] = {
                    doctorInfo: apt.docData,
                    count: 0,
                    appointments: []
                };
            }
            byDoctor[docId].count++;
            byDoctor[docId].appointments.push({
                id: apt._id,
                patient: apt.userData?.name || 'Unknown',
                date: apt.slotDate,
                time: apt.slotTime,
                cancelled: apt.cancelled,
                completed: apt.isCompleted
            });
        });

        // Display grouped data
        Object.entries(byDoctor).forEach(([docId, data], index) => {
            console.log(`\n${index + 1}. Doctor ID: ${docId}`);
            console.log(`   Name: ${data.doctorInfo?.name || 'Unknown'}`);
            console.log(`   Email: ${data.doctorInfo?.email || 'Unknown'}`);
            console.log(`   Speciality: ${data.doctorInfo?.speciality || 'Unknown'}`);
            console.log(`   📊 Total Appointments: ${data.count}`);
            console.log(`   Appointments:`);
            data.appointments.forEach((apt, i) => {
                const status = apt.cancelled ? '❌ Cancelled' : apt.completed ? '✅ Completed' : '⏳ Pending';
                console.log(`      ${i + 1}. ${apt.patient} - ${apt.date} ${apt.time} - ${status}`);
            });
        });
    }

    // Check all doctors
    console.log('\n\n👨‍⚕️ ========== ALL DOCTORS ==========\n');
    const doctors = await doctorModel.find({}).select('name email speciality');
    console.log(`Total Doctors: ${doctors.length}\n`);
    doctors.forEach((doc, index) => {
        const aptCount = totalAppointments > 0 ?
            (byDoctor[doc._id.toString()]?.count || 0) : 0;
        console.log(`${index + 1}. ${doc.name}`);
        console.log(`   ID: ${doc._id}`);
        console.log(`   Email: ${doc.email}`);
        console.log(`   Speciality: ${doc.speciality}`);
        console.log(`   Appointments: ${aptCount}`);
        console.log('');
    });

    console.log('\n========================================\n');

    process.exit(0);
};

checkData().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});

import mongoose from 'mongoose';
import 'dotenv/config';
import appointmentModel from './models/appointmentModel.js';
import doctorModel from './models/doctorModel.js';
import userModel from './models/userModel.js';

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

const checkLatestAppointments = async () => {
    await connectDB();

    console.log('\n📊 ========== LATEST APPOINTMENTS CHECK ==========\n');

    try {
        // Get total count
        const totalAppointments = await appointmentModel.countDocuments();
        console.log(`📈 Total Appointments in Database: ${totalAppointments}\n`);

        // Get the 10 most recent appointments
        const recentAppointments = await appointmentModel
            .find({})
            .sort({ date: -1 }) // Sort by date descending (newest first)
            .limit(10);

        if (recentAppointments.length === 0) {
            console.log('⚠️ No appointments found in database!\n');
        } else {
            console.log(`📋 Last ${recentAppointments.length} Appointments:\n`);

            for (let i = 0; i < recentAppointments.length; i++) {
                const apt = recentAppointments[i];
                console.log(`${i + 1}. Appointment ID: ${apt._id}`);
                console.log(`   Patient: ${apt.userData?.name || 'Unknown'}`);
                console.log(`   Doctor ID: ${apt.docId}`);
                console.log(`   Doctor Name: ${apt.docData?.name || 'Unknown'}`);
                console.log(`   Date: ${apt.slotDate} at ${apt.slotTime}`);
                console.log(`   Amount: $${apt.amount}`);
                console.log(`   Payment: ${apt.payment ? 'Online' : 'Cash'}`);
                console.log(`   Status: ${apt.cancelled ? '❌ Cancelled' : apt.isCompleted ? '✅ Completed' : '⏳ Pending'}`);
                console.log(`   Created: ${new Date(apt.date).toLocaleString()}`);
                console.log('');
            }
        }

        // Get all doctors
        console.log('\n👨‍⚕️ ========== ALL DOCTORS ==========\n');
        const doctors = await doctorModel.find({}).select('_id name email speciality');
        console.log(`Total Doctors: ${doctors.length}\n`);

        doctors.forEach((doc, index) => {
            console.log(`${index + 1}. ${doc.name}`);
            console.log(`   Doctor ID: ${doc._id}`);
            console.log(`   Email: ${doc.email}`);
            console.log(`   Speciality: ${doc.speciality}`);

            // Count appointments for this doctor
            const doctorAppointments = recentAppointments.filter(
                apt => apt.docId && apt.docId.toString() === doc._id.toString()
            );
            console.log(`   Recent Appointments: ${doctorAppointments.length}`);
            console.log('');
        });

        // Check for appointments with mismatched or missing docId
        console.log('\n🔍 ========== CHECKING FOR ISSUES ==========\n');
        const allAppointments = await appointmentModel.find({});

        let issuesFound = 0;

        for (const apt of allAppointments) {
            if (!apt.docId) {
                console.log(`⚠️ Appointment ${apt._id} has NO docId!`);
                issuesFound++;
            } else {
                // Check if doctor exists
                const doctorExists = await doctorModel.findById(apt.docId);
                if (!doctorExists) {
                    console.log(`⚠️ Appointment ${apt._id} has invalid docId: ${apt.docId} (doctor not found)`);
                    issuesFound++;
                }
            }
        }

        if (issuesFound === 0) {
            console.log('✅ No issues found - all appointments have valid doctor IDs\n');
        } else {
            console.log(`\n⚠️ Found ${issuesFound} appointment(s) with issues\n`);
        }

        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
};

checkLatestAppointments();

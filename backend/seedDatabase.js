import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import doctorModel from './models/doctorModel.js';
import userModel from './models/userModel.js';
import appointmentModel from './models/appointmentModel.js';

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

const seedDatabase = async () => {
    await connectDB();

    console.log('\n🌱 ========== SEEDING DATABASE ==========\n');

    try {
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await doctorModel.deleteMany({});
        await userModel.deleteMany({});
        await appointmentModel.deleteMany({});
        console.log('✅ Existing data cleared\n');

        // Hash password for all doctors and users
        const hashedPassword = await bcrypt.hash('123456', 10);

        // Create sample doctors
        console.log('👨‍⚕️ Creating sample doctors...');
        const doctors = await doctorModel.insertMany([
            {
                name: 'Dr. Richard James',
                email: 'richard@prescripto.com',
                password: hashedPassword,
                image: 'https://res.cloudinary.com/dqy2ts9h6/image/upload/v1234567890/doctor1.jpg',
                speciality: 'General physician',
                degree: 'MBBS',
                experience: '4 Years',
                about: 'Dr. Richard has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
                available: true,
                fees: 50,
                address: { line1: '17th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                slots_booked: {}
            },
            {
                name: 'Dr. Emily Larson',
                email: 'emily@prescripto.com',
                password: hashedPassword,
                image: 'https://res.cloudinary.com/dqy2ts9h6/image/upload/v1234567890/doctor2.jpg',
                speciality: 'Gynecologist',
                degree: 'MBBS, MD',
                experience: '3 Years',
                about: 'Dr. Emily Larson has a strong commitment to delivering comprehensive medical care, focusing on women\'s health.',
                available: true,
                fees: 60,
                address: { line1: '27th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                slots_booked: {}
            },
            {
                name: 'Dr. Sarah Patel',
                email: 'sarah@prescripto.com',
                password: hashedPassword,
                image: 'https://res.cloudinary.com/dqy2ts9h6/image/upload/v1234567890/doctor3.jpg',
                speciality: 'Dermatologist',
                degree: 'MBBS, MD (Dermatology)',
                experience: '5 Years',
                about: 'Dr. Sarah Patel specializes in skin care and treatment of various skin conditions.',
                available: true,
                fees: 70,
                address: { line1: '37th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                slots_booked: {}
            },
            {
                name: 'Dr. Christopher Lee',
                email: 'christopher@prescripto.com',
                password: hashedPassword,
                image: 'https://res.cloudinary.com/dqy2ts9h6/image/upload/v1234567890/doctor4.jpg',
                speciality: 'Pediatricians',
                degree: 'MBBS, MD (Pediatrics)',
                experience: '6 Years',
                about: 'Dr. Christopher Lee is dedicated to providing excellent care for children of all ages.',
                available: true,
                fees: 65,
                address: { line1: '47th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                slots_booked: {}
            },
            {
                name: 'Dr. Jennifer Garcia',
                email: 'jennifer@prescripto.com',
                password: hashedPassword,
                image: 'https://res.cloudinary.com/dqy2ts9h6/image/upload/v1234567890/doctor5.jpg',
                speciality: 'Neurologist',
                degree: 'MBBS, MD (Neurology)',
                experience: '8 Years',
                about: 'Dr. Jennifer Garcia specializes in treating neurological disorders.',
                available: true,
                fees: 80,
                address: { line1: '57th Cross, Richmond', line2: 'Circle, Ring Road, London' },
                slots_booked: {}
            }
        ]);
        console.log(`✅ Created ${doctors.length} doctors\n`);

        // Create sample patients/users
        console.log('👥 Creating sample patients...');
        const users = await userModel.insertMany([
            {
                name: 'John Smith',
                email: 'john@patient.com',
                password: hashedPassword,
                image: 'https://via.placeholder.com/150',
                address: { line1: '123 Main St', line2: 'Apt 4B, New York' },
                gender: 'Male',
                dob: '1990-05-15',
                phone: '1234567890'
            },
            {
                name: 'Emma Wilson',
                email: 'emma@patient.com',
                password: hashedPassword,
                image: 'https://via.placeholder.com/150',
                address: { line1: '456 Oak Ave', line2: 'Suite 2A, Boston' },
                gender: 'Female',
                dob: '1985-08-22',
                phone: '2345678901'
            },
            {
                name: 'Michael Brown',
                email: 'michael@patient.com',
                password: hashedPassword,
                image: 'https://via.placeholder.com/150',
                address: { line1: '789 Pine Rd', line2: 'Chicago' },
                gender: 'Male',
                dob: '1992-03-10',
                phone: '3456789012'
            },
            {
                name: 'Sophia Davis',
                email: 'sophia@patient.com',
                password: hashedPassword,
                image: 'https://via.placeholder.com/150',
                address: { line1: '321 Elm St', line2: 'Los Angeles' },
                gender: 'Female',
                dob: '1988-11-30',
                phone: '4567890123'
            },
            {
                name: 'David Miller',
                email: 'david@patient.com',
                password: hashedPassword,
                image: 'https://via.placeholder.com/150',
                address: { line1: '654 Maple Dr', line2: 'Miami' },
                gender: 'Male',
                dob: '1995-07-18',
                phone: '5678901234'
            }
        ]);
        console.log(`✅ Created ${users.length} patients\n`);

        // Create sample appointments
        console.log('📅 Creating sample appointments...');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

        const formatDate = (date) => {
            const day = date.getDate();
            const month = date.toLocaleString('en-US', { month: 'short' });
            const year = date.getFullYear();
            return `${day}_${month}_${year}`;
        };

        const appointments = [];

        // Create appointments for each doctor
        for (let i = 0; i < doctors.length; i++) {
            const doctor = doctors[i];
            const userIndex = i % users.length;
            const user = users[userIndex];

            // Create 2-3 appointments per doctor
            const numAppointments = 2 + (i % 2);

            for (let j = 0; j < numAppointments; j++) {
                const appointmentDate = j === 0 ? today : (j === 1 ? tomorrow : dayAfterTomorrow);
                const times = ['10:00 am', '11:30 am', '2:00 pm', '3:30 pm', '5:00 pm'];

                const userForAppointment = users[(userIndex + j) % users.length];

                appointments.push({
                    userId: userForAppointment._id.toString(),
                    docId: doctor._id.toString(),
                    slotDate: formatDate(appointmentDate),
                    slotTime: times[j % times.length],
                    userData: {
                        _id: userForAppointment._id,
                        name: userForAppointment.name,
                        image: userForAppointment.image,
                        email: userForAppointment.email,
                        dob: userForAppointment.dob,
                        gender: userForAppointment.gender,
                        phone: userForAppointment.phone,
                        address: userForAppointment.address
                    },
                    docData: {
                        _id: doctor._id,
                        name: doctor.name,
                        image: doctor.image,
                        speciality: doctor.speciality,
                        degree: doctor.degree,
                        experience: doctor.experience,
                        about: doctor.about,
                        fees: doctor.fees,
                        address: doctor.address
                    },
                    amount: doctor.fees,
                    date: Date.now(),
                    cancelled: j === numAppointments - 1 && i === 0, // Cancel one appointment for demo
                    payment: j % 2 === 0, // Alternate between paid and cash
                    isCompleted: j === 0 && i === doctors.length - 1 // Mark one as completed
                });
            }
        }

        await appointmentModel.insertMany(appointments);
        console.log(`✅ Created ${appointments.length} appointments\n`);

        // Summary
        console.log('📊 ========== SEED SUMMARY ==========\n');
        console.log(`✅ Doctors: ${doctors.length}`);
        console.log(`✅ Patients: ${users.length}`);
        console.log(`✅ Appointments: ${appointments.length}`);
        console.log('\n📝 Login Credentials (for all doctors and patients):');
        console.log('   Email: See respective emails above');
        console.log('   Password: 123456\n');

        console.log('🎯 Sample Doctor Login:');
        console.log('   Email: richard@prescripto.com');
        console.log('   Password: 123456\n');

        console.log('✅ Database seeding completed successfully!\n');
        console.log('=====================================\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit(0);
    }
};

seedDatabase();

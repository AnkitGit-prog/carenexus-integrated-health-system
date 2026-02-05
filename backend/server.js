import express from 'express'
import cors from 'cors'
import'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';
// app config
const app =express();

const port = process.env.PORT || 4000;
connectDB();
connectCloudinary()

// middlewares
app.use (express.json());
app.use(cors());
 

//api endpoints


app.use ('/api/admin',adminRouter)
app.use ('/api/doctor',doctorRouter)
app.use ('/api/user',userRouter);

// http://localhost:4000/api/admin/add-doctor?name=John&specialization=Dentist&experience=5&image=image_url_from_cloudinary  // Example request to add a doctor with a profile picture from Cloudinary. Note: Replace 'image_url_from_cloudinary' with your actual Cloudinary image URL.
// localhost:4000/api/admin
  


app.get('/', (req, res) => res.send('API WORKing'));

app.listen(port, () => console.log(`Server running on port ${port}`));
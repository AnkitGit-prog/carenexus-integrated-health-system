
import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
 import Razorpay from  'razorpay'
//// api to register user 
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }
        // validating email format
        if (validator.isEmail(email) === false) {
            return res.json({ success: false, message: "enter a valid email" });
        }
        // validating strong password
        if (password.length < 8 || /[A-Z]/.test(password) === false || /[a-z]/.test(password) === false || /[0-9]/.test(password) === false || /[!@#$%^&*]/.test(password) === false) {
            return res.json({ success: false, message: "Password is not strong" });
        }
             //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            
        };
        const newUser = new userModel(userData);
        const user= await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, message: "User registered successfully", token });

    }catch (error) {
        console.log(error);
        res.json({ success: false, message:error.message });
    }

}

//ap for user login
const loginUser =async (req,res)=>{
 try {
    const {email,password}=req.body
    const user= await userModel.findOne({email})
    if(!user){
     return res.json({success:false,message:'user does not exist'})
    }
    

    const isMatch =await bcrypt.compare(password,user.password)
if(isMatch) {
    const token  =jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.json({success:true,token})
}else{
    res.json({success:false,message:"invalid credintials"})
}


 } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
    
 }
}    

// api to get user profile data
const getProfile =async(req,res)=>{
    try{
       const userId = req.userId; 
        const userData =await userModel.findById(userId).select('-password')
        res.json({success:true ,userData})
    }catch(error){
        console.log(error)
    res.json({success:false,message:error.message})

    }
}

  // api to update user profile
   const updateProfile =async(req,res)=>{
    try{
const userId = req.userId; // ✅ from middleware token
 const {name,phone,address,dob,gender}=req.body
 const imageFile=req.file
 if(!name||!phone|| !address|| !dob|| !gender){
    return res.json({success:false,message:"Data Missing"})
 }
 const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
 await userModel.findByIdAndUpdate(userId,{name,phone,address:parsedAddress,dob,gender})
 if(imageFile){
    // uplode image to cloudianary
    const imageUpload =await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
    const imageURL =imageUpload.secure_url
    await userModel.findByIdAndUpdate(userId,{image:imageURL})
 }
 res.json({success:true,message:"Profile updated"})
    }
   catch(error){
   console.log(error)
    res.json({success:false,message:error.message})
   }
   }

   // api to book appointment
    const bookAppointment =async (req,res)=>{
        try{
            const {userId,docId ,slotDate,slotTime}=req.body
            const docData = await doctorModel.findById(docId).select('-password')
            if(!docData.available){
                return res.json({success:false,message:"Doctor Chutti Par Hai Kal aana"})
            }
              
         let slots_booked = docData.slots_booked || {};

            // checking for slot availability
            if(slots_booked[slotDate]){
                if(slots_booked[slotDate].includes(slotTime)){
                    return res.json({success:false,message:"Doctor Chutti Par Hai Kal aana"})
                }else{
                    slots_booked[slotDate].push(slotTime)
                }
            }else{
                slots_booked[slotDate] =[]
                slots_booked[slotDate].push(slotTime)
            }
            const userData =await userModel.findById(userId).select('-password')
            delete docData.slots_booked

            const appointmentData={
                userId,
                docId,
                userData,
                docData,amount:docData.fees,
                slotTime,
                slotDate,
                date:Date.now()
            }
          const newAppointment =new appointmentModel(appointmentData)
          await newAppointment.save()

           // save new slots  data in docdata
           await doctorModel.findByIdAndUpdate(docId,{slots_booked})
          res.json({success:true,message:"Thik hai aa jana paise lekar"})


        }catch(error){
            console.log(error)
            res.json({success:false,message:error.message})

        }

        
    }

    // API to get user for  formated my-appointments page
     const  listAppointment =async(req,res)=>{
        try{
            const userId = req.userId
            const appointments =await appointmentModel.find({userId})

            res.json({success:true,appointments})
        }catch (error){
            console.log(error)
            res.json({success :false,message:error.message})

        }
     }
     // API to cancle appoimtment

     const cancleAppointment = async (req, res) => {
        try {
            const { appointmentId } = req.body
            const userId = req.userId

            const appointmentData = await appointmentModel.findById(appointmentId)
            if (!appointmentData) {
                return res.json({ success: false, message: 'Appointment not found' })
            }
            // verify appointment user
            if (appointmentData.userId !== userId) {
                return res.json({ success: false, message: 'Unauthorized' })
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




     /*const razorpayInstance =new Razorpay({
 key_id:process.env.RAZORPAY_KEY_ID,
 key_secret:process.env.RAZORPAY_KEY_SECRET
     }) */

  // for payment api using razrpay
 
   const paymentRazorpay =async (req,res)=>{
    try{
        const {appointmentId} =req.body
    const appointmentData=await appointmentModel.findById(appointmentId)
     
    if(appointmentData || appointmentData.cancelled){
        return res.json ({success:false,message:"Appointment cancelled or not found"})
    }
// 🔥 RAZORPAY BYPASS (DEV MODE)
if (
  process.env.NODE_ENV === "development" &&
  !process.env.RAZORPAY_KEY_ID
) {
  return res.json({
    success: true,
    bypass: true,
    order: {
      id: "order_dev_" + Date.now(),
      amount: appointmentData.amount * 100,
      currency: "INR",
    },
  });
}

    // cretaing options for razor pay payment method
    const options ={
        amount:appointmentData.amount*100,
        currency:process.env.CURRENCY,
        receipt:appointmentId,
    }
    // creation of an a order
    const order = await razorpayInstance.order.create(options)
    res.json({success:true,order})

    }catch (error) {
            console.log(error)
            return res.json({ success: false, message: error.message })
        }
    
   }






export { registerUser ,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancleAppointment,paymentRazorpay};

























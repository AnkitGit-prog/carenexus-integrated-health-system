import mongoose from "mongoose";


const userSchema =new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String,default:"https://th.bing.com/th/id/OIP.-hU7XQqgFQVyg5lG6SKnTQAAAA?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"},
      address:{type:Object,default: {line1:'',line2:''}},
      gender:{type:String, default:"Not selected"},
       dob :{type:String,default:"Not selected"},
       phone: {type:String,default:'0000000000'}
                                             
})
const userModel=  mongoose.models.user || mongoose.model('user',userSchema)

export default userModel
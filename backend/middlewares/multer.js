import multer from "multer"

// Create multer storsge
const storage = multer.diskStorage({
    filename:function(req, file, cb){

        cb(null,file.originalname)
    }
})
const uplode = multer({storage})


export default uplode
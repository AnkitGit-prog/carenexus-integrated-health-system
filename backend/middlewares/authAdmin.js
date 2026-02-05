import jwt from 'jsonwebtoken'
// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
          const aToken = req.headers.atoken || req.headers.aToken;  // ✅ ye line fix hai

        if (!aToken) {
            return res.json({ success: false, message: "Unauthorized" });
        }
        const token_decoded = jwt.verify(aToken, process.env.JWT_SECRET);

        if (token_decoded !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD) {
             return res.json({ success: false, message: "Unauthorized" });
             
        }
next();



    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: "Unauthorized" });
    }
}

export default authAdmin;